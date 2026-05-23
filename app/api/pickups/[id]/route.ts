import { withAuth } from '@/lib/api/auth-guard'
import { ok, notFound, forbidden, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

// ─────────────────────────────────────────────────────────────
// GET /api/pickups/[id]
//
// Returns pickup details. Accessible by:
//  - The receiver who created the pickup
//  - The donor whose donation is being picked up
//  - Admin
// ─────────────────────────────────────────────────────────────
export const GET = withAuth(
  async (_req: NextRequest, { profile, supabase }, ctx: Ctx) => {
    const { id } = await ctx.params

    const { data, error } = await supabase
      .from('pickup_assignments')
      .select(
        `
        *,
        donations (
          id, title, status, pickup_address, pickup_city,
          pickup_instructions, contact_number, donor_id,
          donation_images ( image_url, is_primary )
        ),
        receiver_profiles ( organization_name, phone )
        `
      )
      .eq('id', id)
      .single()

    if (error || !data) return notFound('Pickup assignment')

    // ── Access control: donor, receiver, or admin
    const donorId = (data.donations as { donor_id: string } | null)?.donor_id
    const isReceiver = data.receiver_id === profile.id
    const isDonor    = donorId === profile.id
    const isAdmin    = profile.role === 'admin'

    if (!isReceiver && !isDonor && !isAdmin) {
      return forbidden('You do not have access to this pickup')
    }

    return ok(data)
  }
)
