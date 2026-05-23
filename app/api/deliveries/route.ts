import { withReceiver } from '@/lib/api/auth-guard'
import { validateBody, z } from '@/lib/api/validate'
import { created, err, notFound, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

const confirmSchema = z.object({
  pickup_assignment_id: z.string().uuid('pickup_assignment_id must be a valid UUID'),
  quantity_received_kg: z.number().positive().max(10000).optional(),
  food_condition_on_arrival: z
    .enum(['excellent', 'good', 'fair', 'poor', 'unsafe'])
    .optional(),
  is_food_safe: z.boolean({
    required_error: 'is_food_safe is required',
  }),
  receiver_notes: z.string().max(1000).optional(),
})

// ─────────────────────────────────────────────────────────────
// POST /api/deliveries
//
// Receiver confirms food arrived and was distributed.
// - Marks pickup status → verified
// - Marks donation status → delivered
// - Calls generate_impact_report() DB function
// - Notifies the donor
// ─────────────────────────────────────────────────────────────
export const POST = withReceiver(
  async (req: NextRequest, { profile, supabase }) => {
    const { data, error } = await validateBody(req, confirmSchema)
    if (error) return error

    // ── Load the pickup assignment
    const { data: pickup, error: fetchErr } = await supabase
      .from('pickup_assignments')
      .select('id, receiver_id, pickup_status, donation_id, donations(donor_id, title)')
      .eq('id', data.pickup_assignment_id)
      .single()

    if (fetchErr || !pickup) return notFound('Pickup assignment')

    if (pickup.receiver_id !== profile.id) {
      return err('You can only confirm deliveries for your own pickups.', 403, 'FORBIDDEN')
    }

    if (pickup.pickup_status !== 'completed') {
      return err(
        `Cannot confirm delivery — pickup status is "${pickup.pickup_status}". Complete the pickup first.`,
        409,
        'WRONG_STATUS'
      )
    }

    // ── Prevent duplicate delivery confirmations
    const { data: existing } = await supabase
      .from('delivery_confirmations')
      .select('id')
      .eq('pickup_assignment_id', data.pickup_assignment_id)
      .maybeSingle()

    if (existing) {
      return err('Delivery has already been confirmed for this pickup.', 409, 'ALREADY_CONFIRMED')
    }

    // ── Create delivery confirmation record
    const { data: delivery, error: insertErr } = await supabase
      .from('delivery_confirmations')
      .insert({
        pickup_assignment_id: data.pickup_assignment_id,
        donation_id: pickup.donation_id,
        receiver_id: profile.id,
        quantity_received_kg: data.quantity_received_kg ?? null,
        food_condition_on_arrival: data.food_condition_on_arrival ?? null,
        is_food_safe: data.is_food_safe,
        receiver_notes: data.receiver_notes ?? null,
      })
      .select()
      .single()

    if (insertErr) return serverError(insertErr.message)

    // ── Update donation status → delivered (or unsafe if food not safe)
    const newStatus = data.is_food_safe ? 'delivered' : 'unsafe'
    await supabase
      .from('donations')
      .update({ status: newStatus })
      .eq('id', pickup.donation_id)

    // ── Update pickup to verified
    await supabase
      .from('pickup_assignments')
      .update({ pickup_status: 'verified' })
      .eq('id', data.pickup_assignment_id)

    // ── Trigger impact report generation
    const { error: impactErr } = await supabase
      .rpc('generate_impact_report', { p_donation_id: pickup.donation_id })

    if (impactErr) {
      // Non-fatal — impact report can be generated later
      console.error('[POST /api/deliveries] Impact report generation failed:', impactErr.message)
    }

    // ── Notify the donor
    const donation = pickup.donations as { donor_id: string; title: string } | null
    if (donation) {
      await supabase.from('notifications').insert({
        user_id: donation.donor_id,
        type: 'delivery_confirmed',
        title: data.is_food_safe
          ? 'Delivery confirmed! Food reached the beneficiaries 🎉'
          : 'Delivery confirmed — food safety issue reported',
        message: data.is_food_safe
          ? `Your donation "${donation.title}" has been successfully distributed. Check your impact report!`
          : `Your donation "${donation.title}" was received but flagged as unsafe. Please contact support.`,
        related_donation_id: pickup.donation_id,
      })
    }

    return created({
      delivery,
      message: data.is_food_safe
        ? 'Delivery confirmed! Your impact report will be ready shortly.'
        : 'Delivery confirmed. The unsafe food flag has been recorded.',
    })
  }
)
