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

    // Decouple search query parameters from page view tracking so keystrokes do not re-trigger trackPageView
    const params = new URLSearchParams(searchParams?.toString() || "")
    params.delete("search")
    params.delete("q")
    const queryString = params.toString()
    const trackedPath = queryString ? `${pathname}?${queryString}` : pathname

    if (trackedPath !== lastTrackedPath.current) {
      lastTrackedPath.current = trackedPath
      trackPageView(trackedPath)
    }
  }, [pathname, searchParams])

  return null
}
