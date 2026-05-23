import { withAdmin } from '@/lib/api/auth-guard'
import { validateBody, z } from '@/lib/api/validate'
import { ok, err, notFound, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

const assignSchema = z.object({
  receiver_id: z.string().uuid('receiver_id must be a valid UUID'),
  pickup_type: z.enum(['ngo_pickup', 'donor_dropoff', 'delivery_partner']).default('ngo_pickup'),
  notes: z.string().max(500).optional(),
})

// ─────────────────────────────────────────────────────────────
// POST /api/admin/donations/[id]/assign
//
// Admin manually assigns a donation to a specific NGO.
// Bypasses the normal matching flow.
// ─────────────────────────────────────────────────────────────
export const POST = withAdmin(
  async (req: NextRequest, { profile: admin, supabase }, ctx: Ctx) => {
    const { id: donationId } = await ctx.params

    const { data: body, error: bodyErr } = await validateBody(req, assignSchema)
    if (bodyErr) return bodyErr

    // ── Load the donation
    const { data: donation, error: fetchErr } = await supabase
      .from('donations')
      .select('id, donor_id, status, title, pickup_city')
      .eq('id', donationId)
      .single()

    if (fetchErr || !donation) return notFound('Donation')

    const assignableStatuses = ['available', 'pending_acceptance']
    if (!assignableStatuses.includes(donation.status)) {
      return err(
        `Cannot assign donation with status "${donation.status}".`,
        409,
        'WRONG_STATUS'
      )
    }

    // ── Verify receiver exists and has a profile
    const { data: receiver } = await supabase
      .from('users')
      .select('id, role, full_name')
      .eq('id', body.receiver_id)
      .eq('role', 'receiver')
      .maybeSingle()

    if (!receiver) return notFound('Receiver user')

    const { data: receiverProfile } = await supabase
      .from('receiver_profiles')
      .select('id')
      .eq('user_id', body.receiver_id)
      .maybeSingle()

    if (!receiverProfile) {
      return err('Receiver has not set up their profile yet.', 400, 'PROFILE_REQUIRED')
    }

    // ── Create or update the notification row
    await supabase.from('donation_receiver_notifications').upsert(
      {
        donation_id: donationId,
        receiver_id: body.receiver_id,
        response: 'accepted',
        responded_at: new Date().toISOString(),
      },
      { onConflict: 'donation_id,receiver_id' }
    )

    // ── Create pickup assignment
    const { data: pickup, error: pickupErr } = await supabase
      .from('pickup_assignments')
      .insert({
        donation_id: donationId,
        receiver_id: body.receiver_id,
        receiver_profile_id: receiverProfile.id,
        pickup_type: body.pickup_type,
        pickup_status: 'assigned',
        pickup_notes: body.notes ?? `Manually assigned by admin`,
      })
      .select()
      .single()

    if (pickupErr) {
      if (pickupErr.code === '23505') {
        return err('A pickup assignment already exists for this donation.', 409, 'ALREADY_ASSIGNED')
      }
      return serverError(pickupErr.message)
    }

    // ── Update donation status → pickup_assigned
    await supabase
      .from('donations')
      .update({ status: 'pickup_assigned' })
      .eq('id', donationId)

    // ── Notify the receiver
    await supabase.from('notifications').insert({
      user_id: body.receiver_id,
      type: 'pickup_assigned',
      title: 'Donation assigned to you by admin',
      message: `An admin has assigned the donation "${donation.title}" in ${donation.pickup_city} to your organisation. Please arrange pickup.`,
      related_donation_id: donationId,
    })

    // ── Log admin action
    await supabase.from('admin_actions').insert({
      admin_id: admin.id,
      target_user_id: body.receiver_id,
      action_type: 'manual_donation_assignment',
      notes: `Assigned donation ${donationId} to ${receiver.full_name}`,
    })

    return ok({
      pickup,
      message: `Donation assigned to ${receiver.full_name} successfully.`,
    })
  }
)
