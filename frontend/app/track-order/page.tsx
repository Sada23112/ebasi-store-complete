"use client"

import type React from "react"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Search, Truck, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export default function TrackOrderHomePage() {
  const [orderId, setOrderId] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (orderId) {
      // Redirect to tracking page
      window.location.href = `/track-order/${orderId}`
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <Package className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Track Your Order</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter your order number and email address to get real-time updates on your package delivery status.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tracking Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Track Your Package
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="orderId">Order Number *</Label>
                    <Input
                      id="orderId"
                      placeholder="EB-2024-001234"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      You can find this in your order confirmation email
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Track Order
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground text-center">
                    Have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>{" "}
                    to view all your orders
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Real-time Updates</h3>
                      <p className="text-sm text-muted-foreground">
                        Get live updates on your package location and estimated delivery time.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Delivery Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive SMS and email notifications when your package is out for delivery.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Delivery History</h3>
                      <p className="text-sm text-muted-foreground">
                        View complete timeline of your package journey from warehouse to your door.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sample Order Numbers */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>Try Sample Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Don't have an order to track? Try these sample order numbers to see how our tracking system works:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/track-order/EB-2024-001234">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <p className="font-mono text-sm font-medium">EB-2024-001234</p>
                      <p className="text-xs text-muted-foreground mt-1">Delivered Order</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/track-order/EB-2024-001235">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <p className="font-mono text-sm font-medium">EB-2024-001235</p>
                      <p className="text-xs text-muted-foreground mt-1">In Transit</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/track-order/EB-2024-001236">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <p className="font-mono text-sm font-medium">EB-2024-001236</p>
                      <p className="text-xs text-muted-foreground mt-1">Processing</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="text-center mt-12">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find your order or having trouble with tracking? Our customer support team is here to help.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline">Contact Support</Button>
              <Button variant="outline">FAQ</Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
