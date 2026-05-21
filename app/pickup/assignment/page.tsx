import Link from 'next/link'
import {
  Store,
  Truck,
  UserCheck,
  Phone,
  MapPin,
  Clock,
  Package,
  CheckCircle2,
  Building2,
} from 'lucide-react'

const tabs = ['NGO Pickup', 'Delivery Partner', 'Manual Assign']

export default function PickupAssignmentPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Pickup Assignment</h1>
            <p className="text-sm text-muted-foreground">Assign pickup method for this donation</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-primary">
            <CheckCircle2 size={13} />
            Pickup Assigned
          </span>
        </div>

        {/* Method tabs */}
        <div className="flex overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                i === 0
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Left: Donation + Donor info */}
          <div className="space-y-5">
            {/* Assignment details */}
            <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm space-y-3">
              <h2 className="text-sm font-semibold text-foreground">Assignment Details</h2>
              {[
                ['Donation ID', 'DON-2024-0512'],
                ['Pickup Window', 'Today, 6:00 PM – 6:30 PM'],
                ['Assigned At', 'Today, 5:20 PM'],
                ['Pickup Method', 'NGO Self Pickup'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    {k === 'Donation ID' && <Package size={13} />}
                    {k === 'Pickup Window' && <Clock size={13} />}
                    {k === 'Assigned At' && <Clock size={13} />}
                    {k === 'Pickup Method' && <Store size={13} />}
                    {k}
                  </span>
                  <span className="font-medium text-foreground text-right">{v}</span>
                </div>
              ))}
            </div>

            {/* Donor */}
            <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm space-y-2">
              <h2 className="text-sm font-semibold text-foreground">Donor</h2>
              <p className="font-semibold text-foreground">Green Leaf Café</p>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone size={12} /> +91 98765 43210
              </p>
              <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                <MapPin size={12} className="mt-0.5 shrink-0" />
                Koramangala, Bengaluru, 560034
              </p>
            </div>

            {/* Receiver NGO */}
            <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm space-y-2">
              <h2 className="text-sm font-semibold text-foreground">Receiver NGO</h2>
              <p className="font-semibold text-foreground">Helping Hands NGO</p>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone size={12} /> +91 91234 56789
              </p>
              <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                <MapPin size={12} className="mt-0.5 shrink-0" />
                BTM Layout, Bengaluru, 560076
              </p>
            </div>
          </div>

          {/* Right: Donation details + Rider + Notes */}
          <div className="space-y-5">
            {/* Donation */}
            <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm space-y-3">
              <h2 className="text-sm font-semibold text-foreground">Donation Details</h2>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-3xl">
                  🍛
                </div>
                <div>
                  <p className="font-semibold text-foreground">Veg Biryani + Dal Tadka</p>
                  <p className="text-sm text-muted-foreground">8 Portions · Veg · Packed</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                  Pickup Assigned
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tracking ID</span>
                <span className="font-mono text-xs font-medium text-foreground">TRK-984312</span>
              </div>
              <Link
                href={`/donor/donations/abc123`}
                className="block text-center text-sm font-medium text-primary hover:underline"
              >
                View Timeline →
              </Link>
            </div>

            {/* Rider / Contact */}
            <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm space-y-3">
              <h2 className="text-sm font-semibold text-foreground">Rider / Contact Person</h2>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  RS
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-foreground">Rahul Sharma</p>
                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                      Verified
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                  <p className="text-xs text-muted-foreground">Helping Hands NGO</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm space-y-2">
              <h2 className="text-sm font-semibold text-foreground">Notes</h2>
              <p className="text-sm text-muted-foreground">
                Please collect from main counter.
              </p>
            </div>

            {/* Confirm Pickup CTA */}
            <Link
              href="/pickup/verify"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <CheckCircle2 size={16} />
              Confirm Pickup
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
