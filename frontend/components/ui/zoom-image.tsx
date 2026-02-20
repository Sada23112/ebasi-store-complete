"use client"

import { useState, useRef, type MouseEvent } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ZoomableImageProps {
    src: string
    alt: string
    width?: number
    height?: number
    className?: string
    priority?: boolean
}

export function ZoomableImage({ src, alt, width, height, className, priority = false }: ZoomableImageProps) {
    const [showZoom, setShowZoom] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const imageRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return

        const { left, top, width, height } = imageRef.current.getBoundingClientRect()
        const x = ((e.clientX - left) / width) * 100
        const y = ((e.clientY - top) / height) * 100

        setPosition({ x, y })
    }

    return (
        <div
            ref={imageRef}
            className={cn("relative overflow-hidden cursor-crosshair group", className)}
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
        >
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                priority={priority}
            />

            {/* Zoom Lens / Result */}
            {showZoom && (
                <div
                    className="absolute inset-0 pointer-events-none hidden md:block" // Only show on desktop
                    style={{
                        backgroundImage: `url(${src})`,
                        backgroundPosition: `${position.x}% ${position.y}%`,
                        backgroundSize: "200%", // 2x Zoom level
                        backgroundRepeat: "no-repeat",
                    }}
                />
            )}
        </div>
    )
}
