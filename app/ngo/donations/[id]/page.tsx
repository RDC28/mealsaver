import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  Package,
  Thermometer,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react'
import { DashboardSidebar } from '@/components/mealsaver/dashboard-sidebar'

const matchReasons = [
  { label: 'Nearest Verified Receiver', sub: 'Within 1.2 km radius' },
  { label: 'Urgency Alignment', sub: 'Pickup by 6:00 PM' },
  { label: 'Quantity Fit', sub: 'Perfect for your capacity' },
  { label: 'Storage Compatibility', sub: 'Refrigerated storage match' },
]

const donationMeta = [
  ['Pickup by', 'Today, 6:00 PM'],
  ['Distance', '1.2 km from your location'],
  ['Donor Phone', '+91 98765 12345'],
  ['Food Type', 'Veg · Cooked'],
  ['Packaging', 'Food-grade containers'],
  ['Special Notes', 'Prepared at 1:00 PM today. Best consumed before 8:00 PM.'],
  ['Storage Required', 'Refrigerated / Insulated'],
  ['Allergens', 'None declared'],
]

export default function NGODonationDetailPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar role="ngo" userName="Helping Hands NGO" userRole="NGO" />

      <main className="flex-1 overflow-y-auto">
        {/* Sub-header */}
        <div className="flex items-center border-b border-border bg-card px-8 py-4">
          <Link
            href="/ngo/dashboard"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={15} />
            Back to Nearby Donations
          </Link>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Top: food card + match score */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Donation info */}
            <div className="lg:col-span-3 rounded-2xl border border-border bg-card px-6 py-5 shadow-sm space-y-4">
              <div className="flex items-start gap-4">
                {/* Image */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-4xl">
                  🍛
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg font-bold text-foreground">Veg Biryani + Dal Tadka</h1>
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                      Best Match
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Cooked Food · 8 Portions
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Donor: Green Leaf Café</span>
                    <CheckCircle2 size={12} className="text-primary" />
                  </p>
                </div>
              </div>

              {/* Meta rows */}
              <div className="space-y-2.5 pt-2 border-t border-border">
                {donationMeta.map(([k, v]) => (
                  <div key={k} className="flex items-start gap-3 text-sm">
                    <span className="w-32 shrink-0 text-muted-foreground">{k}</span>
                    <span className="font-medium text-foreground">{v}</span>
                  </div>
                ))}
              </div>

              {/* Notice */}
              <div className="flex items-start gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
                <AlertCircle size={15} className="mt-0.5 shrink-0 text-orange-500" />
                Once accepted, this donation is reserved and other NGOs cannot claim it.
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 pt-1">
                <Link
                  href="/ngo/pickups/abc123"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <CheckCircle2 size={16} />
                  Accept Donation
                </Link>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-destructive bg-white py-3 text-sm font-semibold text-destructive transition-colors hover:bg-red-50">
                  <X size={16} />
                  Reject
                </button>
              </div>
            </div>

            {/* Match score */}
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card px-6 py-5 shadow-sm space-y-5">
              <h2 className="font-semibold text-foreground">Match Score</h2>

              {/* Big score circle */}
              <div className="flex flex-col items-center gap-1 py-2">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-primary">
                  <span className="text-4xl font-bold text-primary">96%</span>
                </div>
                <CheckCircle2 size={18} className="mt-2 text-primary" />
              </div>

              {/* Reasons */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Why this is a great match</p>
                {matchReasons.map((r) => (
                  <div key={r.label} className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.label}</p>
                      <p className="text-xs text-muted-foreground">{r.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
