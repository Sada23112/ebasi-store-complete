"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { STORE_INFO, API_BASE_URL } from "@/lib/constants"
import { adminApi, StoreProfileData, SocialLinkItem, HeroSectionData } from "@/lib/admin-api"

// Default initial state backed directly by real STORE_INFO constants
const defaultStoreProfile: StoreProfileData = {
  name: STORE_INFO.name,
  brand_name: STORE_INFO.brandName,
  enterprise_name: STORE_INFO.enterpriseName,
  business_type: STORE_INFO.businessType,
  tagline: "Style that Speaks. Fashion that Lasts.",
  short_description: "Authentic Assamese traditional attire boutique. Specializing in handcrafted Deori Egu-Jokasiba, Mekhela Sador, Gamusa, and traditional silk weaves with direct WhatsApp customer assistance.",
  long_description: "Celebrating the timeless artistry of Assamese handlooms, Deori Egu-Jokasiba, and authentic ethnic wear directly from local weavers to your wardrobe.",
  phone: STORE_INFO.phone,
  phone_raw: STORE_INFO.phoneRaw,
  phone_display: STORE_INFO.phoneDisplay,
  whatsapp_number: STORE_INFO.phoneRaw,
  email: "contact@ebasistore.com",
  address_street: STORE_INFO.address.street,
  address_locality: STORE_INFO.address.locality,
  address_city: STORE_INFO.address.city,
  address_state: STORE_INFO.address.state,
  address_postal_code: STORE_INFO.address.postalCode,
  address_country: STORE_INFO.address.country,
  address_full: STORE_INFO.address.full,
  plus_code: STORE_INFO.address.plusCode,
  google_maps_embed_url: STORE_INFO.maps.embedUrl,
  google_maps_directions_url: STORE_INFO.maps.directionsUrl,
  specialties: [...STORE_INFO.specialties],
  policies: { ...STORE_INFO.policies },
  meta_title: "Ms Ebasi Store | Authentic Assamese Traditional Attire & Handlooms",
  meta_description: "Discover authentic Assamese Mekhela Sador, Deori Egu-Jokasiba, Gamusa, and traditional handloom silk attire at Ms Ebasi Store, Dhemaji, Assam.",
  meta_keywords: "Assamese handloom, Mekhela Sador, Deori Egu-Jokasiba, Dhemaji boutique, Muga silk, Paat silk, Gamusa",
  logo_url: null,
  favicon_url: null,
  og_share_image_url: "/images/branding/og-image.jpg",
}

const defaultSocialLinks: SocialLinkItem[] = [
  {
    id: 1,
    platform: "instagram",
    display_name: "Instagram",
    handle: STORE_INFO.instagram.handle,
    url: STORE_INFO.instagram.url,
    is_enabled: true,
    order: 1,
  },
  {
    id: 2,
    platform: "youtube",
    display_name: "YouTube Channel",
    handle: STORE_INFO.youtube.handle,
    url: STORE_INFO.youtube.url,
    is_enabled: true,
    order: 2,
  },
  {
    id: 3,
    platform: "facebook",
    display_name: "Facebook Page",
    handle: STORE_INFO.facebook.handle,
    url: STORE_INFO.facebook.url,
    is_enabled: true,
    order: 3,
  },
  {
    id: 4,
    platform: "whatsapp",
    display_name: "WhatsApp Order Support",
    handle: STORE_INFO.phoneDisplay,
    url: STORE_INFO.whatsappUrl,
    is_enabled: true,
    order: 4,
  },
]

const defaultHeroSection: HeroSectionData = {
  badge_text: "New Season Arrivals",
  heading: "Style that Speaks. Fashion that Lasts.",
  subheading: "Discover the perfect blend of traditional elegance and modern style at EBASI STORE. Your destination for authentic Assamese Mekhela Sadors, sarees, and handcrafted fashion.",
  cta_text: "Shop Collection",
  cta_link: "/shop",
  secondary_cta_text: "Follow Us",
  secondary_cta_link: STORE_INFO.instagram.url,
  image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
  image_alt: "Authentic handcrafted Assamese Mekhela Sador and traditional boutique collection",
  floating_card_title: "Handcrafted Mekhela Sador",
  floating_card_subtitle: "Explore our handpicked curation of elegant Assamese wear.",
  is_active: true,
}

interface StoreContextType {
  store: StoreProfileData
  socialLinks: SocialLinkItem[]
  hero: HeroSectionData
  isLoading: boolean
  getSocialUrl: (platform: 'instagram' | 'facebook' | 'youtube' | 'whatsapp') => string
  refreshStore: () => Promise<void>
}

const StoreContext = createContext<StoreContextType>({
  store: defaultStoreProfile,
  socialLinks: defaultSocialLinks,
  hero: defaultHeroSection,
  isLoading: true,
  getSocialUrl: () => "",
  refreshStore: async () => {},
})

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<StoreProfileData>(defaultStoreProfile)
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(defaultSocialLinks)
  const [hero, setHero] = useState<HeroSectionData>(defaultHeroSection)
  const [isLoading, setIsLoading] = useState(true)

  const fetchConfig = async () => {
    try {
      const data = await adminApi.getPublicCmsConfig()
      if (data.store) {
        setStore((prev) => ({ ...prev, ...data.store }))
      }
      if (data.social_links && data.social_links.length > 0) {
        setSocialLinks(data.social_links)
      }
      if (data.hero) {
        setHero((prev) => ({ ...prev, ...data.hero }))
      }
    } catch {
      // Fallback seamlessly to constants
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  const getSocialUrl = (platform: 'instagram' | 'facebook' | 'youtube' | 'whatsapp'): string => {
    const found = socialLinks.find((s) => s.platform === platform && s.is_enabled)
    if (found) return found.url
    if (platform === "instagram") return STORE_INFO.instagram.url
    if (platform === "youtube") return STORE_INFO.youtube.url
    if (platform === "facebook") return STORE_INFO.facebook.url
    if (platform === "whatsapp") return STORE_INFO.whatsappUrl
    return ""
  }

  return (
    <StoreContext.Provider
      value={{
        store,
        socialLinks,
        hero,
        isLoading,
        getSocialUrl,
        refreshStore: fetchConfig,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
export const useStoreConfig = () => useContext(StoreContext)
