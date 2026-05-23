import { withAdmin } from '@/lib/api/auth-guard'
import { validateBody, z } from '@/lib/api/validate'
import { ok, err, notFound, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

const verifySchema = z.object({
  status: z.enum(['verified', 'rejected'], {
    required_error: 'status must be "verified" or "rejected"',
  }),
  notes: z.string().max(500).optional(),
})

// ─────────────────────────────────────────────────────────────
// PUT /api/admin/users/[id]/verify
//
// Approve or reject a donor's or NGO's verification.
// Updates the verification_status on donor_profiles or receiver_profiles.
// Notifies the user.
// ─────────────────────────────────────────────────────────────
export const PUT = withAdmin(
  async (req: NextRequest, { profile: admin, supabase }, ctx: Ctx) => {
    const { id } = await ctx.params

    const { data: body, error: bodyErr } = await validateBody(req, verifySchema)
    if (bodyErr) return bodyErr

    // ── Load the user
    const { data: user, error: fetchErr } = await supabase
      .from('users')
      .select('id, email, full_name, role')
      .eq('id', id)
      .single()

    if (fetchErr || !user) return notFound('User')

    const now = new Date().toISOString()
    const isVerified = body.status === 'verified'

    // ── Update the appropriate profile table
    if (user.role === 'donor') {
      const { error } = await supabase
        .from('donor_profiles')
        .update({
          verification_status: body.status,
          verified_at: isVerified ? now : null,
          verified_by: isVerified ? admin.id : null,
        })
        .eq('user_id', id)

      if (error) return serverError(error.message)
    } else if (user.role === 'receiver') {
      const { error } = await supabase
        .from('receiver_profiles')
        .update({
          verification_status: body.status,
          verified_at: isVerified ? now : null,
          verified_by: isVerified ? admin.id : null,
        })
        .eq('user_id', id)

      if (error) return serverError(error.message)
    } else {
      return err('Only donor and receiver accounts can be verified.', 400, 'INVALID_ROLE')
    }

    // ── Log the admin action
    await supabase.from('admin_actions').insert({
      admin_id: admin.id,
      target_user_id: id,
      action_type: `verification_${body.status}`,
      notes: body.notes ?? null,
    })

    // ── Notify the user
    await supabase.from('notifications').insert({
      user_id: id,
      type: 'verification_update',
      title: isVerified
        ? '✅ Your account has been verified!'
        : '❌ Verification request rejected',
      message: isVerified
        ? 'You can now fully use the MealSaver platform. Welcome aboard!'
        : `Your verification was not approved. ${body.notes ? 'Reason: ' + body.notes : 'Please contact support for details.'}`,
    })

    return ok({
      message: `User ${body.status} successfully`,
      user_id: id,
      status: body.status,
    })
  }
)
