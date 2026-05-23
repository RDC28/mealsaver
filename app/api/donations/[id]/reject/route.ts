import { withReceiver } from '@/lib/api/auth-guard'
import { validateBody, z } from '@/lib/api/validate'
import { ok, err, notFound, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

const rejectSchema = z.object({
  rejection_reason: z
    .string()
    .max(500)
    .optional(),
})

// ─────────────────────────────────────────────────────────────
// POST /api/donations/[id]/reject
//
// NGO rejects a donation they were notified about.
// After rejection the donation stays pending_acceptance so other
// NGOs can still accept it. If ALL notified NGOs reject, the
// donation reverts to "available" status.
// ─────────────────────────────────────────────────────────────
export const POST = withReceiver(
  async (req: NextRequest, { profile, supabase }, ctx: Ctx) => {
    const { id: donationId } = await ctx.params

    const { data: body, error: bodyErr } = await validateBody(req, rejectSchema)
    if (bodyErr) return bodyErr

    // ── Check the donation
    const { data: donation, error: fetchErr } = await supabase
      .from('donations')
      .select('id, donor_id, status, title, pickup_city')
      .eq('id', donationId)
      .single()

    if (fetchErr || !donation) return notFound('Donation')

    if (!['pending_acceptance', 'available'].includes(donation.status)) {
      return err(
        `This donation cannot be rejected — it has status "${donation.status}".`,
        409,
        'WRONG_STATUS'
      )
    }

    // ── Check the NGO was notified
    const { data: notification, error: notifErr } = await supabase
      .from('donation_receiver_notifications')
      .select('id, response')
      .eq('donation_id', donationId)
      .eq('receiver_id', profile.id)
      .maybeSingle()

    if (notifErr) return serverError(notifErr.message)

    if (!notification) {
      return err(
        'You were not notified about this donation.',
        403,
        'NOT_ELIGIBLE'
      )
    }

    if (notification.response !== 'no_response') {
      return err(
        `You already responded to this donation (${notification.response}).`,
        409,
        'ALREADY_RESPONDED'
      )
    }

    // ── Mark the notification as rejected
    const { error: updateErr } = await supabase
      .from('donation_receiver_notifications')
      .update({
        response: 'rejected',
        responded_at: new Date().toISOString(),
        rejection_reason: body?.rejection_reason ?? null,
      })
      .eq('id', notification.id)

    if (updateErr) return serverError(updateErr.message)

    // ── Check if ALL notified NGOs have now rejected
    const { data: pendingResponses } = await supabase
      .from('donation_receiver_notifications')
      .select('id')
      .eq('donation_id', donationId)
      .eq('response', 'no_response')

    const allRejected = !pendingResponses || pendingResponses.length === 0

    if (allRejected) {
      // Revert donation to "available" so the donor can re-match or edit it
      await supabase
        .from('donations')
        .update({ status: 'available' })
        .eq('id', donationId)

      // Notify the donor
      await supabase.from('notifications').insert({
        user_id: donation.donor_id,
        type: 'donation_rejected',
        title: 'All NGOs have rejected your donation',
        message: `Unfortunately, all notified NGOs rejected your donation "${donation.title}". You can re-match or edit the listing.`,
        related_donation_id: donationId,
      })
    }

    return ok({
      message: allRejected
        ? 'Rejection recorded. All NGOs have responded — the donation is back to available.'
        : 'Rejection recorded. Other NGOs can still accept this donation.',
      all_rejected: allRejected,
    })
  }
)
