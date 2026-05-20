import { CheckCircle2, Clock, MapPin, Phone, Utensils } from "lucide-react"

import { AppLayout } from "@/components/app-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MatchPage() {
  return (
    <AppLayout>
      <section className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Match Details</h1>
            <p className="mt-2 text-muted-foreground">Pickup coordination between donor and NGO partner.</p>
          </div>
          <Badge className="w-fit">Matched</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Paneer rice bowls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Detail icon={Utensils} label="Quantity" value="45 meals, packed in sealed containers" />
              <Detail icon={Clock} label="Pickup window" value="Today, 8:00 PM - 9:00 PM" />
              <Detail icon={MapPin} label="Pickup address" value="Green Leaf Cafe, Indiranagar, Bengaluru" />
              <Detail icon={Phone} label="Donor contact" value="+91 90000 12345" />
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button>
                  <CheckCircle2 className="h-4 w-4" />
                  Confirm Pickup
                </Button>
                <Button variant="outline">Call Donor</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pickup Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Donation posted", "NGO matched", "Pickup assigned", "Delivery confirmation"].map((step, index) => (
                <div key={step} className="flex gap-3">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-card-foreground">{step}</div>
                    <div className="text-sm text-muted-foreground">{index < 2 ? "Completed" : "Pending"}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </AppLayout>
  )
}

function Detail({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-5 w-5 text-primary" />
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-medium text-card-foreground">{value}</div>
      </div>
    </div>
  )
}
