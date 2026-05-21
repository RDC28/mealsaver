'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Download, TrendingUp, Leaf, Cloud, Users } from 'lucide-react'
import { DashboardSidebar } from '@/components/mealsaver/dashboard-sidebar'

const chartData = [
  { month: 'Jan', meals: 280,  waste: 60 },
  { month: 'Feb', meals: 420,  waste: 90 },
  { month: 'Mar', meals: 650,  waste: 140 },
  { month: 'Apr', meals: 900,  waste: 220 },
  { month: 'May', meals: 1240, waste: 320 },
]

const topStats = [
  { emoji: '🍜', value: '1,240', label: 'Meals Saved', sub: '+120 this week' },
  { emoji: '🌿', value: '320 kg', label: 'Waste Reduced', sub: '+28 kg this week' },
  { emoji: '☁️', value: '512 kg', label: 'CO₂ Impact Avoided', sub: '+48 kg this week' },
  { emoji: '👥', value: '85', label: 'Total Donations', sub: '+9 this week' },
]

const recentActivity = [
  { icon: '🍜', event: 'Donation Completed', sub: 'Veg Biryani + Dal Tadka', meta: '8 Portions', time: 'Today, 6:42 PM' },
  { icon: '🍜', event: 'Donation Completed', sub: 'Chola + Rice', meta: '10 Portions', time: 'Today, 1:15 PM' },
  { icon: '🌿', event: 'Waste Reduced', sub: 'Through your recent donations', meta: '24 kg', time: 'May 11, 2024' },
  { icon: '☁️', event: 'CO₂ Impact Achieved', sub: 'Equivalent to 2.5 km of car travel avoided', meta: '18 kg', time: 'May 10, 2024' },
]

export default function ImpactPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar role="donor" />

      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-border bg-card px-8 py-5">
          <h1 className="text-lg font-bold text-foreground">Impact Report</h1>
          <p className="text-sm text-muted-foreground">Your Impact, Our Shared Mission</p>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Top stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {topStats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
                <span className="text-2xl">{s.emoji}</span>
                <p className="mt-2 text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="mt-0.5 text-xs font-medium text-primary">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Chart + Contribution */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Chart */}
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card px-6 py-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-foreground">Impact Over Time</h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="meals"
                    name="Meals Saved"
                    stroke="#15803d"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#15803d' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="waste"
                    name="Waste Reduced (kg)"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#f97316' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Contribution history */}
            <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-foreground">Contribution History</h2>
              <p className="text-xs text-muted-foreground mb-2">Since Join Date</p>
              <p className="text-3xl font-bold text-foreground">₹ 24,860</p>
              <p className="text-sm text-muted-foreground mb-4">Total Value Contributed</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><span className="text-primary">✓</span> Meals saved summary</p>
                <p className="flex items-center gap-2"><span className="text-primary">✓</span> Waste &amp; CO₂ impact</p>
                <p className="flex items-center gap-2"><span className="text-primary">✓</span> Donation trend analysis</p>
                <p className="flex items-center gap-2"><span className="text-primary">✓</span> NGO beneficiaries</p>
                <p className="flex items-center gap-2"><span className="text-primary">✓</span> Downloadable PDF report</p>
              </div>
              <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                <Download size={15} />
                Download Report
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm">
            <h2 className="mb-4 font-semibold text-foreground">Recent Impact Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{a.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{a.event}</p>
                      <p className="text-xs text-muted-foreground">{a.sub}</p>
                      <p className="text-xs text-muted-foreground">{a.time}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-foreground">{a.meta}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
