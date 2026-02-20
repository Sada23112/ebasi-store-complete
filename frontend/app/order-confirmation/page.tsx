"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Truck, MapPin, Calendar, Download, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Sample order data
const orderData = {
  orderNumber: "EB-2024-001234",
  orderDate: "January 15, 2024",
  estimatedDelivery: "January 18-20, 2024",
  status: "Confirmed",
  items: [
    {
      id: 1,
      name: "Elegant Silk Saree",
      price: 2499,
      image: "/elegant-silk-saree.jpg",
      quantity: 1,
    },
    {
      id: 2,
      name: "Designer Kurti Set",
      price: 1899,
      image: "/designer-kurti-set.jpg",
      quantity: 2,
    },
  ],
  shippingAddress: {
    name: "Priya Sharma",
    address: "123 MG Road, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
  },
  paymentMethod: "Credit Card ending in 1234",
  subtotal: 6297,
  shipping: 0,
  tax: 1133,
  total: 7430,
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-background">
      

      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground mb-4">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>Order #{orderData.orderNumber}</span>
              <span>•</span>
              <span>{orderData.orderDate}</span>
            </div>
          </div>

          {/* Order Status */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Order Status</h2>
                  <p className="text-muted-foreground">We'll send you updates as your order progresses</p>
                </div>
                <Badge className="bg-green-100 text-green-800">{orderData.status}</Badge>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs text-center">Order Placed</span>
                </div>
                <div className="flex-1 h-0.5 bg-muted mx-2"></div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mb-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-xs text-center">Processing</span>
                </div>
                <div className="flex-1 h-0.5 bg-muted mx-2"></div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mb-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-xs text-center">Shipped</span>
                </div>
                <div className="flex-1 h-0.5 bg-muted mx-2"></div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-xs text-center">Delivered</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Estimated delivery: {orderData.estimatedDelivery}</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderData.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{item.name}</h4>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                            <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{orderData.shippingAddress.name}</p>
                    <p className="text-muted-foreground">{orderData.shippingAddress.address}</p>
                    <p className="text-muted-foreground">
                      {orderData.shippingAddress.city}, {orderData.shippingAddress.state}{" "}
                      {orderData.shippingAddress.pincode}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{orderData.paymentMethod}</p>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{orderData.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{orderData.shipping === 0 ? "Free" : `₹${orderData.shipping}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>₹{orderData.tax.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{orderData.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Order
                    </Button>
                    <Link href={`/track-order/${orderData.orderNumber}`}>
                      <Button className="w-full">Track Your Order</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Next Steps */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">What happens next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">Order Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    We'll prepare your items for shipment within 1-2 business days.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">Shipping Updates</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll receive tracking information once your order ships.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">Delivery</h4>
                  <p className="text-sm text-muted-foreground">
                    Your order will be delivered to your specified address.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Continue Shopping */}
          <div className="text-center mt-8">
            <Link href="/shop">
              <Button variant="outline" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>

      
    </div>
  )
}
