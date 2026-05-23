import { withDonor } from '@/lib/api/auth-guard'
import { ok, notFound, forbidden, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ id: string; imageId: string }> }

const BUCKET = 'donation-images'

// ─────────────────────────────────────────────────────────────
// DELETE /api/donations/[id]/images/[imageId]
//
// Remove a donation image. Donor must own the donation.
// If the deleted image was primary, promotes the next image to primary.
// ─────────────────────────────────────────────────────────────
export const DELETE = withDonor(
  async (_req: NextRequest, { profile, supabase }, ctx: Ctx) => {
    const { id: donationId, imageId } = await ctx.params

    // ── Verify donation ownership
    const { data: donation, error: fetchErr } = await supabase
      .from('donations')
      .select('id, donor_id')
      .eq('id', donationId)
      .single()

    if (fetchErr || !donation) return notFound('Donation')

    if (donation.donor_id !== profile.id) {
      return forbidden('You can only manage images for your own donations')
    }

    // ── Fetch the image record
    const { data: image, error: imgFetchErr } = await supabase
      .from('donation_images')
      .select('*')
      .eq('id', imageId)
      .eq('donation_id', donationId)   // cross-check ownership
      .single()

    if (imgFetchErr || !image) return notFound('Image')

    // ── Delete from storage if we have a path
    if (image.storage_path) {
      const { error: storageErr } = await supabase.storage
        .from(BUCKET)
        .remove([image.storage_path])

      if (storageErr) {
        console.error('[DELETE /api/donations/[id]/images/[imageId]] Storage error:', storageErr)
        // Non-fatal: continue and delete the DB record
      }
    }

    // ── Delete the DB record
    const { error: deleteErr } = await supabase
      .from('donation_images')
      .delete()
      .eq('id', imageId)

    if (deleteErr) return serverError(deleteErr.message)

    // ── If this was the primary image, promote the next one
    if (image.is_primary) {
      const { data: remaining } = await supabase
        .from('donation_images')
        .select('id')
        .eq('donation_id', donationId)
        .order('uploaded_at', { ascending: true })
        .limit(1)

      if (remaining && remaining.length > 0) {
        await supabase
          .from('donation_images')
          .update({ is_primary: true })
          .eq('id', remaining[0].id)
      }
    }

    return ok({ message: 'Image deleted successfully', id: imageId })
  }
)
