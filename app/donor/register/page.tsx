'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Eye, EyeOff, Upload, UserCircle2, CheckCircle2 } from 'lucide-react'
import { Logo } from '@/components/mealsaver/logo'

export default function DonorRegisterPage() {
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [fileName, setFileName] = useState('food_license_greenleaf.pdf')

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Logo />
        </div>

        <div className="rounded-2xl border border-border bg-card px-8 py-8 shadow-sm">
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <UserCircle2 size={16} className="text-primary" />
            Create your donor account and start making an impact.
          </div>

          <h1 className="mb-6 text-xl font-bold text-foreground">Donor Registration Form</h1>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Business Name" required>
                <input
                  type="text"
                  defaultValue="Green Leaf Café"
                  className={inputCls}
                />
              </Field>
              <Field label="Business Type" required>
                <select className={inputCls} defaultValue="restaurant">
                  <option value="restaurant">Restaurant / Café</option>
                  <option value="bakery">Bakery</option>
                  <option value="hotel">Hotel</option>
                  <option value="corporate">Corporate Canteen</option>
                  <option value="other">Other</option>
                </select>
              </Field>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Owner / Contact Person" required>
                <input type="text" defaultValue="Rahul Sharma" className={inputCls} />
              </Field>
              <Field label="Phone Number" required>
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

            {/* Email */}
            <Field label="Email" required>
              <input
                type="email"
                defaultValue="greenleafcafe@gmail.com"
                className={inputCls}
              />
            </Field>

            {/* Address */}
            <Field label="Business Address" required>
              <input
                type="text"
                defaultValue="12, 3rd Cross, Koramangala 4th Block"
                className={inputCls}
              />
            </Field>

            {/* Row 3 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="City / Area" required>
                <input type="text" defaultValue="Koramangala" className={inputCls} />
              </Field>
              <Field label="Food License Number" required>
                <input
                  type="text"
                  defaultValue="LIC/KA/2024/123456"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Password" required>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    defaultValue="••••••••••"
                    className={inputCls + ' pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </Field>
              <Field label="Confirm Password" required>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    defaultValue="••••••••••"
                    className={inputCls + ' pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </Field>
            </div>

            {/* Document upload */}
            <Field label="Food License / Verification Document" required>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                  <span className="text-xs font-bold text-red-600">PDF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{fileName}</p>
                  <p className="text-xs text-muted-foreground">245 KB</p>
                </div>
                <label className="cursor-pointer rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary">
                  Change File
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setFileName(e.target.files[0].name)
                    }}
                  />
                </label>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Upload valid food license or FSSAI certificate (PDF, JPG, PNG – Max 5MB)
              </p>
            </Field>

            {/* Agreement */}
            <label className="flex cursor-pointer items-start gap-2 text-sm text-primary">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              I agree to follow food safety guidelines and the MealSaver platform terms.
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Create Donor Account
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in here
              </Link>
            </p>
          </form>
        </div>
      </div>
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
