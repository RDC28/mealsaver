"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

const DEFAULT_DONATIONS: Donation[] = [
  { 
    id: 1, 
    item: "Assorted Gourmet Sandwiches", 
    quantity: "12 kg", 
    type: "Bakery", 
    status: "Accepted", 
    pickup: "Today, 6:00 PM - 7:00 PM", 
    address: "Green Leaf Cafe - Main Entrance", 
    time: "04:30 PM Today", 
    step: 3 
  },
  { 
    id: 2, 
    item: "Paneer & Vegetable Rice Bowls", 
    quantity: "45 meals", 
    type: "Cooked", 
    status: "Matched", 
    pickup: "Today, 8:30 PM", 
    address: "Green Leaf Cafe - Back Counter", 
    time: "02:15 PM Today", 
    step: 2 
  },
  { 
    id: 3, 
    item: "Organic Tomatoes & Bell Peppers", 
    quantity: "18 kg", 
    type: "Raw", 
    status: "Completed", 
    pickup: "Yesterday, 5:00 PM", 
    address: "Green Leaf Cafe - Side Alley Loading Dock", 
    time: "Yesterday", 
    step: 5 
  }
]

export default function NgoPage() {
  const router = useRouter()
  const [donations, setDonations] = useState<Donation[]>([])
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mealsaver_donations")
      if (stored) {
        try {
          setDonations(JSON.parse(stored))
        } catch (e) {
          console.error(e)
          setDonations(DEFAULT_DONATIONS)
        }
      } else {
        localStorage.setItem("mealsaver_donations", JSON.stringify(DEFAULT_DONATIONS))
        setDonations(DEFAULT_DONATIONS)
      }
    }
  }, [])

  const handleOpenDetails = (donation: Donation) => {
    setSelectedDonation(donation)
    setModalOpen(true)
  }

  const handleAcceptDonation = () => {
    if (!selectedDonation) return
    setAccepting(true)

    // Simulate route optimization & driver assignment loading state
    setTimeout(() => {
      const updatedList = donations.map((d) => {
        if (d.id === selectedDonation.id) {
          return {
            ...d,
            status: "Accepted" as const,
            step: 3 // Accepted step
          }
        }
        return d
      })

      setDonations(updatedList)
      if (typeof window !== "undefined") {
        localStorage.setItem("mealsaver_donations", JSON.stringify(updatedList))
      }

      setAccepting(false)
      setModalOpen(false)
      // Redirect to the match details page for the accepted donation
      router.push(`/match?id=${selectedDonation.id}`)
    }, 1500)
  }

  // Filter donations to display only those that are not completed
  const availableDonations = donations.filter(d => d.status !== "Completed" && d.status !== "Accepted" && d.status !== "In Transit")
  const acceptedDonationsCount = donations.filter(d => d.status === "Accepted" || d.status === "In Transit").length

  return (
    <AppLayout>
      <div className="px-6 md:px-12 py-8 max-w-7xl mx-auto flex flex-col min-h-screen">
        {/* Welcome Header */}
        <header className="mb-8 border-b border-outline-variant/10 pb-6">
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Good evening, Food Runners NGO 👋</h1>
          <p className="text-on-surface-variant font-medium text-sm mt-1 font-sans">Active verification area: 5km radius in Bengaluru.</p>
        </header>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-[24px] bento-shadow border border-outline-variant/30 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[32px]">package_2</span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-on-surface">{availableDonations.length}</div>
              <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">Nearby Donations</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] bento-shadow border border-outline-variant/30 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-on-surface">{acceptedDonationsCount}</div>
              <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">Accepted Today</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] bento-shadow border border-outline-variant/30 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[32px]">distance</span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-on-surface">5 km</div>
              <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">Partner Area</div>
            </div>
          </div>
        </section>

        {/* Available Feed */}
        <section className="flex-grow">
          <h2 className="text-xl font-bold mb-6">Available Surplus Food Listings</h2>

          {availableDonations.length === 0 ? (
            <div className="bg-white rounded-[24px] p-12 text-center border border-outline-variant/30 bento-shadow flex flex-col items-center">
              <span className="material-symbols-outlined text-6xl text-primary-fixed mb-4">eco</span>
              <h3 className="text-lg font-bold text-on-surface">No Surplus Food Available</h3>
              <p className="text-sm text-on-surface-variant mt-2 max-w-sm">All local surplus listings have been claimed or delivered. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableDonations.map((donation) => {
                // Mock distances & match scores based on type
                const matchScore = donation.type === "Cooked" ? 98 : donation.type === "Bakery" ? 92 : 85
                const distance = donation.type === "Cooked" ? "1.2 km" : donation.type === "Bakery" ? "2.4 km" : "4.1 km"

                return (
                  <div 
                    key={donation.id} 
                    className="bg-white rounded-[24px] border border-outline-variant/30 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-primary/45 transition-all group"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          donation.type === "Bakery" ? "bg-primary-fixed text-primary" : 
                          donation.type === "Cooked" ? "bg-primary/10 text-primary" : "bg-tertiary-fixed text-tertiary"
                        }`}>
                          <span className="material-symbols-outlined text-[24px]">
                            {donation.type === "Bakery" ? "bakery_dining" : 
                             donation.type === "Cooked" ? "restaurant" : 
                             donation.type === "Raw" ? "nutrition" : "inventory_2"}
                          </span>
                        </div>
                        <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm font-semibold">hub</span>
                          {matchScore}% Match
                        </div>
                      </div>
                      
                      <h3 className="font-extrabold text-lg text-on-surface leading-snug group-hover:text-primary transition-colors">{donation.item}</h3>
                      <p className="text-xs text-on-surface-variant mt-2 font-medium">Quantity: {donation.quantity}</p>
                      
                      <div className="mt-4 flex flex-col gap-2 border-t border-outline-variant/10 pt-4 text-xs font-medium text-on-surface-variant">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                          <span>Pickup: {donation.pickup}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-sm">distance</span>
                          <span>Distance: {distance} ({donation.address})</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleOpenDetails(donation)}
                      className="w-full bg-primary/5 hover:bg-primary text-primary hover:text-on-primary py-3 rounded-xl font-bold text-sm transition-all mt-6 cursor-pointer active:scale-95 text-center flex items-center justify-center gap-2"
                    >
                      View Details
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Claimed/Accepted Active Pickups Section */}
        {donations.some(d => d.status === "Accepted" || d.status === "In Transit") && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-6">Active Rescues in Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {donations.filter(d => d.status === "Accepted" || d.status === "In Transit").map((donation) => (
                <div key={donation.id} className="bg-white border border-outline-variant/30 rounded-[24px] p-6 bento-shadow flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider mb-2">
                        {donation.status}
                      </span>
                      <h4 className="font-bold text-on-surface text-lg">{donation.item}</h4>
                      <p className="text-xs text-on-surface-variant mt-1 font-medium">Quantity: {donation.quantity} · Pickup: {donation.pickup}</p>
                    </div>
                    <Link 
                      href={`/match?id=${donation.id}`} 
                      className="bg-primary text-on-primary px-4 py-2.5 rounded-xl font-bold text-xs shadow-md hover:bg-primary/95 transition-all flex items-center gap-1 active:scale-95"
                    >
                      Track Route
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Details Side-over / Modal */}
      {modalOpen && selectedDonation && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[24px] w-full max-w-lg overflow-hidden shadow-2xl border border-outline-variant/30">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-outline-variant/20 flex justify-between items-center bg-primary/5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">hub</span>
                <span className="font-extrabold text-base text-primary">Match Details: {selectedDonation.type === "Cooked" ? 98 : selectedDonation.type === "Bakery" ? 92 : 85}% Match</span>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container transition-colors flex items-center justify-center cursor-pointer text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-on-surface">{selectedDonation.item}</h3>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">Quantity: {selectedDonation.quantity}</p>
              </div>

              <div className="space-y-3 bg-surface-container-low p-4 rounded-[16px] border border-outline-variant/10 text-sm font-semibold text-on-surface-variant">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                  <span>Pickup: {selectedDonation.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                  <span>Pickup Window: {selectedDonation.pickup}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-lg">restaurant</span>
                  <span>Storage: Room temp, sealed cardboard boxes</span>
                </div>
              </div>

              {/* Styled Mock Map Preview */}
              <div>
                <div className="text-xs font-bold text-on-surface-variant mb-2">ROUTE PREVIEW</div>
                <div className="relative rounded-[16px] overflow-hidden border border-outline-variant/30 h-40 bg-slate-100 flex items-center justify-center">
                  {/* Decorative background grid and map details */}
                  <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                  {/* Styled Route Line */}
                  <svg className="absolute w-full h-full" viewBox="0 0 300 150">
                    <path d="M 50 100 Q 150 40 250 80" fill="transparent" stroke="oklch(0.42 0.12 145)" strokeWidth="4" strokeDasharray="6" />
                    <circle cx="50" cy="100" r="6" fill="oklch(0.42 0.12 145)" />
                    <circle cx="250" cy="80" r="6" fill="#3b82f6" />
                  </svg>
                  {/* Labels */}
                  <div className="absolute left-6 bottom-4 bg-white px-2 py-0.5 rounded-md text-[9px] font-bold shadow-sm border border-outline-variant/30 text-on-surface">DONOR</div>
                  <div className="absolute right-6 top-8 bg-blue-600 text-white px-2 py-0.5 rounded-md text-[9px] font-bold shadow-sm">NGO</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-5 border-t border-outline-variant/20 bg-surface-container-low flex justify-between gap-4">
              <button 
                onClick={() => setModalOpen(false)}
                className="w-1/2 border border-outline-variant text-on-surface-variant hover:text-on-surface py-3 rounded-xl font-bold text-sm cursor-pointer text-center"
              >
                Close
              </button>
              
              <button 
                disabled={accepting}
                onClick={handleAcceptDonation}
                className="w-1/2 bg-primary text-on-primary py-3 rounded-xl font-bold text-sm active:scale-95 shadow-md hover:bg-primary/95 transition-all cursor-pointer text-center flex items-center justify-center gap-2"
              >
                {accepting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-on-primary" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Optimizing route...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">handshake</span>
                    <span>Accept Donation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
