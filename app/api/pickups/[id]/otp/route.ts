import { withReceiver } from '@/lib/api/auth-guard'
import { ok, err, notFound, forbidden, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

// ─────────────────────────────────────────────────────────────
// POST /api/pickups/[id]/otp
//
// Generates a 6-digit OTP for in-person verification at pickup.
// The OTP is shared with the donor so they can verify the collector.
//
// Rules:
//  - Only the receiver who created the pickup can request the OTP
//  - Pickup status must be "assigned" or "in_progress"
//  - Calls the generate_pickup_otp() DB function
// ─────────────────────────────────────────────────────────────
export const POST = withReceiver(
  async (_req: NextRequest, { profile, supabase }, ctx: Ctx) => {
    const { id } = await ctx.params

    // ── Load the pickup
    const { data: pickup, error: fetchErr } = await supabase
      .from('pickup_assignments')
      .select('id, receiver_id, pickup_status, otp_verified, donations(donor_id, title)')
      .eq('id', id)
      .single()

    if (fetchErr || !pickup) return notFound('Pickup assignment')

    if (pickup.receiver_id !== profile.id) {
      return forbidden('You can only request OTPs for your own pickups')
    }

    if (!['assigned', 'in_progress'].includes(pickup.pickup_status)) {
      return err(
        `Cannot generate OTP — pickup status is "${pickup.pickup_status}".`,
        409,
        'WRONG_STATUS'
      )
    }

    if (pickup.otp_verified) {
      return err('OTP has already been verified for this pickup.', 409, 'ALREADY_VERIFIED')
    }

    // ── Call DB function to generate (or return existing) OTP
    const { data: result, error: rpcErr } = await supabase
      .rpc('generate_pickup_otp', { p_pickup_id: id })

    if (rpcErr) {
      console.error('[POST /api/pickups/[id]/otp] RPC error:', rpcErr)
      return serverError('Failed to generate OTP. ' + rpcErr.message)
    }

    // ── Update status to in_progress
    await supabase
      .from('pickup_assignments')
      .update({ pickup_status: 'in_progress' })
      .eq('id', id)
      .eq('pickup_status', 'assigned')   // only if still "assigned"

    // ── Notify donor with the OTP
    const donation = pickup.donations as { donor_id: string; title: string } | null
    if (donation) {
      await supabase.from('notifications').insert({
        user_id: donation.donor_id,
        type: 'general',
        title: 'Pickup OTP generated',
        message: `The NGO is on their way to collect "${donation.title}". Verify with OTP: ${result}`,
        related_donation_id: null,
      })
    }

    return ok({
      otp: result,
      message: 'OTP generated. Share this with the donor to verify collection.',
      expires_in: 'Use before pickup is marked complete',
    })
  }
)
