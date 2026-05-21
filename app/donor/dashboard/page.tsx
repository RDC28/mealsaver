import Link from 'next/link'
import {
  PlusCircle,
  CheckCircle2,
  UtensilsCrossed,
  Leaf,
  MoreVertical,
  TrendingUp,
  BarChart2,
} from 'lucide-react'
import { DashboardSidebar } from '@/components/mealsaver/dashboard-sidebar'
import { StatusBadge } from '@/components/mealsaver/status-badge'

const stats = [
  { icon: '🍱', value: '12', label: 'Active Donations', sub: 'View all', href: '/donor/donations' },
  { icon: '✅', value: '38', label: 'Successful Deliveries', sub: 'View all', href: '/donor/history' },
  { icon: '🍜', value: '1,240', label: 'Meals Saved', sub: 'This Month' },
  { icon: '🌿', value: '320 kg', label: 'Waste Reduced', sub: 'This Month' },
]

const recentDonations = [
  {
    id: '1',
    title: 'Veg Biryani + Dal Tadka',
    qty: '8 Portions',
    status: 'available' as const,
    window: '6:00 PM – 7:00 PM',
    time: '2 min ago',
  },
  {
    id: '2',
    title: 'Paneer Butter Masala',
    qty: '6 Portions',
    status: 'accepted' as const,
    window: '7:00 PM – 8:00 PM',
    time: '35 min ago',
  },
  {
    id: '3',
    title: 'Mixed Veg Curry',
    qty: '5 Portions',
    status: 'picked_up' as const,
    window: '5:00 PM – 6:00 PM',
    time: '1 hr ago',
  },
  {
    id: '4',
    title: 'Masala Dosa + Chutney',
    qty: '10 Portions',
    status: 'delivered' as const,
    window: '8:00 PM – 9:00 PM',
    time: 'Yesterday',
  },
  {
    id: '5',
    title: 'Veg Pulao',
    qty: '6 Portions',
    status: 'expired' as const,
    window: '—',
    time: '2 days ago',
  },
]

export default function DonorDashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar role="donor" />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-start justify-between border-b border-border bg-card px-8 py-5">
          <div>
            <h1 className="text-lg font-bold text-foreground">
              Welcome back, Green Leaf Café! 🌿
            </h1>
            <p className="text-sm text-muted-foreground">
              Together, we&apos;re reducing waste and feeding more people.
            </p>
          </div>
          <Link
            href="/donor/donations/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <PlusCircle size={16} />
            Create New Donation
          </Link>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm"
              >
                <span className="text-2xl">{s.icon}</span>
                <p className="mt-2 text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                {s.href ? (
                  <Link href={s.href} className="mt-1 text-xs font-medium text-primary hover:underline">
                    {s.sub}
                  </Link>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
                )}
              </div>
            ))}
          </div>

          {/* Recent Donations table */}
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="font-semibold text-foreground">Recent Donations</h2>
              <Link href="/donor/donations" className="text-sm font-medium text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                    <th className="px-6 py-3">Food Title</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Pickup Window</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentDonations.map((d) => (
                    <tr key={d.id} className="hover:bg-secondary/30">
                      <td className="px-6 py-3.5 font-medium text-foreground">{d.title}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{d.qty}</td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">{d.window}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{d.time}</td>
                      <td className="px-4 py-3.5">
                        <button className="text-muted-foreground hover:text-foreground">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Impact banner */}
          <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/40 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌿</span>
              <div>
                <p className="font-semibold text-foreground">Great going!</p>
                <p className="text-sm text-muted-foreground">
                  You&apos;ve made a positive impact in your community.
                </p>
              </div>
            </div>
            <Link
              href="/impact"
              className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
            >
              <BarChart2 size={15} />
              View Impact Report
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
