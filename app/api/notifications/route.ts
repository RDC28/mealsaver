import { withAuth } from '@/lib/api/auth-guard'
import { validateParams, z } from '@/lib/api/validate'
import { ok, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

const listSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
  unread_only: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
})

// ─────────────────────────────────────────────────────────────
// GET /api/notifications
//
// Fetch the current user's notifications, newest first.
// Supports pagination and filtering by read/unread.
// ─────────────────────────────────────────────────────────────
export const GET = withAuth(
  async (req: NextRequest, { profile, supabase }) => {
    const { data: params, error: paramErr } = validateParams(req, listSchema)
    if (paramErr) return paramErr as Response

    const { page, limit, unread_only } = params
    const offset = (page - 1) * limit

    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (unread_only) {
      query = query.eq('is_read', false)
    }

    const { data, error, count } = await query

    if (error) return serverError(error.message)

    return ok({
      notifications: data ?? [],
      pagination: {
        page,
        limit,
        total: count ?? 0,
        pages: Math.ceil((count ?? 0) / limit),
      },
    })
  }
)
