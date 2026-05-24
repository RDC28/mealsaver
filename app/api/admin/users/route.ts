import { withAdmin } from '@/lib/api/auth-guard'
import { db, users, donor_profiles, receiver_profiles } from '@/lib/db'
import { eq, or, ilike, desc, count, and } from 'drizzle-orm'
import { validateParams, z } from '@/lib/api/validate'
import { ok, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

const listSchema = z.object({
  role:                z.enum(['donor', 'receiver', 'admin', 'delivery_partner']).optional(),
  verification_status: z.enum(['pending', 'verified', 'rejected', 'suspended']).optional(),
  city:                z.string().optional(),
  search:              z.string().optional(),
  page:                z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit:               z.string().regex(/^\d+$/).transform(Number).default('25'),
})

// ─────────────────────────────────────────────────────────────
// GET /api/admin/users
// ─────────────────────────────────────────────────────────────
export const GET = withAdmin(
  async (req: NextRequest) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rawParams, error: paramErr } = validateParams(req, listSchema as any)
    if (paramErr) return paramErr as Response
    const params = rawParams as { role?: string; verification_status?: string; city?: string; search?: string; page: number; limit: number }

    const { role, verification_status, city, search, page, limit } = params
    const offset = (page - 1) * limit

    try {
      const conditions = []

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (role)   conditions.push(eq(users.role, role as any))
      if (search) conditions.push(
        or(
          ilike(users.full_name, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )!
      )

      const where = conditions.length > 0 ? and(...conditions) : undefined

      const [rows, [{ total }]] = await Promise.all([
        db
          .select()
          .from(users)
          .where(where)
          .orderBy(desc(users.created_at))
          .limit(limit)
          .offset(offset),
        db.select({ total: count() }).from(users).where(where),
      ])

      // Fetch profiles for each user
      const userIds = rows.map(u => u.id)

      const [donorProfs, receiverProfs] = userIds.length > 0
        ? await Promise.all([
            db
              .select({
                id:                  donor_profiles.id,
                user_id:             donor_profiles.user_id,
                business_name:       donor_profiles.business_name,
                business_type:       donor_profiles.business_type,
                city:                donor_profiles.city,
                verification_status: donor_profiles.verification_status,
                verified_at:         donor_profiles.verified_at,
              })
              .from(donor_profiles)
              .where(or(...userIds.map(id => eq(donor_profiles.user_id, id)))!),
            db
              .select({
                id:                  receiver_profiles.id,
                user_id:             receiver_profiles.user_id,
                organization_name:   receiver_profiles.organization_name,
                organization_type:   receiver_profiles.organization_type,
                city:                receiver_profiles.city,
                verification_status: receiver_profiles.verification_status,
                verified_at:         receiver_profiles.verified_at,
              })
              .from(receiver_profiles)
              .where(or(...userIds.map(id => eq(receiver_profiles.user_id, id)))!),
          ])
        : [[], []]

      // Enrich and optionally filter by city/verification_status
      let enriched = rows.map(user => ({
        ...user,
        donor_profiles:    donorProfs.filter(dp => dp.user_id === user.id),
        receiver_profiles: receiverProfs.filter(rp => rp.user_id === user.id),
      }))

      if (verification_status || city) {
        enriched = enriched.filter(user => {
          const donorCity       = user.donor_profiles[0]?.city
          const receiverCity    = user.receiver_profiles[0]?.city
          const donorStatus     = user.donor_profiles[0]?.verification_status
          const receiverStatus  = user.receiver_profiles[0]?.verification_status

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
        users: enriched,
        pagination: {
          page,
          limit,
          total: Number(total),
          pages: Math.ceil(Number(total) / limit),
        },
      })
    } catch (e) {
      console.error('[GET /api/admin/users]', e)
      return serverError('Failed to load users')
    }
  }
)
