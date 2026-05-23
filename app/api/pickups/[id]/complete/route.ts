import { withReceiver } from '@/lib/api/auth-guard'
import { ok, err, notFound, forbidden, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

// ─────────────────────────────────────────────────────────────
// POST /api/pickups/[id]/complete
//
// Marks a pickup as complete → donation status → picked_up.
// OTP must have been verified first.
// Only the receiver who created the pickup can complete it.
// ─────────────────────────────────────────────────────────────
export const POST = withReceiver(
  async (_req: NextRequest, { profile, supabase }, ctx: Ctx) => {
    const { id } = await ctx.params

    const { data: pickup, error: fetchErr } = await supabase
      .from('pickup_assignments')
      .select('id, receiver_id, pickup_status, otp_verified, donation_id, donations(donor_id, title)')
      .eq('id', id)
      .single()

    if (fetchErr || !pickup) return notFound('Pickup assignment')

    if (pickup.receiver_id !== profile.id) {
      return forbidden('You can only complete your own pickups')
    }

    if (pickup.pickup_status === 'completed') {
      return err('This pickup is already marked as complete.', 409, 'ALREADY_COMPLETED')
    }

    if (pickup.pickup_status !== 'in_progress') {
      return err(
        `Cannot complete a pickup with status "${pickup.pickup_status}". It must be in_progress.`,
        409,
        'WRONG_STATUS'
      )
    }

    if (!pickup.otp_verified) {
      return err(
        'OTP verification is required before marking a pickup as complete.',
        400,
        'OTP_NOT_VERIFIED'
      )
    }

    // ── Mark pickup as completed
    const { error: pickupUpdateErr } = await supabase
      .from('pickup_assignments')
      .update({
        pickup_status: 'completed',
        actual_pickup_time: new Date().toISOString(),
      })
      .eq('id', id)

    if (pickupUpdateErr) return serverError(pickupUpdateErr.message)

    // ── Update donation status → picked_up
    const { data: updatedDonation, error: donationUpdateErr } = await supabase
      .from('donations')
      .update({ status: 'picked_up' })
      .eq('id', pickup.donation_id)
      .select()
      .single()

    if (donationUpdateErr) return serverError(donationUpdateErr.message)

    // ── Notify the donor
    const donation = pickup.donations as { donor_id: string; title: string } | null
    if (donation) {
      await supabase.from('notifications').insert({
        user_id: donation.donor_id,
        type: 'pickup_completed',
        title: 'Food picked up successfully!',
        message: `Your donation "${donation.title}" has been collected. Thank you for making a difference! 🎉`,
        related_donation_id: pickup.donation_id,
      })
    }

    return ok({
      message: 'Pickup completed! Please confirm delivery once the food reaches the beneficiaries.',
      pickup_id: id,
      donation: updatedDonation,
    })
  }
)
