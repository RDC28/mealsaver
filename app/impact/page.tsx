import { BarChart3, Leaf, TrendingUp, Utensils } from "lucide-react"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const impact = [
  { title: "Meals Saved", value: "1,240", icon: Utensils },
  { title: "Food Waste Avoided", value: "320 kg", icon: Leaf },
  { title: "Monthly Growth", value: "+18%", icon: TrendingUp },
]

export default function ImpactPage() {
  return (
    <AppLayout>
      <section className="px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Impact Report</h1>
          <p className="mt-2 text-muted-foreground">A snapshot of rescued food and community outcomes.</p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {impact.map((item) => (
            <Card key={item.title}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-card-foreground">{item.value}</div>
                  <div className="text-sm text-muted-foreground">{item.title}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Target</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Meals saved</span>
                <span className="font-medium">1,240 / 1,500</span>
              </div>
              <Progress value={82} />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart3 className="h-4 w-4" />
                260 meals remaining for this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Green Leaf Cafe", "Sunrise Bakery", "Metro Foods"].map((name, index) => (
                <div key={name} className="flex items-center justify-between rounded-md border p-3">
                  <span className="font-medium text-card-foreground">{name}</span>
                  <span className="text-sm text-muted-foreground">{[380, 295, 210][index]} meals</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </AppLayout>
  )
}
