import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  Package,
  Leaf,
  Thermometer,
  AlertCircle,
  Pencil,
  X,
  CheckCircle2,
  Circle,
  Truck,
  Store,
  Building2,
} from 'lucide-react'
import { DashboardSidebar } from '@/components/mealsaver/dashboard-sidebar'

const steps = [
  { label: 'Uploaded',            time: '3:00 PM\n24 May', done: true },
  { label: 'Nearby NGOs\nNotified', time: '3:05 PM\n24 May', done: true },
  { label: 'Accepted by NGO',     time: '3:20 PM\n24 May', done: true },
  { label: 'Pickup\nAssigned',    time: '4:30 PM\n24 May', done: false },
  { label: 'Picked Up',          time: 'Pending',          done: false },
  { label: 'Delivered',          time: 'Pending',          done: false },
]

const timeline = [
  { time: '3:00 PM\n24 May', event: 'Donation Uploaded',          color: 'bg-primary' },
  { time: '3:05 PM\n24 May', event: 'Nearby NGOs Notified',       color: 'bg-primary' },
  { time: '3:20 PM\n24 May', event: 'Accepted by Helping Hands NGO', color: 'bg-primary' },
  { time: '4:30 PM\n24 May', event: 'Pickup Assigned',            color: 'bg-orange-400' },
  { time: 'Pending',          event: 'Picked Up',                  color: 'bg-muted' },
  { time: 'Pending',          event: 'Delivered',                  color: 'bg-muted' },
]

export default function DonationDetailPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar role="donor" />

      <main className="flex-1 overflow-y-auto">
        {/* Sub-header */}
        <div className="flex items-center justify-between border-b border-border bg-card px-8 py-4">
          <Link
            href="/donor/donations"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={15} />
            Back to Active Donations
          </Link>
          <span className="text-xs text-muted-foreground">
            Donation ID: DNTN-2025-0524-0012
          </span>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Title + tags */}
          <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
              {/* Food image placeholder */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-5xl">
                🍛
              </div>
              <div className="flex-1 space-y-2">
                <h1 className="text-xl font-bold text-foreground">
                  Veg Biryani + Dal Tadka — 8 Portions
                </h1>
                <div className="flex flex-wrap gap-2 text-xs">
                  {['Main Course', 'Veg', 'Cooked', 'No Storage'].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-secondary px-2.5 py-1 font-medium text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress stepper */}
            <div className="mt-6 flex items-center overflow-x-auto gap-0">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center gap-1 min-w-[80px] text-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                        step.done
                          ? 'border-primary bg-primary text-white'
                          : i === steps.findIndex((s) => !s.done)
                          ? 'border-orange-400 bg-orange-400 text-white'
                          : 'border-border bg-background text-muted-foreground'
                      }`}
                    >
                      {step.done ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Circle size={14} />
                      )}
                    </div>
                    <p className="whitespace-pre-line text-[10px] font-medium leading-tight text-foreground">
                      {step.label}
                    </p>
                    <p className="whitespace-pre-line text-[9px] leading-tight text-muted-foreground">
                      {step.time}
                    </p>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`mx-1 h-0.5 w-8 shrink-0 ${
                        step.done ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Donation Details */}
            <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-foreground">Donation Details</h2>
              {[
                ['Pickup Deadline', '🟠 24 May 2025, 7:00 PM'],
                ['Food Type', 'Cooked · Veg'],
                ['Quantity', '8 Portions'],
                ['Preparation Time', '24 May 2025, 3:00 PM'],
                ['Expiry / Safe Usage', '24 May 2025, 9:00 PM'],
                ['Preferred Window', '6:00 PM – 7:00 PM'],
                ['Pickup Mode', '🚐 NGO Pickup'],
                ['Special Notes', 'Please bring your own containers.'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-right font-medium text-foreground">{v}</span>
                </div>
              ))}
            </div>

            {/* Location & People */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm space-y-3">
                <h2 className="font-semibold text-foreground">Location &amp; People</h2>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="flex items-center gap-1.5 font-medium text-foreground mb-1">
                      <Store size={13} className="text-primary" />
                      Donor (You)
                    </div>
                    <p className="text-muted-foreground text-sm font-semibold">Green Leaf Café</p>
                    <p className="text-xs text-muted-foreground">
                      12, 3rd Cross, Koramangala 4th Block,<br />Bengaluru – 560034
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone size={11} /> +91 98765 43210
                    </p>
                  </div>
                  <div className="h-px bg-border" />
                  <div>
                    <div className="flex items-center gap-1.5 font-medium text-foreground mb-1">
                      <Building2 size={13} className="text-primary" />
                      Receiver NGO
                    </div>
                    <p className="text-muted-foreground text-sm font-semibold">Helping Hands NGO</p>
                    <p className="text-xs text-muted-foreground">Koramangala, Bengaluru</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone size={11} /> +91 98765 43211
                    </p>
                  </div>
                </div>
              </div>

              {/* Thank you */}
              <div className="rounded-2xl border border-border bg-secondary/40 px-5 py-4 text-sm">
                <p className="flex items-center gap-2 font-medium text-foreground">
                  <span>🌿</span> Thank you for your generosity!
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your donation will help feed more people and reduce food waste.
                </p>
              </div>
            </div>
          </div>

          {/* Activity Timeline + Actions */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Timeline */}
            <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-foreground">Activity Timeline</h2>
              <div className="space-y-3">
                {timeline.map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${t.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{t.event}</p>
                    </div>
                    <span className="shrink-0 whitespace-pre-line text-right text-[10px] text-muted-foreground leading-tight">
                      {t.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm flex flex-col justify-between">
              <div>
                <p className="font-semibold text-foreground mb-1">Need to make a change?</p>
                <p className="text-sm text-muted-foreground">
                  You can update or cancel this donation before pickup.
                </p>
              </div>
              <div className="mt-6 space-y-3">
                <button className="w-full rounded-lg border border-border bg-white py-3 text-sm font-semibold text-foreground hover:bg-secondary">
                  Edit Donation
                </button>
                <button className="w-full rounded-lg border border-destructive bg-white py-3 text-sm font-semibold text-destructive hover:bg-red-50">
                  Cancel Donation
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
