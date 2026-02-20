"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  Search,
  Star,
  LucideCaptions as Directions,
  Calendar,
  Users,
  Car,
  Wifi,
  CreditCard,
  ShoppingBag,
  Coffee,
} from "lucide-react"

const stores = [
  {
    id: 1,
    name: "EBASI STORE - Phoenix Mall",
    address: "Phoenix Marketcity, Kurla West, Mumbai, Maharashtra 400070",
    phone: "+91 22 6671 7000",
    coordinates: { lat: 19.0822, lng: 72.8811 },
    hours: {
      monday: "10:00 AM - 10:00 PM",
      tuesday: "10:00 AM - 10:00 PM",
      wednesday: "10:00 AM - 10:00 PM",
      thursday: "10:00 AM - 10:00 PM",
      friday: "10:00 AM - 11:00 PM",
      saturday: "10:00 AM - 11:00 PM",
      sunday: "10:00 AM - 10:00 PM",
    },
    services: ["Personal Styling", "Alterations", "Gift Wrapping", "Home Delivery"],
    amenities: ["Parking", "WiFi", "Card Payment", "Cafe", "Kids Area"],
    rating: 4.8,
    reviews: 324,
    distance: "2.3 km",
    image: "/store-phoenix.jpg",
    manager: "Priya Sharma",
    specialties: ["Bridal Collection", "Designer Sarees", "Festive Wear"],
  },
  {
    id: 2,
    name: "EBASI STORE - Select City Walk",
    address: "Select City Walk, Saket, New Delhi, Delhi 110017",
    phone: "+91 11 4055 9000",
    coordinates: { lat: 28.5245, lng: 77.2066 },
    hours: {
      monday: "11:00 AM - 9:00 PM",
      tuesday: "11:00 AM - 9:00 PM",
      wednesday: "11:00 AM - 9:00 PM",
      thursday: "11:00 AM - 9:00 PM",
      friday: "11:00 AM - 10:00 PM",
      saturday: "11:00 AM - 10:00 PM",
      sunday: "11:00 AM - 9:00 PM",
    },
    services: ["Personal Styling", "Alterations", "Gift Wrapping", "Express Delivery"],
    amenities: ["Valet Parking", "WiFi", "Card Payment", "Lounge"],
    rating: 4.7,
    reviews: 256,
    distance: "5.1 km",
    image: "/store-delhi.jpg",
    manager: "Anjali Gupta",
    specialties: ["Contemporary Fashion", "Indo-Western", "Casual Wear"],
  },
  {
    id: 3,
    name: "EBASI STORE - Forum Mall",
    address: "Forum Mall, Hosur Road, Koramangala, Bengaluru, Karnataka 560095",
    phone: "+91 80 4112 9000",
    coordinates: { lat: 12.9352, lng: 77.6245 },
    hours: {
      monday: "10:30 AM - 9:30 PM",
      tuesday: "10:30 AM - 9:30 PM",
      wednesday: "10:30 AM - 9:30 PM",
      thursday: "10:30 AM - 9:30 PM",
      friday: "10:30 AM - 10:00 PM",
      saturday: "10:30 AM - 10:00 PM",
      sunday: "10:30 AM - 9:30 PM",
    },
    services: ["Personal Styling", "Alterations", "Gift Wrapping", "Virtual Consultation"],
    amenities: ["Parking", "WiFi", "Card Payment", "Food Court"],
    rating: 4.9,
    reviews: 189,
    distance: "8.7 km",
    image: "/store-bangalore.jpg",
    manager: "Kavya Reddy",
    specialties: ["Tech-Friendly Fashion", "Work Wear", "Smart Casuals"],
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

export default function StoresPage() {
  const [selectedStore, setSelectedStore] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState("all")

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterBy === "all" || store.services.some((service) => service.toLowerCase().includes(filterBy.toLowerCase()))
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Store Locator</h1>
          <p className="text-muted-foreground">Find EBASI STORE locations near you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search and Filters */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-primary" />
                  <span>Find Stores</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="search" className="text-sm font-medium">
                    Search by location or store name
                  </Label>
                  <Input
                    id="search"
                    placeholder="Enter city, area, or store name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="filter" className="text-sm font-medium">
                    Filter by services
                  </Label>
                  <select
                    id="filter"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="w-full mt-2 border rounded px-3 py-2 text-sm"
                  >
                    <option value="all">All Services</option>
                    <option value="personal styling">Personal Styling</option>
                    <option value="alterations">Alterations</option>
                    <option value="gift wrapping">Gift Wrapping</option>
                    <option value="home delivery">Home Delivery</option>
                  </select>
                </div>
                <Button className="w-full">
                  <Navigation className="w-4 h-4 mr-2" />
                  Use My Location
                </Button>
              </CardContent>
            </Card>

            {/* Store List */}
            <div className="space-y-4">
              {filteredStores.map((store) => (
                <Card
                  key={store.id}
                  className={`cursor-pointer transition-all ${
                    selectedStore === store.id ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedStore(store.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sm">{store.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {store.distance}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{store.address}</p>
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{store.rating}</span>
                        <span className="text-xs text-muted-foreground">({store.reviews})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Open until 10 PM</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {store.services.slice(0, 2).map((service) => (
                        <Badge key={service} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {store.services.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{store.services.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Map and Store Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interactive Map Placeholder */}
            <Card>
              <CardContent className="p-0">
                <div className="h-96 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Interactive Store Map</h3>
                    <p className="text-muted-foreground">
                      {selectedStore
                        ? `Showing ${stores.find((s) => s.id === selectedStore)?.name}`
                        : "Select a store to view on map"}
                    </p>
                  </div>
                  {/* Map markers */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="absolute bottom-8 right-8">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center ring-4 ring-primary/20">
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Store Details */}
            {selectedStore && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{stores.find((s) => s.id === selectedStore)?.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-2 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{stores.find((s) => s.id === selectedStore)?.address}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{stores.find((s) => s.id === selectedStore)?.rating}</span>
                      <span className="text-muted-foreground">
                        ({stores.find((s) => s.id === selectedStore)?.reviews})
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="details" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="hours">Hours</TabsTrigger>
                      <TabsTrigger value="services">Services</TabsTrigger>
                      <TabsTrigger value="contact">Contact</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Store Manager</h4>
                        <p className="text-sm text-muted-foreground">
                          {stores.find((s) => s.id === selectedStore)?.manager}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {stores
                            .find((s) => s.id === selectedStore)
                            ?.specialties.map((specialty) => (
                              <Badge key={specialty} variant="outline">
                                {specialty}
                              </Badge>
                            ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Amenities</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {stores
                            .find((s) => s.id === selectedStore)
                            ?.amenities.map((amenity) => {
                              const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons] || ShoppingBag
                              return (
                                <div key={amenity} className="flex items-center space-x-2 text-sm">
                                  <IconComponent className="w-4 h-4 text-primary" />
                                  <span>{amenity}</span>
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="hours" className="space-y-3">
                      {Object.entries(stores.find((s) => s.id === selectedStore)?.hours || {}).map(([day, hours]) => (
                        <div key={day} className="flex justify-between items-center py-2 border-b">
                          <span className="font-medium capitalize">{day}</span>
                          <span className="text-sm text-muted-foreground">{hours}</span>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="services" className="space-y-3">
                      {stores
                        .find((s) => s.id === selectedStore)
                        ?.services.map((service) => (
                          <div key={service} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <ShoppingBag className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{service}</p>
                              <p className="text-xs text-muted-foreground">Available at this location</p>
                            </div>
                          </div>
                        ))}
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>Call Store</span>
                        </Button>
                        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                          <Directions className="w-4 h-4" />
                          <span>Get Directions</span>
                        </Button>
                        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                          <Calendar className="w-4 h-4" />
                          <span>Book Appointment</span>
                        </Button>
                        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                          <Users className="w-4 h-4" />
                          <span>Virtual Consultation</span>
                        </Button>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm">
                          <strong>Phone:</strong> {stores.find((s) => s.id === selectedStore)?.phone}
                        </p>
                        <p className="text-sm mt-1">
                          <strong>Distance:</strong> {stores.find((s) => s.id === selectedStore)?.distance} from your
                          location
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
