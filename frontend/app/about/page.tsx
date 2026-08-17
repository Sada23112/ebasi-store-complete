"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useStore } from "@/lib/store-context"
import { adminApi, PageContentData } from "@/lib/admin-api"
import { trackWhatsAppConversion } from "@/lib/analytics"
import { Sparkles, Heart, ShieldCheck, MessageCircle, MapPin } from "lucide-react"

export default function AboutPage() {
  const { store, getSocialUrl } = useStore()
  const [pageData, setPageData] = useState<PageContentData | null>(null)

  useEffect(() => {
    adminApi.getPublicCmsPage("about")
      .then((data) => {
        if (data) setPageData(data)
      })
      .catch(() => {})
  }, [])

  const whatsappUrl = getSocialUrl('whatsapp')
  const content = pageData?.content_json || {}
  const storyParagraphs: string[] = content.story_paragraphs || [
    `${store.name} (${store.enterprise_name}) is an authentic clothing brand and boutique based in ${store.address_city}, ${store.address_state}. We are dedicated to preserving and showcasing the indigenous weaving traditions of Northeast India, including sacred Deori Egu-Jokasiba, traditional Mekhela Sador, Gamusa, and handcrafted sarees.`,
    "With over 1,000+ satisfied clients across Assam and all of India, our mission is to deliver pure, genuine handloom fabrics directly from local weavers to your wardrobe with uncompromised quality and personalized care.",
    "Every piece in our boutique is a testament to cultural pride, crafted by skilled weavers who pour heritage, geometry, and intricate zari into every thread."
  ]

  const coreValues = content.core_values || [
    {
      title: "Pure Indigenous Handloom",
      description: "Authentic Deori Egu-Jokasiba, Muga, Paat, Tos, and Kesavan cotton handloom sets crafted with genuine traditional motifs."
    },
    {
      title: "1000+ Happy Clients",
      description: "A trusted community of women celebrating handlooms with high customer satisfaction and repeat orders across India."
    },
    {
      title: "Transparent Direct Ordering",
      description: "Personalized 1-on-1 WhatsApp assistance, verified prepaid ordering, and direct dispatch from Dhemaji, Assam."
    }
  ]

  const specialties = content.specialties || [
    {
      title: "Deori Egu-Jokasiba",
      description: "Sacred and traditional attire of the Deori community, handcrafted with authentic tribal patterns, geometric precision, and cultural reverence."
    },
    {
      title: "Mekhela Sador Sets",
      description: "Exquisite two-piece Assamese attire woven in Muga, Paat silk, Tos, and pure cotton, adorned with intricate Guna and Mina kari zari borders."
    },
    {
      title: "Traditional Gamusa & Sarees",
      description: "Handwoven Assamese Gamusas and festive sarees crafted for weddings, Bihu celebrations, and formal cultural events."
    }
  ]

  const heroImageSrc = pageData?.hero_image_url || pageData?.story_image_url || "/images/branding/og-image.jpg"

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary font-medium mb-4">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                {store.business_type || "Boutique / Clothing brand"} • {store.address_city}, {store.address_state}
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                {pageData?.title || `About ${store.name}`}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {pageData?.subtitle || pageData?.intro || "Celebrating the timeless artistry of Assamese handlooms, Deori Egu-Jokasiba, and authentic ethnic wear."}
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Our Story */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                    {content.heritage_story_title || "Our Heritage & Story"}
                  </h2>
                  {storyParagraphs.map((para, i) => (
                    <p key={i} className="text-muted-foreground mb-6 leading-relaxed">
                      {para}
                    </p>
                  ))}

                  <div className="mt-8 flex items-center gap-2 text-sm text-primary font-medium">
                    <MapPin className="h-4 w-4" />
                    <span>Located in {store.address_city}, {store.address_state} — Serving customers across India</span>
                  </div>
                </div>
                <div className="relative w-full h-96 overflow-hidden rounded-2xl shadow-lg bg-muted border border-border/50">
                  <Image
                    src={heroImageSrc}
                    alt={`Authentic Assamese Handloom - ${store.name}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover rounded-2xl"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Brand Values */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Rooted in authenticity, ethical craftsmanship, and direct customer relationships
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coreValues.map((val: any, idx: number) => {
                const Icon = idx === 0 ? Sparkles : idx === 1 ? Heart : ShieldCheck
                return (
                  <ScrollReveal key={val.title || idx} delay={idx * 100} direction="up">
                    <Card className="text-center border border-border/50 shadow-sm hover:shadow-md transition-all h-full">
                      <CardContent className="p-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Icon className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="font-serif text-xl font-semibold text-foreground mb-4">{val.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {val.description}
                        </p>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* Handloom Specialties Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Our Handcrafted Specialties</h2>
                <p className="text-lg text-muted-foreground">Each creation represents generations of Assamese weaving expertise</p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {specialties.map((spec: any, idx: number) => (
                <ScrollReveal key={spec.title || idx} delay={idx * 100} direction="up">
                  <Card className="border border-border/50 shadow-sm h-full">
                    <CardContent className="p-8 space-y-3">
                      <h3 className="font-serif text-xl font-semibold text-foreground">{spec.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {spec.description}
                      </p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-primary text-primary-foreground">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-serif text-3xl font-bold mb-4">Experience Authentic Assamese Weaves</h2>
              <p className="text-lg mb-8 opacity-90">
                Explore our catalog or connect directly on WhatsApp for personalized orders and inquiries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop">
                  <Button className="bg-background text-foreground hover:bg-muted transition-colors font-medium h-auto py-3 px-8 text-base active:scale-95 focus-visible:ring-2 focus-visible:ring-white">
                    Browse Collections
                  </Button>
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppConversion({ source: "about_page" })}
                  aria-label={`Chat with ${store.name} on WhatsApp`}
                >
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 transition-colors font-medium h-auto py-3 px-8 text-base active:scale-95 bg-transparent focus-visible:ring-2 focus-visible:ring-white">
                    <MessageCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                    Chat with Boutique
                  </Button>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </div>
  )
}
