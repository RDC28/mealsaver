"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<"donor" | "ngo" | "admin">("donor")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (role === "donor") {
      router.push("/donor")
    } else if (role === "ngo") {
      router.push("/ngo")
    } else if (role === "admin") {
      router.push("/impact")
    }
  }

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 -z-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 -z-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="mb-8 text-center">
        <Link href="/" className="text-3xl font-extrabold text-primary flex items-center gap-2 justify-center">
          <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          MealSaver
        </Link>
        <p className="text-on-surface-variant text-sm mt-2 font-medium">Rescuing food, nourishing communities.</p>
      </div>

      <div className="bg-white w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden border border-outline-variant/30 p-8">
        <h2 className="text-2xl font-bold text-on-background mb-2">Welcome back</h2>
        <p className="text-on-surface-variant text-xs mb-6 font-medium">Please sign in to access your dashboard.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Email Address</label>
            <input 
              className="w-full px-4 py-3 rounded-[16px] border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm outline-none" 
              placeholder="name@company.com" 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Password</label>
            <input 
              className="w-full px-4 py-3 rounded-[16px] border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm outline-none" 
              placeholder="••••••••" 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Select Your Role</label>
            <div className="grid grid-cols-3 gap-2">
              <label className="cursor-pointer">
                <input 
                  checked={role === "donor"} 
                  onChange={() => setRole("donor")} 
                  className="hidden peer" 
                  name="role" 
                  type="radio" 
                  value="donor"
                />
                <div className="p-3 text-center rounded-[16px] border border-outline-variant peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-xs font-semibold hover:bg-surface-container/50">
                  Donor
                </div>
              </label>
              <label className="cursor-pointer">
                <input 
                  checked={role === "ngo"} 
                  onChange={() => setRole("ngo")} 
                  className="hidden peer" 
                  name="role" 
                  type="radio" 
                  value="ngo"
                />
                <div className="p-3 text-center rounded-[16px] border border-outline-variant peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-xs font-semibold hover:bg-surface-container/50">
                  NGO
                </div>
              </label>
              <label className="cursor-pointer">
                <input 
                  checked={role === "admin"} 
                  onChange={() => setRole("admin")} 
                  className="hidden peer" 
                  name="role" 
                  type="radio" 
                  value="admin"
                />
                <div className="p-3 text-center rounded-[16px] border border-outline-variant peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-xs font-semibold hover:bg-surface-container/50">
                  Admin
                </div>
              </label>
            </div>
          </div>
          
          <button className="w-full bg-primary text-on-primary py-4 rounded-[16px] font-semibold shadow-md hover:bg-primary/95 transition-all cursor-pointer active:scale-95" type="submit">
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          New to MealSaver?{" "}
          <Link className="text-primary font-bold hover:underline" href="/#how-it-works">
            Get Started
          </Link>
        </p>
      </div>
    </div>
  )
}
