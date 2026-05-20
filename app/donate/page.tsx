import { CalendarClock, MapPin, PackagePlus } from "lucide-react"

import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function DonatePage() {
  return (
    <AppLayout>
      <section className="mx-auto max-w-4xl px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create Donation</h1>
          <p className="mt-2 text-muted-foreground">List safe surplus food for nearby NGO partners to claim.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Food details</CardTitle>
            <CardDescription>Share enough detail for a receiver to plan pickup and distribution.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Food item" id="food-item" placeholder="Rice bowls, bread, vegetables" />
                <Field label="Quantity" id="quantity" placeholder="45 meals or 12 kg" />
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Food type</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veg">Vegetarian</SelectItem>
                      <SelectItem value="non-veg">Non-vegetarian</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cooked">Cooked</SelectItem>
                      <SelectItem value="raw">Raw</SelectItem>
                      <SelectItem value="packaged">Packaged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Field label="Best before" id="best-before" type="time" />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Pickup address" id="pickup-address" placeholder="Restaurant address" icon={MapPin} />
                <Field label="Pickup window" id="pickup-window" placeholder="7:30 PM - 9:00 PM" icon={CalendarClock} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Packaging, allergens, contact instructions" />
              </div>
              <Button className="w-full md:w-fit">
                <PackagePlus className="h-4 w-4" />
                Publish Donation
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  )
}

function Field({ label, id, icon: Icon, ...props }: React.ComponentProps<typeof Input> & { label: string; id: string; icon?: React.ElementType }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />}
        <Input id={id} className={Icon ? "pl-9" : undefined} {...props} />
      </div>
    </div>
  )
}
