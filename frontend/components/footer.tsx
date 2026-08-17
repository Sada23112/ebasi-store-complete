"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Instagram, MapPin, Phone, MessageCircle, Youtube, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { STORE_INFO } from "@/lib/constants"
import { trackWhatsAppConversion } from "@/lib/analytics"

export function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) {
    return null
  }
  return (
    <footer className="bg-muted py-12 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo, Description & Social */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="text-2xl font-serif font-bold text-foreground">{STORE_INFO.name}</h3>
              <p className="text-xs text-primary font-semibold tracking-wider uppercase mt-0.5">
                {STORE_INFO.enterpriseName}
              </p>
            </div>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
              Authentic Assamese traditional attire boutique. Specializing in handcrafted Deori Egu-Jokasiba,
              Mekhela Sador, Gamusa, and traditional silk weaves with direct WhatsApp customer assistance.
            </p>

            {/* Store Contact Snippet in Footer */}
            <div className="space-y-2 text-xs text-muted-foreground pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>{STORE_INFO.address.full}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-green-600 shrink-0" />
                <a href={`tel:${STORE_INFO.phoneRaw}`} className="hover:text-primary transition-colors font-medium">
                  {STORE_INFO.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={STORE_INFO.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Ms Ebasi Store on Instagram"
                title="Instagram @ebasistore_traditionalattire"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Instagram className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Instagram</span>
                </Button>
              </a>
              <a
                href={STORE_INFO.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Ms Ebasi Store on YouTube"
                title="YouTube Channel"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Youtube className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">YouTube</span>
                </Button>
              </a>
              <a
                href={STORE_INFO.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Ms Ebasi Store on Facebook"
                title="Facebook @twinkledeori21"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Facebook className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Facebook</span>
                </Button>
              </a>
              <a
                href={STORE_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppConversion({ source: "footer" })}
                aria-label="Chat with Ms Ebasi Store on WhatsApp"
                title="WhatsApp Order Support"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">WhatsApp</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Explore Store</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/shop?category=traditional-mekhela-chador" className="text-muted-foreground hover:text-primary transition-colors">
                  Mekhela Sador
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Information & Policies</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground block text-xs">Ordering: WhatsApp-First (Prepaid / No COD)</span>
              </li>
              <li>
                <span className="text-muted-foreground block text-xs">Dispatch: Dhemaji, Assam</span>
              </li>
              <li className="pt-2">
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} {STORE_INFO.name} ({STORE_INFO.enterpriseName}). All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Handcrafted with pride in Dhemaji, Assam</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
