'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, Building2, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/mealsaver/logo'

const roles = [
  { id: 'donor', label: 'Donor', icon: User },
  { id: 'ngo', label: 'NGO', icon: Building2 },
  { id: 'admin', label: 'Admin', icon: ShieldCheck },
] as const

type Role = (typeof roles)[number]['id']

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [role, setRole] = useState<Role>('donor')

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card px-8 py-10 shadow-sm">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Logo size="lg" />
          <h1 className="mt-2 text-2xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-sm text-muted-foreground">Access your MealSaver dashboard</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Email Address</label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Log In
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or continue as</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Role selector */}
        <div className="flex gap-2">
          {roles.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setRole(id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                role === id
                  ? 'border-primary bg-secondary text-primary'
                  : 'border-border text-muted-foreground hover:bg-secondary'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to MealSaver?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  )
}
