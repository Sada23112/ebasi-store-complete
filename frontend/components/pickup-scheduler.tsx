"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MapPin, Clock, CalendarIcon, Phone, Package, CheckCircle, AlertCircle, Car, Truck } from "lucide-react"
import { format } from "date-fns"

interface PickupRequest {
  id: string
  customerName: string
  phone: string
  email: string
  address: string
  preferredDate: Date
  timeSlot: string
  items: string[]
  specialInstructions: string
  status: "pending" | "confirmed" | "in-transit" | "completed" | "cancelled"
  storeLocation: string
  pickupType: "return" | "exchange" | "repair"
}

const timeSlots = [
  "9:00 AM - 11:00 AM",
  "11:00 AM - 1:00 PM",
  "1:00 PM - 3:00 PM",
  "3:00 PM - 5:00 PM",
  "5:00 PM - 7:00 PM",
]

const stores = [
  { id: "phoenix", name: "Phoenix Mall, Mumbai" },
  { id: "select-city", name: "Select City Walk, Delhi" },
  { id: "forum", name: "Forum Mall, Bangalore" },
]

export default function PickupScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    timeSlot: "",
    items: "",
    specialInstructions: "",
    storeLocation: "",
    pickupType: "return" as "return" | "exchange" | "repair",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle pickup scheduling logic
    console.log("Pickup scheduled:", { ...formData, preferredDate: selectedDate })
    setIsSubmitted(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Pickup Scheduled Successfully!</h2>
          <p className="text-muted-foreground mb-6">
            Your pickup has been scheduled for {selectedDate && format(selectedDate, "PPP")} during {formData.timeSlot}.
            You'll receive a confirmation email shortly.
          </p>
          <div className="bg-muted/50 p-4 rounded-lg mb-6">
            <p className="text-sm">
              <strong>Pickup ID:</strong> PU{Date.now().toString().slice(-6)}
            </p>
            <p className="text-sm">
              <strong>Estimated Pickup:</strong> {selectedDate && format(selectedDate, "PPP")} • {formData.timeSlot}
            </p>
            <p className="text-sm">
              <strong>Contact:</strong> {formData.phone}
            </p>
          </div>
          <Button onClick={() => setIsSubmitted(false)}>Schedule Another Pickup</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Schedule Pickup</h1>
        <p className="text-muted-foreground">Schedule a convenient pickup for returns, exchanges, or repairs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pickup Types */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-primary" />
                <span>Pickup Types</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.pickupType === "return" ? "border-primary bg-primary/5" : "hover:border-primary/50"
                }`}
                onClick={() => handleInputChange("pickupType", "return")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Return Items</h4>
                    <p className="text-sm text-muted-foreground">Return unwanted items</p>
                  </div>
                  <Truck className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.pickupType === "exchange" ? "border-primary bg-primary/5" : "hover:border-primary/50"
                }`}
                onClick={() => handleInputChange("pickupType", "exchange")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Exchange Items</h4>
                    <p className="text-sm text-muted-foreground">Exchange for different size/color</p>
                  </div>
                  <Car className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.pickupType === "repair" ? "border-primary bg-primary/5" : "hover:border-primary/50"
                }`}
                onClick={() => handleInputChange("pickupType", "repair")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Repair Service</h4>
                    <p className="text-sm text-muted-foreground">Alteration or repair service</p>
                  </div>
                  <AlertCircle className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Pickup Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Free pickup within 24-48 hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Available in major cities</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>SMS & email notifications</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pickup Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Your Pickup</CardTitle>
              <CardDescription>Fill in the details to schedule your pickup</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange("customerName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Pickup Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Enter complete pickup address with landmark"
                      required
                    />
                  </div>
                </div>

                {/* Pickup Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Pickup Details</h3>
                  <div>
                    <Label htmlFor="storeLocation">Nearest Store Location *</Label>
                    <Select
                      value={formData.storeLocation}
                      onValueChange={(value) => handleInputChange("storeLocation", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select nearest store" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={store.id}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Preferred Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="timeSlot">Time Slot *</Label>
                      <Select value={formData.timeSlot} onValueChange={(value) => handleInputChange("timeSlot", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="items">Items to Pickup *</Label>
                    <Textarea
                      id="items"
                      value={formData.items}
                      onChange={(e) => handleInputChange("items", e.target.value)}
                      placeholder="List the items you want to return/exchange (e.g., Blue Silk Saree - Size M, Designer Kurti - Size L)"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialInstructions">Special Instructions</Label>
                    <Textarea
                      id="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                      placeholder="Any special instructions for pickup (e.g., call before arrival, gate code, etc.)"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline">
                    Save as Draft
                  </Button>
                  <Button type="submit">Schedule Pickup</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
