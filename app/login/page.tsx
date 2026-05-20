"use client"

import Link from "next/link"
import { Building2, Leaf, LogIn, Store } from "lucide-react"

import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  return (
    <AppLayout>
      <section className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10">
        <div className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Welcome back to MealSaver</h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              Sign in as a food donor or NGO partner to manage donations, pickups, and impact updates.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Choose your account type to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="donor">
                <TabsList className="mb-6 grid w-full grid-cols-2">
                  <TabsTrigger value="donor">
                    <Store className="h-4 w-4" />
                    Donor
                  </TabsTrigger>
                  <TabsTrigger value="ngo">
                    <Building2 className="h-4 w-4" />
                    NGO
                  </TabsTrigger>
                </TabsList>
                {["donor", "ngo"].map((role) => (
                  <TabsContent key={role} value={role}>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${role}-email`}>Email</Label>
                        <Input id={`${role}-email`} type="email" placeholder="name@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${role}-password`}>Password</Label>
                        <Input id={`${role}-password`} type="password" />
                      </div>
                      <Button className="w-full" asChild>
                        <Link href={role === "donor" ? "/donor" : "/ngo"}>
                          <LogIn className="h-4 w-4" />
                          Continue
                        </Link>
                      </Button>
                    </form>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>
    </AppLayout>
  )
}
