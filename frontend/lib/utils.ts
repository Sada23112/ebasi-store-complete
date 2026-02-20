import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { API_BASE_URL } from "@/lib/constants"

export function getAbsoluteImageUrl(url: string | null | undefined): string {
  if (!url) return "/images/placeholders/placeholder.svg"
  if (url.startsWith("http")) return url
  if (url.startsWith("data:")) return url

  // Remove /api/v1 suffix if present to get the root URL
  const baseUrl = API_BASE_URL.replace(/\/api\/v1\/?$/, "")

  // Ensure url starts with / if not present
  const path = url.startsWith("/") ? url : `/${url}`

  return `${baseUrl}${path}`
}
