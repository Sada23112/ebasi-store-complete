"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  Clock,
  Search,
  Eye,
  Trash2,
  Mail,
  Smartphone,
  Calendar,
  TrendingUp,
  Package,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

const waitlistItems = [
  {
    id: 1,
    name: "Designer Kurti Set",
    price: 1599,
    image: "/designer-kurti-set.jpg",
    category: "Kurtis",
    joinedDate: "2024-01-08",
    expectedRestock: "2024-02-15",
    status: "waiting",
    position: 23,
    totalWaiting: 156,
    notificationMethods: ["email"],
  },
  {
    id: 2,
    name: "Embroidered Saree",
    price: 3299,
    image: "/embroidered-saree.jpg",
    category: "Sarees",
    joinedDate: "2024-01-12",
    expectedRestock: "2024-01-25",
    status: "available",
    position: 1,
    totalWaiting: 89,
    notificationMethods: ["email", "sms"],
    availableDate: "2024-01-20",
  },
  {
    id: 3,
    name: "Festive Lehenga",
    price: 5999,
    image: "/festive-lehenga.jpg",
    category: "Lehengas",
    joinedDate: "2024-01-05",
    expectedRestock: "2024-03-01",
    status: "delayed",
    position: 8,
    totalWaiting: 234,
    notificationMethods: ["email"],
    originalExpected: "2024-02-15",
  },
]

const waitlistStats = {
  totalItems: 3,
  availableNow: 1,
  waitingItems: 1,
  delayedItems: 1,
  avgWaitTime: "18 days",
  successRate: 87,
}

export default function WaitlistPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredItems = waitlistItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesCategory = categoryFilter === "all" || item.category.toLowerCase() === categoryFilter.toLowerCase()
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "default"
      case "waiting":
        return "secondary"
      case "delayed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-4 h-4" />
      case "waiting":
        return <Clock className="w-4 h-4" />
      case "delayed":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Waitlists</h1>
          <p className="text-muted-foreground">
            Track items you're waiting for and get notified when they're available
          </p>
        </div>

        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="items">Waitlist Items ({waitlistItems.length})</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Total Items</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{waitlistStats.totalItems}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Available Now</span>
                  </div>
                  <p className="text-2xl font-bold mt-1 text-green-600">{waitlistStats.availableNow}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Still Waiting</span>
                  </div>
                  <p className="text-2xl font-bold mt-1 text-blue-600">{waitlistStats.waitingItems}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{waitlistStats.successRate}%</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search waitlist items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available Now</SelectItem>
                  <SelectItem value="waiting">Still Waiting</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sarees">Sarees</SelectItem>
                  <SelectItem value="kurtis">Kurtis</SelectItem>
                  <SelectItem value="lehengas">Lehengas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Waitlist Items */}
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="w-full lg:w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-primary" />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div>
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            <p className="text-muted-foreground">₹{item.price.toLocaleString()}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline">{item.category}</Badge>
                              <Badge variant={getStatusColor(item.status)} className="flex items-center space-x-1">
                                {getStatusIcon(item.status)}
                                <span className="capitalize">{item.status}</span>
                              </Badge>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Position in queue</p>
                            <p className="text-2xl font-bold">#{item.position}</p>
                            <p className="text-xs text-muted-foreground">of {item.totalWaiting} waiting</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Joined Waitlist</p>
                            <p className="font-medium">{item.joinedDate}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              {item.status === "available"
                                ? "Available Since"
                                : item.status === "delayed"
                                  ? "New Expected Date"
                                  : "Expected Restock"}
                            </p>
                            <p className="font-medium">
                              {item.status === "available" ? item.availableDate : item.expectedRestock}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Notifications</p>
                            <div className="flex items-center space-x-2 mt-1">
                              {item.notificationMethods.includes("email") && <Mail className="w-4 h-4 text-blue-500" />}
                              {item.notificationMethods.includes("sms") && (
                                <Smartphone className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        </div>

                        {item.status === "available" && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-800">Item is now available!</span>
                              </div>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        )}

                        {item.status === "delayed" && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                              <AlertCircle className="w-5 h-5 text-orange-600" />
                              <div>
                                <span className="font-medium text-orange-800">Restock Delayed</span>
                                <p className="text-sm text-orange-700">
                                  Originally expected {item.originalExpected}, now expected {item.expectedRestock}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-2 border-t">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {item.joinedDate}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No waitlist items found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Items you join waitlists for will appear here
                  </p>
                  <Button>
                    <Package className="w-4 h-4 mr-2" />
                    Browse Products
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <span>Waitlist Notifications</span>
                </CardTitle>
                <CardDescription>Manage how you receive waitlist updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">Back in Stock Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when waitlisted items are available</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <Smartphone className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">Position Updates</Label>
                      <p className="text-sm text-muted-foreground">Updates when your position in queue changes</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="font-medium">Restock Delays</Label>
                      <p className="text-sm text-muted-foreground">Notifications about delayed restocks</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <Smartphone className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Waitlist Performance</CardTitle>
                  <CardDescription>Your waitlist success statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-bold text-green-600">{waitlistStats.successRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Average Wait Time</span>
                    <span className="font-medium">{waitlistStats.avgWaitTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Items Purchased</span>
                    <span className="font-medium">7 of 8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Saved</span>
                    <span className="font-medium">₹2,450</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Waitlist items by category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sarees</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-muted rounded-full">
                        <div className="w-8 h-2 bg-primary rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">1</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Kurtis</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-muted rounded-full">
                        <div className="w-8 h-2 bg-primary rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">1</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Lehengas</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-muted rounded-full">
                        <div className="w-8 h-2 bg-primary rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">1</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
