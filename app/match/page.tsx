"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { AppLayout } from "@/components/app-layout"

interface Donation {
  id: number
  item: string
  quantity: string
  type: string
  status: "Pending Pickup" | "Matched" | "Completed" | "Accepted" | "In Transit"
  pickup: string
  address: string
  time: string
  step: number
}

const DEFAULT_DONATION: Donation = {
  id: 1,
  item: "Assorted Gourmet Sandwiches",
  quantity: "12 kg",
  type: "Bakery",
  status: "Accepted",
  pickup: "Today, 6:00 PM - 7:00 PM",
  address: "Green Leaf Cafe - Main Entrance",
  time: "04:30 PM Today",
  step: 3
}

function MatchDetailsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const donationId = searchParams.get("id")

  const [donation, setDonation] = useState<Donation | null>(null)
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mealsaver_donations")
      if (stored && donationId) {
        try {
          const list: Donation[] = JSON.parse(stored)
          const found = list.find((d) => d.id.toString() === donationId)
          if (found) {
            setDonation(found)
          } else {
            setDonation(DEFAULT_DONATION)
          }
        } catch (e) {
          console.error(e)
          setDonation(DEFAULT_DONATION)
        }
      } else {
        setDonation(DEFAULT_DONATION)
      }
    }
  }, [donationId])

  // Simple animation loop for the map marker
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedProgress((prev) => (prev >= 1 ? 0 : prev + 0.05))
    }, 300)
    return () => clearInterval(interval)
  }, [])

  if (!donation) {
    return (
      <div className="flex h-96 items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  // Calculate coordinates for animation
  // Route is a bezier curve Q 150 40 250 80 starting at 50, 100
  // Approximation of curve coordinates for animation:
  const t = animatedProgress
  const markerX = (1 - t) * (1 - t) * 50 + 2 * (1 - t) * t * 150 + t * t * 250
  const markerY = (1 - t) * (1 - t) * 100 + 2 * (1 - t) * t * 40 + t * t * 80

  return (
    <div className="px-6 md:px-12 py-8 max-w-5xl mx-auto flex flex-col min-h-screen">
      {/* Header */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Rescue Coordination</h1>
          <p className="text-on-surface-variant font-medium text-sm mt-1">Real-time matching details and transport route tracking.</p>
        </div>
        <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider w-fit">
          Matched & Dispatching
        </span>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details and Live Tracking */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Card */}
          <div className="bg-white rounded-[24px] border border-outline-variant/30 p-6 bento-shadow">
            <h2 className="text-xl font-extrabold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">restaurant</span>
              {donation.item}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-primary text-xl">inventory_2</span>
                <div>
                  <div className="text-xs text-on-surface-variant font-bold uppercase">Quantity</div>
                  <div className="text-sm font-extrabold text-on-surface mt-0.5">{donation.quantity}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                <div>
                  <div className="text-xs text-on-surface-variant font-bold uppercase">Pickup Window</div>
                  <div className="text-sm font-extrabold text-on-surface mt-0.5">{donation.pickup}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                <div>
                  <div className="text-xs text-on-surface-variant font-bold uppercase">Collection Point</div>
                  <div className="text-sm font-extrabold text-on-surface mt-0.5">{donation.address}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="material-symbols-outlined text-primary text-xl">call</span>
                <div>
                  <div className="text-xs text-on-surface-variant font-bold uppercase">Donor Contact</div>
                  <div className="text-sm font-extrabold text-on-surface mt-0.5">+91 90000 12345</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 border-t border-outline-variant/10 pt-6">
              <button className="bg-primary text-on-primary px-6 py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-primary/95 transition-all active:scale-95 cursor-pointer">
                Confirm Handover
              </button>
              <button className="border border-outline-variant text-on-surface-variant hover:text-on-surface px-6 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer">
                Call Donor Cafe
              </button>
            </div>
          </div>

          {/* Route Tracking Map */}
          <div className="bg-white rounded-[24px] border border-outline-variant/30 p-6 bento-shadow">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">Route Navigation</h3>
            <div className="relative rounded-[20px] overflow-hidden border border-outline-variant/30 h-64 bg-slate-100 flex items-center justify-center">
              {/* Grid Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
              
              {/* Route Line & Marker */}
              <svg className="absolute w-full h-full" viewBox="0 0 400 250">
                {/* Dashed Route line */}
                <path d="M 60 180 Q 200 60 340 140" fill="transparent" stroke="oklch(0.88 0.02 145)" strokeWidth="6" strokeLinecap="round" />
                {/* Active path */}
                <path d="M 60 180 Q 200 60 340 140" fill="transparent" stroke="oklch(0.42 0.12 145)" strokeWidth="6" strokeLinecap="round" strokeDasharray="300" strokeDashoffset={300 - (300 * t)} />
                
                {/* Start Point */}
                <circle cx="60" cy="180" r="10" fill="oklch(0.42 0.12 145)" stroke="white" strokeWidth="3" className="shadow" />
                {/* End Point */}
                <circle cx="340" cy="140" r="10" fill="#3b82f6" stroke="white" strokeWidth="3" />

                {/* Animated Truck/Courier Node */}
                <g transform={`translate(${markerX - 12}, ${markerY - 24})`}>
                  <circle cx="12" cy="12" r="14" fill="oklch(0.42 0.12 145)" stroke="white" strokeWidth="2" className="shadow-lg" />
                  <text x="5" y="16" fill="white" className="material-symbols-outlined text-xs font-semibold select-none">local_shipping</text>
                </g>
              </svg>

              {/* Float Indicators */}
              <div className="absolute left-6 bottom-6 bg-white px-3 py-1.5 rounded-[12px] text-[10px] font-bold shadow-md border border-outline-variant/30 text-on-surface">
                📍 GREEN LEAF CAFE
              </div>
              <div className="absolute right-6 top-6 bg-blue-600 text-white px-3 py-1.5 rounded-[12px] text-[10px] font-bold shadow-md">
                📍 NGO HUBCENTER
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Driver & Timeline */}
        <div className="space-y-8">
          
          {/* Driver Card */}
          <div className="bg-white rounded-[24px] border border-outline-variant/30 p-6 bento-shadow">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">Assigned Driver</h3>
            <div className="flex items-center gap-4 pb-6 border-b border-outline-variant/10">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-primary/10 border border-outline-variant/30 flex-shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              </div>
              <div>
                <h4 className="font-extrabold text-on-surface text-base">Alex Rivera</h4>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">Verified Volunteer Driver</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-primary font-bold">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  4.9 · 186 Rescues
                </div>
              </div>
            </div>
            
            <div className="pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-on-surface-variant">Vehicle Status</span>
                <span className="text-on-surface">Electric Bike (E-22)</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-on-surface-variant">Estimated Arrival</span>
                <span className="text-primary font-bold">14 mins</span>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button className="w-full bg-primary/10 text-primary py-3 rounded-xl font-bold text-xs hover:bg-primary/15 transition-colors cursor-pointer text-center">
                  Call Driver
                </button>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white rounded-[24px] border border-outline-variant/30 p-6 bento-shadow">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-6">Rescue Progress Timeline</h3>
            <div className="relative pl-6 border-l-2 border-outline-variant/40 space-y-8">
              
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm"></div>
                <h4 className="font-bold text-xs text-on-surface leading-none">Donation Published</h4>
                <p className="text-[10px] text-on-surface-variant mt-1">Completed</p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm"></div>
                <h4 className="font-bold text-xs text-on-surface leading-none">NGO Matching Completed</h4>
                <p className="text-[10px] text-on-surface-variant mt-1">Completed</p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm animate-pulse"></div>
                <h4 className="font-bold text-xs text-primary leading-none">Courier In Transit</h4>
                <p className="text-[10px] text-on-surface-variant mt-1">Driver en route to collect package</p>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-surface-container border-4 border-white shadow-sm"></div>
                <h4 className="font-bold text-xs text-on-surface-variant leading-none">Delivery Verification</h4>
                <p className="text-[10px] text-on-surface-variant mt-1">Pending arrival</p>
              </div>

            </div>
          </div>

          <Link href="/ngo" className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface py-3.5 rounded-xl font-bold text-sm transition-all text-center block shadow-sm cursor-pointer">
            Return to NGO Dashboard
          </Link>
        </div>

      </div>
    </div>
  )
}

export default function MatchPage() {
  return (
    <AppLayout>
      <Suspense fallback={
        <div className="flex h-96 items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      }>
        <MatchDetailsContent />
      </Suspense>
    </AppLayout>
  )
}
