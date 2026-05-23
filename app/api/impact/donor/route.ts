import { withDonor } from '@/lib/api/auth-guard'
import { ok, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

// ─────────────────────────────────────────────────────────────
// GET /api/impact/donor
//
// Returns the logged-in donor's cumulative impact summary.
// Calls get_donor_impact_summary() DB function.
// ─────────────────────────────────────────────────────────────
export const GET = withDonor(
  async (_req: NextRequest, { profile, supabase }) => {
    const { data, error } = await supabase
      .rpc('get_donor_impact_summary', { p_donor_id: profile.id })

    if (error) {
      console.error('[GET /api/impact/donor] RPC error:', error)
      return serverError('Failed to load impact summary. ' + error.message)
    }

    // Also fetch recent impact reports for context
    const { data: recentReports } = await supabase
      .from('impact_reports')
      .select(
        `
        id, meals_saved, food_waste_reduced_kg, co2_impact_kg,
        people_served, report_generated_at,
        donations ( title, pickup_city, food_type )
        `
      )
      .eq('donor_id', profile.id)
      .order('report_generated_at', { ascending: false })
      .limit(5)

    return ok({
      summary: data,
      recent_reports: recentReports ?? [],
    })
  }
)
