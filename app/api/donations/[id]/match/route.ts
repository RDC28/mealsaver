import { withDonorOrAdmin } from '@/lib/api/auth-guard'
import { ok, err, notFound, forbidden, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

// ─────────────────────────────────────────────────────────────
// POST /api/donations/[id]/match
//
// Runs the matching algorithm:
//  1. Calls find_nearby_receivers() DB function
//  2. Creates donation_receiver_notifications rows for each matched NGO
//  3. Sets donation status → pending_acceptance
//
// Only the donor who owns the donation (or admin) can trigger this.
// Donation must be in "available" status.
// ─────────────────────────────────────────────────────────────
export const POST = withDonorOrAdmin(
  async (_req: NextRequest, { profile, supabase }, ctx: Ctx) => {
    const { id: donationId } = await ctx.params

    // ── Load the donation
    const { data: donation, error: fetchErr } = await supabase
      .from('donations')
      .select('id, donor_id, status, pickup_city, pickup_location')
      .eq('id', donationId)
      .single()

    if (fetchErr || !donation) return notFound('Donation')

    // ── Ownership check (admins bypass)
    if (profile.role !== 'admin' && donation.donor_id !== profile.id) {
      return forbidden('You can only match your own donations')
    }

    // ── Status gate — can only match from available
    if (donation.status !== 'available') {
      return err(
        `Donation status is "${donation.status}". Only available donations can be matched.`,
        409,
        'WRONG_STATUS'
      )
    }

    // ── Run the matching function (returns receiver_ids sorted by distance + score)
    const { data: matches, error: matchErr } = await supabase
      .rpc('find_nearby_receivers', { p_donation_id: donationId })

    if (matchErr) {
      console.error('[POST /api/donations/[id]/match] RPC error:', matchErr)
      return serverError('Matching algorithm failed. ' + matchErr.message)
    }

    if (!matches || matches.length === 0) {
      return err(
        'No nearby NGOs found that match this donation\'s criteria. Try again later or contact support.',
        404,
        'NO_MATCHES'
      )
    }

    // ── Insert notification rows for each matched receiver
    const notifications = matches.map((match: { receiver_id: string }) => ({
      donation_id: donationId,
      receiver_id: match.receiver_id,
      response: 'no_response' as const,
    }))

    const { error: notifyErr } = await supabase
      .from('donation_receiver_notifications')
      .insert(notifications)

    if (notifyErr) {
      // Ignore duplicate key errors (idempotent re-match)
      if (notifyErr.code !== '23505') {
        return serverError(notifyErr.message)
      }
    }

    // ── Update donation status to pending_acceptance
    const { data: updated, error: updateErr } = await supabase
      .from('donations')
      .update({ status: 'pending_acceptance' })
      .eq('id', donationId)
      .select()
      .single()

    if (updateErr) return serverError(updateErr.message)

    // ── Also create in-app notifications for each receiver
    if (matches.length > 0) {
      const inAppNotifications = matches.map((match: { receiver_id: string }) => ({
        user_id: match.receiver_id,
        type: 'donation_available' as const,
        title: 'New donation available near you!',
        message: `A food donation is available for pickup in ${donation.pickup_city}. Act quickly!`,
        related_donation_id: donationId,
      }))

      await supabase.from('notifications').insert(inAppNotifications)
      // Non-fatal if this fails — the main match already succeeded
    }

    return ok({
      donation: updated,
      matched_receivers: matches.length,
      message: `${matches.length} NGO${matches.length !== 1 ? 's' : ''} notified. Waiting for acceptance.`,
    })
  }
)
