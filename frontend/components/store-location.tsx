"use client"

import { usePathname } from "next/navigation"
import { MapPin, Navigation, Phone, Instagram, Sparkles, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/scroll-reveal"
import { STORE_INFO } from "@/lib/constants"
import { trackWhatsAppConversion } from "@/lib/analytics"

export function StoreLocation() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) {
    return null
  }
  return (
    <section className="py-12 sm:py-16 px-4 bg-muted/40 border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary font-medium mb-3">
              <Sparkles className="h-3 w-3 mr-1.5" />
              Visit In-Person or Order Direct
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground tracking-tight">
              Our Store Location
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Experience the authentic weave of Assamese handlooms at our boutique in Dhemaji, Assam.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Store Info Card */}
          <div className="lg:col-span-5 flex flex-col">
            <ScrollReveal direction="right" className="h-full">
              <Card className="rounded-2xl border-border/60 shadow-sm bg-card/80 backdrop-blur-sm h-full flex flex-col justify-between">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div>
                    <Badge variant="outline" className="text-primary border-primary/30 text-xs font-semibold mb-2">
                      {STORE_INFO.businessType}
                    </Badge>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                      {STORE_INFO.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-primary font-medium mt-0.5">
                      {STORE_INFO.enterpriseName}
                    </p>
                  </div>

                  {/* Contact Details List */}
                  <div className="space-y-4 text-sm">
                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-foreground block text-xs uppercase tracking-wider text-muted-foreground">
                          Store Address
                        </span>
                        <p className="text-foreground mt-0.5 leading-relaxed">
                          {STORE_INFO.address.street}
                          <br />
                          {STORE_INFO.address.locality}, {STORE_INFO.address.city}
                          <br />
                          {STORE_INFO.address.state} — {STORE_INFO.address.postalCode}, {STORE_INFO.address.country}
                        </p>
                        <span className="inline-block mt-1.5 text-[11px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                          Plus Code: {STORE_INFO.address.plusCode}
                        </span>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-foreground block text-xs uppercase tracking-wider text-muted-foreground">
                          Phone & WhatsApp
                        </span>
                        <a
                          href={`tel:${STORE_INFO.phoneRaw}`}
                          className="text-foreground hover:text-primary transition-colors font-medium mt-0.5 inline-block"
                        >
                          {STORE_INFO.phoneDisplay}
                        </a>
                      </div>
                    </div>

                    {/* Instagram */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-pink-500/10 text-pink-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Instagram className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-foreground block text-xs uppercase tracking-wider text-muted-foreground">
                          Official Instagram
                        </span>
                        <a
                          href={STORE_INFO.instagram.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium mt-0.5 inline-block"
                        >
                          {STORE_INFO.instagram.handle}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <a
                      href={STORE_INFO.maps.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Get driving directions to Ms Ebasi Store in Google Maps"
                      className="flex-1"
                    >
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold min-h-[44px] shadow-sm active:scale-95 transition-transform focus-visible:ring-2 focus-visible:ring-primary">
                        <Navigation className="h-4 w-4 mr-2" aria-hidden="true" />
                        Get Directions
                      </Button>
                    </a>
                    <a
                      href={STORE_INFO.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsAppConversion({ source: "store_location" })}
                      aria-label="Open WhatsApp to chat with Ms Ebasi Store directly"
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold min-h-[44px] bg-transparent active:scale-95 transition-transform focus-visible:ring-2 focus-visible:ring-primary">
                        <MessageCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                        WhatsApp Store
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="lg:col-span-7 flex flex-col">
            <ScrollReveal direction="left" className="h-full">
              <div className="relative w-full h-[300px] sm:h-[380px] lg:h-full min-h-[300px] rounded-2xl overflow-hidden border border-border/60 shadow-sm bg-muted">
                <iframe
                  title="Ms Ebasi Store Location Map"
                  src={STORE_INFO.maps.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full object-cover filter grayscale-[0.1] contrast-[1.05]"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
