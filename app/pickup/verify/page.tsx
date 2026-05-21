'use client'

import { useState } from 'react'
import { CheckCircle2, Lock, RefreshCw } from 'lucide-react'
import Link from 'next/link'

const checklist = [
  'Food checked visually',
  'Quantity confirmed',
  'Packing condition okay',
  'Pickup marked complete',
]

export default function PickupVerifyPage() {
  const [checked, setChecked] = useState<boolean[]>(checklist.map(() => false))
  const [otp, setOtp] = useState(['7', '3', '1', '9'])

  const toggle = (i: number) =>
    setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)))

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card px-7 py-8 shadow-sm space-y-6">
        <h1 className="text-xl font-bold text-foreground">Pickup Verification</h1>

        {/* Checklist */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Verify Pickup Checklist</h2>
          {checklist.map((item, i) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background px-4 py-3"
            >
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => toggle(i)}
                className="h-4 w-4 accent-primary"
              />
              <span className={`text-sm ${checked[i] ? 'text-primary font-medium' : 'text-foreground'}`}>
                {item}
              </span>
              {checked[i] && <CheckCircle2 size={16} className="ml-auto text-primary" />}
            </label>
          ))}
        </div>

        {/* OTP */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">OTP Verification (Optional)</h2>
          <p className="text-xs text-muted-foreground">Enter 4-digit OTP sent to receiver</p>
          <div className="flex gap-3 justify-center">
            {otp.map((digit, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '')
                  setOtp((prev) => prev.map((d, j) => (j === i ? val : d)))
                }}
                className="h-14 w-14 rounded-xl border-2 border-border bg-background text-center text-2xl font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            ))}
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Didn&apos;t receive OTP?{' '}
            <button className="font-medium text-primary hover:underline">
              Resend OTP (00:45)
            </button>
          </p>
        </div>

        <Link
          href="/delivery/confirm"
          className="block w-full rounded-lg bg-primary py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Confirm Pickup
        </Link>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock size={11} />
          Your verification helps build trust and ensures food safety.
        </div>
      </div>
    </div>
  )
}
