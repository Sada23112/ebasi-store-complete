"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"
import { useState } from "react"
import { Facebook, Instagram, Loader2 } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { STORE_INFO } from "@/lib/constants"
import { trackWhatsAppConversion, trackContactSubmit } from "@/lib/analytics"

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
      trackContactSubmit(formData.subject)

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
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-2">
                          Full Name <span className="text-primary">*</span>
                        </label>
                        <input
                          type="text"
                          id="contact-name"
                          name="name"
                          required
                          aria-required="true"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-2">
                          Email Address <span className="text-primary">*</span>
                        </label>
                        <input
                          type="email"
                          id="contact-email"
                          name="email"
                          required
                          aria-required="true"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-phone" className="block text-sm font-medium text-foreground mb-2">
                          Phone Number <span className="text-xs text-muted-foreground">(Optional)</span>
                        </label>
                        <input
                          type="tel"
                          id="contact-phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                          placeholder="+91 73992 91242"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-subject" className="block text-sm font-medium text-foreground mb-2">
                          Subject <span className="text-primary">*</span>
                        </label>
                        <select
                          id="contact-subject"
                          name="subject"
                          required
                          aria-required="true"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
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
                      <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-2">
                        Message <span className="text-primary">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        aria-required="true"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      aria-busy={isLoading}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg active:scale-95 transition-transform min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" aria-hidden="true" />
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
                      <h3 className="font-serif text-xl font-bold text-foreground mb-6">Store & Boutique Information</h3>
                      <div className="space-y-5">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-primary text-sm">📍</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">Official Address</h4>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {STORE_INFO.name} ({STORE_INFO.enterpriseName})
                              <br />
                              {STORE_INFO.address.street}
                              <br />
                              {STORE_INFO.address.locality}, {STORE_INFO.address.city}
                              <br />
                              {STORE_INFO.address.state} — {STORE_INFO.address.postalCode}, {STORE_INFO.address.country}
                            </p>
                            <span className="inline-block mt-2 text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                              Plus Code: {STORE_INFO.address.plusCode}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-green-600 text-sm">📞</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">Phone & WhatsApp Support</h4>
                            <a
                              href={`tel:${STORE_INFO.phoneRaw}`}
                              className="text-foreground hover:text-primary transition-colors font-medium text-sm block"
                            >
                              {STORE_INFO.phoneDisplay} ({STORE_INFO.phone})
                            </a>
                            <a
                              href={STORE_INFO.whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => trackWhatsAppConversion({ source: "contact_page" })}
                              className="text-green-600 hover:underline text-xs font-semibold inline-block mt-1"
                            >
                              Direct Chat on WhatsApp →
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-pink-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-pink-600 text-sm">📷</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">Instagram Community</h4>
                            <a
                              href={STORE_INFO.instagram.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-medium text-sm"
                            >
                              {STORE_INFO.instagram.handle}
                            </a>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              1000+ Happy Clients • Daily Collections
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-red-600 text-sm">▶️</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">YouTube Channel</h4>
                            <a
                              href={STORE_INFO.youtube.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 hover:underline font-medium text-sm"
                            >
                              Ms Ebasi Store on YouTube →
                            </a>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Fabric tours, styling guides & drape showcases
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-blue-600 text-sm">🌐</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">Facebook Community</h4>
                            <a
                              href={STORE_INFO.facebook.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-medium text-sm"
                            >
                              {STORE_INFO.facebook.handle} →
                            </a>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Connect with our traditional attire community
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-border/50 shadow-md">
                    <CardContent className="p-8">
                      <h3 className="font-serif text-xl font-bold text-foreground mb-4">Ordering & Dispatch Policies</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex flex-col gap-1 pb-3 border-b border-border/50">
                          <span className="font-semibold text-foreground">Order Model:</span>
                          <span className="text-muted-foreground">WhatsApp-First Direct Ordering (Personal Assistance)</span>
                        </div>
                        <div className="flex flex-col gap-1 pb-3 border-b border-border/50">
                          <span className="font-semibold text-foreground">Payment Terms:</span>
                          <span className="text-muted-foreground">Prepaid via UPI / Bank Transfer (No COD)</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-foreground">Dispatch Origin:</span>
                          <span className="text-muted-foreground">Dispatched directly from Dhemaji, Assam to all over India</span>
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
