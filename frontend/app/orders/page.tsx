"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Search, Eye, Download, RotateCcw, Star, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Sample orders data
const allOrders = [
  {
    id: "EB-2024-001234",
    date: "Jan 15, 2024",
    status: "Delivered",
    total: 7430,
    items: [
      { name: "Elegant Silk Saree", image: "/elegant-silk-saree.jpg", quantity: 1 },
      { name: "Designer Kurti Set", image: "/designer-kurti-set.jpg", quantity: 2 },
    ],
    deliveryDate: "Jan 18, 2024",
  },
  {
    id: "EB-2024-001233",
    date: "Jan 10, 2024",
    status: "In Transit",
    total: 4999,
    items: [{ name: "Traditional Lehenga", image: "/traditional-lehenga.jpg", quantity: 1 }],
    estimatedDelivery: "Jan 20, 2024",
  },
  {
    id: "EB-2024-001232",
    date: "Jan 5, 2024",
    status: "Processing",
    total: 2899,
    items: [{ name: "Embroidered Anarkali", image: "/embroidered-anarkali.jpg", quantity: 1 }],
    estimatedDelivery: "Jan 22, 2024",
  },
  {
    id: "EB-2024-001231",
    date: "Dec 28, 2023",
    status: "Delivered",
    total: 3599,
    items: [
      { name: "Cotton Palazzo Set", image: "/cotton-palazzo-set.jpg", quantity: 1 },
      { name: "Casual Denim Jacket", image: "/casual-denim-jacket.jpg", quantity: 1 },
    ],
    deliveryDate: "Dec 30, 2023",
  },
  {
    id: "EB-2024-001230",
    date: "Dec 20, 2023",
    status: "Cancelled",
    total: 1899,
    items: [{ name: "Designer Kurti Set", image: "/designer-kurti-set.jpg", quantity: 1 }],
    cancelledDate: "Dec 21, 2023",
  },
  {
    id: "EB-2024-001229",
    date: "Dec 15, 2023",
    status: "Returned",
    total: 2499,
    items: [{ name: "Elegant Silk Saree", image: "/elegant-silk-saree.jpg", quantity: 1 }],
    returnDate: "Dec 25, 2023",
  },
]

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [activeTab, setActiveTab] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in transit":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "returned":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filterOrders = (orders: typeof allOrders, tab: string) => {
    let filtered = orders

    // Filter by tab
    if (tab !== "all") {
      filtered = filtered.filter((order) => order.status.toLowerCase() === tab)
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status.toLowerCase() === statusFilter)
    }

    // Sort orders
    switch (sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "amount-high":
        filtered.sort((a, b) => b.total - a.total)
        break
      case "amount-low":
        filtered.sort((a, b) => a.total - b.total)
        break
      default:
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
    }

    return filtered
  }

  const getTabOrders = (tab: string) => {
    switch (tab) {
      case "delivered":
        return allOrders.filter((order) => order.status.toLowerCase() === "delivered")
      case "active":
        return allOrders.filter((order) => ["processing", "in transit", "shipped"].includes(order.status.toLowerCase()))
      case "cancelled":
        return allOrders.filter((order) => ["cancelled", "returned"].includes(order.status.toLowerCase()))
      default:
        return allOrders
    }
  }

  const tabOrders = getTabOrders(activeTab)
  const filteredOrders = filterOrders(tabOrders, activeTab)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">My Orders</h1>
              <p className="text-muted-foreground">Track and manage all your orders</p>
            </div>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders or products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="in transit">In Transit</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="amount-high">Amount: High to Low</SelectItem>
                    <SelectItem value="amount-low">Amount: Low to High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Order Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Orders ({allOrders.length})</TabsTrigger>
              <TabsTrigger value="active">
                Active ({allOrders.filter((o) => ["processing", "in transit"].includes(o.status.toLowerCase())).length})
              </TabsTrigger>
              <TabsTrigger value="delivered">
                Delivered ({allOrders.filter((o) => o.status.toLowerCase() === "delivered").length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({allOrders.filter((o) => ["cancelled", "returned"].includes(o.status.toLowerCase())).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Orders Found</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery || statusFilter !== "all"
                        ? "No orders match your current filters."
                        : "You haven't placed any orders yet."}
                    </p>
                    {!searchQuery && statusFilter === "all" && (
                      <Link href="/shop">
                        <Button>Start Shopping</Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-foreground">Order #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                            <p className="text-lg font-bold text-foreground mt-1">₹{order.total.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Status Info */}
                        <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                          {order.status === "Delivered" && order.deliveryDate && (
                            <p className="text-sm text-green-600">Delivered on {order.deliveryDate}</p>
                          )}
                          {order.status === "In Transit" && order.estimatedDelivery && (
                            <p className="text-sm text-blue-600">Estimated delivery: {order.estimatedDelivery}</p>
                          )}
                          {order.status === "Processing" && order.estimatedDelivery && (
                            <p className="text-sm text-yellow-600">Expected to ship soon</p>
                          )}
                          {order.status === "Cancelled" && order.cancelledDate && (
                            <p className="text-sm text-red-600">Cancelled on {order.cancelledDate}</p>
                          )}
                          {order.status === "Returned" && order.returnDate && (
                            <p className="text-sm text-purple-600">Returned on {order.returnDate}</p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <Link href={`/track-order/${order.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                          {order.status === "Delivered" && (
                            <>
                              <Button size="sm" variant="outline">
                                <Star className="h-4 w-4 mr-2" />
                                Write Review
                              </Button>
                              <Button size="sm" variant="outline">
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Return/Exchange
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Invoice
                          </Button>
                          {(order.status === "In Transit" || order.status === "Processing") && (
                            <Button size="sm" variant="outline">
                              Track Package
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
