import { withDonor } from '@/lib/api/auth-guard'
import { validateBody, z } from '@/lib/api/validate'
import { ok, created, conflict, notFound, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

// ─────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────

const businessTypes = [
  'restaurant', 'bakery', 'cafe', 'caterer',
  'supermarket', 'vegetable_vendor', 'individual', 'grocery', 'other',
] as const

const createSchema = z.object({
  business_name: z
    .string({ required_error: 'Business name is required' })
    .min(2, 'Business name must be at least 2 characters')
    .max(100),
  business_type: z.enum(businessTypes, {
    required_error: 'Business type is required',
    invalid_type_error: `Business type must be one of: ${businessTypes.join(', ')}`,
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
  // Frontend gets these from browser Geolocation API or a map picker
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  food_license_number: z.string().optional(),
  gst_number: z.string().optional(),
})

// All fields optional for updates — frontend sends only what changed
const updateSchema = createSchema.partial()

// ─────────────────────────────────────────────────────────────
// GET /api/donor/profile
// Returns the logged-in donor's business profile.
// ─────────────────────────────────────────────────────────────
export const GET = withDonor(async (_req: NextRequest, { profile, supabase }) => {
  const { data, error } = await supabase
    .from('donor_profiles')
    .select('*')
    .eq('user_id', profile.id)
    .maybeSingle()

  if (error) return serverError(error.message)
  if (!data) return notFound('Donor profile')

  return ok(data)
})

// ─────────────────────────────────────────────────────────────
// POST /api/donor/profile
// Creates the donor's business profile (one-time setup after signup).
// ─────────────────────────────────────────────────────────────
export const POST = withDonor(async (req: NextRequest, { profile, supabase }) => {
  const { data, error } = await validateBody(req, createSchema)
  if (error) return error

  // Prevent creating a duplicate profile
  const { data: existing } = await supabase
    .from('donor_profiles')
    .select('id')
    .eq('user_id', profile.id)
    .maybeSingle()

  if (existing) {
    return conflict('Donor profile already exists. Use PUT to update it.')
  }

  const { latitude, longitude, ...rest } = data

  // PostGIS WKT format: POINT(longitude latitude) — lon first, then lat
  const location =
    latitude != null && longitude != null
      ? `POINT(${longitude} ${latitude})`
      : null

  const { data: newProfile, error: insertError } = await supabase
    .from('donor_profiles')
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
    message: 'Profile created. Your account is pending verification by the MealSaver team.',
  })
})

// ─────────────────────────────────────────────────────────────
// PUT /api/donor/profile
// Updates the donor's business profile. Partial updates supported.
// ─────────────────────────────────────────────────────────────
export const PUT = withDonor(async (req: NextRequest, { profile, supabase }) => {
  const { data, error } = await validateBody(req, updateSchema)
  if (error) return error

  if (Object.keys(data).length === 0) {
    return error ?? serverError('No fields provided to update')
  }

  const { latitude, longitude, ...rest } = data

  // Only update location if both lat AND lng are provided together
  const locationUpdate: { location?: string } = {}
  if (latitude != null && longitude != null) {
    locationUpdate.location = `POINT(${longitude} ${latitude})`
  }

  const { data: updated, error: updateError } = await supabase
    .from('donor_profiles')
    .update({ ...rest, ...locationUpdate })
    .eq('user_id', profile.id)
    .select()
    .single()

  if (updateError) {
    // PGRST116 = no rows matched (profile doesn't exist yet)
    if (updateError.code === 'PGRST116') {
      return notFound('Donor profile — create it first with POST /api/donor/profile')
    }
    return serverError(updateError.message)
  }

  return ok(updated)
})
