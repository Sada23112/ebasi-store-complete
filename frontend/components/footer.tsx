"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Instagram, MapPin, Phone, MessageCircle, Youtube, Facebook, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store-context"
import { trackWhatsAppConversion } from "@/lib/analytics"

export function Footer() {
  const pathname = usePathname()
  const { store, socialLinks } = useStore()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  const enabledSocialLinks = socialLinks.filter((s) => s.is_enabled)

  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-4 w-4" aria-hidden="true" />
      case 'youtube':
        return <Youtube className="h-4 w-4" aria-hidden="true" />
      case 'facebook':
        return <Facebook className="h-4 w-4" aria-hidden="true" />
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4" aria-hidden="true" />
      default:
        return <Globe className="h-4 w-4" aria-hidden="true" />
    }
  }

  const getSocialButtonClass = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
      case 'youtube':
        return "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
      case 'facebook':
        return "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
      case 'whatsapp':
        return "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
      default:
        return "border-border text-foreground hover:bg-muted"
    }
  }

  return (
    <footer className="bg-muted py-12 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo, Description & Social */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="text-2xl font-serif font-bold text-foreground">{store.name}</h3>
              <p className="text-xs text-primary font-semibold tracking-wider uppercase mt-0.5">
                {store.enterprise_name}
              </p>
            </div>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
              {store.short_description}
            </p>

            {/* Store Contact Snippet in Footer */}
            <div className="space-y-2 text-xs text-muted-foreground pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>{store.address_full}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-green-600 shrink-0" />
                <a href={`tel:${store.phone_raw}`} className="hover:text-primary transition-colors font-medium">
                  {store.phone_display || store.phone}
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {enabledSocialLinks.map((social) => (
                <a
                  key={social.id || social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (social.platform === 'whatsapp') {
                      trackWhatsAppConversion({ source: "footer" })
                    }
                  }}
                  aria-label={`Visit ${store.name} on ${social.display_name || social.platform}`}
                  title={social.display_name || social.platform}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className={`bg-transparent min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 focus-visible:ring-2 focus-visible:ring-primary ${getSocialButtonClass(social.platform)}`}
                  >
                    {renderSocialIcon(social.platform)}
                    <span className="sr-only">{social.display_name || social.platform}</span>
                  </Button>
                </a>
              ))}
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
                <span className="text-muted-foreground block text-xs">
                  Ordering: {store.policies?.payment || "WhatsApp-First (Prepaid / No COD)"}
                </span>
              </li>
              <li>
                <span className="text-muted-foreground block text-xs">
                  Dispatch: {store.policies?.dispatch || "Dhemaji, Assam"}
                </span>
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
              © {new Date().getFullYear()} {store.name} ({store.enterprise_name}). All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Handcrafted with pride in {store.address_city || "Dhemaji"}, {store.address_state || "Assam"}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
