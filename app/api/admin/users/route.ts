import { withAdmin } from '@/lib/api/auth-guard'
import { validateParams, z } from '@/lib/api/validate'
import { ok, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

const listSchema = z.object({
  role: z.enum(['donor', 'receiver', 'admin', 'delivery_partner']).optional(),
  verification_status: z.enum(['pending', 'verified', 'rejected', 'suspended']).optional(),
  city: z.string().optional(),
  search: z.string().optional(),   // searches full_name + email
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('25'),
})

// ─────────────────────────────────────────────────────────────
// GET /api/admin/users
//
// List all users with their profile and verification status.
// Supports role, status, city, and text search filters.
// ─────────────────────────────────────────────────────────────
export const GET = withAdmin(
  async (req: NextRequest, { supabase }) => {
    const { data: params, error: paramErr } = validateParams(req, listSchema)
    if (paramErr) return paramErr as Response

    const { role, verification_status, city, search, page, limit } = params
    const offset = (page - 1) * limit

    let query = supabase
      .from('users')
      .select(
        `
        id, email, full_name, phone, avatar_url, role, is_active, created_at,
        donor_profiles (
          id, business_name, business_type, city, verification_status, verified_at
        ),
        receiver_profiles (
          id, organization_name, organization_type, city, verification_status, verified_at
        )
        `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (role)   query = query.eq('role', role)
    if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)

    // Filter by city or verification_status requires joining via profiles
    // For simplicity: filter city/status on donor_profiles + receiver_profiles
    if (verification_status || city) {
      // Supabase doesn't support cross-table filter in select easily;
      // fetch all and filter in JS (works fine for admin dashboards with reasonable user counts)
    }

    const { data, error, count } = await query

    if (error) return serverError(error.message)

    // ── Post-filter by verification_status / city if needed
    let filtered = data ?? []
    if (verification_status || city) {
      filtered = filtered.filter(user => {
        const donorCity     = (user.donor_profiles    as { city?: string }[] | null)?.[0]?.city
        const receiverCity  = (user.receiver_profiles as { city?: string }[] | null)?.[0]?.city
        const donorStatus   = (user.donor_profiles    as { verification_status?: string }[] | null)?.[0]?.verification_status
        const receiverStatus = (user.receiver_profiles as { verification_status?: string }[] | null)?.[0]?.verification_status

        const matchesCity =
          !city ||
          donorCity?.toLowerCase().includes(city.toLowerCase()) ||
          receiverCity?.toLowerCase().includes(city.toLowerCase())

        const matchesStatus =
          !verification_status ||
          donorStatus === verification_status ||
          receiverStatus === verification_status

        return matchesCity && matchesStatus
      })
    }

    return ok({
      users: filtered,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        pages: Math.ceil((count ?? 0) / limit),
      },
    })
  }
)
