import { withAdmin } from '@/lib/api/auth-guard'
import { validateParams, z } from '@/lib/api/validate'
import { ok, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

const listSchema = z.object({
  status: z
    .enum([
      'available', 'pending_acceptance', 'accepted',
      'pickup_assigned', 'picked_up', 'delivered',
      'expired', 'cancelled', 'rejected', 'unsafe',
    ])
    .optional(),
  city: z.string().optional(),
  food_type: z.enum(['veg', 'non_veg', 'vegan']).optional(),
  donor_id: z.string().uuid().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('25'),
})

// ─────────────────────────────────────────────────────────────
// GET /api/admin/donations
//
// Admin view of all donations with full filters.
// ─────────────────────────────────────────────────────────────
export const GET = withAdmin(
  async (req: NextRequest, { supabase }) => {
    const { data: params, error: paramErr } = validateParams(req, listSchema)
    if (paramErr) return paramErr as Response

    const { status, city, food_type, donor_id, page, limit } = params
    const offset = (page - 1) * limit

    let query = supabase
      .from('donations')
      .select(
        `
        *,
        donation_images ( id, image_url, is_primary ),
        donor_profiles  ( business_name, business_type, city, verification_status ),
        users!donations_donor_id_fkey ( full_name, email, phone )
        `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status)   query = query.eq('status', status)
    if (city)     query = query.ilike('pickup_city', `%${city}%`)
    if (food_type) query = query.eq('food_type', food_type)
    if (donor_id) query = query.eq('donor_id', donor_id)

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
  }
)
