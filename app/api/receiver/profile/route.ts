import { withReceiver } from '@/lib/api/auth-guard'
import { validateBody, z } from '@/lib/api/validate'
import { ok, created, conflict, notFound, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

// ─────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────

const organizationTypes = [
  'ngo', 'shelter', 'orphanage', 'community_kitchen',
  'animal_shelter', 'feeding_program', 'other',
] as const

const createSchema = z.object({
  organization_name: z
    .string({ required_error: 'Organization name is required' })
    .min(2, 'Organization name must be at least 2 characters')
    .max(150),
  organization_type: z.enum(organizationTypes, {
    required_error: 'Organization type is required',
    invalid_type_error: `Organization type must be one of: ${organizationTypes.join(', ')}`,
  }),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Invalid phone number format')
    .optional(),
  address: z
    .string({ required_error: 'Address is required' })
    .min(5, 'Please enter a full address'),
  city: z
    .string({ required_error: 'City is required' })
    .min(2),
  state: z.string().optional(),
  pincode: z
    .string()
    .regex(/^[0-9]{5,10}$/, 'Invalid pincode')
    .optional(),
  // Location for nearest-NGO matching
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  // Operational preferences — used by the matching algorithm
  service_area_km: z
    .number()
    .int()
    .min(1, 'Service area must be at least 1 km')
    .max(100, 'Service area cannot exceed 100 km')
    .default(10),
  max_capacity_kg: z
    .number()
    .positive('Capacity must be a positive number')
    .optional(),
  // Food type preferences
  accepts_veg: z.boolean().default(true),
  accepts_non_veg: z.boolean().default(false),
  accepts_vegan: z.boolean().default(true),
  // Food condition preferences
  accepts_cooked: z.boolean().default(true),
  accepts_raw: z.boolean().default(true),
  accepts_packaged: z.boolean().default(true),
  // Food category preferences
  accepts_short_term: z.boolean().default(true),
  accepts_long_term: z.boolean().default(true),
  // Verification document reference
  registration_number: z.string().optional(),
})

const updateSchema = createSchema.partial()

// ─────────────────────────────────────────────────────────────
// GET /api/receiver/profile
// Returns the logged-in NGO/receiver's organisation profile.
// ─────────────────────────────────────────────────────────────
export const GET = withReceiver(async (_req: NextRequest, { profile, supabase }) => {
  const { data, error } = await supabase
    .from('receiver_profiles')
    .select('*')
    .eq('user_id', profile.id)
    .maybeSingle()

  if (error) return serverError(error.message)
  if (!data) return notFound('Receiver profile')

  return ok(data)
})

// ─────────────────────────────────────────────────────────────
// POST /api/receiver/profile
// Creates the NGO's profile (one-time setup after signup).
// ─────────────────────────────────────────────────────────────
export const POST = withReceiver(async (req: NextRequest, { profile, supabase }) => {
  const { data, error } = await validateBody(req, createSchema)
  if (error) return error

  // Prevent duplicates
  const { data: existing } = await supabase
    .from('receiver_profiles')
    .select('id')
    .eq('user_id', profile.id)
    .maybeSingle()

  if (existing) {
    return conflict('Receiver profile already exists. Use PUT to update it.')
  }

  const { latitude, longitude, ...rest } = data

  const location =
    latitude != null && longitude != null
      ? `POINT(${longitude} ${latitude})`
      : null

  const { data: newProfile, error: insertError } = await supabase
    .from('receiver_profiles')
    .insert({
      ...rest,
      user_id: profile.id,
      location,
    })
    .select()
    .single()

  if (insertError) return serverError(insertError.message)

  return created({
    ...newProfile,
    message: 'Profile created. Your organisation is pending verification by the MealSaver team.',
  })
})

// ─────────────────────────────────────────────────────────────
// PUT /api/receiver/profile
// Updates the NGO's profile. Partial updates supported.
// Key use case: updating food preferences, service area, capacity.
// ─────────────────────────────────────────────────────────────
export const PUT = withReceiver(async (req: NextRequest, { profile, supabase }) => {
  const { data, error } = await validateBody(req, updateSchema)
  if (error) return error

  if (Object.keys(data).length === 0) {
    return serverError('No fields provided to update')
  }

  const { latitude, longitude, ...rest } = data

  const locationUpdate: { location?: string } = {}
  if (latitude != null && longitude != null) {
    locationUpdate.location = `POINT(${longitude} ${latitude})`
  }

  const { data: updated, error: updateError } = await supabase
    .from('receiver_profiles')
    .update({ ...rest, ...locationUpdate })
    .eq('user_id', profile.id)
    .select()
    .single()

  if (updateError) {
    if (updateError.code === 'PGRST116') {
      return notFound('Receiver profile — create it first with POST /api/receiver/profile')
    }
    return serverError(updateError.message)
  }

  return ok(updated)
})
