import { withAuth } from '@/lib/api/auth-guard'
import { ok, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

// ─────────────────────────────────────────────────────────────
// PUT /api/notifications/read-all
//
// Mark ALL of the current user's unread notifications as read.
// ─────────────────────────────────────────────────────────────
export const PUT = withAuth(
  async (_req: NextRequest, { profile, supabase }) => {
    const { error, count } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', profile.id)
      .eq('is_read', false)

    if (error) return serverError(error.message)

    return ok({
      message: `Marked ${count ?? 0} notification${(count ?? 0) !== 1 ? 's' : ''} as read`,
      marked_count: count ?? 0,
    })
  }
)
