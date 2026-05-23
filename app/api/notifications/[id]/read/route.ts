import { withAuth } from '@/lib/api/auth-guard'
import { ok, notFound, forbidden, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

// ─────────────────────────────────────────────────────────────
// PUT /api/notifications/[id]/read
//
// Mark a single notification as read.
// ─────────────────────────────────────────────────────────────
export const PUT = withAuth(
  async (_req: NextRequest, { profile, supabase }, ctx: Ctx) => {
    const { id } = await ctx.params

    // ── Fetch to verify ownership
    const { data: notif, error: fetchErr } = await supabase
      .from('notifications')
      .select('id, user_id, is_read')
      .eq('id', id)
      .single()

    if (fetchErr || !notif) return notFound('Notification')

    if (notif.user_id !== profile.id) {
      return forbidden('You can only mark your own notifications as read')
    }

    if (notif.is_read) {
      return ok({ message: 'Already marked as read', id })
    }

    const { error: updateErr } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id)

    if (updateErr) return serverError(updateErr.message)

    return ok({ message: 'Marked as read', id })
  }
)
