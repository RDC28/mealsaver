import { withAuth, withDonor } from '@/lib/api/auth-guard'
import { validateBody, validateParams, z } from '@/lib/api/validate'
import { ok, created, err, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

// ─────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────

const createSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(3, 'Title must be at least 3 characters')
    .max(120),
  description: z.string().max(1000).optional(),

  food_category: z.enum(['short_term', 'long_term'], {
    required_error: 'food_category is required (short_term | long_term)',
  }),
  food_type: z.enum(['veg', 'non_veg', 'vegan'], {
    required_error: 'food_type is required (veg | non_veg | vegan)',
  }),
  food_condition: z.enum(['cooked', 'raw', 'packaged'], {
    required_error: 'food_condition is required (cooked | raw | packaged)',
  }),

  quantity_kg: z
    .number({ required_error: 'quantity_kg is required' })
    .positive('quantity_kg must be positive')
    .max(10000),
  quantity_description: z.string().max(200).optional(),
  serves_approx: z.number().int().positive().optional(),

  preparation_time: z.string().datetime({ offset: true }).optional(),
  expiry_time: z
    .string({ required_error: 'expiry_time is required' })
    .datetime({ offset: true }),
  preferred_pickup_time: z.string().datetime({ offset: true }).optional(),

  pickup_address: z
    .string({ required_error: 'pickup_address is required' })
    .min(5),
  pickup_city: z
    .string({ required_error: 'pickup_city is required' })
    .min(2),
  pickup_latitude: z.number().min(-90).max(90).optional(),
  pickup_longitude: z.number().min(-180).max(180).optional(),
  pickup_instructions: z.string().max(500).optional(),

  contact_number: z
    .string({ required_error: 'contact_number is required' })
    .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Invalid contact number format'),
})

const listSchema = z.object({
  status: z
    .enum([
      'available', 'pending_acceptance', 'accepted',
      'pickup_assigned', 'picked_up', 'delivered',
      'expired', 'cancelled', 'rejected', 'unsafe',
    ])
    .optional(),
  city: z.string().optional(),
  food_category: z.enum(['short_term', 'long_term']).optional(),
  food_type: z.enum(['veg', 'non_veg', 'vegan']).optional(),
  food_condition: z.enum(['cooked', 'raw', 'packaged']).optional(),
  is_urgent: z
    .enum(['true', 'false'])
    .transform(v => v === 'true')
    .optional(),
  page: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default('1'),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default('20'),
  my: z
    .enum(['true', 'false'])
    .transform(v => v === 'true')
    .optional(),
})

// ─────────────────────────────────────────────────────────────
// GET /api/donations
//
// For donors:   ?my=true  → their own donations (any status)
// For receivers: default  → available donations in their area
// For all:      supports ?status, ?city, ?food_category, ?food_type,
//               ?food_condition, ?is_urgent, ?page, ?limit
// ─────────────────────────────────────────────────────────────
export const GET = withAuth(async (req: NextRequest, { profile, supabase }) => {
  const { data: params, error: paramError } = validateParams(req, listSchema)
  if (paramError) return paramError as Response

  const { status, city, food_category, food_type, food_condition, is_urgent, page, limit, my } = params

  const offset = (page - 1) * limit

  let query = supabase
    .from('donations')
    .select(
      `
      *,
      donation_images ( id, image_url, is_primary ),
      donor_profiles  ( business_name, business_type, city )
      `,
      { count: 'exact' }
    )

  // ── Role-specific defaults
  if (my || profile.role === 'donor') {
    // Donor: show their own donations by default
    query = query.eq('donor_id', profile.id)
  } else if (profile.role === 'receiver') {
    // Receiver: show available donations (unless specific status requested)
    if (!status) query = query.eq('status', 'available')
  }

  // ── Filters
  if (status)         query = query.eq('status', status)
  if (city)           query = query.ilike('pickup_city', `%${city}%`)
  if (food_category)  query = query.eq('food_category', food_category)
  if (food_type)      query = query.eq('food_type', food_type)
  if (food_condition) query = query.eq('food_condition', food_condition)
  if (is_urgent !== undefined) query = query.eq('is_urgent', is_urgent)

  // ── Ordering + pagination
  query = query
    .order('is_urgent', { ascending: false })
    .order('expiry_time', { ascending: true })
    .range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) return serverError(error.message)

  return ok({
    donations: data ?? [],
    pagination: {
      page,
      limit,
      total: count ?? 0,
      pages: Math.ceil((count ?? 0) / limit),
    },
  })
})

// ─────────────────────────────────────────────────────────────
// POST /api/donations
// Create a new donation listing (donors only).
// ─────────────────────────────────────────────────────────────
export const POST = withDonor(async (req: NextRequest, { profile, supabase }) => {
  const { data, error } = await validateBody(req, createSchema)
  if (error) return error

  // ── Ensure donor has a profile
  const { data: donorProfile } = await supabase
    .from('donor_profiles')
    .select('id')
    .eq('user_id', profile.id)
    .maybeSingle()

  if (!donorProfile) {
    return err(
      'You must complete your donor profile before posting a donation.',
      400,
      'PROFILE_REQUIRED'
    )
  }

  // ── Validate expiry time is in the future
  if (new Date(data.expiry_time) <= new Date()) {
    return err('expiry_time must be in the future', 422, 'VALIDATION_ERROR')
  }

  const { pickup_latitude, pickup_longitude, ...rest } = data

  // ── PostGIS WKT: POINT(longitude latitude)
  const pickup_location =
    pickup_latitude != null && pickup_longitude != null
      ? `POINT(${pickup_longitude} ${pickup_latitude})`
      : null

  // ── Calculate urgency: < 4 hours to expiry = urgent
  const hoursToExpiry =
    (new Date(data.expiry_time).getTime() - Date.now()) / (1000 * 60 * 60)
  const is_urgent = hoursToExpiry < 4

  const { data: donation, error: insertError } = await supabase
    .from('donations')
    .insert({
      ...rest,
      donor_id: profile.id,
      donor_profile_id: donorProfile.id,
      pickup_location,
      is_urgent,
      status: 'available',
    })
    .select()
    .single()

  if (insertError) return serverError(insertError.message)

  return created({
    ...donation,
    message: 'Donation listed successfully. NGOs in your area will be notified.',
  })
})
