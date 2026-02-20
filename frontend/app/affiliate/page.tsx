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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Users, Gift, CheckCircle, Star, BarChart3 } from "lucide-react"

export default function AffiliatePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    socialMedia: "",
    audience: "",
    experience: "",
    promotion: "",
    message: "",
  })

  const commissionTiers = [
    {
      tier: "Starter",
      sales: "₹0 - ₹25,000",
      commission: "5%",
      features: ["Basic tracking", "Monthly payouts", "Marketing materials"],
      color: "bg-blue-50 border-blue-200",
    },
    {
      tier: "Growth",
      sales: "₹25,001 - ₹75,000",
      commission: "7%",
      features: ["Advanced analytics", "Bi-weekly payouts", "Priority support", "Custom links"],
      color: "bg-green-50 border-green-200",
    },
    {
      tier: "Pro",
      sales: "₹75,001 - ₹1,50,000",
      commission: "10%",
      features: ["Real-time tracking", "Weekly payouts", "Dedicated manager", "Exclusive products"],
      color: "bg-purple-50 border-purple-200",
    },
    {
      tier: "Elite",
      sales: "₹1,50,000+",
      commission: "12%",
      features: ["Maximum commission", "Daily payouts", "VIP support", "Co-marketing opportunities"],
      color: "bg-amber-50 border-amber-200",
    },
  ]

  const benefits = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "High Commissions",
      description: "Earn up to 12% commission on every sale you generate",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Real-time Tracking",
      description: "Monitor your performance with detailed analytics dashboard",
    },
    {
      icon: <Gift className="h-6 w-6" />,
      title: "Marketing Support",
      description: "Access to banners, product images, and promotional content",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Dedicated Support",
      description: "Personal affiliate manager to help you succeed",
    },
  ]

  const stats = [
    { label: "Active Affiliates", value: "2,500+" },
    { label: "Total Commissions Paid", value: "₹45L+" },
    { label: "Average Monthly Earnings", value: "₹18,000" },
    { label: "Top Affiliate Earnings", value: "₹85,000/month" },
  ]

  const testimonials = [
    {
      name: "Sneha Patel",
      role: "Fashion Blogger",
      earnings: "₹35,000/month",
      review:
        "EBASI STORE's affiliate program has been a game-changer for my blog monetization. The products are high-quality and my audience loves them!",
      rating: 5,
    },
    {
      name: "Rahul Sharma",
      role: "Instagram Influencer",
      earnings: "₹28,000/month",
      review:
        "Great commission rates and excellent support team. The tracking system is transparent and payouts are always on time.",
      rating: 5,
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Affiliate application submitted:", formData)
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
      

      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold mb-4">Affiliate Program</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our affiliate program and earn commissions by promoting premium traditional and contemporary fashion
            </p>
            <div className="mt-6">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Earn up to 12% Commission
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-2">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Benefits */}
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

          <Tabs defaultValue="commission" className="mb-12">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="commission">Commission Tiers</TabsTrigger>
              <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="commission">
              <Card>
                <CardHeader>
                  <CardTitle>Commission Structure</CardTitle>
                  <p className="text-muted-foreground">
                    Your commission rate increases based on your monthly sales volume
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {commissionTiers.map((tier, index) => (
                      <div key={index} className={`border rounded-lg p-6 ${tier.color}`}>
                        <h3 className="text-xl font-semibold mb-2">{tier.tier}</h3>
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground">Monthly Sales</p>
                          <p className="font-medium">{tier.sales}</p>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground">Commission Rate</p>
                          <p className="text-2xl font-bold text-primary">{tier.commission}</p>
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
            </TabsContent>

            <TabsContent value="how-it-works">
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-primary">1</span>
                      </div>
                      <h3 className="font-semibold mb-2">Apply & Get Approved</h3>
                      <p className="text-sm text-muted-foreground">
                        Submit your application and get approved within 24-48 hours
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-primary">2</span>
                      </div>
                      <h3 className="font-semibold mb-2">Promote Products</h3>
                      <p className="text-sm text-muted-foreground">
                        Share your unique affiliate links on your website, blog, or social media
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-primary">3</span>
                      </div>
                      <h3 className="font-semibold mb-2">Earn Commissions</h3>
                      <p className="text-sm text-muted-foreground">
                        Get paid for every sale generated through your affiliate links
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle>Marketing Resources</CardTitle>
                  <p className="text-muted-foreground">
                    Everything you need to promote EBASI STORE products effectively
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4">Available Resources</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          High-quality product images
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Banner ads in multiple sizes
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Product descriptions and copy
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Social media templates
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Email marketing templates
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Seasonal promotional materials
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Best Practices</h3>
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        <li>• Create authentic content that resonates with your audience</li>
                        <li>• Use high-quality images and detailed product descriptions</li>
                        <li>• Share personal experiences and styling tips</li>
                        <li>• Engage with your audience through comments and messages</li>
                        <li>• Track your performance and optimize your strategy</li>
                        <li>• Stay updated with new product launches and promotions</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Application Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Join Our Affiliate Program</CardTitle>
                  <p className="text-muted-foreground">Fill out the application form to get started</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website/Blog URL</Label>
                        <Input
                          id="website"
                          placeholder="https://yourwebsite.com"
                          value={formData.website}
                          onChange={(e) => handleChange("website", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="socialMedia">Primary Social Media</Label>
                        <Input
                          id="socialMedia"
                          placeholder="Instagram, YouTube, etc."
                          value={formData.socialMedia}
                          onChange={(e) => handleChange("socialMedia", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="audience">Audience Size</Label>
                        <Select value={formData.audience} onValueChange={(value) => handleChange("audience", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select audience size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1k-5k">1K - 5K followers</SelectItem>
                            <SelectItem value="5k-10k">5K - 10K followers</SelectItem>
                            <SelectItem value="10k-50k">10K - 50K followers</SelectItem>
                            <SelectItem value="50k-100k">50K - 100K followers</SelectItem>
                            <SelectItem value="100k+">100K+ followers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Affiliate Marketing Experience</Label>
                      <Select value={formData.experience} onValueChange={(value) => handleChange("experience", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                          <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                          <SelectItem value="experienced">Experienced (3+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="promotion">How will you promote our products?</Label>
                      <Textarea
                        id="promotion"
                        placeholder="Describe your promotion strategy..."
                        value={formData.promotion}
                        onChange={(e) => handleChange("promotion", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Information</Label>
                      <Textarea
                        id="message"
                        placeholder="Any additional information you'd like to share..."
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Submit Application
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Success Stories */}
              <Card>
                <CardHeader>
                  <CardTitle>Success Stories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="border-b border-border pb-4 last:border-b-0">
                      <div className="flex mb-2">{renderStars(testimonial.rating)}</div>
                      <p className="text-sm text-muted-foreground mb-2">"{testimonial.review}"</p>
                      <div>
                        <p className="font-medium text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {testimonial.earnings}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Facts */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Quick Facts</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• No joining fees or hidden costs</li>
                    <li>• 30-day cookie duration</li>
                    <li>• Real-time tracking and reporting</li>
                    <li>• Multiple payment options</li>
                    <li>• Dedicated affiliate support</li>
                    <li>• Regular promotional campaigns</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  )
}
