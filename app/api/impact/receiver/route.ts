import { withReceiver } from '@/lib/api/auth-guard'
import { ok, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

// ─────────────────────────────────────────────────────────────
// GET /api/impact/receiver
//
// Returns the logged-in NGO's cumulative impact summary.
// Calls get_receiver_impact_summary() DB function.
// ─────────────────────────────────────────────────────────────
export const GET = withReceiver(
  async (_req: NextRequest, { profile, supabase }) => {
    const { data, error } = await supabase
      .rpc('get_receiver_impact_summary', { p_receiver_id: profile.id })

    if (error) {
      console.error('[GET /api/impact/receiver] RPC error:', error)
      return serverError('Failed to load impact summary. ' + error.message)
    }

    // Recent impact reports
    const { data: recentReports } = await supabase
      .from('impact_reports')
      .select(
        `
        id, meals_saved, food_waste_reduced_kg, co2_impact_kg,
        people_served, report_generated_at,
        donations ( title, pickup_city, food_type )
        `
      )
      .eq('receiver_id', profile.id)
      .order('report_generated_at', { ascending: false })
      .limit(5)

    return ok({
      summary: data,
      recent_reports: recentReports ?? [],
    })
  }
)
