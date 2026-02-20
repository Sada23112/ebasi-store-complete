"use client"

import type React from "react"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Building2, Package, TrendingUp, Users, CheckCircle, Star, Mail, Phone } from "lucide-react"

export default function WholesalePage() {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    businessType: "",
    location: "",
    expectedVolume: "",
    productInterest: "",
    message: "",
  })

  const pricingTiers = [
    {
      tier: "Starter",
      minOrder: "₹25,000",
      discount: "15-20%",
      features: ["Bulk pricing", "Priority support", "Flexible payment terms"],
      badge: "Most Popular",
    },
    {
      tier: "Growth",
      minOrder: "₹50,000",
      discount: "20-25%",
      features: ["Higher discounts", "Custom packaging", "Dedicated account manager", "Seasonal catalogs"],
      badge: "",
    },
    {
      tier: "Enterprise",
      minOrder: "₹1,00,000+",
      discount: "25-35%",
      features: ["Maximum discounts", "Custom designs", "Priority manufacturing", "Marketing support"],
      badge: "Best Value",
    },
  ]

  const benefits = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Competitive Pricing",
      description: "Get up to 35% discount on bulk orders with transparent pricing structure",
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Quality Assurance",
      description: "Every product goes through rigorous quality checks before dispatch",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Dedicated Support",
      description: "Personal account manager for all your wholesale needs",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Flexible Terms",
      description: "Customizable payment terms and delivery schedules",
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      business: "Kumar Fashion House",
      location: "Mumbai",
      review:
        "EBASI STORE has been our trusted partner for 3 years. Their quality and service are unmatched in the industry.",
      rating: 5,
    },
    {
      name: "Priya Textiles",
      business: "Priya Textiles Pvt Ltd",
      location: "Delhi",
      review:
        "Excellent wholesale experience. The bulk discounts and quality products have helped grow our business significantly.",
      rating: 5,
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Wholesale inquiry submitted:", formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold mb-4">Wholesale Partnership</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our wholesale program and grow your business with premium traditional and contemporary fashion
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Pricing Tiers */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Wholesale Pricing Tiers</CardTitle>
                  <p className="text-muted-foreground">Choose the tier that best fits your business needs</p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {pricingTiers.map((tier, index) => (
                      <div key={index} className="relative border border-border rounded-lg p-6">
                        {tier.badge && <Badge className="absolute -top-2 left-4 bg-primary">{tier.badge}</Badge>}
                        <h3 className="text-xl font-semibold mb-2">{tier.tier}</h3>
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground">Minimum Order</p>
                          <p className="text-2xl font-bold text-primary">{tier.minOrder}</p>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground">Discount Range</p>
                          <p className="text-lg font-semibold">{tier.discount}</p>
                        </div>
                        <ul className="space-y-2">
                          {tier.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Get Started Today</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">wholesale@ebasistore.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-sm text-muted-foreground">Mon-Sat: 9AM-6PM IST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonials */}
              <Card>
                <CardHeader>
                  <CardTitle>What Partners Say</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="border-b border-border pb-4 last:border-b-0">
                      <div className="flex mb-2">{renderStars(testimonial.rating)}</div>
                      <p className="text-sm text-muted-foreground mb-2">"{testimonial.review}"</p>
                      <div>
                        <p className="font-medium text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.business}, {testimonial.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle>Wholesale Partnership Application</CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below and our team will contact you within 24 hours
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      placeholder="Your business name"
                      value={formData.businessName}
                      onChange={(e) => handleChange("businessName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Person *</Label>
                    <Input
                      id="contactName"
                      placeholder="Your full name"
                      value={formData.contactName}
                      onChange={(e) => handleChange("contactName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="business@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) => handleChange("businessType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retailer">Retailer</SelectItem>
                        <SelectItem value="distributor">Distributor</SelectItem>
                        <SelectItem value="online-store">Online Store</SelectItem>
                        <SelectItem value="boutique">Boutique</SelectItem>
                        <SelectItem value="export">Export Business</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Business Location *</Label>
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expectedVolume">Expected Monthly Volume *</Label>
                    <Select
                      value={formData.expectedVolume}
                      onValueChange={(value) => handleChange("expectedVolume", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select volume range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25k-50k">₹25,000 - ₹50,000</SelectItem>
                        <SelectItem value="50k-100k">₹50,000 - ₹1,00,000</SelectItem>
                        <SelectItem value="100k-250k">₹1,00,000 - ₹2,50,000</SelectItem>
                        <SelectItem value="250k-500k">₹2,50,000 - ₹5,00,000</SelectItem>
                        <SelectItem value="500k+">₹5,00,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productInterest">Product Interest *</Label>
                    <Select
                      value={formData.productInterest}
                      onValueChange={(value) => handleChange("productInterest", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarees">Sarees</SelectItem>
                        <SelectItem value="kurtis">Kurtis & Tops</SelectItem>
                        <SelectItem value="lehengas">Lehengas</SelectItem>
                        <SelectItem value="traditional">Traditional Wear</SelectItem>
                        <SelectItem value="contemporary">Contemporary Fashion</SelectItem>
                        <SelectItem value="all">All Categories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Additional Information</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your business, specific requirements, or any questions you have..."
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={4}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full md:w-auto">
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
