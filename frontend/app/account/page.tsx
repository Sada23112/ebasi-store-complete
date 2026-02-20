"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Package, MapPin, CreditCard, Bell, Shield, LogOut, Edit, Eye, Star, Calendar } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import { getAbsoluteImageUrl } from "@/lib/utils"

export default function AccountPage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await api.getOrders()
        // Ensure we handle various response formats (list or paginated)
        const orderList = Array.isArray(data) ? data : (data.results || [])
        setOrders(orderList)
      } catch (error) {
        console.error("Failed to fetch orders", error)
      } finally {
        setLoadingOrders(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user])

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_transit":
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 flex flex-col items-center justify-center">
          <p className="mb-4">Please log in to view your account.</p>
          <Button onClick={() => window.location.href = '/login'}>Login</Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image src={user.avatar || "/placeholder.svg"} alt={user.firstName} fill className="object-cover" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground">{user.firstName} {user.lastName}</h1>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">{user.email}</p>
                  <Badge className="bg-yellow-100 text-yellow-800">Member</Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" className="bg-transparent" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Account Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8 h-auto gap-2">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>

              <TabsTrigger value="addresses" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Addresses</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>

            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold text-foreground">{orders.length}</div>
                    <div className="text-sm text-muted-foreground">Total Orders</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Heart className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold text-foreground">0</div>
                    <div className="text-sm text-muted-foreground">Wishlist Items</div>
                  </CardContent>
                </Card>
                {/* ... other stats ... */}
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.length > 0 ? orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium text-foreground">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end">
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          <p className="text-sm font-medium mt-0 sm:mt-1">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-muted-foreground text-center py-4">No recent orders found.</p>
                    )}
                  </div>
                  {orders.length > 0 && (
                    <div className="text-center mt-4">
                      <Button variant="outline" onClick={() => setActiveTab("orders")}>
                        View All Orders
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.length > 0 ? orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-foreground">Order #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                            <p className="text-lg font-bold text-foreground mt-1">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          {order.items && order.items.map((item: any, index: number) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                                <Image
                                  src={getAbsoluteImageUrl(item.product?.image || null)}
                                  alt={item.product_name || "Product"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{item.product_name}</p>
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No orders yet</h3>
                        <p className="text-muted-foreground mb-4">Start shopping to see your orders here.</p>
                        <Button onClick={() => window.location.href = '/shop'}>Start Shopping</Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>



            <TabsContent value="addresses">
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No saved addresses</h3>
              </div>
            </TabsContent>

            <TabsContent value="payments">
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No saved payment methods</h3>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">First Name</label>
                        <p className="text-muted-foreground">{user.firstName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Last Name</label>
                        <p className="text-muted-foreground">{user.lastName}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>


          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
