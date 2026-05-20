"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navItems = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/login", label: "Login", icon: "login" },
  { href: "/donor", label: "Donor Dashboard", icon: "dashboard" },
  { href: "/donate", label: "Create Donation", icon: "add_circle" },
  { href: "/ngo", label: "NGO Dashboard", icon: "domain" },
  { href: "/match", label: "Match Details", icon: "handshake" },
  { href: "/impact", label: "Impact Report", icon: "bar_chart" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? (
          <span className="material-symbols-outlined text-xl">close</span>
        ) : (
          <span className="material-symbols-outlined text-xl">menu</span>
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out border-r border-sidebar-border",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col font-sans">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border bg-sidebar/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
              <span className="material-symbols-outlined text-sidebar-primary-foreground text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">MealSaver</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3.5 rounded-[12px] px-4 py-3 text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
                  )}
                >
                  <span className={cn(
                    "material-symbols-outlined text-xl",
                    isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/60"
                  )} style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border px-6 py-5 bg-sidebar/5">
            <p className="text-[10px] text-sidebar-foreground/45 uppercase tracking-wider font-bold">
              © 2026 MealSaver
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
