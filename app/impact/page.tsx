"use client"

import { useState } from "react"
import Link from "next/link"
import { AppLayout } from "@/components/app-layout"

interface VerificationItem {
  id: string
  name: string
  role: string
  avatar: string
  status: "Pending" | "Verified"
}

interface ActiveRescue {
  id: number
  item: string
  donor: string
  status: "Assigned" | "In Transit" | "Completed"
  time: string
}

export default function ImpactPage() {
  // Safety checklist states
  const [chkQty, setChkQty] = useState(false)
  const [chkPkg, setChkPkg] = useState(false)
  const [chkSafe, setChkSafe] = useState(false)
  
  // Delivery success state
  const [deliverySuccess, setDeliverySuccess] = useState(false)

  // Admin actions states
  const [courierDeployed, setCourierDeployed] = useState(false)
  
  const [verifications, setVerifications] = useState<VerificationItem[]>([
    { id: "v1", name: "Sarah Chen", role: "Volunteer Driver", avatar: "SC", status: "Pending" },
    { id: "v2", name: "Marcus Thorne", role: "Donor Cafe Owner", avatar: "MT", status: "Pending" }
  ])

  const [rescues, setRescues] = useState<ActiveRescue[]>([
    { id: 1, item: "Gourmet Bakery Surplus", donor: "Sunrise Bakery", status: "In Transit", time: "ETA 14 mins" },
    { id: 2, item: "Paneer & Rice Bowls", donor: "Green Leaf Cafe", status: "Assigned", time: "Pickup at 8:30 PM" },
    { id: 3, item: "Fresh Organic Vegetables", donor: "Metro Foods", status: "Completed", time: "Delivered 1 hr ago" }
  ])

  const handleVerifyUser = (id: string) => {
    setVerifications(
      verifications.map((v) => (v.id === id ? { ...v, status: "Verified" } : v))
    )
  }

  const handleDeployCourier = () => {
    setCourierDeployed(true)
  }

  const handleCompleteDelivery = () => {
    setDeliverySuccess(true)
  }

  const handleResetChecklist = () => {
    setChkQty(false)
    setChkPkg(false)
    setChkSafe(false)
    setDeliverySuccess(false)
    
    // Set the first active rescue as completed!
    setRescues(
      rescues.map((r, i) => i === 0 ? { ...r, status: "Completed", time: "Just Now" } : r)
    )
  }

  const allChecked = chkQty && chkPkg && chkSafe

  return (
    <AppLayout>
      <div className="px-6 md:px-12 py-8 max-w-7xl mx-auto flex flex-col min-h-screen relative font-sans">
        
        {/* Confetti Success Overlay */}
        {deliverySuccess && (
          <div className="fixed inset-0 bg-primary/95 z-[100] flex flex-col items-center justify-center p-6 text-center text-on-primary animate-in fade-in duration-500">
            {/* Background elements */}
            <div className="absolute top-10 left-10 text-6xl opacity-30 select-none animate-bounce">🎉</div>
            <div className="absolute top-20 right-20 text-6xl opacity-30 select-none animate-bounce delay-150">🌱</div>
            <div className="absolute bottom-20 left-20 text-6xl opacity-30 select-none animate-bounce delay-300">🍲</div>
            <div className="absolute bottom-10 right-10 text-6xl opacity-30 select-none animate-bounce delay-75">📦</div>

            <div className="max-w-md space-y-6">
              <div className="w-24 h-24 rounded-full bg-white text-primary flex items-center justify-center mx-auto shadow-2xl animate-in zoom-in-50 duration-300">
                <span className="material-symbols-outlined text-5xl font-bold">check</span>
              </div>
              
              <h2 className="text-4xl font-black tracking-tight leading-tight">Delivery Completed!</h2>
              <p className="text-base font-medium opacity-90">
                The safety parameters have been verified, and the surplus food has reached the distribution kitchen safely.
              </p>

              <div className="bg-white/10 p-6 rounded-[24px] backdrop-blur-sm border border-white/20 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase font-extrabold tracking-wider opacity-85">Meals Rescued</div>
                  <div className="text-3xl font-black mt-1">45 meals</div>
                </div>
                <div>
                  <div className="text-xs uppercase font-extrabold tracking-wider opacity-85">Waste Saved</div>
                  <div className="text-3xl font-black mt-1">12.4 kg</div>
                </div>
              </div>

              <button 
                onClick={handleResetChecklist}
                className="w-full bg-white text-primary py-4 rounded-[16px] font-semibold active:scale-95 shadow-xl hover:bg-slate-50 transition-all cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Header */}
        <header className="mb-8 border-b border-outline-variant/10 pb-6">
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Impact Dashboard & Administration</h1>
          <p className="text-on-surface-variant font-medium text-sm mt-1">Monitor rescued volume, audit safety protocols, and dispatch couriers.</p>
        </header>

        {/* Impact Numbers Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-[24px] bento-shadow border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined text-[24px]">restaurant</span>
            </div>
            <div>
              <div className="text-3xl font-black text-on-surface">1,240</div>
              <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1">Meals Saved</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] bento-shadow border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined text-[24px]">eco</span>
            </div>
            <div>
              <div className="text-3xl font-black text-on-surface">320 kg</div>
              <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1">Waste Avoided</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] bento-shadow border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined text-[24px]">co2</span>
            </div>
            <div>
              <div className="text-3xl font-black text-on-surface">1.8 Tons</div>
              <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1">CO2 Prevented</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] bento-shadow border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined text-[24px]">diversity_1</span>
            </div>
            <div>
              <div className="text-3xl font-black text-on-surface">148</div>
              <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-1">Families Nourished</div>
            </div>
          </div>
        </section>

        {/* Bento Workspace grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Main workspace (Colspan 2) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Chart: Impact Velocity */}
            <div className="bg-white rounded-[24px] p-6 border border-outline-variant/30 bento-shadow">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-extrabold text-base text-on-surface">Impact Velocity</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">Rescued meals volume over the last 30 days.</p>
                </div>
                <div className="text-xs font-bold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">trending_up</span>
                  +18% growth
                </div>
              </div>

              {/* Custom CSS Bar Chart */}
              <div className="h-48 flex items-end justify-between gap-2 px-2 mt-4">
                {/* 10 columns for dates */}
                {[
                  { date: "May 1", val: 35, height: "h-[35%]" },
                  { date: "May 4", val: 42, height: "h-[42%]" },
                  { date: "May 7", val: 58, height: "h-[58%]" },
                  { date: "May 10", val: 64, height: "h-[64%]" },
                  { date: "May 13", val: 50, height: "h-[50%]" },
                  { date: "May 16", val: 78, height: "h-[78%]" },
                  { date: "May 19", val: 86, height: "h-[86%]" },
                  { date: "May 22", val: 92, height: "h-[92%]" },
                  { date: "May 25", val: 70, height: "h-[70%]" },
                  { date: "May 28", val: 98, height: "h-[98%]" }
                ].map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center group cursor-pointer">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-on-surface text-white text-[9px] font-bold px-1.5 py-0.5 rounded absolute -translate-y-8 select-none z-10 shadow-md">
                      {item.val} meals
                    </div>
                    {/* CSS Bar with primary color and secondary hover */}
                    <div className={`w-full ${item.height} bg-primary/20 group-hover:bg-primary rounded-t-[6px] transition-all duration-300`}></div>
                    <span className="text-[9px] text-on-surface-variant font-bold mt-2 rotate-45 sm:rotate-0">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Operations List */}
            <div className="bg-white rounded-[24px] p-6 border border-outline-variant/30 bento-shadow">
              <h3 className="font-extrabold text-base text-on-surface mb-6">Active Rescue Operations</h3>
              
              <div className="space-y-4">
                {rescues.map((rescue) => (
                  <div key={rescue.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-[16px] border border-outline-variant/20 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-on-surface">{rescue.item}</h4>
                        <p className="text-xs text-on-surface-variant mt-0.5">{rescue.donor} · {rescue.time}</p>
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit ${
                      rescue.status === "Completed" ? "bg-primary/10 text-primary" : 
                      rescue.status === "In Transit" ? "bg-blue-100 text-blue-800" : "bg-tertiary/10 text-tertiary"
                    }`}>
                      {rescue.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Verification Panel */}
            <div className="bg-white rounded-[24px] p-6 border border-outline-variant/30 bento-shadow">
              <h3 className="font-extrabold text-base text-on-surface mb-2">Safety Verification Protocol</h3>
              <p className="text-xs text-on-surface-variant mb-6">Auditors and kitchen managers must verify safety parameters upon package receipt.</p>
              
              <div className="space-y-4 mb-6">
                <label className="flex items-start gap-4 p-4 border border-outline-variant/20 rounded-[16px] cursor-pointer hover:bg-slate-50 transition-colors">
                  <input 
                    type="checkbox" 
                    className="mt-1 w-5 h-5 accent-primary rounded cursor-pointer"
                    checked={chkQty}
                    onChange={(e) => setChkQty(e.target.checked)}
                  />
                  <div>
                    <h5 className="font-bold text-sm text-on-surface leading-tight">Quantity matches order</h5>
                    <p className="text-xs text-on-surface-variant mt-1">Verify that package weights match the publisher&apos;s manifest details.</p>
                  </div>
                </label>

                <label className="flex items-start gap-4 p-4 border border-outline-variant/20 rounded-[16px] cursor-pointer hover:bg-slate-50 transition-colors">
                  <input 
                    type="checkbox" 
                    className="mt-1 w-5 h-5 accent-primary rounded cursor-pointer"
                    checked={chkPkg}
                    onChange={(e) => setChkPkg(e.target.checked)}
                  />
                  <div>
                    <h5 className="font-bold text-sm text-on-surface leading-tight">Packaging integrity verified</h5>
                    <p className="text-xs text-on-surface-variant mt-1">Verify that containers are undamaged, clean, and completely sealed.</p>
                  </div>
                </label>

                <label className="flex items-start gap-4 p-4 border border-outline-variant/20 rounded-[16px] cursor-pointer hover:bg-slate-50 transition-colors">
                  <input 
                    type="checkbox" 
                    className="mt-1 w-5 h-5 accent-primary rounded cursor-pointer"
                    checked={chkSafe}
                    onChange={(e) => setChkSafe(e.target.checked)}
                  />
                  <div>
                    <h5 className="font-bold text-sm text-on-surface leading-tight">Food safety protocol</h5>
                    <p className="text-xs text-on-surface-variant mt-1">Verify temperature logs and ensure food quality matches fresh standards.</p>
                  </div>
                </label>
              </div>

              <button 
                disabled={!allChecked}
                onClick={handleCompleteDelivery}
                className={`w-full py-4 rounded-[16px] font-bold text-sm transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  allChecked ? "bg-primary text-on-primary hover:bg-primary/95" : "bg-surface-container text-on-surface-variant/40 cursor-not-allowed shadow-none"
                }`}
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Complete Delivery & File Record
              </button>
            </div>
          </div>

          {/* Admin Sidebar Operations */}
          <div className="space-y-8">
            
            {/* Urgent Hub Alert */}
            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-[24px] shadow-sm flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center gap-2 text-red-700 font-extrabold text-sm mb-3">
                  <span className="material-symbols-outlined text-red-600 animate-pulse">warning</span>
                  URGENT EMERGENCY ALERT
                </div>
                <h4 className="font-extrabold text-red-950 text-base">30kg Fresh Dairy Expiring</h4>
                <p className="text-xs text-red-900 mt-2 leading-relaxed font-medium">
                  Hub-3 contains 30kg of fresh dairy that will expire in 4 hours. Deployed couriers needed immediately.
                </p>
              </div>

              <button 
                onClick={handleDeployCourier}
                disabled={courierDeployed}
                className={`w-full py-3.5 rounded-xl font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2 ${
                  courierDeployed ? "bg-green-600 text-white border-transparent" : "bg-red-600 text-white hover:bg-red-700 animate-pulse"
                }`}
              >
                {courierDeployed ? (
                  <>
                    <span className="material-symbols-outlined text-sm">check</span>
                    Courier Deployed
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">rocket_launch</span>
                    Deploy Courier Dispatch
                  </>
                )}
              </button>
            </div>

            {/* Pending User Verifications */}
            <div className="bg-white rounded-[24px] p-6 border border-outline-variant/30 bento-shadow">
              <h3 className="font-extrabold text-base text-on-surface mb-6">Pending Verifications</h3>
              
              <div className="space-y-4">
                {verifications.map((item) => (
                  <div key={item.id} className="flex justify-between items-center pb-4 border-b border-outline-variant/10 last:border-none last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                        {item.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-on-surface">{item.name}</h4>
                        <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">{item.role}</p>
                      </div>
                    </div>
                    
                    {item.status === "Verified" ? (
                      <span className="text-[10px] text-primary font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        Verified
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleVerifyUser(item.id)}
                        className="bg-primary text-on-primary px-3 py-1.5 rounded-lg font-bold text-[10px] shadow hover:bg-primary/95 transition-all cursor-pointer"
                      >
                        Verify
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Realtime Action Feed */}
            <div className="bg-white rounded-[24px] p-6 border border-outline-variant/30 bento-shadow">
              <h3 className="font-extrabold text-base text-on-surface mb-4">Real-time Feed</h3>
              <div className="space-y-3 text-[11px] font-semibold text-on-surface-variant">
                <div className="flex items-center justify-between py-1 border-b border-outline-variant/5">
                  <span>NGO matched Paneer Curry</span>
                  <span className="text-[9px] text-primary font-bold">1m ago</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-outline-variant/5">
                  <span>Donor listed 12kg sandwiches</span>
                  <span className="text-[9px] text-primary font-bold">5m ago</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-outline-variant/5">
                  <span>Alex Rivera marked: Collected</span>
                  <span className="text-[9px] text-primary font-bold">12m ago</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-outline-variant/5">
                  <span>Hub-3 reported dairy influx</span>
                  <span className="text-[9px] text-primary font-bold">1 hr ago</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  )
}
