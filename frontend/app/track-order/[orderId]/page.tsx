"use client"

import type React from "react"

import { useState } from "react"
import { useParams } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Package,
  Truck,
  MapPin,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Download,
  Share2,
  ArrowLeft,
  User,
  CreditCard,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Sample order tracking data
const orderTrackingData = {
  "EB-2024-001234": {
    orderNumber: "EB-2024-001234",
    orderDate: "January 15, 2024",
    estimatedDelivery: "January 18-20, 2024",
    actualDelivery: "January 18, 2024",
    status: "Delivered",
    currentLocation: "Delivered to Customer",
    trackingNumber: "TRK123456789",
    items: [
      {
        id: 1,
        name: "Elegant Silk Saree",
        price: 2499,
        image: "/elegant-silk-saree.jpg",
        quantity: 1,
        color: "Red",
        size: "Free Size",
      },
      {
        id: 2,
        name: "Designer Kurti Set",
        price: 1899,
        image: "/designer-kurti-set.jpg",
        quantity: 2,
        color: "Blue",
        size: "M",
      },
    ],
    shippingAddress: {
      name: "Priya Sharma",
      address: "123 MG Road, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      phone: "+91 98765 43210",
    },
    paymentMethod: "Credit Card ending in 1234",
    subtotal: 6297,
    shipping: 0,
    tax: 1133,
    total: 7430,
    timeline: [
      {
        status: "Order Placed",
        date: "Jan 15, 2024",
        time: "10:30 AM",
        description: "Your order has been successfully placed",
        completed: true,
      },
      {
        status: "Payment Confirmed",
        date: "Jan 15, 2024",
        time: "10:32 AM",
        description: "Payment has been processed successfully",
        completed: true,
      },
      {
        status: "Order Processing",
        date: "Jan 15, 2024",
        time: "2:15 PM",
        description: "Your order is being prepared for shipment",
        completed: true,
      },
      {
        status: "Shipped",
        date: "Jan 16, 2024",
        time: "9:00 AM",
        description: "Your order has been shipped from our warehouse",
        completed: true,
      },
      {
        status: "In Transit",
        date: "Jan 17, 2024",
        time: "11:30 AM",
        description: "Package is on the way to your delivery address",
        completed: true,
      },
      {
        status: "Out for Delivery",
        date: "Jan 18, 2024",
        time: "8:00 AM",
        description: "Package is out for delivery",
        completed: true,
      },
      {
        status: "Delivered",
        date: "Jan 18, 2024",
        time: "2:45 PM",
        description: "Package delivered successfully to Priya Sharma",
        completed: true,
      },
    ],
    carrier: {
      name: "Express Logistics",
      phone: "+91 1800-123-4567",
      website: "www.expresslogistics.com",
    },
  },
}

export default function TrackOrderPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const [guestOrderId, setGuestOrderId] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [showGuestForm, setShowGuestForm] = useState(!orderId)

  const orderData = orderTrackingData[orderId as keyof typeof orderTrackingData]

  const handleGuestTracking = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, this would make an API call to fetch order data
    setShowGuestForm(false)
  }

  if (showGuestForm) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <div className="max-w-md mx-auto px-4 py-16">
            <Card>
              <CardHeader className="text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle className="text-2xl font-serif">Track Your Order</CardTitle>
                <p className="text-muted-foreground">Enter your order details to track your package</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGuestTracking} className="space-y-4">
                  <div>
                    <Label htmlFor="orderId">Order Number</Label>
                    <Input
                      id="orderId"
                      placeholder="EB-2024-001234"
                      value={guestOrderId}
                      onChange={(e) => setGuestOrderId(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Track Order
                  </Button>
                </form>
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>{" "}
                    to view all your orders
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Order Not Found</h1>
            <p className="text-muted-foreground mb-8">
              We couldn't find an order with the provided details. Please check your order number and try again.
            </p>
            <Button onClick={() => setShowGuestForm(true)}>Try Again</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    }
    switch (status.toLowerCase()) {
      case "shipped":
      case "in transit":
      case "out for delivery":
        return <Truck className="h-5 w-5 text-blue-600" />
      case "delivered":
        return <MapPin className="h-5 w-5 text-green-600" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        {/* Header */}
        <div className="border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/account">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground">Order #{orderData.orderNumber}</h1>
                <p className="text-muted-foreground">Placed on {orderData.orderDate}</p>
              </div>
              <Badge
                className={
                  orderData.status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : orderData.status === "Shipped" || orderData.status === "In Transit"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                }
              >
                {orderData.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Tracking Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Status */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      {orderData.status === "Delivered" ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <Truck className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">{orderData.status}</h2>
                      <p className="text-muted-foreground">{orderData.currentLocation}</p>
                    </div>
                  </div>

                  {orderData.status === "Delivered" ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-medium">
                        Your order was delivered on {orderData.actualDelivery}
                      </p>
                      <p className="text-green-600 text-sm mt-1">
                        Package was delivered to {orderData.shippingAddress.name}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 font-medium">Estimated Delivery: {orderData.estimatedDelivery}</p>
                      <p className="text-blue-600 text-sm mt-1">Tracking Number: {orderData.trackingNumber}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tracking Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Tracking History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderData.timeline.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          {getStatusIcon(event.status, event.completed)}
                          {index < orderData.timeline.length - 1 && (
                            <div className={`w-0.5 h-12 mt-2 ${event.completed ? "bg-green-200" : "bg-muted"}`} />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between mb-1">
                            <h3
                              className={`font-medium ${event.completed ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {event.status}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                              {event.date} at {event.time}
                            </span>
                          </div>
                          <p
                            className={`text-sm ${
                              event.completed ? "text-muted-foreground" : "text-muted-foreground/60"
                            }`}
                          >
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Carrier Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Carrier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{orderData.carrier.name}</h3>
                      <p className="text-sm text-muted-foreground">Tracking: {orderData.trackingNumber}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Carrier
                      </Button>
                      <Button size="sm" variant="outline">
                        Visit Website
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderData.items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {item.color} • {item.size} • Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{orderData.shippingAddress.name}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p>{orderData.shippingAddress.address}</p>
                        <p>
                          {orderData.shippingAddress.city}, {orderData.shippingAddress.state}{" "}
                          {orderData.shippingAddress.pincode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{orderData.shippingAddress.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{orderData.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{orderData.shipping === 0 ? "Free" : `₹${orderData.shipping}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>₹{orderData.tax.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{orderData.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      <span>{orderData.paymentMethod}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Tracking
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
