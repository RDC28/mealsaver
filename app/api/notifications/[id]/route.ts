import { withAuth } from '@/lib/api/auth-guard'
import { ok, notFound, forbidden, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

// ─────────────────────────────────────────────────────────────
// DELETE /api/notifications/[id]
//
// Delete a single notification (own only).
// ─────────────────────────────────────────────────────────────
export const DELETE = withAuth(
  async (_req: NextRequest, { profile, supabase }, ctx: Ctx) => {
    const { id } = await ctx.params

    const { data: notif, error: fetchErr } = await supabase
      .from('notifications')
      .select('id, user_id')
      .eq('id', id)
      .single()

    if (fetchErr || !notif) return notFound('Notification')

    if (notif.user_id !== profile.id) {
      return forbidden('You can only delete your own notifications')
    }

    const { error: deleteErr } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)

    if (deleteErr) return serverError(deleteErr.message)

    return ok({ message: 'Notification deleted', id })
  }
)
