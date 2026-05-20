"use client"

import { useState, useEffect } from "react"
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
  step: number // 1: Created, 2: Notified, 3: Accepted, 4: Picked Up, 5: Delivered
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

export default function DonorPage() {
  const [donations, setDonations] = useState<Donation[]>(DEFAULT_DONATIONS)
  const [selectedDonationId, setSelectedDonationId] = useState<number>(1)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mealsaver_donations")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setDonations(parsed)
          if (parsed.length > 0) {
            setSelectedDonationId(parsed[0].id)
          }
        } catch (e) {
          console.error(e)
        }
      } else {
        localStorage.setItem("mealsaver_donations", JSON.stringify(DEFAULT_DONATIONS))
      }
    }
  }, [])

  const saveDonations = (list: Donation[]) => {
    setDonations(list)
    if (typeof window !== "undefined") {
      localStorage.setItem("mealsaver_donations", JSON.stringify(list))
    }
  }

  // Active donation selected for the timeline display
  const activeDonation = donations.find(d => d.id === selectedDonationId) || donations[0]

  // Multi-step modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [foodName, setFoodName] = useState("")
  const [foodType, setFoodType] = useState("Bakery")
  const [quantity, setQuantity] = useState(10)
  const [quantityUnit, setQuantityUnit] = useState("kg")
  const [pickupTime, setPickupTime] = useState("ASAP (Within 1 hour)")
  const [collectionPoint, setCollectionPoint] = useState("Main Entrance, Side Alley")
  const [photo, setPhoto] = useState<string | null>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(URL.createObjectURL(e.target.files[0]))
    }
  }

  const openDonationFlow = () => {
    setModalOpen(true)
    setCurrentStep(1)
    setFoodName("")
    setFoodType("Bakery")
    setQuantity(10)
    setQuantityUnit("kg")
    setPickupTime("ASAP (Within 1 hour)")
    setCollectionPoint("Main Entrance, Side Alley")
    setPhoto(null)
  }

  const closeDonationFlow = () => {
    setModalOpen(false)
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const submitDonation = () => {
    const newDonation: Donation = {
      id: Date.now(),
      item: foodName || `Surplus ${foodType} Pack`,
      quantity: `${quantity} ${quantityUnit}`,
      type: foodType,
      status: "Pending Pickup",
      pickup: pickupTime === "ASAP (Within 1 hour)" ? "Today, within 1 hr" : pickupTime === "This evening (6pm - 9pm)" ? "Today, 6:00 PM - 9:00 PM" : "Tomorrow Morning",
      address: collectionPoint || "Main Storefront",
      time: "Just Now",
      step: 1
    }
    const updated = [newDonation, ...donations]
    saveDonations(updated)
    setSelectedDonationId(newDonation.id)
    setModalOpen(false)
  }

  // Derived stats
  const activeCount = donations.filter(d => d.status !== "Completed").length
  const completedCount = donations.filter(d => d.status === "Completed").length
  const totalWeight = donations.reduce((acc, d) => {
    const num = parseFloat(d.quantity)
    return acc + (isNaN(num) ? 0 : num)
  }, 0)

  return (
    <AppLayout>
      <div className="px-6 md:px-12 py-8 max-w-7xl mx-auto flex flex-col min-h-screen">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/10 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Good evening, Green Leaf Cafe 👋</h1>
            <p className="text-on-surface-variant font-medium text-sm mt-1">Ready to save more food today? You&apos;ve helped 12 families this week.</p>
          </div>
          <button 
            onClick={openDonationFlow}
            className="bg-primary text-on-primary px-6 py-4 rounded-[16px] font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Create Donation
          </button>
        </header>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-[24px] bento-shadow border border-outline-variant/30 flex flex-col justify-between min-h-[140px] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Meals Shared</div>
              <div className="text-3xl font-extrabold text-primary mt-1">1,248</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[24px] bento-shadow border border-outline-variant/30 flex flex-col justify-between min-h-[140px] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pending_actions</span>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Active Listings</div>
              <div className="text-3xl font-extrabold text-tertiary mt-1">{activeCount}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] bento-shadow border border-outline-variant/30 flex flex-col justify-between min-h-[140px] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Food Saved (kg)</div>
              <div className="text-3xl font-extrabold text-primary mt-1">{totalWeight + 400}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] bento-shadow border border-outline-variant/30 flex flex-col justify-between min-h-[140px] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>recycling</span>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Waste Reduced</div>
              <div className="text-3xl font-extrabold text-primary mt-1">85%</div>
            </div>
          </div>
        </section>

        {/* Live Status Tracking */}
        {activeDonation && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">local_shipping</span>
              Live Tracking: {activeDonation.item}
            </h2>
            <div className="bg-white p-8 rounded-[24px] bento-shadow border border-outline-variant/30">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pb-6 border-b border-outline-variant/10">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 ${
                    activeDonation.status === "Completed" ? "bg-primary/10 text-primary" : "bg-tertiary/10 text-tertiary"
                  }`}>
                    {activeDonation.status}
                  </span>
                  <h3 className="text-lg font-bold text-on-surface">{activeDonation.item}</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Listed: {activeDonation.time} · Unit: {activeDonation.quantity}</p>
                </div>
                {activeDonation.status !== "Completed" && (
                  <Link href="/match" className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline cursor-pointer">
                    View Details 
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                )}
              </div>

              {/* Visual Timeline */}
              <div className="relative flex items-center justify-between w-full mt-4 max-w-3xl mx-auto px-4">
                <div className="absolute h-1 bg-surface-container top-1/2 left-0 w-full -translate-y-1/2 -z-10 rounded-full"></div>
                <div 
                  className="absolute h-1 bg-primary top-1/2 left-0 -translate-y-1/2 -z-10 transition-all duration-500 rounded-full"
                  style={{ width: `${((activeDonation.step - 1) / 4) * 100}%` }}
                ></div>

                {/* Step 1: Created */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-colors ${
                    activeDonation.step >= 1 ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"
                  }`}>
                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                  </div>
                  <span className="text-xs text-on-surface font-semibold">Created</span>
                </div>

                {/* Step 2: Notified */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-colors ${
                    activeDonation.step >= 2 ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"
                  }`}>
                    <span className="material-symbols-outlined text-sm font-bold">campaign</span>
                  </div>
                  <span className="text-xs text-on-surface font-semibold">Notified</span>
                </div>

                {/* Step 3: Accepted */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-colors ${
                    activeDonation.step >= 3 ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"
                  }`}>
                    <span className="material-symbols-outlined text-sm font-bold">handshake</span>
                  </div>
                  <span className="text-xs text-on-surface font-semibold">Accepted</span>
                </div>

                {/* Step 4: Picked Up */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-colors ${
                    activeDonation.step >= 4 ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"
                  }`}>
                    <span className="material-symbols-outlined text-sm">local_shipping</span>
                  </div>
                  <span className={`text-xs ${activeDonation.step >= 4 ? "text-on-surface font-semibold" : "text-on-surface-variant"}`}>Picked Up</span>
                </div>

                {/* Step 5: Delivered */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-colors ${
                    activeDonation.step >= 5 ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"
                  }`}>
                    <span className="material-symbols-outlined text-sm">home_pin</span>
                  </div>
                  <span className={`text-xs ${activeDonation.step >= 5 ? "text-on-surface font-semibold" : "text-on-surface-variant"}`}>Delivered</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* List of recent donations */}
        <section className="mb-12 flex-grow">
          <h2 className="text-xl font-bold mb-4">Donation Activity history</h2>
          <div className="bg-white rounded-[24px] bento-shadow border border-outline-variant/30 overflow-hidden">
            <div className="divide-y divide-outline-variant/10">
              {donations.map((donation) => (
                <div 
                  key={donation.id} 
                  onClick={() => setSelectedDonationId(donation.id)}
                  className={`flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between hover:bg-primary/5 transition-colors cursor-pointer ${
                    donation.id === selectedDonationId ? "bg-primary/5 border-l-4 border-primary pl-5" : ""
                  }`}
                >
                  <div className="flex gap-4 items-center">
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
                    <div>
                      <h4 className="font-bold text-on-surface">{donation.item}</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">Quantity: {donation.quantity} · Collection Point: {donation.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 justify-between md:justify-end">
                    <span className="text-xs text-on-surface-variant font-medium">Pickup: {donation.pickup}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      donation.status === "Completed" ? "bg-secondary-container text-on-secondary-container" : 
                      donation.status === "Accepted" || donation.status === "In Transit" ? "bg-primary-container/20 text-primary-container" : "bg-tertiary/10 text-tertiary"
                    }`}>
                      {donation.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Interactive 4-step wizard modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[24px] w-full max-w-2xl overflow-hidden shadow-2xl border border-outline-variant/30">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-outline-variant/20 flex justify-between items-center bg-primary/5">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">add_circle</span>
                New Surplus Food Donation
              </h2>
              <button className="w-10 h-10 rounded-full hover:bg-surface-container transition-colors flex items-center justify-center cursor-pointer text-on-surface-variant hover:text-on-surface" onClick={closeDonationFlow}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Steps Container */}
            <div className="px-8 py-8 min-h-[400px]">
              
              {/* Step 1: File Photo Upload & Title */}
              {currentStep === 1 && (
                <div className="step-transition animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold mb-1">What are you donating today?</h3>
                    <p className="text-xs text-on-surface-variant">Provide a clear title and a photo of the food items.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-on-surface-variant mb-2">Food Item Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Fresh Sourdough Bread, Chicken Curry, Paneer Rolls" 
                        className="w-full px-4 py-3 rounded-[16px] border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-on-surface-variant mb-2">Upload Photo</label>
                      <div className="relative border-4 border-dashed border-primary/20 bg-primary/5 rounded-[24px] h-48 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-primary/10 transition-colors">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoUpload} 
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        {photo ? (
                          <div className="relative w-full h-full p-2 flex items-center justify-center">
                            <img src={photo} alt="Preview" className="max-h-full max-w-full rounded-[16px] object-contain" />
                            <button 
                              onClick={(e) => { e.preventDefault(); setPhoto(null); }}
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-5xl text-primary">add_a_photo</span>
                            <p className="font-semibold text-sm text-primary">Click to upload or drag & drop</p>
                            <p className="text-[10px] text-on-surface-variant">PNG, JPG up to 5MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Food Type */}
              {currentStep === 2 && (
                <div className="step-transition animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold mb-1">What kind of food is it?</h3>
                    <p className="text-xs text-on-surface-variant">Select the most accurate category to ensure proper logistics handling.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      className={`flex flex-col items-center gap-3 p-6 rounded-[24px] border-2 transition-all cursor-pointer group text-center ${
                        foodType === "Cooked" ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-outline-variant hover:border-primary/50 text-on-surface"
                      }`}
                      onClick={() => setFoodType("Cooked")}
                    >
                      <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">restaurant</span>
                      <div>
                        <span className="font-bold text-sm block">Cooked Meal</span>
                        <span className="text-[10px] text-on-surface-variant block mt-0.5">Hot meals, catering pans</span>
                      </div>
                    </button>
                    
                    <button 
                      className={`flex flex-col items-center gap-3 p-6 rounded-[24px] border-2 transition-all cursor-pointer group text-center ${
                        foodType === "Bakery" ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-outline-variant hover:border-primary/50 text-on-surface"
                      }`}
                      onClick={() => setFoodType("Bakery")}
                    >
                      <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">bakery_dining</span>
                      <div>
                        <span className="font-bold text-sm block">Bakery Surplus</span>
                        <span className="text-[10px] text-on-surface-variant block mt-0.5">Bread, buns, pastries, bagels</span>
                      </div>
                    </button>

                    <button 
                      className={`flex flex-col items-center gap-3 p-6 rounded-[24px] border-2 transition-all cursor-pointer group text-center ${
                        foodType === "Raw" ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-outline-variant hover:border-primary/50 text-on-surface"
                      }`}
                      onClick={() => setFoodType("Raw")}
                    >
                      <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">nutrition</span>
                      <div>
                        <span className="font-bold text-sm block">Raw Ingredients</span>
                        <span className="text-[10px] text-on-surface-variant block mt-0.5">Fruits, vegetables, dairy</span>
                      </div>
                    </button>

                    <button 
                      className={`flex flex-col items-center gap-3 p-6 rounded-[24px] border-2 transition-all cursor-pointer group text-center ${
                        foodType === "Packed" ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-outline-variant hover:border-primary/50 text-on-surface"
                      }`}
                      onClick={() => setFoodType("Packed")}
                    >
                      <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">inventory_2</span>
                      <div>
                        <span className="font-bold text-sm block">Packaged Food</span>
                        <span className="text-[10px] text-on-surface-variant block mt-0.5">Canned items, boxed snacks</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Logistics Details */}
              {currentStep === 3 && (
                <div className="step-transition animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold mb-1">Specify Logistics Details</h3>
                    <p className="text-xs text-on-surface-variant">Adjust quantities and schedule the pickup window.</p>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-semibold text-on-surface-variant">Estimated Quantity</label>
                        <span className="text-sm text-primary font-bold">{quantity} {quantityUnit}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <input 
                          className="flex-grow h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" 
                          max="50" 
                          min="1" 
                          type="range" 
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value))}
                        />
                        <select 
                          className="px-3 py-1 rounded-xl border border-outline-variant text-sm font-semibold bg-white outline-none cursor-pointer"
                          value={quantityUnit}
                          onChange={(e) => setQuantityUnit(e.target.value)}
                        >
                          <option value="kg">kg</option>
                          <option value="meals">meals</option>
                          <option value="portions">portions</option>
                          <option value="items">items</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-on-surface-variant mb-2">Pickup Time</label>
                        <select 
                          className="w-full bg-surface-container-low border border-outline-variant rounded-[16px] p-3 text-sm focus:border-primary outline-none"
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                        >
                          <option value="ASAP (Within 1 hour)">ASAP (Within 1 hour)</option>
                          <option value="This evening (6pm - 9pm)">This evening (6pm - 9pm)</option>
                          <option value="Tomorrow morning">Tomorrow morning</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-on-surface-variant mb-2">Collection Point</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            className="w-full bg-surface-container-low border border-outline-variant rounded-[16px] p-3 pr-10 text-sm focus:border-primary outline-none"
                            value={collectionPoint}
                            onChange={(e) => setCollectionPoint(e.target.value)}
                          />
                          <span className="material-symbols-outlined absolute right-3 top-3 text-primary text-lg">location_on</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Preview Details */}
              {currentStep === 4 && (
                <div className="step-transition animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold mb-1">Confirm Listing</h3>
                    <p className="text-xs text-on-surface-variant">Review details before publishing to nearby verified NGOs.</p>
                  </div>
                  <div className="bg-surface-container-low rounded-[24px] p-6 border border-outline-variant/30">
                    <div className="flex gap-6 items-start mb-6">
                      <div className="w-24 h-24 rounded-[16px] overflow-hidden bg-white border border-outline-variant/30 flex-shrink-0 flex items-center justify-center">
                        {photo ? (
                          <img src={photo} alt="Food Uploaded" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-4xl text-primary-fixed">restaurant</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-on-surface">{foodName || `Surplus ${foodType} Pack`}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase">{foodType}</span>
                          <span className="text-on-surface-variant text-xs font-semibold">• {quantity} {quantityUnit}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 border-t border-outline-variant/20 pt-4 text-sm font-semibold text-on-surface-variant">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                        <span>Pickup: {pickupTime}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                        <span>Collection: {collectionPoint}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 border-t border-outline-variant/20 bg-surface-container-low flex justify-between">
              <button 
                className={`px-6 py-3 font-semibold text-sm text-on-surface-variant hover:text-on-surface cursor-pointer ${
                  currentStep === 1 ? "invisible" : ""
                }`} 
                onClick={prevStep}
              >
                Back
              </button>
              <div className="flex-grow"></div>
              {currentStep < 4 ? (
                <button 
                  className="bg-primary text-on-primary px-8 py-3 rounded-xl font-semibold shadow-lg active:scale-95 transition-all cursor-pointer" 
                  onClick={nextStep}
                  disabled={currentStep === 1 && !foodName}
                >
                  Next
                </button>
              ) : (
                <button 
                  className="bg-primary text-on-primary px-8 py-3 rounded-xl font-semibold shadow-lg active:scale-95 transition-all cursor-pointer" 
                  onClick={submitDonation}
                >
                  Publish Donation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
