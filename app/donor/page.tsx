import Link from "next/link"
import { Clock, PackageCheck, PlusCircle, Utensils } from "lucide-react"

import { AppLayout } from "@/components/app-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const donations = [
  { item: "Paneer rice bowls", quantity: "45 meals", status: "Matched", pickup: "Today, 8:30 PM" },
  { item: "Bakery assortment", quantity: "12 kg", status: "Open", pickup: "Today, 9:15 PM" },
  { item: "Fresh vegetables", quantity: "18 kg", status: "Completed", pickup: "Yesterday" },
]

export default function DonorPage() {
  return (
    <AppLayout>
      <section className="px-4 py-8 md:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Donor Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Track surplus listings, pickup status, and saved meals.</p>
          </div>
          <Button asChild>
            <Link href="/donate">
              <PlusCircle className="h-4 w-4" />
              Create Donation
            </Link>
          </Button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Metric title="Active Listings" value="2" icon={Utensils} />
          <Metric title="Meals Donated" value="1,240" icon={PackageCheck} />
          <Metric title="Pending Pickups" value="1" icon={Clock} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {donations.map((donation) => (
              <div key={donation.item} className="flex flex-col gap-3 rounded-md border p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-medium text-card-foreground">{donation.item}</div>
                  <div className="text-sm text-muted-foreground">{donation.quantity} · Pickup {donation.pickup}</div>
                </div>
                <Badge variant={donation.status === "Completed" ? "secondary" : "default"}>{donation.status}</Badge>
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
