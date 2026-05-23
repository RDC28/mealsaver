import { withDonor } from '@/lib/api/auth-guard'
import { created, err, notFound, forbidden, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

const BUCKET = 'donation-images'
const MAX_SIZE_BYTES = 5 * 1024 * 1024   // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// ─────────────────────────────────────────────────────────────
// POST /api/donations/[id]/images
//
// Upload an image for a donation. Accepts multipart/form-data.
// Field name: "image"
//
// Rules:
//  - Donor must own the donation
//  - Max 5 MB, JPEG / PNG / WebP only
//  - Max 5 images per donation
//  - First uploaded image becomes the primary image
// ─────────────────────────────────────────────────────────────
export const POST = withDonor(
  async (req: NextRequest, { profile, supabase }, ctx: Ctx) => {
    const { id: donationId } = await ctx.params

    // ── Verify donation ownership
    const { data: donation, error: fetchErr } = await supabase
      .from('donations')
      .select('id, donor_id, status')
      .eq('id', donationId)
      .single()

    if (fetchErr || !donation) return notFound('Donation')

    if (donation.donor_id !== profile.id) {
      return forbidden('You can only upload images for your own donations')
    }

    if (!['available', 'pending_acceptance'].includes(donation.status)) {
      return err(
        'Images can only be added to available or pending donations',
        409,
        'WRONG_STATUS'
      )
    }

    // ── Parse multipart form
    let formData: FormData
    try {
      formData = await req.formData()
    } catch {
      return err('Request must be multipart/form-data', 400, 'INVALID_REQUEST')
    }

    const file = formData.get('image')
    if (!file || !(file instanceof File)) {
      return err('Field "image" is required and must be a file', 422, 'VALIDATION_ERROR')
    }

    // ── Validate file type and size
    if (!ALLOWED_TYPES.includes(file.type)) {
      return err(
        `Invalid file type "${file.type}". Allowed: JPEG, PNG, WebP`,
        415,
        'INVALID_FILE_TYPE'
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return err(
        `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 5 MB.`,
        413,
        'FILE_TOO_LARGE'
      )
    }

    // ── Check image count limit
    const { count } = await supabase
      .from('donation_images')
      .select('id', { count: 'exact', head: true })
      .eq('donation_id', donationId)

    if ((count ?? 0) >= 5) {
      return err(
        'Maximum of 5 images per donation. Delete an existing image first.',
        409,
        'IMAGE_LIMIT_REACHED'
      )
    }

    // ── Is this the first image? (becomes primary)
    const isPrimary = (count ?? 0) === 0

    // ── Build storage path: donations/{donationId}/{uuid}.{ext}
    const ext = file.type.split('/')[1].replace('jpeg', 'jpg')
    const uuid = crypto.randomUUID()
    const storagePath = `donations/${donationId}/${uuid}.${ext}`

    // ── Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadErr) {
      console.error('[POST /api/donations/[id]/images] Upload error:', uploadErr)
      return serverError('Failed to upload image. Please try again.')
    }

    // ── Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath)

    // ── Save image record to DB
    const { data: imageRecord, error: dbErr } = await supabase
      .from('donation_images')
      .insert({
        donation_id: donationId,
        image_url: urlData.publicUrl,
        storage_path: storagePath,
        is_primary: isPrimary,
      })
      .select()
      .single()

    if (dbErr) {
      // Clean up orphaned storage file
      await supabase.storage.from(BUCKET).remove([storagePath])
      return serverError(dbErr.message)
    }

    return created({
      ...imageRecord,
      message: isPrimary
        ? 'Image uploaded and set as primary photo.'
        : 'Image uploaded successfully.',
    })
  }
)
