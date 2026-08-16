"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Gift, Store, MessageCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"

export function Promotions() {
  return (
    <section className="py-20 lg:py-24 px-4 bg-primary/5">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Current Offers</h2>
            <p className="text-lg text-muted-foreground">Discover featured offers and order directly on WhatsApp</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Main Promotion */}
          <ScrollReveal direction="left" delay={100}>
            <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white overflow-hidden shadow-md group hover-lift h-full flex flex-col justify-between">
              <div className="relative z-10">
                <Badge className="bg-white text-primary mb-4 font-semibold">Limited Time</Badge>
                <h3 className="text-3xl font-serif font-bold mb-2">Festive Mekhela Sador Collection</h3>
                <p className="text-xl mb-4">Special Offers on Traditional Assamese Wear</p>
                <p className="text-white/90 mb-6">
                  Celebrate the season with our exclusive handpicked collection of traditional sarees and Mekhela Sadors.
                </p>
                <div className="flex items-center gap-2 mb-6 text-white/90">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm">Available while stocks last</span>
                </div>
                <Link href="/shop">
                  <Button variant="secondary" size="lg" className="font-bold transition-all duration-300 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white">
                    Browse Collection
                  </Button>
                </Link>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-20 pointer-events-none transition-transform duration-700 group-hover:scale-110" aria-hidden="true">
                <Gift className="h-40 w-40" />
              </div>
            </div>
          </ScrollReveal>

          {/* Secondary Promotion */}
          <ScrollReveal direction="right" delay={200}>
            <div className="bg-background border-2 border-primary/20 rounded-2xl p-8 flex flex-col justify-between shadow-sm hover-lift h-full">
              <div>
                <Badge className="bg-primary/10 text-primary mb-4 font-semibold">New Collection</Badge>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Designer Ethnic Wear</h3>
                <p className="text-lg font-bold text-primary mb-4">Starting from ₹999</p>
                <p className="text-muted-foreground mb-6">
                  Discover our latest collection of contemporary ethnic pieces and designer wear. Order directly with custom fitting options via WhatsApp.
                </p>
              </div>
              <div>
                <Link href="/shop">
                  <Button variant="outline" size="lg" className="bg-transparent font-semibold transition-all duration-300 active:scale-[0.98] hover:bg-primary hover:text-white focus-visible:ring-2 focus-visible:ring-primary">
                    Explore Collection
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Benefits aligned with WhatsApp / Store Pickup Model */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScrollReveal direction="up" delay={100}>
            <div className="flex items-center gap-4 p-6 bg-background rounded-xl border shadow-sm hover-lift">
              <div className="bg-green-500/10 p-3 rounded-full shrink-0">
                <MessageCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">WhatsApp First Order</h4>
                <p className="text-sm text-muted-foreground">Instant chat, video call & product photos</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <div className="flex items-center gap-4 p-6 bg-background rounded-xl border shadow-sm hover-lift">
              <div className="bg-primary/10 p-3 rounded-full shrink-0">
                <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Authentic Handlooms</h4>
                <p className="text-sm text-muted-foreground">100% Genuine Assamese Traditional Wear</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <div className="flex items-center gap-4 p-6 bg-background rounded-xl border shadow-sm hover-lift">
              <div className="bg-amber-500/10 p-3 rounded-full shrink-0">
                <Store className="h-6 w-6 text-amber-600" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Dhemaji Store Pickup</h4>
                <p className="text-sm text-muted-foreground">Boutique pickup & India-wide dispatch</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
