import { withDonorOrAdmin } from '@/lib/api/auth-guard'
import { db, donations, donation_receiver_notifications, notifications } from '@/lib/db'
import { eq, sql } from 'drizzle-orm'
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
// ─────────────────────────────────────────────────────────────
export const POST = withDonorOrAdmin(
  async (_req: NextRequest, { profile }, ctx: Ctx) => {
    const { id: donationId } = await ctx.params

    // Load the donation
    const [donation] = await db
      .select({
        id:              donations.id,
        donor_id:        donations.donor_id,
        status:          donations.status,
        pickup_city:     donations.pickup_city,
        pickup_location: donations.pickup_location,
      })
      .from(donations)
      .where(eq(donations.id, donationId))

    if (!donation) return notFound('Donation')

    // Ownership check (admins bypass)
    if (profile.role !== 'admin' && donation.donor_id !== profile.id) {
      return forbidden('You can only match your own donations')
    }

    // Status gate
    if (donation.status !== 'available') {
      return err(
        `Donation status is "${donation.status}". Only available donations can be matched.`,
        409,
        'WRONG_STATUS'
      )
    }

    // Run the matching function
    let matches: { receiver_id: string; user_id: string; organization_name: string; distance_km: number }[]
    try {
      const result = await db.execute(
        sql`SELECT * FROM find_nearby_receivers(${donationId}::uuid)`
      )
      matches = result.rows as typeof matches
    } catch (e) {
      console.error('[POST /api/donations/[id]/match] RPC error:', e)
      return serverError('Matching algorithm failed.')
    }

    if (!matches || matches.length === 0) {
      return err(
        "No nearby NGOs found that match this donation's criteria. Try again later or contact support.",
        404,
        'NO_MATCHES'
      )
    }

    // Insert notification rows for each matched receiver (ignore duplicates)
    const notifRows = matches.map(match => ({
      donation_id: donationId,
      receiver_id: match.receiver_id,
      response:    'no_response' as const,
    }))

    try {
      await db
        .insert(donation_receiver_notifications)
        .values(notifRows)
        .onConflictDoNothing()
    } catch (e) {
      console.error('[POST /api/donations/[id]/match] notify insert error:', e)
      return serverError('Failed to create receiver notifications')
    }

    // Update donation status to pending_acceptance
    const [updated] = await db
      .update(donations)
      .set({ status: 'pending_acceptance' })
      .where(eq(donations.id, donationId))
      .returning()

    if (!updated) return serverError('Failed to update donation status')

    // Create in-app notifications for each receiver (non-fatal)
    try {
      const inAppNotifications = matches.map(match => ({
        user_id:             match.user_id,
        type:                'donation_available' as const,
        title:               'New donation available near you!',
        message:             `A food donation is available for pickup in ${donation.pickup_city}. Act quickly!`,
        related_donation_id: donationId,
      }))
      await db.insert(notifications).values(inAppNotifications)
    } catch {
      // Non-fatal
    }

    return ok({
      donation: updated,
      matched_receivers: matches.length,
      message: `${matches.length} NGO${matches.length !== 1 ? 's' : ''} notified. Waiting for acceptance.`,
    })
  }
)
