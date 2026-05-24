import { withReceiver } from '@/lib/api/auth-guard'
import { db, donations, donation_receiver_notifications, receiver_profiles, notifications } from '@/lib/db'
import { eq, and, ne } from 'drizzle-orm'
import { validateBody, z } from '@/lib/api/validate'
import { ok, err, notFound, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

const acceptSchema = z.object({
  scheduled_pickup_time: z.string().datetime({ offset: true }).optional(),
  pickup_notes:          z.string().max(500).optional(),
})

// ─────────────────────────────────────────────────────────────
// POST /api/donations/[id]/accept
// ─────────────────────────────────────────────────────────────
export const POST = withReceiver(
  async (req: NextRequest, { profile }, ctx: Ctx) => {
    const { id: donationId } = await ctx.params

    const { data: body, error: bodyErr } = await validateBody(req, acceptSchema)
    if (bodyErr) return bodyErr

    // Check the donation
    const [donation] = await db
      .select({
        id:          donations.id,
        donor_id:    donations.donor_id,
        status:      donations.status,
        title:       donations.title,
        pickup_city: donations.pickup_city,
      })
      .from(donations)
      .where(eq(donations.id, donationId))

    if (!donation) return notFound('Donation')

    if (!['pending_acceptance', 'available'].includes(donation.status)) {
      return err(
        `This donation cannot be accepted — it has status "${donation.status}".`,
        409,
        'WRONG_STATUS'
      )
    }

    // Check the NGO was notified about this donation
    const [notification] = await db
      .select({ id: donation_receiver_notifications.id, response: donation_receiver_notifications.response })
      .from(donation_receiver_notifications)
      .where(
        and(
          eq(donation_receiver_notifications.donation_id, donationId),
          eq(donation_receiver_notifications.receiver_id, profile.id)
        )
      )

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

    // Get receiver's profile ID
    const [receiverProfile] = await db
      .select({ id: receiver_profiles.id })
      .from(receiver_profiles)
      .where(eq(receiver_profiles.user_id, profile.id))

    if (!receiverProfile) {
      return err(
        'You must complete your receiver profile before accepting donations.',
        400,
        'PROFILE_REQUIRED'
      )
    }

    // Step 1: Mark the notification as accepted
    await db
      .update(donation_receiver_notifications)
      .set({ response: 'accepted', responded_at: new Date() })
      .where(eq(donation_receiver_notifications.id, notification.id))

    // Step 2: Update donation status → accepted
    const [updatedDonation] = await db
      .update(donations)
      .set({ status: 'accepted' })
      .where(eq(donations.id, donationId))
      .returning()

    if (!updatedDonation) return serverError('Failed to update donation status')

    // Step 3: Mark all other notification rows as no_response (non-fatal)
    try {
      await db
        .update(donation_receiver_notifications)
        .set({ response: 'no_response' })
        .where(
          and(
            eq(donation_receiver_notifications.donation_id, donationId),
            ne(donation_receiver_notifications.id, notification.id),
            eq(donation_receiver_notifications.response, 'no_response')
          )
        )
    } catch { /* non-fatal */ }

    // Step 4: Notify the donor (non-fatal)
    try {
      await db.insert(notifications).values({
        user_id:             donation.donor_id,
        type:                'donation_accepted',
        title:               'Your donation has been accepted!',
        message:             `An NGO in ${donation.pickup_city} has accepted your donation "${donation.title}". They will be in touch soon.`,
        related_donation_id: donationId,
      })
    } catch { /* non-fatal */ }

    return ok({
      donation: updatedDonation,
      message: 'Donation accepted! The donor has been notified. Please arrange pickup.',
    })
  }
)
