import Link from 'next/link'
import {
  LayoutDashboard, Users, ShieldCheck, Package,
  UserPlus, BarChart2, AlertTriangle, LogOut,
  ChevronRight, AlertCircle, Clock,
} from 'lucide-react'
import { StatusBadge } from '@/components/mealsaver/status-badge'

const adminNav = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard, active: true },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Verifications', href: '/admin/verifications', icon: ShieldCheck },
  { label: 'Donations', href: '/admin/donations', icon: Package },
  { label: 'Manual Matching', href: '/admin/matching', icon: UserPlus },
  { label: 'Reports', href: '/admin/reports', icon: BarChart2 },
  { label: 'Emergency Handling', href: '/admin/emergency', icon: AlertTriangle },
]

export default function AdminDashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Admin Sidebar */}
      <aside className="flex h-full w-56 shrink-0 flex-col border-r border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              M
            </div>
            <span className="font-bold text-foreground">MealSaver</span>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {adminNav.map(({ label, href, icon: Icon, active }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
              }`}
            >
              <Icon size={15} strokeWidth={1.8} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
              AU
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Admin User</p>
              <p className="text-[10px] text-muted-foreground">admin@mealsaver.org</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <LogOut size={12} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-border bg-card px-8 py-5">
          <h1 className="text-lg font-bold text-foreground">Admin Dashboard</h1>
        </div>

        <div className="px-8 py-6 space-y-5">
          {/* Row 1: Pending verifications + Active/Expiring */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
            {/* Pending Donor Verification */}
            <div className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground">Pending Donor Verification</h2>
                <Link href="#" className="text-xs text-primary hover:underline">View All</Link>
              </div>
              <p className="text-3xl font-bold text-foreground mb-3">12</p>
              {[
                ['Green Leaf Café', 'Today, 10:38 AM'],
                ['Spice Corner', 'Today, 09:15 AM'],
                ['Urban Eats', 'Yesterday, 02:40 PM'],
              ].map(([name, time]) => (
                <div key={name} className="flex justify-between text-xs py-1 border-b border-border last:border-0">
                  <span className="font-medium text-foreground">{name}</span>
                  <span className="text-muted-foreground">{time}</span>
                </div>
              ))}
              <button className="mt-3 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
                Verify Users →
              </button>
            </div>

            {/* Pending NGO Verification */}
            <div className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground">Pending NGO Verification</h2>
                <Link href="#" className="text-xs text-primary hover:underline">View All</Link>
              </div>
              <p className="text-3xl font-bold text-foreground mb-3">8</p>
              {[
                ['Helping Hearts', 'Today, 11:00 AM'],
                ['Care & Share', 'Today, 09:05 AM'],
                ['Hope Foundation', 'Yesterday, 07:10 PM'],
              ].map(([name, time]) => (
                <div key={name} className="flex justify-between text-xs py-1 border-b border-border last:border-0">
                  <span className="font-medium text-foreground">{name}</span>
                  <span className="text-muted-foreground">{time}</span>
                </div>
              ))}
              <button className="mt-3 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
                Verify NGOs →
              </button>
            </div>

            {/* Active Donations */}
            <div className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground">Active Donations</h2>
                <span className="text-xl font-bold text-foreground">34</span>
              </div>
              {[
                ['DON-2024-0512', 'Pickup-Assigned'],
                ['DON-2024-0511', 'In Transit'],
                ['DON-2024-0510', 'Delivered'],
              ].map(([id, status]) => (
                <div key={id} className="flex items-center justify-between py-1.5 text-xs border-b border-border last:border-0">
                  <span className="text-muted-foreground">{id}</span>
                  <span className={`rounded-full px-2 py-0.5 font-medium ${
                    status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                    status === 'In Transit' ? 'bg-blue-50 text-blue-700' :
                    'bg-orange-50 text-orange-700'
                  }`}>{status}</span>
                </div>
              ))}
              <button className="mt-3 text-xs font-medium text-primary hover:underline">
                Manage Donations →
              </button>
            </div>

            {/* Expiring Soon */}
            <div className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground">Expiring Soon</h2>
                <span className="text-xl font-bold text-destructive">7</span>
              </div>
              {[
                ['DON-2024-0508', '30 min left'],
                ['DON-2024-0506', '45 min left'],
                ['DON-2024-0503', '2 hr left'],
              ].map(([id, time]) => (
                <div key={id} className="flex items-center justify-between py-1.5 text-xs border-b border-border last:border-0">
                  <span className="text-muted-foreground">{id}</span>
                  <span className="text-orange-600 font-medium">{time}</span>
                </div>
              ))}
              <button className="mt-3 text-xs font-medium text-primary hover:underline">
                Take Action →
              </button>
            </div>
          </div>

          {/* Row 2: Manual Assignments + Emergency Cases */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Manual Assignments */}
            <div className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground">Manual Assignments</h2>
                <Link href="#" className="text-xs text-primary hover:underline">View All</Link>
              </div>
              <p className="text-2xl font-bold text-foreground mb-3">5</p>
              {[
                ['DON-2024-0509', 'Unassigned'],
                ['DON-2024-0507', 'Unassigned'],
                ['DON-2024-0505', 'Needs Attention'],
              ].map(([id, status]) => (
                <div key={id} className="flex items-center justify-between py-2 text-sm border-b border-border last:border-0">
                  <span className="text-muted-foreground text-xs">{id}</span>
                  <span className={`text-xs font-medium ${status === 'Needs Attention' ? 'text-orange-600' : 'text-muted-foreground'}`}>
                    {status}
                  </span>
                </div>
              ))}
              <button className="mt-3 text-xs font-medium text-primary hover:underline">
                Manage Assignments →
              </button>
            </div>

            {/* Emergency Cases */}
            <div className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-destructive">
                  <AlertCircle size={14} /> Emergency Cases
                </h2>
                <span className="text-xl font-bold text-destructive">3</span>
              </div>
              {[
                ['DON-2024-0501', 'No NGO Accepted', '1 hr'],
                ['DON-2024-0498', 'Pickup Failed', '3 hr'],
                ['DON-2024-0493', 'Delivery Failed', '5 hr'],
              ].map(([id, reason, ago]) => (
                <div key={id} className="flex items-center gap-3 py-2 text-xs border-b border-border last:border-0">
                  <AlertCircle size={12} className="text-destructive shrink-0" />
                  <span className="font-medium text-muted-foreground">{id}</span>
                  <span className="flex-1 text-muted-foreground">{reason}</span>
                  <span className="text-muted-foreground">{ago}</span>
                </div>
              ))}
              <button className="mt-3 text-xs font-medium text-destructive hover:underline">
                Resolve Cases →
              </button>
            </div>
          </div>

          {/* Row 3: User Verification Status + Recent Verification Requests + Quick Actions */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* User Verification Status */}
            <div className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-foreground">User Verification Status</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Users', value: '1,268', color: 'text-foreground' },
                  { label: 'Verified Donors', value: '842', color: 'text-primary' },
                  { label: 'Verified NGOs', value: '186', color: 'text-primary' },
                  { label: 'Rejected Users', value: '23', color: 'text-destructive' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border p-3 text-center">
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Verification Requests */}
            <div className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-foreground">Recent Verification Requests</h2>
              <div className="space-y-3">
                {[
                  { name: 'Fresh Plate Café', role: 'Donor', time: 'Today, 11:00 AM' },
                  { name: 'Shelter Home Trust', role: 'NGO', time: 'Today, 10:20 AM' },
                  { name: 'GoodFood Pvt Ltd', role: 'Donor', time: 'Today, 09:40 AM' },
                ].map((r) => (
                  <div key={r.name} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                      {r.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-medium text-foreground">{r.name}</p>
                      <p className="text-[10px] text-muted-foreground">{r.role} · {r.time}</p>
                    </div>
                    <button className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-[10px] font-semibold text-primary-foreground">
                      Verify User
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-foreground">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button className="flex flex-col items-center gap-1.5 rounded-xl border border-border py-3 text-xs font-medium text-foreground hover:bg-secondary">
                  <Users size={18} className="text-primary" />
                  Add User
                </button>
                <button className="flex flex-col items-center gap-1.5 rounded-xl border border-border py-3 text-xs font-medium text-foreground hover:bg-secondary">
                  <ShieldCheck size={18} className="text-primary" />
                  Add NGO
                </button>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-orange-500" />
                  <span className="text-xs font-medium text-orange-800">System Alerts</span>
                </div>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                  2
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
