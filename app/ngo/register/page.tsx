'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Eye, EyeOff, Upload, UserCircle2 } from 'lucide-react'
import { Logo } from '@/components/mealsaver/logo'

export default function NGORegisterPage() {
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <Logo />
        </div>

        <div className="rounded-2xl border border-border bg-card px-8 py-8 shadow-sm">
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <UserCircle2 size={16} className="text-primary" />
            Register your organisation to start receiving donations.
          </div>

          <h1 className="mb-6 text-xl font-bold text-foreground">NGO / Receiver Registration Form</h1>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Organisation Details heading */}
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <UserCircle2 size={15} className="text-primary" />
              Organisation Details
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Organization Name" required>
                <input type="text" placeholder="Enter organization name" className={inputCls} />
              </Field>
              <Field label="Organization Type" required>
                <select className={inputCls} defaultValue="">
                  <option value="" disabled>Select type</option>
                  <option>Shelter</option>
                  <option>Community Kitchen</option>
                  <option>Orphanage</option>
                  <option>Old Age Home</option>
                  <option>Food Bank</option>
                </select>
              </Field>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Contact Person" required>
                <input type="text" placeholder="Full name" className={inputCls} />
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

            {/* Row 3 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Email" required>
                <input type="email" placeholder="you@example.com" className={inputCls} />
              </Field>
              <Field label="Service Area" required>
                <select className={inputCls} defaultValue="">
                  <option value="" disabled>Select service area</option>
                  <option>Koramangala</option>
                  <option>Indiranagar</option>
                  <option>HSR Layout</option>
                  <option>BTM Layout</option>
                  <option>Whitefield</option>
                </select>
              </Field>
            </div>

            {/* Address */}
            <Field label="Address" required>
              <input type="text" placeholder="Enter full address" className={inputCls} />
            </Field>

            {/* Row 4 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Storage Capability" required>
                <select className={inputCls} defaultValue="">
                  <option value="" disabled>Select capacity</option>
                  <option>No storage</option>
                  <option>Refrigerated (small)</option>
                  <option>Refrigerated (large)</option>
                  <option>Dry storage</option>
                </select>
              </Field>
              <Field label="Food Types Accepted" required>
                <select className={inputCls} defaultValue="">
                  <option value="" disabled>Select food types</option>
                  <option>All food types</option>
                  <option>Cooked food only</option>
                  <option>Raw materials only</option>
                  <option>Packaged food only</option>
                </select>
              </Field>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Password" required>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter password"
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
                    placeholder="Confirm password"
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

            {/* Document Verification */}
            <div className="pt-2">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary">
                  <span className="text-[10px] text-primary">✓</span>
                </span>
                Document Verification
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Organization Verification" required>
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/50 px-4 py-6 text-center hover:bg-secondary">
                    <Upload size={22} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Upload document</span>
                    <span className="text-xs text-muted-foreground">PDF, JPG or PNG (Max 5MB)</span>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.png" />
                  </label>
                </Field>
                <Field label="Registration Proof" required>
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/50 px-4 py-6 text-center hover:bg-secondary">
                    <Upload size={22} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Upload document</span>
                    <span className="text-xs text-muted-foreground">PDF, JPG or PNG (Max 5MB)</span>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.png" />
                  </label>
                </Field>
              </div>
            </div>

            {/* Agreement */}
            <label className="flex cursor-pointer items-start gap-2 text-sm text-primary">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              I agree to MealSaver's{' '}
              <Link href="#" className="underline">Terms & Conditions</Link> and{' '}
              <Link href="#" className="underline">Privacy Policy</Link>.
            </label>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Create NGO Account
            </button>
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
