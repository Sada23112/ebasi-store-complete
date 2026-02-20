"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ProductManagement } from "@/components/product-management"
import { UserManagement } from "@/components/user-management"
import { OrderManagement } from "@/components/order-management"
import { ShoppingBag, Users, DollarSign, TrendingUp } from "lucide-react"

const salesData = [
  { month: "Jan", sales: 45000, orders: 120 },
  { month: "Feb", sales: 52000, orders: 140 },
  { month: "Mar", sales: 48000, orders: 130 },
  { month: "Apr", sales: 61000, orders: 165 },
  { month: "May", sales: 55000, orders: 150 },
  { month: "Jun", sales: 67000, orders: 180 },
]

const categoryData = [
  { name: "Sarees", value: 35, color: "#e91e63" },
  { name: "Kurtis", value: 25, color: "#f8bbd9" },
  { name: "Lehengas", value: 20, color: "#fce4ec" },
  { name: "Accessories", value: 20, color: "#880e4f" },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_orders: 0,
    total_users: 0,
    conversion_rate: 0,
    recent_activity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { api } = await import("@/lib/api")
      const token = api.getToken()

      if (!token) {
        window.location.href = "/admin/login"
        return
      }

      try {
        const data = await api.getAdminDashboardStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch admin stats:", error)
        // If 401/403, might want to redirect to login
      } finally {
        setLoading(false)
      }
    }

    if (activeTab === "overview") {
      checkAuth()
    }
  }, [activeTab])

  const handleLogout = async () => {
    const { api } = await import("@/lib/api")
    api.logout()
    window.location.href = "/admin/login"
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your EBASI STORE operations</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md text-sm font-medium"
          >
            Logout
          </button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="contacts">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.total_revenue?.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Lifetime revenue
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_orders?.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Lifetime orders
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_users?.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered accounts
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.conversion_rate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Orders / Users
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest orders and user activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recent_activity && stats.recent_activity.length > 0 ? (
                    stats.recent_activity.map((activity: any, index: number) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{new Date(activity.time).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <div className="p-4 border rounded-md">
              <h3 className="text-lg font-medium mb-4">Contact Messages (Coming Soon)</h3>
              <p>Features to view and reply to contact messages will be here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
