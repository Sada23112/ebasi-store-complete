"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Instagram, ArrowRight, Sparkles } from "lucide-react"
import { STORE_INFO } from "@/lib/constants"

export function HeroSection() {
  return (
    <section className="relative bg-background pt-24 pb-12 lg:pt-28 lg:pb-14 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left side - Text content */}
          <div className="space-y-6 animate-fade-up">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs sm:text-sm text-primary font-medium transition-all duration-300 hover:border-primary/40 hover:bg-primary/10">
                <Sparkles className="h-3.5 w-3.5 mr-2 animate-pulse" />
                New Season Arrivals
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-[1.15] text-balance tracking-tight">
                Style that Speaks. <br className="hidden xs:inline"/>
                <span className="text-primary drop-shadow-sm">Fashion that Lasts.</span>
              </h1>
              
              <p className="text-sm sm:text-lg text-muted-foreground max-w-lg text-pretty leading-relaxed">
                Discover the perfect blend of traditional elegance and modern style at EBASI STORE. Your destination for authentic Assamese Mekhela Sadors, sarees, and handcrafted fashion.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3.5 animate-fade-up animate-stagger-2">
              <Link href="/shop" className="w-full sm:w-auto group">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground premium-shadow hover:premium-shadow-hover transition-all duration-300 ease-out hover:-translate-y-1 active:scale-[0.98] rounded-xl font-semibold h-11 px-6 min-h-[44px]">
                  Shop Collection
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Button>
              </Link>
              <a
                href={STORE_INFO.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Ms Ebasi Store on Instagram"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 active:scale-[0.98] rounded-xl font-semibold bg-transparent h-11 px-6 min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Instagram className="w-4 h-4 mr-2" aria-hidden="true" />
                  Follow Us
                </Button>
              </a>
            </div>
          </div>

          {/* Right side - Hero image with subtle hover depth */}
          <div className="relative animate-scale-in animate-stagger-3 mt-4 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl opacity-50 transform -rotate-6 scale-105" />
            
            <div className="relative overflow-hidden rounded-2xl premium-shadow ring-1 ring-black/5 bg-muted group cursor-pointer w-full h-[320px] xs:h-[380px] sm:h-[480px] lg:h-[540px]">
              <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop"
                alt="Authentic handcrafted Assamese Mekhela Sador and traditional boutique collection"
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
              
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 transform transition-all duration-500 ease-out group-hover:-translate-y-1">
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl p-3 sm:p-4 premium-shadow border border-white/20">
                  <h3 className="text-base sm:text-lg font-serif font-semibold text-foreground">Handcrafted Mekhela Sador</h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Explore our handpicked curation of elegant Assamese wear.</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          </div>
          
        </div>
      </div>
    </section>
  )
}
