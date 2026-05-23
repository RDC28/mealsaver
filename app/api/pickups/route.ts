import { withReceiver } from '@/lib/api/auth-guard'
import { validateBody, z } from '@/lib/api/validate'
import { created, err, notFound, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

const createSchema = z.object({
  donation_id: z.string().uuid('donation_id must be a valid UUID'),
  pickup_type: z.enum(['ngo_pickup', 'donor_dropoff', 'delivery_partner'], {
    required_error: 'pickup_type is required',
  }),
  scheduled_pickup_time: z.string().datetime({ offset: true }).optional(),
  pickup_notes: z.string().max(500).optional(),
})

// ─────────────────────────────────────────────────────────────
// POST /api/pickups
//
// Creates a pickup assignment after the NGO has accepted a donation.
// Sets donation status → pickup_assigned.
// ─────────────────────────────────────────────────────────────
export const POST = withReceiver(
  async (req: NextRequest, { profile, supabase }) => {
    const { data, error } = await validateBody(req, createSchema)
    if (error) return error

    // ── Verify the donation is accepted
    const { data: donation, error: fetchErr } = await supabase
      .from('donations')
      .select('id, donor_id, status, title, pickup_city')
      .eq('id', data.donation_id)
      .single()

    if (fetchErr || !donation) return notFound('Donation')

    if (donation.status !== 'accepted') {
      return err(
        `Donation status is "${donation.status}". A pickup can only be created for accepted donations.`,
        409,
        'WRONG_STATUS'
      )
    }

    // ── Verify the NGO accepted this donation
    const { data: notif } = await supabase
      .from('donation_receiver_notifications')
      .select('id')
      .eq('donation_id', data.donation_id)
      .eq('receiver_id', profile.id)
      .eq('response', 'accepted')
      .maybeSingle()

    if (!notif) {
      return err(
        'You did not accept this donation.',
        403,
        'NOT_ELIGIBLE'
      )
    }

    // ── Prevent duplicate pickup assignments
    const { data: existing } = await supabase
      .from('pickup_assignments')
      .select('id')
      .eq('donation_id', data.donation_id)
      .maybeSingle()

    if (existing) {
      return err(
        'A pickup assignment already exists for this donation.',
        409,
        'ALREADY_ASSIGNED'
      )
    }

    // ── Get receiver profile ID
    const { data: receiverProfile } = await supabase
      .from('receiver_profiles')
      .select('id')
      .eq('user_id', profile.id)
      .maybeSingle()

    if (!receiverProfile) {
      return err('Please complete your receiver profile first.', 400, 'PROFILE_REQUIRED')
    }

    // ── Create the pickup assignment
    const { data: pickup, error: insertErr } = await supabase
      .from('pickup_assignments')
      .insert({
        donation_id: data.donation_id,
        receiver_id: profile.id,
        receiver_profile_id: receiverProfile.id,
        pickup_type: data.pickup_type,
        pickup_status: 'assigned',
        scheduled_pickup_time: data.scheduled_pickup_time ?? null,
        pickup_notes: data.pickup_notes ?? null,
      })
      .select()
      .single()

    if (insertErr) return serverError(insertErr.message)

    // ── Update donation status → pickup_assigned
    await supabase
      .from('donations')
      .update({ status: 'pickup_assigned' })
      .eq('id', data.donation_id)

    // ── Notify the donor
    await supabase.from('notifications').insert({
      user_id: donation.donor_id,
      type: 'pickup_assigned',
      title: 'Pickup has been scheduled!',
      message: `An NGO will pick up your donation "${donation.title}" soon. Have it ready!`,
      related_donation_id: data.donation_id,
    })

    return created({
      ...pickup,
      message: 'Pickup assignment created. Generate an OTP when you arrive at the donor location.',
    })
  }
)
