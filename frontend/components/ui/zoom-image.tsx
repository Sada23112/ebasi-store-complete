"use client"

import { useState, useRef, type MouseEvent } from "react"
import Image from "next/image"
import { ZoomIn } from "lucide-react"
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
    const [position, setPosition] = useState({ x: 50, y: 50 })
    const imageRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return

        const { left, top, width, height } = imageRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100))
        const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100))

        setPosition({ x, y })
    }

    return (
        <div
            ref={imageRef}
            className={cn("relative overflow-hidden cursor-crosshair group select-none", className)}
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
        >
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                priority={priority}
            />

            {/* Inspect Hint Badge */}
            <div className="absolute top-3 right-3 hidden md:flex items-center gap-1.5 bg-background/80 backdrop-blur-md text-foreground text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/40 shadow-xs pointer-events-none transition-opacity duration-300 opacity-90 group-hover:opacity-0 z-10">
                <ZoomIn className="h-3 w-3 text-primary" />
                Hover to inspect weave
            </div>

            {/* Desktop Zoom Lens */}
            <div
                className={cn(
                    "absolute inset-0 pointer-events-none hidden md:block transition-opacity duration-300 ease-out",
                    showZoom ? "opacity-100" : "opacity-0"
                )}
                style={{
                    backgroundImage: `url(${src})`,
                    backgroundPosition: `${position.x}% ${position.y}%`,
                    backgroundSize: "220%",
                    backgroundRepeat: "no-repeat",
                }}
            />
        </div>
    )
}
