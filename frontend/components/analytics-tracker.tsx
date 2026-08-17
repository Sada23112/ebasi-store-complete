"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { trackPageView } from "@/lib/analytics"

export function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastTrackedPath = useRef<string>("")

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return
    const queryString = searchParams?.toString()
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname

    if (fullPath !== lastTrackedPath.current) {
      lastTrackedPath.current = fullPath
      trackPageView(fullPath)
    }
  }, [pathname, searchParams])

  return null
}
