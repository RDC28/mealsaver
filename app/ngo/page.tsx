import Link from "next/link"
import { Building2, CheckCircle2, MapPin, PackageSearch } from "lucide-react"

import { AppLayout } from "@/components/app-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const nearby = [
  { item: "Paneer rice bowls", donor: "Green Leaf Cafe", distance: "1.2 km", quantity: "45 meals" },
  { item: "Bakery assortment", donor: "Sunrise Bakery", distance: "2.6 km", quantity: "12 kg" },
  { item: "Packaged snacks", donor: "Metro Foods", distance: "4.1 km", quantity: "30 packs" },
]

export default function NgoPage() {
  return (
    <AppLayout>
      <section className="px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">NGO Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Review nearby donations and coordinate pickups.</p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Metric title="Nearby Donations" value="8" icon={PackageSearch} />
          <Metric title="Accepted Today" value="3" icon={CheckCircle2} />
          <Metric title="Partner Area" value="5 km" icon={MapPin} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Donations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nearby.map((donation) => (
              <div key={donation.item} className="flex flex-col gap-3 rounded-md border p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-medium text-card-foreground">{donation.item}</div>
                  <div className="text-sm text-muted-foreground">{donation.donor} · {donation.quantity} · {donation.distance}</div>
                </div>
                <Button size="sm" asChild>
                  <Link href="/match">View Match</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  )
}

function Metric({ title, value, icon: Icon }: { title: string; value: string; icon: React.ElementType }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-2xl font-bold text-card-foreground">{value}</div>
          <div className="text-sm text-muted-foreground">{title}</div>
        </div>
      </CardContent>
    </Card>
  )
}
