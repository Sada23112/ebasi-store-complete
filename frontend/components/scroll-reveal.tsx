"use client"

import { useEffect, useRef, useState, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Immediately reveal if user prefers reduced motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -20px 0px",
      }
    )

    observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [])

  const getDirectionClass = () => {
    if (isVisible) return "opacity-100 translate-x-0 translate-y-0"

    switch (direction) {
      case "up":
        return "opacity-0 translate-y-6"
      case "down":
        return "opacity-0 -translate-y-6"
      case "left":
        return "opacity-0 translate-x-6"
      case "right":
        return "opacity-0 -translate-x-6"
      case "none":
        return "opacity-0"
      default:
        return "opacity-0 translate-y-6"
    }
  }

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out",
        !isVisible && "will-change-transform",
        getDirectionClass(),
        className
      )}
    >
      {children}
    </div>
  )
}
