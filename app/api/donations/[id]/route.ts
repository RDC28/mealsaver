import { withAuth, withDonor } from '@/lib/api/auth-guard'
import { validateBody, z } from '@/lib/api/validate'
import { ok, err, notFound, forbidden, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

// ─────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────

const updateSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  description: z.string().max(1000).optional(),
  food_category: z.enum(['short_term', 'long_term']).optional(),
  food_type: z.enum(['veg', 'non_veg', 'vegan']).optional(),
  food_condition: z.enum(['cooked', 'raw', 'packaged']).optional(),
  quantity_kg: z.number().positive().max(10000).optional(),
  quantity_description: z.string().max(200).optional(),
  serves_approx: z.number().int().positive().optional(),
  preparation_time: z.string().datetime({ offset: true }).optional(),
  expiry_time: z.string().datetime({ offset: true }).optional(),
  preferred_pickup_time: z.string().datetime({ offset: true }).optional(),
  pickup_address: z.string().min(5).optional(),
  pickup_city: z.string().min(2).optional(),
  pickup_latitude: z.number().min(-90).max(90).optional(),
  pickup_longitude: z.number().min(-180).max(180).optional(),
  pickup_instructions: z.string().max(500).optional(),
  contact_number: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Invalid contact number format')
    .optional(),
})

// ─────────────────────────────────────────────────────────────
// Route context helper
// ─────────────────────────────────────────────────────────────
type Ctx = { params: Promise<{ id: string }> }

// ─────────────────────────────────────────────────────────────
// GET /api/donations/[id]
// Returns full donation with images + donor profile info.
// Open to any authenticated user.
// ─────────────────────────────────────────────────────────────
export const GET = withAuth(
  async (_req: NextRequest, { supabase }, ctx: Ctx) => {
    const { id } = await ctx.params

    const { data, error } = await supabase
      .from('donations')
      .select(
        `
        *,
        donation_images ( id, image_url, storage_path, is_primary, uploaded_at ),
        donor_profiles  (
          id, business_name, business_type, city,
          phone, verification_status
        )
        `
      )
      .eq('id', id)
      .single()

    if (error || !data) return notFound('Donation')

    return ok(data)
  }
)

// ─────────────────────────────────────────────────────────────
// PUT /api/donations/[id]
// Update a donation. Donors only, and only while status = available.
// ─────────────────────────────────────────────────────────────
export const PUT = withDonor(
  async (req: NextRequest, { profile, supabase }, ctx: Ctx) => {
    const { id } = await ctx.params

    const { data: body, error: bodyErr } = await validateBody(req, updateSchema)
    if (bodyErr) return bodyErr

    // ── Load the donation and verify ownership
    const { data: donation, error: fetchErr } = await supabase
      .from('donations')
      .select('id, donor_id, status')
      .eq('id', id)
      .single()

    if (fetchErr || !donation) return notFound('Donation')

    if (donation.donor_id !== profile.id) {
      return forbidden('You can only edit your own donations')
    }

    if (donation.status !== 'available') {
      return err(
        `Cannot edit a donation with status "${donation.status}". Only available donations can be updated.`,
        409,
        'WRONG_STATUS'
      )
    }

    const { pickup_latitude, pickup_longitude, expiry_time, ...rest } = body

    // ── Expiry must still be in the future if being changed
    if (expiry_time && new Date(expiry_time) <= new Date()) {
      return err('expiry_time must be in the future', 422, 'VALIDATION_ERROR')
    }

    // ── Update is_urgent based on new expiry or existing one
    const effectiveExpiry = expiry_time ?? donation.status
    let is_urgent: boolean | undefined
    if (expiry_time) {
      const hoursToExpiry =
        (new Date(expiry_time).getTime() - Date.now()) / (1000 * 60 * 60)
      is_urgent = hoursToExpiry < 4
    }

    // ── Update location only if both coords provided
    const locationUpdate: { pickup_location?: string } = {}
    if (pickup_latitude != null && pickup_longitude != null) {
      locationUpdate.pickup_location = `POINT(${pickup_longitude} ${pickup_latitude})`
    }

    const updatePayload = {
      ...rest,
      ...(expiry_time && { expiry_time }),
      ...(is_urgent !== undefined && { is_urgent }),
      ...locationUpdate,
    }

    if (Object.keys(updatePayload).length === 0) {
      return err('No updatable fields provided', 422, 'VALIDATION_ERROR')
    }

    const { data: updated, error: updateErr } = await supabase
      .from('donations')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (updateErr) return serverError(updateErr.message)

    return ok(updated)
  }
)

// ─────────────────────────────────────────────────────────────
// DELETE /api/donations/[id]
// Delete a donation. Donor only, status must be available or cancelled.
// ─────────────────────────────────────────────────────────────
export const DELETE = withDonor(
  async (_req: NextRequest, { profile, supabase }, ctx: Ctx) => {
    const { id } = await ctx.params

    const { data: donation, error: fetchErr } = await supabase
      .from('donations')
      .select('id, donor_id, status')
      .eq('id', id)
      .single()

    if (fetchErr || !donation) return notFound('Donation')

    if (donation.donor_id !== profile.id) {
      return forbidden('You can only delete your own donations')
    }

    const deletableStatuses = ['available', 'cancelled']
    if (!deletableStatuses.includes(donation.status)) {
      return err(
        `Cannot delete a donation with status "${donation.status}". Cancel it first if it's been accepted.`,
        409,
        'WRONG_STATUS'
      )
    }

    // ── Remove associated images from storage first
    const { data: images } = await supabase
      .from('donation_images')
      .select('storage_path')
      .eq('donation_id', id)
      .not('storage_path', 'is', null)

    if (images && images.length > 0) {
      const paths = images
        .map(img => img.storage_path)
        .filter(Boolean) as string[]

      if (paths.length > 0) {
        await supabase.storage.from('donation-images').remove(paths)
      }
    }

    const { error: deleteErr } = await supabase
      .from('donations')
      .delete()
      .eq('id', id)

    if (deleteErr) return serverError(deleteErr.message)

    return ok({ message: 'Donation deleted successfully', id })
  }
)
