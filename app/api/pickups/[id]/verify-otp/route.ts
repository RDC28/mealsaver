import { withAuth } from '@/lib/api/auth-guard'
import { validateBody, z } from '@/lib/api/validate'
import { ok, err, notFound, forbidden, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

const verifySchema = z.object({
  otp: z
    .string({ required_error: 'OTP is required' })
    .regex(/^\d{6}$/, 'OTP must be a 6-digit number'),
})

// ─────────────────────────────────────────────────────────────
// POST /api/pickups/[id]/verify-otp
//
// Verifies the OTP — can be done by:
//  - The donor (they enter the OTP the NGO shows them)
//  - The receiver/NGO (they enter the OTP shared with the donor)
// Marks otp_verified = true on success.
// ─────────────────────────────────────────────────────────────
export const POST = withAuth(
  async (req: NextRequest, { profile, supabase }, ctx: Ctx) => {
    const { id } = await ctx.params

    const { data: body, error: bodyErr } = await validateBody(req, verifySchema)
    if (bodyErr) return bodyErr

    // ── Load pickup with donation donor info
    const { data: pickup, error: fetchErr } = await supabase
      .from('pickup_assignments')
      .select('id, receiver_id, pickup_status, otp_code, otp_verified, donations(donor_id, title)')
      .eq('id', id)
      .single()

    if (fetchErr || !pickup) return notFound('Pickup assignment')

    const donation = pickup.donations as { donor_id: string; title: string } | null

    // ── Access control: only the donor or receiver involved
    const isDonor    = donation?.donor_id === profile.id
    const isReceiver = pickup.receiver_id === profile.id
    const isAdmin    = profile.role === 'admin'

    if (!isDonor && !isReceiver && !isAdmin) {
      return forbidden('You are not involved in this pickup')
    }

    if (pickup.otp_verified) {
      return err('OTP has already been verified.', 409, 'ALREADY_VERIFIED')
    }

    if (pickup.pickup_status !== 'in_progress') {
      return err(
        `OTP verification is only available when pickup is in progress. Current status: "${pickup.pickup_status}".`,
        409,
        'WRONG_STATUS'
      )
    }

    if (!pickup.otp_code) {
      return err('No OTP has been generated for this pickup. Generate one first.', 400, 'NO_OTP')
    }

    // ── Verify the OTP
    if (body.otp !== pickup.otp_code) {
      return err('Incorrect OTP. Please try again.', 400, 'INVALID_OTP')
    }

    // ── Mark as verified
    const { error: updateErr } = await supabase
      .from('pickup_assignments')
      .update({ otp_verified: true })
      .eq('id', id)

    if (updateErr) return serverError(updateErr.message)

    return ok({
      message: 'OTP verified successfully! You can now mark the pickup as complete.',
      pickup_id: id,
      otp_verified: true,
    })
  }
)
