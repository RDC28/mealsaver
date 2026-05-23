import { withAdmin } from '@/lib/api/auth-guard'
import { ok, serverError } from '@/lib/api/response'
import type { NextRequest } from 'next/server'

// ─────────────────────────────────────────────────────────────
// GET /api/admin/reports
//
// Platform-wide impact and activity statistics.
// ─────────────────────────────────────────────────────────────
export const GET = withAdmin(
  async (_req: NextRequest, { supabase }) => {
    // Run all stat queries in parallel
    const [
      usersResult,
      donationsResult,
      impactResult,
      recentDonationsResult,
      pendingVerificationsResult,
    ] = await Promise.all([
      // User counts by role
      supabase.rpc('get_user_counts'),

      // Donation counts by status
      supabase
        .from('donations')
        .select('status', { count: 'exact' })
        .then(async () => {
          const statuses = [
            'available', 'pending_acceptance', 'accepted',
            'pickup_assigned', 'picked_up', 'delivered',
            'expired', 'cancelled',
          ]
          const counts = await Promise.all(
            statuses.map(s =>
              supabase
                .from('donations')
                .select('id', { count: 'exact', head: true })
                .eq('status', s)
                .then(({ count }) => ({ status: s, count: count ?? 0 }))
            )
          )
          return { data: counts }
        }),

      // Aggregate impact stats
      supabase
        .from('impact_reports')
        .select('meals_saved, food_waste_reduced_kg, co2_impact_kg, people_served')
        .then(({ data }) => {
          if (!data) return { data: null }
          const totals = data.reduce(
            (acc, r) => ({
              total_meals_saved:   acc.total_meals_saved   + (r.meals_saved ?? 0),
              total_kg_rescued:    acc.total_kg_rescued    + (r.food_waste_reduced_kg ?? 0),
              total_co2_saved:     acc.total_co2_saved     + (r.co2_impact_kg ?? 0),
              total_people_served: acc.total_people_served + (r.people_served ?? 0),
              total_reports:       acc.total_reports       + 1,
            }),
            { total_meals_saved: 0, total_kg_rescued: 0, total_co2_saved: 0, total_people_served: 0, total_reports: 0 }
          )
          return { data: totals }
        }),

      // Last 7 days donations
      supabase
        .from('donations')
        .select('id, created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),

      // Pending verifications
      supabase
        .from('donor_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('verification_status', 'pending')
        .then(async ({ count: donorCount }) => {
          const { count: receiverCount } = await supabase
            .from('receiver_profiles')
            .select('id', { count: 'exact', head: true })
            .eq('verification_status', 'pending')
          return { data: { donors: donorCount ?? 0, receivers: receiverCount ?? 0 } }
        }),
    ])

    if (
      usersResult.error ||
      impactResult.data === null ||
      recentDonationsResult.error
    ) {
      return serverError('Failed to load some report data')
    }

    return ok({
      users: usersResult.data,
      donations_by_status: donationsResult.data,
      impact: impactResult.data,
      recent_activity: {
        donations_last_7_days: recentDonationsResult.data?.length ?? 0,
      },
      pending_verifications: pendingVerificationsResult.data,
      generated_at: new Date().toISOString(),
    })
  }
)
