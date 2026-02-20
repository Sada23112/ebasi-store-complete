"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Download, Activity } from "lucide-react"

const salesData = [
  { month: "Jan", revenue: 450000, orders: 120, customers: 89 },
  { month: "Feb", revenue: 520000, orders: 140, customers: 102 },
  { month: "Mar", revenue: 480000, orders: 130, customers: 95 },
  { month: "Apr", revenue: 610000, orders: 165, customers: 118 },
  { month: "May", revenue: 550000, orders: 150, customers: 108 },
  { month: "Jun", revenue: 670000, orders: 180, customers: 135 },
]

const customerSegments = [
  { name: "VIP Customers", value: 25, color: "#0891b2", revenue: 1250000 },
  { name: "Regular Customers", value: 45, color: "#f59e0b", revenue: 890000 },
  { name: "New Customers", value: 30, color: "#6b7280", revenue: 450000 },
]

const productPerformance = [
  { category: "Sarees", sales: 450, revenue: 1350000, margin: 45 },
  { category: "Kurtis", sales: 320, revenue: 512000, margin: 38 },
  { category: "Lehengas", sales: 180, revenue: 900000, margin: 52 },
  { category: "Accessories", sales: 280, revenue: 168000, margin: 35 },
]

const conversionFunnel = [
  { stage: "Visitors", count: 12500, percentage: 100 },
  { stage: "Product Views", count: 8750, percentage: 70 },
  { stage: "Add to Cart", count: 2500, percentage: 20 },
  { stage: "Checkout", count: 1250, percentage: 10 },
  { stage: "Purchase", count: 875, percentage: 7 },
]

export function AdvancedAnalytics() {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("6months")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Advanced Analytics</h2>
          <p className="text-muted-foreground">Comprehensive business insights and reporting</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹32.8L</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% from last period
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹3,742</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.2% from last period
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Lifetime Value</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹18,450</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15.3% from last period
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7.2%</div>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -0.5% from last period
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${(value as number).toLocaleString()}`, "Revenue"]} />
                    <Area type="monotone" dataKey="revenue" stroke="#0891b2" fill="#0891b2" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>Revenue by customer type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>Revenue, orders, and customer trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#0891b2" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Monthly Growth Rate</span>
                  <Badge variant="default">+12.5%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Best Performing Month</span>
                  <Badge variant="secondary">June</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Average Monthly Revenue</span>
                  <span className="font-medium">₹5.47L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Orders (6 months)</span>
                  <span className="font-medium">885</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Revenue per Order</span>
                  <span className="font-medium">₹3,742</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Acquisition</CardTitle>
                <CardDescription>New vs returning customers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="customers" fill="#0891b2" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
                <CardDescription>Detailed customer analytics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {customerSegments.map((segment) => (
                  <div key={segment.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{segment.name}</span>
                      <span className="text-sm text-muted-foreground">{segment.value}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${segment.value}%`,
                          backgroundColor: segment.color,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Revenue: ₹{(segment.revenue / 100000).toFixed(1)}L</span>
                      <span>Avg Order: ₹{Math.round(segment.revenue / (segment.value * 10))}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Sales and profitability by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4 font-medium">Category</th>
                      <th className="text-left p-4 font-medium">Units Sold</th>
                      <th className="text-left p-4 font-medium">Revenue</th>
                      <th className="text-left p-4 font-medium">Margin %</th>
                      <th className="text-left p-4 font-medium">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productPerformance.map((product) => (
                      <tr key={product.category} className="border-b">
                        <td className="p-4 font-medium">{product.category}</td>
                        <td className="p-4">{product.sales}</td>
                        <td className="p-4">₹{(product.revenue / 100000).toFixed(1)}L</td>
                        <td className="p-4">{product.margin}%</td>
                        <td className="p-4">
                          <div className="w-24 h-2 bg-muted rounded-full">
                            <div
                              className="h-2 bg-primary rounded-full"
                              style={{ width: `${(product.sales / 450) * 100}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Customer journey from visit to purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnel.map((stage, index) => (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{stage.stage}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{stage.count.toLocaleString()}</span>
                        <Badge variant="outline">{stage.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full">
                      <div
                        className="h-3 bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${stage.percentage}%` }}
                      ></div>
                    </div>
                    {index < conversionFunnel.length - 1 && (
                      <div className="text-xs text-muted-foreground text-center">
                        ↓ {Math.round((conversionFunnel[index + 1].count / stage.count) * 100)}% conversion
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
