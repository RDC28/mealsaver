import { withAuth } from '@/lib/api/auth-guard'
import { ok, notFound, forbidden, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ donationId: string }> }

// ─────────────────────────────────────────────────────────────
// GET /api/impact/[donationId]
//
// Returns the impact report for a specific donation.
// Accessible by the donor, the receiver, or admin.
// ─────────────────────────────────────────────────────────────
export const GET = withAuth(
  async (_req: NextRequest, { profile, supabase }, ctx: Ctx) => {
    const { donationId } = await ctx.params

    const { data, error } = await supabase
      .from('impact_reports')
      .select(
        `
        *,
        donations (
          id, title, food_type, food_condition, quantity_kg,
          pickup_city, pickup_address, created_at,
          donation_images ( image_url, is_primary )
        )
        `
      )
      .eq('donation_id', donationId)
      .single()

    if (error || !data) return notFound('Impact report')

    // ── Access control: only donor, receiver, or admin
    const isDonor    = data.donor_id === profile.id
    const isReceiver = data.receiver_id === profile.id
    const isAdmin    = profile.role === 'admin'

    if (!isDonor && !isReceiver && !isAdmin) {
      return forbidden('You do not have access to this impact report')
    }

    return ok(data)
  }
)
