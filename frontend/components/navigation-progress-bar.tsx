"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function triggerNavigationStart() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ebasi:nav-start"))
  }
}

export function NavigationProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isNavigatingRef = useRef(false)

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current)
    timerRef.current = null
    fadeTimerRef.current = null
    safetyTimerRef.current = null
  }, [])

  const startProgress = useCallback(() => {
    cleanup()
    isNavigatingRef.current = true
    setIsFadingOut(false)
    setVisible(true)
    setProgress(20)

    // Trickle progress up to ~85%
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 85
        }
        // Small random increment for smooth natural feel
        const diff = Math.max(1, (85 - prev) * 0.15)
        return Math.min(85, prev + diff)
      })
    }, 150)

    // Safety timeout: reset if navigation takes longer than 8 seconds
    safetyTimerRef.current = setTimeout(() => {
      completeProgress()
    }, 8000)
  }, [cleanup])

  const completeProgress = useCallback(() => {
    if (!isNavigatingRef.current && progress === 0) return
    isNavigatingRef.current = false

    if (timerRef.current) clearInterval(timerRef.current)
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current)

    setProgress(100)

    // Wait for 100% fill animation, then fade out
    fadeTimerRef.current = setTimeout(() => {
      setIsFadingOut(true)
      fadeTimerRef.current = setTimeout(() => {
        setVisible(false)
        setProgress(0)
        setIsFadingOut(false)
      }, 200)
    }, 150)
  }, [progress])

  // Detect route changes (pathname or searchParams)
  useEffect(() => {
    if (isNavigatingRef.current) {
      completeProgress()
    }
  }, [pathname, searchParams, completeProgress])

  // Setup click and popstate listeners
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      // Ignore modified clicks or non-primary clicks
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return

      const target = e.target as HTMLElement
      const anchor = target.closest("a")
      if (!anchor) return

      // Ignore links with target="_blank"
      if (anchor.target && anchor.target !== "_self") return

      // Check href attribute
      const rawHref = anchor.getAttribute("href")
      if (!rawHref) return

      // Ignore hash-only, mailto, tel, javascript, whatsapp
      if (
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("javascript:") ||
        rawHref.includes("wa.me")
      ) {
        return
      }

      // Check domain origin
      const currentOrigin = window.location.origin
      const targetUrl = new URL(anchor.href, currentOrigin)
      if (targetUrl.origin !== currentOrigin) return

      // Check if navigating to exact same page (same pathname + search + hash)
      const currentFullUrl = window.location.pathname + window.location.search + window.location.hash
      const targetFullUrl = targetUrl.pathname + targetUrl.search + targetUrl.hash

      if (currentFullUrl === targetFullUrl) return

      // Ignore if only hash changed on current page
      if (
        targetUrl.pathname === window.location.pathname &&
        targetUrl.search === window.location.search &&
        targetUrl.hash !== window.location.hash
      ) {
        return
      }

      // Valid internal navigation start!
      startProgress()
    }

    const handlePopState = () => {
      startProgress()
    }

    const handleCustomNavStart = () => {
      startProgress()
    }

    window.addEventListener("click", handleAnchorClick, { capture: true })
    window.addEventListener("popstate", handlePopState)
    window.addEventListener("ebasi:nav-start", handleCustomNavStart)

    return () => {
      window.removeEventListener("click", handleAnchorClick, { capture: true })
      window.removeEventListener("popstate", handlePopState)
      window.removeEventListener("ebasi:nav-start", handleCustomNavStart)
      cleanup()
    }
  }, [startProgress, cleanup])

  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[100] h-[2.5px] pointer-events-none overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-pink-500 via-primary to-pink-400 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(219,39,119,0.7),0_0_4px_rgba(219,39,119,0.5)]"
        style={{
          width: `${progress}%`,
          opacity: isFadingOut ? 0 : 1,
          transitionProperty: "width, opacity",
          transitionDuration: isFadingOut ? "200ms" : "300ms",
        }}
      />
    </div>
  )
}
