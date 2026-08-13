"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"
import { useState } from "react"
import { Facebook, Instagram, Loader2 } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function ContactPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await api.submitContactForm(formData)

      toast({
        title: "Message Sent",
        description: "Thank you for your message! We will get back to you soon.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">Get in Touch</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <ScrollReveal direction="up">
                <Card className="border border-border/50 shadow-md">
                  <CardContent className="p-8">
                  <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          Subject *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="order">Order Support</option>
                          <option value="returns">Returns & Exchanges</option>
                          <option value="wholesale">Wholesale Inquiry</option>
                          <option value="custom">Custom Orders</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg active:scale-95 transition-transform min-h-[44px]">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              </ScrollReveal>

              {/* Contact Information */}
              <ScrollReveal delay={150} direction="up">
                <div className="space-y-8">
                  <Card className="border border-border/50 shadow-md">
                    <CardContent className="p-8">
                      <h3 className="font-serif text-xl font-bold text-foreground mb-6">Store Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-primary">📍</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">Address</h4>
                            <p className="text-muted-foreground">
                              123 Fashion Street, Textile Market
                              <br />
                              Guwahati, Assam 781001
                              <br />
                              India
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-primary">📞</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                            <p className="text-muted-foreground">
                              +91 98765 43210
                              <br />
                              +91 98765 43211
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-primary">✉️</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">Email</h4>
                            <p className="text-muted-foreground">
                              info@ebasistore.com
                              <br />
                              support@ebasistore.com
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-border/50 shadow-md">
                    <CardContent className="p-8">
                      <h3 className="font-serif text-xl font-bold text-foreground mb-6">Business Hours</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Monday - Friday</span>
                          <span className="font-medium text-foreground">10:00 AM - 8:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Saturday</span>
                          <span className="font-medium text-foreground">10:00 AM - 9:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sunday</span>
                          <span className="font-medium text-foreground">11:00 AM - 7:00 PM</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal direction="up">
              <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-12">
                Frequently Asked Questions
              </h2>
            </ScrollReveal>
            <div className="space-y-6">
              <ScrollReveal delay={100} direction="up">
                <Card className="border border-border/50 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">What are your shipping options?</h3>
                    <p className="text-muted-foreground">
                      We offer free shipping on orders above ₹1,999. Standard delivery takes 3-5 business days, and
                      express delivery is available for next-day delivery in select cities.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={200} direction="up">
                <Card className="border border-border/50 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Do you accept returns and exchanges?</h3>
                    <p className="text-muted-foreground">
                      Yes, we accept returns and exchanges within 7 days of delivery. Items must be in original condition
                      with tags attached. Custom orders are not eligible for returns.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={300} direction="up">
                <Card className="border border-border/50 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Do you offer custom tailoring?</h3>
                    <p className="text-muted-foreground">
                      Yes, we provide custom tailoring services for sarees and ethnic wear. Please contact us with your
                      requirements, and we'll provide a quote and timeline.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      
    </div>
  )
}
