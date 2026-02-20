"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  Star,
  Search,
  Download,
  Car,
  Wifi,
  CreditCard,
  Coffee,
} from "lucide-react"

const stores = [
  {
    id: 1,
    name: "EBASI STORE - Phoenix Mall",
    address: "Phoenix Marketcity, Kurla West, Mumbai, Maharashtra 400070",
    phone: "+91 22 6671 7000",
    coordinates: { lat: 19.0822, lng: 72.8811 },
    manager: "Priya Sharma",
    status: "active",
    revenue: 2450000,
    customers: 1250,
    rating: 4.8,
    reviews: 324,
    services: ["Personal Styling", "Alterations", "Gift Wrapping", "Home Delivery"],
    amenities: ["Parking", "WiFi", "Card Payment", "Cafe", "Kids Area"],
    specialties: ["Bridal Collection", "Designer Sarees", "Festive Wear"],
    openingDate: "2020-03-15",
    area: 2500,
    employees: 15,
  },
  {
    id: 2,
    name: "EBASI STORE - Select City Walk",
    address: "Select City Walk, Saket, New Delhi, Delhi 110017",
    phone: "+91 11 4055 9000",
    coordinates: { lat: 28.5245, lng: 77.2066 },
    manager: "Anjali Gupta",
    status: "active",
    revenue: 1890000,
    customers: 980,
    rating: 4.7,
    reviews: 256,
    services: ["Personal Styling", "Alterations", "Gift Wrapping", "Express Delivery"],
    amenities: ["Valet Parking", "WiFi", "Card Payment", "Lounge"],
    specialties: ["Contemporary Fashion", "Indo-Western", "Casual Wear"],
    openingDate: "2021-07-20",
    area: 1800,
    employees: 12,
  },
  {
    id: 3,
    name: "EBASI STORE - Forum Mall",
    address: "Forum Mall, Hosur Road, Koramangala, Bengaluru, Karnataka 560095",
    phone: "+91 80 4112 9000",
    coordinates: { lat: 12.9352, lng: 77.6245 },
    manager: "Kavya Reddy",
    status: "active",
    revenue: 2100000,
    customers: 1100,
    rating: 4.9,
    reviews: 189,
    services: ["Personal Styling", "Alterations", "Gift Wrapping", "Virtual Consultation"],
    amenities: ["Parking", "WiFi", "Card Payment", "Food Court"],
    specialties: ["Tech-Friendly Fashion", "Work Wear", "Smart Casuals"],
    openingDate: "2019-11-10",
    area: 2200,
    employees: 14,
  },
]

const amenityIcons = {
  Parking: Car,
  WiFi: Wifi,
  "Card Payment": CreditCard,
  Cafe: Coffee,
  "Kids Area": Users,
  "Valet Parking": Car,
  Lounge: Users,
  "Food Court": Coffee,
}

export default function StoreAdminPage() {
  const [selectedStore, setSelectedStore] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingStore, setEditingStore] = useState<number | null>(null)

  const [newStore, setNewStore] = useState({
    name: "",
    address: "",
    phone: "",
    manager: "",
    coordinates: { lat: 0, lng: 0 },
    services: [] as string[],
    amenities: [] as string[],
    specialties: [] as string[],
    area: 0,
    employees: 0,
  })

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.manager.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || store.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalRevenue = stores.reduce((sum, store) => sum + store.revenue, 0)
  const totalCustomers = stores.reduce((sum, store) => sum + store.customers, 0)
  const averageRating = stores.reduce((sum, store) => sum + store.rating, 0) / stores.length

  const handleAddStore = () => {
    // Add store logic here
    console.log("Adding store:", newStore)
    setShowAddForm(false)
    setNewStore({
      name: "",
      address: "",
      phone: "",
      manager: "",
      coordinates: { lat: 0, lng: 0 },
      services: [],
      amenities: [],
      specialties: [],
      area: 0,
      employees: 0,
    })
  }

  const handleEditStore = (storeId: number) => {
    setEditingStore(storeId)
    // Load store data for editing
  }

  const handleDeleteStore = (storeId: number) => {
    // Delete store logic here
    console.log("Deleting store:", storeId)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Store Management</h1>
              <p className="text-muted-foreground">Manage EBASI STORE locations and operations</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Store
              </Button>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Stores</p>
                    <p className="text-2xl font-bold">{stores.length}</p>
                  </div>
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">₹{(totalRevenue / 1000000).toFixed(1)}M</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Customers</p>
                    <p className="text-2xl font-bold">{totalCustomers.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                    <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="stores" className="space-y-6">
          <TabsList>
            <TabsTrigger value="stores">Store List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="stores" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search stores, managers, or locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stores</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Store List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredStores.map((store) => (
                <Card key={store.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{store.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {store.address.split(",")[0]}
                        </CardDescription>
                      </div>
                      <Badge variant={store.status === "active" ? "default" : "secondary"}>{store.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Manager</p>
                        <p className="font-medium">{store.manager}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Revenue</p>
                        <p className="font-medium">₹{(store.revenue / 100000).toFixed(1)}L</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Customers</p>
                        <p className="font-medium">{store.customers}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rating</p>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="font-medium">{store.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Services</p>
                      <div className="flex flex-wrap gap-1">
                        {store.services.slice(0, 3).map((service) => (
                          <Badge key={service} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {store.services.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{store.services.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditStore(store.id)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setSelectedStore(store.id)}>
                          View Details
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStore(store.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Store</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stores.map((store) => (
                      <div key={store.id} className="flex justify-between items-center">
                        <span className="text-sm">{store.name.split(" - ")[1]}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(store.revenue / Math.max(...stores.map((s) => s.revenue))) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">₹{(store.revenue / 100000).toFixed(1)}L</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stores.map((store) => (
                      <div key={store.id} className="flex justify-between items-center">
                        <span className="text-sm">{store.name.split(" - ")[1]}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${(store.customers / Math.max(...stores.map((s) => s.customers))) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">{store.customers}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Locator Settings</CardTitle>
                <CardDescription>Configure global settings for the store locator</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="default-radius">Default Search Radius (km)</Label>
                    <Input id="default-radius" type="number" defaultValue="25" />
                  </div>
                  <div>
                    <Label htmlFor="max-results">Maximum Results</Label>
                    <Input id="max-results" type="number" defaultValue="10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Available Services</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Personal Styling",
                      "Alterations",
                      "Gift Wrapping",
                      "Home Delivery",
                      "Express Delivery",
                      "Virtual Consultation",
                    ].map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox id={service} defaultChecked />
                        <Label htmlFor={service} className="text-sm">
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Store Modal/Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Add New Store</CardTitle>
                <CardDescription>Create a new EBASI STORE location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="store-name">Store Name *</Label>
                    <Input
                      id="store-name"
                      value={newStore.name}
                      onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                      placeholder="EBASI STORE - Location Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manager">Store Manager *</Label>
                    <Input
                      id="manager"
                      value={newStore.manager}
                      onChange={(e) => setNewStore({ ...newStore, manager: e.target.value })}
                      placeholder="Manager Name"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={newStore.address}
                    onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                    placeholder="Complete store address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={newStore.phone}
                      onChange={(e) => setNewStore({ ...newStore, phone: e.target.value })}
                      placeholder="+91 XX XXXX XXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Store Area (sq ft)</Label>
                    <Input
                      id="area"
                      type="number"
                      value={newStore.area}
                      onChange={(e) => setNewStore({ ...newStore, area: Number.parseInt(e.target.value) })}
                      placeholder="2500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStore}>Add Store</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
