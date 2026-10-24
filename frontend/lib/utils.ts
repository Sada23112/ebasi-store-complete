import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { API_BASE_URL, STORE_INFO } from "@/lib/constants"

export function getAbsoluteImageUrl(url: string | null | undefined): string {
  if (!url) return "/images/placeholders/placeholder.svg"
  if (url.startsWith("data:")) return url

  let absoluteUrl = url
  if (!url.startsWith("http")) {
    const baseUrl = API_BASE_URL.replace(/\/api\/v1\/?$/, "")
    const path = url.startsWith("/") ? url : `/${url}`
    absoluteUrl = `${baseUrl}${path}`
  }

  // Cloudinary dynamic asset delivery optimization (avif/webp auto format + quality auto)
  if (absoluteUrl.includes("res.cloudinary.com") && absoluteUrl.includes("/upload/")) {
    if (!absoluteUrl.includes("/upload/f_auto") && !absoluteUrl.includes("/upload/q_auto")) {
      absoluteUrl = absoluteUrl.replace("/upload/", "/upload/f_auto,q_auto/")
    }
  }

  return absoluteUrl
}

export interface BadgeInfo {
  label: string
  className: string
}

export function getBadgeInfo(badgeValue: string | null | undefined): BadgeInfo | null {
  if (!badgeValue) return null

  const norm = badgeValue.toLowerCase().replace(/[\s-]/g, '_')

  switch (norm) {
    case 'sale':
      return { label: 'Sale', className: 'bg-red-600 hover:bg-red-600 text-white font-medium' }
    case 'trending':
      return { label: 'Trending', className: 'bg-pink-600 hover:bg-pink-600 text-white font-medium' }
    case 'new_arrival':
    case 'new':
      return { label: 'New Arrival', className: 'bg-blue-600 hover:bg-blue-600 text-white font-medium' }
    case 'best_seller':
    case 'bestseller':
      return { label: 'Best Seller', className: 'bg-amber-600 hover:bg-amber-700 text-white font-medium' }
    case 'hot':
      return { label: 'Hot', className: 'bg-orange-600 hover:bg-orange-600 text-white font-medium' }
    case 'limited_edition':
    case 'limited':
      return { label: 'Limited Edition', className: 'bg-zinc-950 hover:bg-zinc-950 text-white border border-zinc-800 font-medium' }
    case 'featured':
      return { label: 'Featured', className: 'bg-emerald-600 hover:bg-emerald-600 text-white font-medium' }
    default:
      const label = badgeValue.split(/[\s_-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      return { label, className: 'bg-primary text-primary-foreground font-medium' }
  }
}

/**
 * Builds a valid WhatsApp wa.me base URL from a raw phone number or URL.
 * Automatically handles standard 10-digit Indian numbers (prepends country code 91),
 * leading zero prefixes, and existing wa.me links, while falling back to STORE_INFO.whatsappUrl.
 */
export function formatWhatsAppBaseUrl(phoneOrUrl?: string | null): string {
  if (!phoneOrUrl || typeof phoneOrUrl !== "string") {
    return STORE_INFO.whatsappUrl
  }

  const trimmed = phoneOrUrl.trim()
  if (!trimmed) {
    return STORE_INFO.whatsappUrl
  }

  // If already a full WhatsApp URL, extract base URL without query parameters
  if (trimmed.includes("wa.me") || trimmed.includes("api.whatsapp.com")) {
    const baseUrl = trimmed.split("?")[0].replace(/\/+$/, "")
    return baseUrl || STORE_INFO.whatsappUrl
  }

  const digits = trimmed.replace(/\D/g, "")
  if (!digits) {
    return STORE_INFO.whatsappUrl
  }

  // 10 digits (standard Indian mobile without country code) -> prepend 91
  if (digits.length === 10) {
    return `https://wa.me/91${digits}`
  }

  // 11 digits starting with 0 (e.g. 07399291242) -> strip 0 and prepend 91
  if (digits.length === 11 && digits.startsWith("0")) {
    return `https://wa.me/91${digits.slice(1)}`
  }

  return `https://wa.me/${digits}`
}

