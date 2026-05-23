import { withReceiver } from '@/lib/api/auth-guard'
import { validateBody, z } from '@/lib/api/validate'
import { ok, err, notFound, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

const acceptSchema = z.object({
  scheduled_pickup_time: z.string().datetime({ offset: true }).optional(),
  pickup_notes: z.string().max(500).optional(),
})

// ─────────────────────────────────────────────────────────────
// POST /api/donations/[id]/accept
//
// NGO accepts a donation.
//  1. Verifies the NGO was notified (in donation_receiver_notifications)
//  2. Updates their notification row → response: accepted
//  3. Updates donation status → accepted
//  4. Notifies the donor
// ─────────────────────────────────────────────────────────────
export const POST = withReceiver(
  async (req: NextRequest, { profile, supabase }, ctx: Ctx) => {
    const { id: donationId } = await ctx.params

    const { data: body, error: bodyErr } = await validateBody(req, acceptSchema)
    if (bodyErr) return bodyErr

    // ── Check the donation exists and is in the right status
    const { data: donation, error: fetchErr } = await supabase
      .from('donations')
      .select('id, donor_id, status, title, pickup_city')
      .eq('id', donationId)
      .single()

    if (fetchErr || !donation) return notFound('Donation')

    if (!['pending_acceptance', 'available'].includes(donation.status)) {
      return err(
        `This donation cannot be accepted — it has status "${donation.status}".`,
        409,
        'WRONG_STATUS'
      )
    }

    // ── Check the NGO was actually notified about this donation
    const { data: notification, error: notifErr } = await supabase
      .from('donation_receiver_notifications')
      .select('id, response')
      .eq('donation_id', donationId)
      .eq('receiver_id', profile.id)
      .maybeSingle()

    if (notifErr) return serverError(notifErr.message)

    if (!notification) {
      return err(
        'You were not notified about this donation. It may have been matched to other NGOs.',
        403,
        'NOT_ELIGIBLE'
      )
    }

    if (notification.response === 'accepted') {
      return err('You have already accepted this donation.', 409, 'ALREADY_ACCEPTED')
    }

    // ── Get receiver's profile ID
    const { data: receiverProfile } = await supabase
      .from('receiver_profiles')
      .select('id')
      .eq('user_id', profile.id)
      .maybeSingle()

    if (!receiverProfile) {
      return err(
        'You must complete your receiver profile before accepting donations.',
        400,
        'PROFILE_REQUIRED'
      )
    }

    // ── Run everything in a logical sequence (Supabase JS has no real transactions)
    // Step 1: Mark the notification as accepted
    const { error: notifUpdateErr } = await supabase
      .from('donation_receiver_notifications')
      .update({
        response: 'accepted',
        responded_at: new Date().toISOString(),
      })
      .eq('id', notification.id)

    if (notifUpdateErr) return serverError(notifUpdateErr.message)

    // Step 2: Update donation status → accepted
    const { data: updatedDonation, error: donationUpdateErr } = await supabase
      .from('donations')
      .update({ status: 'accepted' })
      .eq('id', donationId)
      .select()
      .single()

    if (donationUpdateErr) return serverError(donationUpdateErr.message)

    // Step 3: Mark all other notification rows for this donation as no longer relevant
    await supabase
      .from('donation_receiver_notifications')
      .update({ response: 'no_response' })
      .eq('donation_id', donationId)
      .neq('id', notification.id)
      .eq('response', 'no_response')
    // Non-fatal

    // Step 4: Notify the donor
    await supabase.from('notifications').insert({
      user_id: donation.donor_id,
      type: 'donation_accepted',
      title: 'Your donation has been accepted!',
      message: `An NGO in ${donation.pickup_city} has accepted your donation "${donation.title}". They will be in touch soon.`,
      related_donation_id: donationId,
    })
    // Non-fatal

    return ok({
      donation: updatedDonation,
      message: 'Donation accepted! The donor has been notified. Please arrange pickup.',
    })
  }
)
