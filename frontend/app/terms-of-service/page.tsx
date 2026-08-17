"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MapPin, Phone, Instagram } from "lucide-react"
import { useStore } from "@/lib/store-context"
import { adminApi, PageContentData } from "@/lib/admin-api"

export default function TermsOfServicePage() {
  const { store, getSocialUrl } = useStore()
  const [pageData, setPageData] = useState<PageContentData | null>(null)

  useEffect(() => {
    adminApi.getPublicCmsPage("terms-of-service")
      .then((data) => {
        if (data) setPageData(data)
      })
      .catch(() => {})
  }, [])

  const instagramUrl = getSocialUrl("instagram")
  const sections = pageData?.content_json?.sections || [
    {
      heading: "1. Product Authenticity & Handloom Variations",
      content: "All handloom textiles featured at Ms Ebasi Store are authentically woven. Minor variations in texture, yarn shade, and hand-embroidered motifs are natural characteristics of authentic handlooms, celebrating artisan craftsmanship.",
      bullets: []
    },
    {
      heading: "2. Ordering and Payment Terms",
      content: "Orders are confirmed via direct WhatsApp coordination and verified UPI payment. As items are handcrafted in limited batches, availability is confirmed at the time of inquiry.",
      bullets: [
        "Accepted payment methods: UPI (Google Pay, PhonePe, Paytm), Net Banking, Direct Bank Transfer.",
        "Cash on Delivery (COD) is not available due to direct dispatch of high-value authentic handloom fabrics.",
        "Dispatches are initiated promptly upon payment confirmation."
      ]
    },
    {
      heading: "3. Shipping and Delivery",
      content: "We ship securely to addresses across India directly from Dhemaji, Assam. Tracking details are provided via WhatsApp as soon as parcel consignment is booked.",
      bullets: []
    },
    {
      heading: "4. Returns and Exchanges",
      content: "Customer satisfaction is our priority. If an item received is defective or damaged during transit, please notify us within 48 hours of delivery with unboxing proof for prompt resolution.",
      bullets: []
    },
    {
      heading: "5. Governing Law and Jurisdiction",
      content: "These Terms are governed by the laws of India. Any legal disputes shall be subject to the exclusive jurisdiction of the competent courts in Dhemaji, Assam.",
      bullets: []
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {pageData?.title || "Terms of Service"}
          </h1>
          <p className="text-muted-foreground">
            Last updated: {pageData?.last_updated_date || "January 15, 2024"}
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>{pageData?.subtitle || "Agreement to Terms"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {pageData?.intro || `Welcome to ${store.brand_name || "EBASI STORE"}. These Terms of Service ("Terms") govern your use of our website and ordering services. By accessing or using our services, you agree to be bound by these Terms.`}
              </p>
            </CardContent>
          </Card>

          {/* Dynamic Terms Sections */}
          {sections.map((section: any, idx: number) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-lg font-serif font-bold text-foreground">
                  {section.heading}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                {section.content && <p>{section.content}</p>}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="list-disc list-inside space-y-1.5 pt-1">
                    {section.bullets.map((b: string, bIdx: number) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-serif font-bold text-foreground">
                Contact & Boutique Inquiries
              </CardTitle>
              <CardDescription>
                If you have any questions about these Terms of Service or order policies, please contact us:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="font-medium text-foreground">{store.name} ({store.enterprise_name})</p>
                  <p className="text-sm text-muted-foreground">
                    Phone / WhatsApp:{" "}
                    <a href={`tel:${store.phone_raw}`} className="text-primary hover:underline font-medium">
                      {store.phone_display || store.phone}
                    </a>
                  </p>
                  {instagramUrl && (
                    <p className="text-sm text-muted-foreground">
                      Instagram:{" "}
                      <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                        @ebasistore_traditionalattire
                      </a>
                    </p>
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground mb-2">Store & Mailing Address</p>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    <p>{store.name}</p>
                    <p>{store.address_street}</p>
                    <p>{store.address_locality}, {store.address_city}</p>
                    <p>{store.address_state} — {store.address_postal_code}, {store.address_country}</p>
                    {store.plus_code && (
                      <p className="text-xs font-mono mt-1">Plus Code: {store.plus_code}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
