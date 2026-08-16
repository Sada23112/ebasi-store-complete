"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { STORE_INFO } from "@/lib/constants"
import { Sparkles, Heart, ShieldCheck, MessageCircle, MapPin } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary font-medium mb-4">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                {STORE_INFO.businessType} • Dhemaji, Assam
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                About {STORE_INFO.name}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Celebrating the timeless artistry of Assamese handlooms, Deori Egu-Jokasiba, and authentic ethnic wear.
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
                  <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Our Heritage & Story</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    <strong>{STORE_INFO.name}</strong> ({STORE_INFO.enterpriseName}) is an authentic clothing brand and boutique
                    based in Dhemaji, Assam. We are dedicated to preserving and showcasing the indigenous weaving traditions
                    of Northeast India, including sacred Deori Egu-Jokasiba, traditional Mekhela Sador, Gamusa, and handcrafted sarees.
                  </p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    With over 1,000+ satisfied clients across Assam and all of India, our mission is to deliver pure,
                    genuine handloom fabrics directly from local weavers to your wardrobe with uncompromised quality and personalized care.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Every piece in our boutique is a testament to cultural pride, crafted by skilled weavers who pour heritage,
                    geometry, and intricate zari into every thread.
                  </p>

                  <div className="mt-8 flex items-center gap-2 text-sm text-primary font-medium">
                    <MapPin className="h-4 w-4" />
                    <span>Located in Dhemaji, Assam — Serving customers across India</span>
                  </div>
                </div>
                <div className="relative w-full h-96 overflow-hidden rounded-2xl shadow-lg bg-muted border border-border/50">
                  <Image
                    src="/images/branding/og-image.jpg"
                    alt="Authentic Assamese Handloom - Ms Ebasi Store"
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
              <ScrollReveal delay={100} direction="up">
                <Card className="text-center border border-border/50 shadow-sm hover:shadow-md transition-all h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Pure Indigenous Handloom</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      Authentic Deori Egu-Jokasiba, Muga, Paat, Tos, and Kesavan cotton handloom sets crafted with genuine traditional motifs.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={200} direction="up">
                <Card className="text-center border border-border/50 shadow-sm hover:shadow-md transition-all h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Heart className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4">1000+ Happy Clients</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      A trusted community of women celebrating handlooms with high customer satisfaction and repeat orders across India.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={300} direction="up">
                <Card className="text-center border border-border/50 shadow-sm hover:shadow-md transition-all h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Transparent Direct Ordering</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      Personalized 1-on-1 WhatsApp assistance, verified prepaid ordering, and direct dispatch from Dhemaji, Assam.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
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
              <ScrollReveal delay={100} direction="up">
                <Card className="border border-border/50 shadow-sm h-full">
                  <CardContent className="p-8 space-y-3">
                    <h3 className="font-serif text-xl font-semibold text-foreground">Deori Egu-Jokasiba</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Sacred and traditional attire of the Deori community, handcrafted with authentic tribal patterns, geometric precision, and cultural reverence.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={200} direction="up">
                <Card className="border border-border/50 shadow-sm h-full">
                  <CardContent className="p-8 space-y-3">
                    <h3 className="font-serif text-xl font-semibold text-foreground">Mekhela Sador Sets</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Exquisite two-piece Assamese attire woven in Muga, Paat silk, Tos, and pure cotton, adorned with intricate Guna and Mina kari zari borders.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={300} direction="up">
                <Card className="border border-border/50 shadow-sm h-full">
                  <CardContent className="p-8 space-y-3">
                    <h3 className="font-serif text-xl font-semibold text-foreground">Traditional Gamusa & Sarees</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Handwoven Assamese Gamusas and festive sarees crafted for weddings, Bihu celebrations, and formal cultural events.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
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
                  <Button className="bg-background text-foreground hover:bg-muted transition-colors font-medium h-auto py-3 px-8 text-base active:scale-95">
                    Browse Collections
                  </Button>
                </Link>
                <a
                  href={STORE_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 transition-colors font-medium h-auto py-3 px-8 text-base active:scale-95 bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
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
