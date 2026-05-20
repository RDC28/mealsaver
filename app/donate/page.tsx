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

export default function DonatePage() {
  const router = useRouter()
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

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const submitDonation = () => {
    // Read from localStorage first
    let currentList = DEFAULT_DONATIONS
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mealsaver_donations")
      if (stored) {
        try {
          currentList = JSON.parse(stored)
        } catch (e) {
          console.error(e)
        }
      }
    }

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

    const updated = [newDonation, ...currentList]
    if (typeof window !== "undefined") {
      localStorage.setItem("mealsaver_donations", JSON.stringify(updated))
    }

    router.push("/donor")
  }

  return (
    <AppLayout>
      <div className="px-6 md:px-12 py-8 max-w-4xl mx-auto flex flex-col min-h-screen">
        <header className="mb-8 border-b border-outline-variant/10 pb-6">
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Create Donation</h1>
          <p className="text-on-surface-variant font-medium text-sm mt-1">List safe surplus food for nearby NGO partners to claim.</p>
        </header>

        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8 max-w-md mx-auto w-full px-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-colors ${
                currentStep === step ? "bg-primary border-primary text-on-primary" : 
                currentStep > step ? "bg-primary/20 border-primary text-primary" : "bg-white border-outline-variant text-on-surface-variant"
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`h-0.5 w-12 md:w-16 mx-1 ${
                  currentStep > step ? "bg-primary" : "bg-outline-variant/40"
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Wizard Card */}
        <div className="bg-white rounded-[24px] shadow-lg border border-outline-variant/30 overflow-hidden flex flex-col flex-grow md:flex-none">
          <div className="p-8 min-h-[350px]">
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
    </AppLayout>
  )
}
