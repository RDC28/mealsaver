import { withAdmin } from '@/lib/api/auth-guard'
import { validateBody, z } from '@/lib/api/validate'
import { ok, notFound, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

const suspendSchema = z.object({
  suspended: z.boolean({ required_error: 'suspended (boolean) is required' }),
  reason: z.string().max(500).optional(),
})

// ─────────────────────────────────────────────────────────────
// PUT /api/admin/users/[id]/suspend
//
// Suspend or reactivate a user account.
// { suspended: true }  → suspend (is_active = false)
// { suspended: false } → reactivate (is_active = true)
// ─────────────────────────────────────────────────────────────
export const PUT = withAdmin(
  async (req: NextRequest, { profile: admin, supabase }, ctx: Ctx) => {
    const { id } = await ctx.params

    const { data: body, error: bodyErr } = await validateBody(req, suspendSchema)
    if (bodyErr) return bodyErr

    // ── Fetch target user
    const { data: user, error: fetchErr } = await supabase
      .from('users')
      .select('id, is_active, full_name, email')
      .eq('id', id)
      .single()

    if (fetchErr || !user) return notFound('User')

    // ── Update is_active
    const { error: updateErr } = await supabase
      .from('users')
      .update({ is_active: !body.suspended })
      .eq('id', id)

    if (updateErr) return serverError(updateErr.message)

    // ── Log admin action
    await supabase.from('admin_actions').insert({
      admin_id: admin.id,
      target_user_id: id,
      action_type: body.suspended ? 'account_suspended' : 'account_reactivated',
      notes: body.reason ?? null,
    })

    // ── Notify the user
    await supabase.from('notifications').insert({
      user_id: id,
      type: 'general',
      title: body.suspended ? 'Account suspended' : 'Account reactivated',
      message: body.suspended
        ? `Your account has been suspended. ${body.reason ? 'Reason: ' + body.reason : 'Contact support for details.'}`
        : 'Your account has been reactivated. Welcome back!',
    })

    return ok({
      message: body.suspended
        ? `${user.full_name ?? user.email} has been suspended`
        : `${user.full_name ?? user.email}'s account has been reactivated`,
      user_id: id,
      is_active: !body.suspended,
    })
  }
)
