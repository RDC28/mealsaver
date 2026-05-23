import { withReceiver } from '@/lib/api/auth-guard'
import { validateParams, z } from '@/lib/api/validate'
import { ok, err, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

const listSchema = z.object({
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
  food_type: z.enum(['veg', 'non_veg', 'vegan']).optional(),
  food_condition: z.enum(['cooked', 'raw', 'packaged']).optional(),
  is_urgent: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
})

// ─────────────────────────────────────────────────────────────
// GET /api/receiver/donations
//
// Returns available donations matched to the NGO's city and food preferences.
// Uses the receiver's preferences from receiver_profiles to filter.
// Sorted by: urgency (urgent first) then by proximity to expiry.
// ─────────────────────────────────────────────────────────────
export const GET = withReceiver(
  async (req: NextRequest, { profile, supabase }) => {
    const { data: params, error: paramErr } = validateParams(req, listSchema)
    if (paramErr) return paramErr as Response

    const { page, limit, food_type, food_condition, is_urgent } = params
    const offset = (page - 1) * limit

    // ── Load NGO's profile to get city + food preferences
    const { data: receiverProfile, error: profileErr } = await supabase
      .from('receiver_profiles')
      .select('city, accepts_veg, accepts_non_veg, accepts_vegan, accepts_cooked, accepts_raw, accepts_packaged, service_area_km')
      .eq('user_id', profile.id)
      .maybeSingle()

    if (profileErr) return serverError(profileErr.message)

    if (!receiverProfile) {
      return err(
        'Please complete your receiver profile first.',
        400,
        'PROFILE_REQUIRED'
      )
    }

    // ── Build the query
    let query = supabase
      .from('donations')
      .select(
        `
        *,
        donation_images ( id, image_url, is_primary ),
        donor_profiles  ( business_name, business_type, city, phone )
        `,
        { count: 'exact' }
      )
      .eq('status', 'available')
      .ilike('pickup_city', `%${receiverProfile.city}%`)

    // ── Filter by the NGO's own food preferences
    // Build OR conditions for accepted food types
    const acceptedFoodTypes: string[] = []
    if (receiverProfile.accepts_veg) acceptedFoodTypes.push('veg')
    if (receiverProfile.accepts_non_veg) acceptedFoodTypes.push('non_veg')
    if (receiverProfile.accepts_vegan) acceptedFoodTypes.push('vegan')

    if (acceptedFoodTypes.length > 0 && acceptedFoodTypes.length < 3) {
      // Only filter if not accepting all types
      query = query.in('food_type', acceptedFoodTypes)
    }

    const acceptedConditions: string[] = []
    if (receiverProfile.accepts_cooked) acceptedConditions.push('cooked')
    if (receiverProfile.accepts_raw) acceptedConditions.push('raw')
    if (receiverProfile.accepts_packaged) acceptedConditions.push('packaged')

    if (acceptedConditions.length > 0 && acceptedConditions.length < 3) {
      query = query.in('food_condition', acceptedConditions)
    }

    // ── Additional filters from query params
    if (food_type) query = query.eq('food_type', food_type)
    if (food_condition) query = query.eq('food_condition', food_condition)
    if (is_urgent !== undefined) query = query.eq('is_urgent', is_urgent)

    // ── Order + paginate
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
      filters_applied: {
        city: receiverProfile.city,
        accepted_food_types: acceptedFoodTypes,
        accepted_conditions: acceptedConditions,
      },
    })
  }
)
