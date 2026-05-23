import { withDonorOrAdmin } from '@/lib/api/auth-guard'
import { validateBody, z } from '@/lib/api/validate'
import { ok, err, notFound, forbidden, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

const cancelSchema = z.object({
  reason: z.string().max(500).optional(),
})

// ─────────────────────────────────────────────────────────────
// POST /api/donations/[id]/cancel
//
// Donor cancels a donation. Allowed statuses:
//   available | pending_acceptance | accepted
//
// Cannot cancel after pickup is assigned or food is in transit.
// ─────────────────────────────────────────────────────────────
export const POST = withDonorOrAdmin(
  async (req: NextRequest, { profile, supabase }, ctx: Ctx) => {
    const { id: donationId } = await ctx.params

    const { data: body, error: bodyErr } = await validateBody(req, cancelSchema)
    if (bodyErr) return bodyErr

    // ── Load the donation
    const { data: donation, error: fetchErr } = await supabase
      .from('donations')
      .select('id, donor_id, status, title')
      .eq('id', donationId)
      .single()

    if (fetchErr || !donation) return notFound('Donation')

    // ── Ownership check (admin bypasses)
    if (profile.role !== 'admin' && donation.donor_id !== profile.id) {
      return forbidden('You can only cancel your own donations')
    }

    // ── Status gate
    const cancellableStatuses = ['available', 'pending_acceptance', 'accepted']
    if (!cancellableStatuses.includes(donation.status)) {
      return err(
        `Cannot cancel a donation with status "${donation.status}". Food is already in transit or delivered.`,
        409,
        'WRONG_STATUS'
      )
    }

    // ── Find any accepted NGO to notify
    const { data: acceptedNotif } = await supabase
      .from('donation_receiver_notifications')
      .select('receiver_id')
      .eq('donation_id', donationId)
      .eq('response', 'accepted')
      .maybeSingle()

    // ── Update status
    const { data: updated, error: updateErr } = await supabase
      .from('donations')
      .update({ status: 'cancelled' })
      .eq('id', donationId)
      .select()
      .single()

    if (updateErr) return serverError(updateErr.message)

    // ── Notify accepted NGO (if any)
    if (acceptedNotif?.receiver_id) {
      await supabase.from('notifications').insert({
        user_id: acceptedNotif.receiver_id,
        type: 'general',
        title: 'Donation cancelled by donor',
        message: `The donor has cancelled the donation "${donation.title}". We're sorry for the inconvenience.`,
        related_donation_id: donationId,
      })
    }

    return ok({
      donation: updated,
      message: 'Donation cancelled successfully.',
    })
  }
)
