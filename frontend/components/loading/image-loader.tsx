"use client"

import { useState } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ImageLoaderProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  priority?: boolean
  sizes?: string
}

export function ImageLoader({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
  priority = false,
  sizes,
}: ImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <Skeleton className={cn("absolute inset-0 z-10", fill ? "w-full h-full" : `w-[${width}px] h-[${height}px]`)} />
      )}

      {hasError ? (
        <div
          className={cn(
            "flex items-center justify-center bg-muted text-muted-foreground text-sm",
            fill ? "absolute inset-0" : `w-[${width}px] h-[${height}px]`,
          )}
        >
          Failed to load image
        </div>
      ) : (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          sizes={sizes}
          className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100")}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  )
}
