"use client"

import type React from "react"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"
import { useState } from "react"
import { Facebook, Instagram } from "lucide-react"

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
    <div className="min-h-screen bg-white">
      

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="border-0 shadow-lg">
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

                    <Button type="submit" disabled={isLoading} className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 text-lg">
                      {isLoading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">Store Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-pink-600">📍</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                          <p className="text-gray-600">
                            123 Fashion Street, Textile Market
                            <br />
                            Guwahati, Assam 781001
                            <br />
                            India
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-pink-600">📞</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                          <p className="text-gray-600">
                            +91 98765 43210
                            <br />
                            +91 98765 43211
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-pink-600">✉️</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                          <p className="text-gray-600">
                            info@ebasistore.com
                            <br />
                            support@ebasistore.com
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">Business Hours</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monday - Friday</span>
                        <span className="font-medium text-gray-900">10:00 AM - 8:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Saturday</span>
                        <span className="font-medium text-gray-900">10:00 AM - 9:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sunday</span>
                        <span className="font-medium text-gray-900">11:00 AM - 7:00 PM</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">Follow Us</h3>
                    <div className="flex gap-4">
                      <a
                        href="https://wa.me/917399291242"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors"
                      >
                        <svg className="h-5 w-5 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </a>
                      <a
                        href="https://www.instagram.com/ebasistore_mekhelasador/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors"
                      >
                        <Instagram className="h-5 w-5 text-pink-600" />
                      </a>
                      <a
                        href="https://www.facebook.com/twinkledeori21"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors"
                      >
                        <Facebook className="h-5 w-5 text-pink-600" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">What are your shipping options?</h3>
                  <p className="text-gray-600">
                    We offer free shipping on orders above ₹1,999. Standard delivery takes 3-5 business days, and
                    express delivery is available for next-day delivery in select cities.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Do you accept returns and exchanges?</h3>
                  <p className="text-gray-600">
                    Yes, we accept returns and exchanges within 7 days of delivery. Items must be in original condition
                    with tags attached. Custom orders are not eligible for returns.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Do you offer custom tailoring?</h3>
                  <p className="text-gray-600">
                    Yes, we provide custom tailoring services for sarees and ethnic wear. Please contact us with your
                    requirements, and we'll provide a quote and timeline.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      
    </div>
  )
}
