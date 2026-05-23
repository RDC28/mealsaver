import { withAdmin } from '@/lib/api/auth-guard'
import { ok, notFound, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ id: string }> }

// ─────────────────────────────────────────────────────────────
// GET /api/admin/users/[id]
//
// Get a single user with full profile data.
// ─────────────────────────────────────────────────────────────
export const GET = withAdmin(
  async (_req: NextRequest, { supabase }, ctx: Ctx) => {
    const { id } = await ctx.params

    const { data, error } = await supabase
      .from('users')
      .select(
        `
        *,
        donor_profiles (*),
        receiver_profiles (*)
        `
      )
      .eq('id', id)
      .single()

    if (error || !data) return notFound('User')

    // Also fetch their recent donations
    const { data: donations } = await supabase
      .from('donations')
      .select('id, title, status, created_at, pickup_city')
      .eq('donor_id', id)
      .order('created_at', { ascending: false })
      .limit(10)

    return ok({ ...data, recent_donations: donations ?? [] })
  }
)
