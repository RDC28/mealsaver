import Link from 'next/link'
import { RefreshCw, Clock, MapPin, ChevronRight, Heart } from 'lucide-react'
import { DashboardSidebar } from '@/components/mealsaver/dashboard-sidebar'

const nearbyDonations = [
  {
    id: '1',
    emoji: '🍛',
    title: 'Veg Biryani + Dal Tadka',
    qty: '8 Portions · Cooked Food',
    pickupBy: '6:00 PM',
    distance: '1.2 km',
    donor: 'Green Leaf Café',
    tags: ['Veg', 'Cooked', 'Hygienic'],
    tagColors: ['green', 'green', 'blue'],
  },
  {
    id: '2',
    emoji: '🧁',
    title: 'Fresh Bakery Items',
    qty: '12 Packets · Packaged Food',
    pickupBy: '4:30 PM',
    distance: '2.3 km',
    donor: 'Morning Bakes',
    tags: ['Veg', 'Packaged', 'Dry'],
    tagColors: ['green', 'blue', 'orange'],
  },
  {
    id: '3',
    emoji: '🌾',
    title: 'Rice Bags + Onions',
    qty: '25 kg Rice · 10 kg Onions · Raw Material',
    pickupBy: '7:00 PM',
    distance: '3.6 km',
    donor: 'WholeMart',
    tags: ['Raw Material', 'Bulk', 'Dry'],
    tagColors: ['orange', 'orange', 'orange'],
  },
]

const tagColorMap: Record<string, string> = {
  green: 'bg-green-50 text-green-700',
  blue: 'bg-blue-50 text-blue-700',
  orange: 'bg-orange-50 text-orange-700',
}

export default function NGODashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar role="ngo" userName="Helping Hands NGO" userRole="NGO" />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-border bg-card px-8 py-5">
          <div>
            <h1 className="text-lg font-bold text-foreground">Nearby Donations</h1>
            <p className="text-sm text-muted-foreground">
              Showing donations within 5–7 km radius · Nearest first
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { icon: '✅', value: '12', label: 'Available Nearby' },
              { icon: '📦', value: '3', label: 'Accepted Today' },
              { icon: '🍜', value: '48', label: 'Meals Received' },
              { icon: '📍', value: '5–7 km', label: 'Service Radius' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm text-center"
              >
                <span className="text-2xl">{s.icon}</span>
                <p className="mt-2 text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Donation cards */}
          <div className="space-y-4">
            {nearbyDonations.map((d) => (
              <div
                key={d.id}
                className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {/* Image placeholder */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-4xl">
                    {d.emoji}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <h3 className="font-semibold text-foreground">{d.title}</h3>
                    <p className="text-sm text-muted-foreground">{d.qty}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> Pickup by {d.pickupBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {d.distance}
                      </span>
                      <span>Donor: {d.donor}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {d.tags.map((tag, i) => (
                        <span
                          key={tag}
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            tagColorMap[d.tagColors[i]] ?? 'bg-secondary text-foreground'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={`/ngo/donations/${d.id}`}
                    className="shrink-0 rounded-lg border border-primary bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-secondary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}

            {/* End message */}
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
              <Heart size={14} className="text-primary" />
              No more donations nearby
            </div>
          </div>

          {/* Service radius */}
          <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm inline-block">
            <p className="text-sm text-muted-foreground">Service Radius</p>
            <p className="text-2xl font-bold text-foreground">5–7 km</p>
            <p className="text-xs text-muted-foreground mb-3">
              You will see donations within this radius.
            </p>
            <button className="text-sm font-semibold text-primary hover:underline">
              Change Radius
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
