import { withReceiver } from '@/lib/api/auth-guard'
import { db, pickup_assignments, donations, notifications } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import { ok, err, notFound, forbidden, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'
import { sql } from 'drizzle-orm'

type Ctx = { params: Promise<{ id: string }> }

// ─────────────────────────────────────────────────────────────
// POST /api/pickups/[id]/otp
// ─────────────────────────────────────────────────────────────
export const POST = withReceiver(
  async (_req: NextRequest, { profile }, ctx: Ctx) => {
    const { id } = await ctx.params

    const [pickup] = await db
      .select({
        id:            pickup_assignments.id,
        receiver_id:   pickup_assignments.receiver_id,
        pickup_status: pickup_assignments.pickup_status,
        otp_verified:  pickup_assignments.otp_verified,
        donation_id:   pickup_assignments.donation_id,
      })
      .from(pickup_assignments)
      .where(eq(pickup_assignments.id, id))

    if (!pickup) return notFound('Pickup assignment')

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

    // Call DB function to generate OTP
    let otpResult: string
    try {
      const result = await db.execute(
        sql`SELECT generate_pickup_otp(${id}::uuid)`
      )
      otpResult = (result.rows[0] as { generate_pickup_otp: string }).generate_pickup_otp
    } catch (e) {
      console.error('[POST /api/pickups/[id]/otp] RPC error:', e)
      return serverError('Failed to generate OTP.')
    }

    // Update status to in_progress if still assigned
    try {
      await db
        .update(pickup_assignments)
        .set({ pickup_status: 'in_progress' })
        .where(
          and(
            eq(pickup_assignments.id, id),
            eq(pickup_assignments.pickup_status, 'assigned')
          )
        )
    } catch { /* non-fatal */ }

    // Notify donor with OTP (non-fatal)
    try {
      const [donation] = await db
        .select({ donor_id: donations.donor_id, title: donations.title })
        .from(donations)
        .where(eq(donations.id, pickup.donation_id))

      if (donation) {
        await db.insert(notifications).values({
          user_id:             donation.donor_id,
          type:                'general',
          title:               'Pickup OTP generated',
          message:             `The NGO is on their way to collect "${donation.title}". Verify with OTP: ${otpResult}`,
          related_donation_id: pickup.donation_id,
        })
      }
    } catch { /* non-fatal */ }

    return ok({
      otp:        otpResult,
      message:    'OTP generated. Share this with the donor to verify collection.',
      expires_in: 'Use before pickup is marked complete',
    })
  }
)
