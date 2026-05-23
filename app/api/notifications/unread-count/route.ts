import { withAuth } from '@/lib/api/auth-guard'
import { ok, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

// ─────────────────────────────────────────────────────────────
// GET /api/notifications/unread-count
//
// Returns the count of unread notifications for the current user.
// Lightweight — used for the notification badge in the nav bar.
// ─────────────────────────────────────────────────────────────
export const GET = withAuth(
  async (_req: NextRequest, { profile, supabase }) => {
    const { count, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .eq('is_read', false)

    if (error) return serverError(error.message)

    return ok({ count: count ?? 0 })
  }
)
