"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function HomePage() {
  const router = useRouter()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authView, setAuthView] = useState<"login" | "register">("login")
  const [role, setRole] = useState<"donor" | "ngo" | "admin">("donor")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleOpenAuth = (view: "login" | "register") => {
    setAuthView(view)
    setAuthModalOpen(true)
  }

  const handleCloseAuth = () => {
    setAuthModalOpen(false)
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
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
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans selection:bg-primary/20">
      {/* TopNavBar */}
      <header className="bg-surface shadow-sm fixed top-0 left-0 right-0 z-50 h-20 flex items-center border-b border-outline-variant/10">
        <nav className="flex justify-between items-center w-full px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[32px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            MealSaver
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-on-surface-variant hover:text-primary transition-colors font-medium" href="#how-it-works">How it Works</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-medium" href="#impact">Impact</a>
            <button className="text-on-surface-variant font-medium hover:text-primary transition-colors cursor-pointer" onClick={() => handleOpenAuth("login")}>Login</button>
            <button className="bg-primary text-on-primary px-6 py-3 rounded-[16px] font-semibold active:scale-95 hover:bg-primary/95 transition-all shadow-sm cursor-pointer" onClick={() => handleOpenAuth("register")}>Get Started</button>
          </div>
          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-primary cursor-pointer" onClick={() => handleOpenAuth("login")}>
            <span className="material-symbols-outlined">menu</span>
          </button>
        </nav>
      </header>

      <main className="pt-20 flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 md:px-12 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                Save Food. <br className="hidden md:inline" />
                <span className="text-primary">Feed People.</span>
              </h1>
              <p className="text-lg text-on-surface-variant mb-8 max-w-lg leading-relaxed">
                Connect surplus food donors with nearby verified NGOs. A modern marketplace to reduce waste and nourish communities.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => handleOpenAuth("register")} 
                  className="bg-primary text-on-primary px-8 py-4 rounded-[16px] font-semibold shadow-lg hover:shadow-xl hover:bg-primary/95 transition-all flex items-center gap-2 group cursor-pointer active:scale-95"
                >
                  Donate Food
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <button 
                  onClick={() => handleOpenAuth("register")} 
                  className="border-2 border-primary text-primary bg-primary/5 hover:bg-primary/10 px-8 py-4 rounded-[16px] font-semibold transition-all cursor-pointer active:scale-95"
                >
                  Join NGO
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-[24px] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 max-w-xl mx-auto border border-outline-variant/30">
                <img 
                  alt="Community kitchen donation" 
                  className="w-full h-[450px] object-cover" 
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass-card p-6 rounded-[24px] shadow-xl hidden md:block border border-outline-variant/30">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-primary font-bold">Active Now</p>
                    <p className="font-bold text-lg text-on-background">12 Nearby NGOs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-primary/5 rounded-l-[100px] blur-3xl"></div>
        </section>

        {/* Process Section */}
        <section className="bg-surface-container-low py-20 px-6 md:px-12 border-y border-outline-variant/20" id="how-it-works">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How it Works</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto text-base">Five simple steps to make a global difference. We handle the logistics; you provide the kindness.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {/* Steps */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all mb-4 border border-outline-variant/10">
                  <span className="material-symbols-outlined text-[32px]">upload_file</span>
                </div>
                <h3 className="font-bold mb-2">Upload Food</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">Snap a photo and list items.</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all mb-4 border border-outline-variant/10">
                  <span className="material-symbols-outlined text-[32px]">hub</span>
                </div>
                <h3 className="font-bold mb-2">Match NGO</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">We find the nearest receiver.</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all mb-4 border border-outline-variant/10">
                  <span className="material-symbols-outlined text-[32px]">local_shipping</span>
                </div>
                <h3 className="font-bold mb-2">Pickup</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">Verified driver arrives.</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all mb-4 border border-outline-variant/10">
                  <span className="material-symbols-outlined text-[32px]">handshake</span>
                </div>
                <h3 className="font-bold mb-2">Delivery</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">Food reaches those in need.</p>
              </div>
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all mb-4 border border-outline-variant/10">
                  <span className="material-symbols-outlined text-[32px]">trending_up</span>
                </div>
                <h3 className="font-bold mb-2">Impact</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">See your contribution live.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Metrics */}
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto" id="impact">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[24px] shadow-sm border border-outline-variant/30 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
              </div>
              <span className="text-4xl font-extrabold text-primary mb-2">1.2M+</span>
              <h4 className="font-bold text-on-surface-variant uppercase tracking-wider text-sm">🍲 Meals Saved</h4>
              <p className="text-sm mt-3 text-on-surface-variant leading-relaxed">Successfully redirected from waste to dinner tables.</p>
            </div>
            
            <div className="bg-white p-8 rounded-[24px] shadow-sm border border-outline-variant/30 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>recycling</span>
              </div>
              <span className="text-4xl font-extrabold text-primary mb-2">450 Tons</span>
              <h4 className="font-bold text-on-surface-variant uppercase tracking-wider text-sm">♻ Food Waste Reduced</h4>
              <p className="text-sm mt-3 text-on-surface-variant leading-relaxed">Carbon emissions saved by preventing landfill disposal.</p>
            </div>

            <div className="bg-white p-8 rounded-[24px] shadow-sm border border-outline-variant/30 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>home_work</span>
              </div>
              <span className="text-4xl font-extrabold text-primary mb-2">850+</span>
              <h4 className="font-bold text-on-surface-variant uppercase tracking-wider text-sm">🏠 NGOs Active</h4>
              <p className="text-sm mt-3 text-on-surface-variant leading-relaxed">Verified organizations receiving regular donations.</p>
            </div>
          </div>
        </section>

        {/* Registration Options */}
        <section className="py-20 px-6 md:px-12 bg-primary/5 border-t border-outline-variant/20">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
            <p className="text-on-surface-variant text-base">Select your path to join the MealSaver movement.</p>
          </div>
          
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Donor Card */}
            <div className="bg-white p-10 rounded-[24px] shadow-lg border-2 border-transparent hover:border-primary transition-all flex flex-col items-center">
              <div className="mb-6">
                <span className="material-symbols-outlined text-[64px] text-primary">storefront</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center text-on-background">Register as Donor</h3>
              <p className="text-on-surface-variant text-center mb-8 text-sm leading-relaxed">For Restaurants, Bakeries, Cafes, and Groceries with surplus food.</p>
              <button onClick={() => handleOpenAuth("register")} className="w-full bg-primary text-on-primary py-4 rounded-[16px] font-semibold hover:bg-primary/95 transition-all cursor-pointer active:scale-95 shadow-md">
                Become a Donor
              </button>
              <ul className="mt-8 space-y-3 w-full text-sm text-on-surface-variant border-t border-outline-variant/20 pt-6">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> 
                  Tax deduction receipts
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> 
                  Zero-waste branding
                </li>
              </ul>
            </div>

            {/* NGO Card */}
            <div className="bg-white p-10 rounded-[24px] shadow-lg border-2 border-transparent hover:border-primary transition-all flex flex-col items-center">
              <div className="mb-6">
                <span className="material-symbols-outlined text-[64px] text-primary">volunteer_activism</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center text-on-background">Register as NGO</h3>
              <p className="text-on-surface-variant text-center mb-8 text-sm leading-relaxed">For Shelters, Community Kitchens, and Local Food Banks.</p>
              <button onClick={() => handleOpenAuth("register")} className="w-full border-2 border-primary text-primary hover:bg-primary/5 py-4 rounded-[16px] font-semibold transition-all cursor-pointer active:scale-95">
                Apply for Intake
              </button>
              <ul className="mt-8 space-y-3 w-full text-sm text-on-surface-variant border-t border-outline-variant/20 pt-6">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> 
                  Consistent food supply
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> 
                  Verified logistics network
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 bg-secondary-container border-t border-outline-variant/20">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <div className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[28px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            MealSaver
          </div>
          <p className="text-xs text-on-secondary-container opacity-80">© 2026 MealSaver. Rescuing food, nourishing communities.</p>
        </div>
        <div className="flex gap-6 text-sm font-medium text-on-secondary-container">
          <a className="hover:underline transition-all" href="#">Privacy Policy</a>
          <a className="hover:underline transition-all" href="#">Terms of Service</a>
          <a className="hover:underline transition-all" href="#">Contact Us</a>
          <a className="hover:underline transition-all" href="#">Careers</a>
        </div>
      </footer>

      {/* Auth Modal Overlay */}
      {authModalOpen && (
        <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 transition-all duration-300">
          <div className="bg-white w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-outline-variant/30">
            {/* Modal Header */}
            <div className="p-6 flex justify-between items-center border-b border-outline-variant/10">
              <h3 className="text-xl font-bold text-on-background">{authView === "login" ? "Login" : "Join MealSaver"}</h3>
              <button className="text-on-surface-variant hover:text-on-surface cursor-pointer w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors" onClick={handleCloseAuth}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Login Form */}
            {authView === "login" ? (
              <div className="p-8">
                <form onSubmit={handleLoginSubmit} className="space-y-6">
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
                  <p className="text-center text-sm text-on-surface-variant">
                    Don&apos;t have an account?{" "}
                    <button className="text-primary font-bold cursor-pointer hover:underline" onClick={() => setAuthView("register")} type="button">
                      Register
                    </button>
                  </p>
                </form>
              </div>
            ) : (
              /* Register Form selection */
              <div className="p-8">
                <div className="space-y-4">
                  <button onClick={() => { setRole("donor"); setAuthView("login"); }} className="w-full p-5 border border-outline-variant rounded-[16px] flex items-center gap-4 hover:bg-surface-container transition-colors group cursor-pointer text-left">
                    <span className="material-symbols-outlined text-primary text-[28px] group-hover:scale-110 transition-transform">restaurant</span>
                    <div>
                      <p className="font-bold text-sm text-on-background">Register as Donor</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">For businesses with surplus food</p>
                    </div>
                  </button>
                  <button onClick={() => { setRole("ngo"); setAuthView("login"); }} className="w-full p-5 border border-outline-variant rounded-[16px] flex items-center gap-4 hover:bg-surface-container transition-colors group cursor-pointer text-left">
                    <span className="material-symbols-outlined text-primary text-[28px] group-hover:scale-110 transition-transform">favorite</span>
                    <div>
                      <p className="font-bold text-sm text-on-background">Register as NGO</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">For charitable food distributions</p>
                    </div>
                  </button>
                  <p className="text-center text-sm text-on-surface-variant mt-6">
                    Already have an account?{" "}
                    <button className="text-primary font-bold cursor-pointer hover:underline" onClick={() => setAuthView("login")} type="button">
                      Login
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
