"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Gift, Truck } from "lucide-react"
import Link from "next/link"

export function Promotions() {
  return (
    <section className="py-16 px-4 bg-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Current Offers</h2>
          <p className="text-lg text-muted-foreground">Don't miss out on these amazing deals</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Main Promotion */}
          <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white overflow-hidden">
            <div className="relative z-10">
              <Badge className="bg-white text-primary mb-4">Limited Time</Badge>
              <h3 className="text-3xl font-serif font-bold mb-2">Festive Sale</h3>
              <p className="text-xl mb-4">Up to 50% OFF on Sarees</p>
              <p className="text-white/90 mb-6">
                Celebrate the season with our exclusive collection of traditional sarees
              </p>
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Ends in 5 days</span>
              </div>
              <Link href="/shop">
                <Button variant="secondary" size="lg">
                  Shop Sarees
                </Button>
              </Link>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-20">
              <Gift className="h-32 w-32" />
            </div>
          </div>

          {/* Secondary Promotion */}
          <div className="bg-background border-2 border-primary/20 rounded-2xl p-8">
            <Badge className="bg-primary/10 text-primary mb-4">New Collection</Badge>
            <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Designer Kurtis</h3>
            <p className="text-lg text-primary mb-4">Starting from ₹999</p>
            <p className="text-muted-foreground mb-6">Discover our latest collection of contemporary designer kurtis</p>
            <Link href="/shop">
              <Button variant="outline" size="lg">
                Explore Collection
              </Button>
            </Link>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-6 bg-background rounded-xl border">
            <div className="bg-primary/10 p-3 rounded-full">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Free Shipping</h4>
              <p className="text-sm text-muted-foreground">On orders above ₹1999</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-background rounded-xl border">
            <div className="bg-primary/10 p-3 rounded-full">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Easy Returns</h4>
              <p className="text-sm text-muted-foreground">7-day return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-background rounded-xl border">
            <div className="bg-primary/10 p-3 rounded-full">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Quick Delivery</h4>
              <p className="text-sm text-muted-foreground">2-3 business days</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
