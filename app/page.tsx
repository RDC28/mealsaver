"use client"

import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Shield, Eye, Utensils, Leaf, Users } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Zap,
    title: "Fast Matching",
    description: "AI-powered matching connects donors with nearby NGOs in minutes",
  },
  {
    icon: Shield,
    title: "Safe Pickup",
    description: "Verified NGOs ensure proper food handling and transportation",
  },
  {
    icon: Eye,
    title: "Transparent Impact",
    description: "Track your donations and see the real-world impact you create",
  },
]

const stats = [
  { value: "1,240", label: "Meals Saved", icon: Utensils },
  { value: "320kg", label: "Waste Reduced", icon: Leaf },
  { value: "72", label: "Active NGOs", icon: Users },
]

export default function HomePage() {
  return (
    <AppLayout>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5 px-4 py-20 md:py-32">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxYTZiM2MiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Leaf className="h-4 w-4" />
              Fighting Food Waste Together
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl text-balance">
              Rescue surplus food.{" "}
              <span className="text-primary">Feed more people.</span>
            </h1>
            <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto text-pretty">
              MealSaver connects restaurants, cafés, and businesses with local NGOs to reduce food waste and help communities in need.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="text-base" asChild>
                <Link href="/donate">
                  <Utensils className="mr-2 h-5 w-5" />
                  Donate Surplus Food
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link href="/login">
                  <Users className="mr-2 h-5 w-5" />
                  Join as NGO
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A simple process to connect surplus food with those who need it most
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={index}
                    className="group relative overflow-hidden border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-lg"
                  >
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border bg-muted/30 px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-3">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-3xl font-bold text-foreground md:text-4xl">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Ready to Make a Difference?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Join our growing network of food donors and NGOs working together to reduce waste and feed communities.
            </p>
            <Button size="lg" asChild>
              <Link href="/login">Get Started Today</Link>
            </Button>
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
