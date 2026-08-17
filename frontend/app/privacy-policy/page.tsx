"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, MapPin, Phone, Instagram } from "lucide-react"
import { useStore } from "@/lib/store-context"
import { adminApi, PageContentData } from "@/lib/admin-api"

export default function PrivacyPolicyPage() {
  const { store, getSocialUrl } = useStore()
  const [pageData, setPageData] = useState<PageContentData | null>(null)

  useEffect(() => {
    adminApi.getPublicCmsPage("privacy-policy")
      .then((data) => {
        if (data) setPageData(data)
      })
      .catch(() => {})
  }, [])

  const instagramUrl = getSocialUrl("instagram")
  const sections = pageData?.content_json?.sections || [
    {
      heading: "1. Information We Collect",
      content: "We collect information you provide directly to us when browsing products, initiating orders, and contacting our boutique.",
      bullets: [
        "Personal Information: Name, email address, contact phone number, shipping address.",
        "Usage Data: Browsing behavior, product inquiries, wishlist selections, device info and IP address.",
        "Communication Records: WhatsApp inquiries and contact form submissions."
      ]
    },
    {
      heading: "2. How We Use Your Information",
      content: "We utilize your information to provide personalized shopping and direct customer support.",
      bullets: [
        "Process and fulfill your handloom orders and direct deliveries.",
        "Provide direct 1-on-1 WhatsApp customer assistance and order status updates.",
        "Send product recommendations, new arrivals, and boutique notices.",
        "Improve store performance, inventory availability, and customer satisfaction."
      ]
    },
    {
      heading: "3. Information Sharing and Disclosure",
      content: "We do not sell, rent, or trade your personal information to third parties. Information is only shared with verified courier partners to deliver parcels directly from Dhemaji, Assam, or when required by legal regulations.",
      bullets: []
    },
    {
      heading: "4. Data Security & Storage",
      content: "We implement appropriate technical measures including SSL encryption, secure tokens, and access controls to safeguard your data against unauthorized access or alteration.",
      bullets: []
    },
    {
      heading: "5. Your Rights and Choices",
      content: "You have the right to request access, correction, or deletion of your personal data stored with us at any time by contacting our support team.",
      bullets: []
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {pageData?.title || "Privacy Policy"}
            </h1>
            <p className="text-muted-foreground">
              Last updated: {pageData?.last_updated_date || "January 15, 2024"}
            </p>
          </div>

          <div className="space-y-8">
            {/* Header / Intro Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>{pageData?.subtitle || "Our Commitment to Your Privacy"}</span>
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {pageData?.intro || `At ${store.brand_name || "EBASI STORE"}, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.`}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Dynamic Policy Sections */}
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

            {/* Contact Information & Grievance Officer */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-serif font-bold text-foreground">
                  Contact Us & Grievance Assistance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  If you have questions regarding this Privacy Policy or your personal data, please reach out to our boutique directly:
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2 text-foreground font-medium">
                    <span>{store.name} ({store.enterprise_name})</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span>{store.address_full}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Phone className="w-4 h-4 text-green-600 shrink-0" />
                    <a href={`tel:${store.phone_raw}`} className="text-primary hover:underline font-medium">
                      {store.phone_display || store.phone}
                    </a>
                  </div>
                  {instagramUrl && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Instagram className="w-4 h-4 text-pink-600 shrink-0" />
                      <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        @ebasistore_traditionalattire
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
