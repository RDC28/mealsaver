import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  Store,
  Building2,
  Truck,
  Navigation,
} from 'lucide-react'
import { DashboardSidebar } from '@/components/mealsaver/dashboard-sidebar'

export default function AcceptedPickupPage() {
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

        <div className="px-8 py-6 space-y-5">
          {/* Acceptance banner */}
          <div className="flex items-center gap-3 rounded-2xl bg-primary px-6 py-4 shadow-sm">
            <CheckCircle2 size={22} className="shrink-0 text-white" />
            <div>
              <p className="font-semibold text-white">Donation Accepted!</p>
              <p className="text-sm text-green-100">
                You have successfully reserved this donation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Left: Donation info + Pickup Assignment */}
            <div className="space-y-5">
              {/* Food card */}
              <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-3xl">
                    🍛
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Veg Biryani + Dal Tadka</h2>
                    <p className="text-sm text-muted-foreground">8 Portions · Cooked Food</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Veg', 'Cooked', 'Hygienic'].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pickup Assignment */}
              <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm space-y-4">
                <h2 className="font-semibold text-foreground">Pickup Assignment</h2>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Accepted
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Will pick up by</span>
                  <span className="flex items-center gap-1.5 font-semibold text-orange-600">
                    <Clock size={13} />
                    Today, 5:15 PM
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Assigned To</span>
                  <div className="text-right">
                    <p className="font-medium text-foreground">Rahul Sharma (Meals Team)</p>
                    <p className="text-xs text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>

                {/* Pickup method */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Pickup Method</p>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 rounded-lg border-2 border-primary bg-secondary px-4 py-2.5 text-sm font-semibold text-primary">
                      <Store size={15} />
                      NGO Pickup
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary">
                      <Truck size={15} />
                      Delivery Partner
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You will pick up the donation from the donor location.
                  </p>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-foreground">Notes</p>
                  <p className="text-sm text-muted-foreground rounded-lg bg-secondary/50 px-3 py-2.5">
                    Food prepared at 1:00 PM today. Please handle with care and maintain hygiene.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Donor + Receiver info + Route */}
            <div className="space-y-5">
              {/* Donor details */}
              <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm space-y-4">
                <h2 className="font-semibold text-foreground">Donor Details</h2>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Store size={14} className="text-primary" />
                    <p className="font-semibold text-foreground">Green Leaf Café</p>
                    <CheckCircle2 size={13} className="text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground pl-5">
                    12 MG Road, Koramangala,<br />
                    Bengaluru, Karnataka 560034
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground pl-5">
                    <Phone size={12} /> +91 98765 12345
                  </p>
                </div>

                <div className="h-px bg-border" />

                {/* Receiver */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-primary" />
                    <p className="font-semibold text-foreground">Receiver (Your NGO)</p>
                  </div>
                  <div className="flex items-center gap-2 pl-5">
                    <p className="font-medium text-foreground">Helping Hands NGO</p>
                    <CheckCircle2 size={13} className="text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground pl-5">
                    45 2nd Cross, HSR Layout,<br />
                    Bengaluru, Karnataka 560102
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground pl-5">
                    <Phone size={12} /> +91 98765 43210
                  </p>
                </div>
              </div>

              {/* Pickup timing */}
              <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm space-y-3">
                <h2 className="font-semibold text-foreground">Pickup Timing</h2>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pickup by</span>
                  <span className="font-semibold text-foreground">Today, 5:15 PM</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Latest by</span>
                  <span className="font-semibold text-foreground">Today, 6:00 PM</span>
                </div>
              </div>

              {/* Route map placeholder */}
              <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">Route (1.2 km)</h2>
                </div>
                {/* Map placeholder */}
                <div className="relative h-36 w-full overflow-hidden rounded-xl bg-secondary flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Simple map illustration */}
                    <svg width="100%" height="100%" viewBox="0 0 300 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="300" height="140" fill="#e8f5e9"/>
                      {/* Roads */}
                      <line x1="0" y1="70" x2="300" y2="70" stroke="#c8e6c9" strokeWidth="12"/>
                      <line x1="150" y1="0" x2="150" y2="140" stroke="#c8e6c9" strokeWidth="8"/>
                      <line x1="0" y1="35" x2="300" y2="35" stroke="#dcedc8" strokeWidth="5"/>
                      <line x1="0" y1="105" x2="300" y2="105" stroke="#dcedc8" strokeWidth="5"/>
                      {/* Route path */}
                      <path d="M60 70 Q100 50 150 70 Q200 90 240 70" stroke="#15803d" strokeWidth="3" strokeDasharray="6 3" fill="none"/>
                      {/* Start marker */}
                      <circle cx="60" cy="70" r="8" fill="#15803d"/>
                      <text x="60" y="74" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">A</text>
                      {/* End marker */}
                      <circle cx="240" cy="70" r="8" fill="#ef4444"/>
                      <text x="240" y="74" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">B</text>
                    </svg>
                  </div>
                </div>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock size={13} className="text-primary" />
                  Est. Time: 8 mins
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
