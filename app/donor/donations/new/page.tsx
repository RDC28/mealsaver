'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Clock, Plus, X, AlertCircle } from 'lucide-react'
import { DashboardSidebar } from '@/components/mealsaver/dashboard-sidebar'

const foodTypes = ['Cooked', 'Bakery', 'Packaged', 'Raw Material']
const vegOptions = ['Veg', 'Non-Veg', 'Mixed']
const cookedRaw = ['Cooked', 'Raw', 'Packaged']
const pickupWindows = [
  '6:00 PM – 7:00 PM',
  '7:00 PM – 8:00 PM',
  '8:00 PM – 9:00 PM',
  '5:00 PM – 6:00 PM',
]

export default function CreateDonationPage() {
  const [selectedFoodType, setSelectedFoodType] = useState('Cooked')
  const [selectedVeg, setSelectedVeg] = useState('Veg')
  const [selectedCooked, setSelectedCooked] = useState('Cooked')
  const [images, setImages] = useState<string[]>(['🍛', '🍱'])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar role="donor" />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="border-b border-border bg-card px-8 py-5">
          <h1 className="text-lg font-bold text-foreground">Create Donation</h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details of the food you want to donate.
          </p>
        </div>

        <div className="mx-auto max-w-2xl px-8 py-6">
          {/* Freshness alert */}
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-orange-500" />
            <div>
              <span className="font-semibold">Fresh cooked food should be picked up quickly.</span>{' '}
              Please provide accurate details to help NGOs plan better pickups.
            </div>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Food Title" required>
                <input
                  type="text"
                  defaultValue="Veg Biryani + Dal Tadka"
                  className={inputCls}
                />
              </Field>
              <Field label="Category" required>
                <select className={inputCls} defaultValue="main">
                  <option value="main">Main Course</option>
                  <option value="snack">Snack</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="dessert">Dessert</option>
                  <option value="raw">Raw Material</option>
                </select>
              </Field>
            </div>

            {/* Food / Raw Material Type */}
            <Field label="Food / Raw Material Type" required>
              <div className="flex flex-wrap gap-2">
                {foodTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedFoodType(t)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      selectedFoodType === t
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-foreground hover:bg-secondary'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>

            {/* Row 2 */}
            <div className="grid grid-cols-3 gap-4">
              <Field label="Quantity" required>
                <input type="number" defaultValue="8" className={inputCls} />
              </Field>
              <Field label="Unit" required>
                <select className={inputCls} defaultValue="portions">
                  <option value="portions">Portions</option>
                  <option value="kg">Kg</option>
                  <option value="packets">Packets</option>
                  <option value="liters">Liters</option>
                </select>
              </Field>
              <Field label="Veg / Non-Veg" required>
                <select className={inputCls} defaultValue="veg">
                  {vegOptions.map((v) => (
                    <option key={v} value={v.toLowerCase()}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Cooked / Raw / Packaged */}
            <Field label="Cooked / Raw / Packaged" required>
              <div className="flex gap-2">
                {cookedRaw.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedCooked(t)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      selectedCooked === t
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-foreground hover:bg-secondary'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>

            {/* Dates & Times */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Preparation Time" required>
                <div className="flex gap-2">
                  <input type="date" defaultValue="2025-05-24" className={inputCls} />
                  <input type="time" defaultValue="15:00" className={`${inputCls} w-36`} />
                </div>
              </Field>
              <Field label="Expiry / Safe Usage Time" required>
                <div className="flex gap-2">
                  <input type="date" defaultValue="2025-05-24" className={inputCls} />
                  <input type="time" defaultValue="21:00" className={`${inputCls} w-36`} />
                </div>
              </Field>
            </div>

            {/* Pickup Address */}
            <Field label="Pickup Address" required>
              <input
                type="text"
                defaultValue="12, 3rd Cross, Koramangala 4th Block, Bengaluru – 560034"
                className={inputCls}
              />
            </Field>

            {/* Pickup Instructions */}
            <Field label="Pickup Instructions">
              <textarea
                rows={2}
                defaultValue="Please bring your own containers. Ring the bell at the main gate."
                className={inputCls + ' resize-none'}
              />
            </Field>

            {/* Window + Contact */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Preferred Pickup Window" required>
                <select className={inputCls} defaultValue={pickupWindows[0]}>
                  {pickupWindows.map((w) => (
                    <option key={w}>{w}</option>
                  ))}
                </select>
              </Field>
              <Field label="Contact Number" required>
                <div className="flex">
                  <span className="flex items-center rounded-l-lg border border-r-0 border-border bg-secondary px-3 text-sm text-muted-foreground">
                    +91
                  </span>
                  <input
                    type="tel"
                    defaultValue="98765 43210"
                    className={inputCls + ' rounded-l-none'}
                  />
                </div>
              </Field>
            </div>

            {/* Image Upload */}
            <Field label="Image Upload" required>
              <div className="flex flex-wrap gap-3">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary text-3xl"
                  >
                    {img}
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, j) => j !== i))}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/40 text-white"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-secondary/50 text-muted-foreground hover:bg-secondary">
                  <Plus size={18} />
                  <span className="text-[10px]">Add More</span>
                  <input type="file" className="hidden" accept="image/*" multiple />
                </label>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                JPG, PNG (Max 5MB each). Up to 5 images.
              </p>
            </Field>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="flex-1 rounded-lg border border-border bg-white py-3 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Submit Donation
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <span className="text-primary">✓</span>
              All donations are verified and used for social good.
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
    </div>
  )
}
