"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  productId: string
  isWishlisted?: boolean
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "ghost" | "outline"
  className?: string
  showText?: boolean
  onToggle?: (productId: string, isWishlisted: boolean) => void
}

export function WishlistButton({
  productId,
  isWishlisted = false,
  size = "default",
  variant = "ghost",
  className,
  showText = false,
  onToggle,
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(isWishlisted)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newState = !isInWishlist
      setIsInWishlist(newState)
      setIsLoading(false)
      onToggle?.(productId, newState)
    }, 300)
  }

  const sizeClasses = {
    default: "h-10 w-10",
    sm: "h-8 w-8",
    lg: "h-12 w-12",
    icon: "h-10 w-10",
  }

    default: "w-5 h-5",
    sm: "w-4 h-4",
      lg: "w-6 h-6",
        icon: "w-5 h-5",

  return (
    <Button
      variant={variant}
      size={showText ? size : "icon"}
      className={cn(
        !showText && sizeClasses[size],
        "transition-all duration-200",
        isInWishlist && "text-red-500 hover:text-red-600",
        className,
      )}
      onClick={handleToggle}
      disabled={isLoading}
    >
      <Heart
        className={cn(
          iconSizes[size],
          "transition-all duration-200",
          isInWishlist && "fill-current",
          isLoading && "animate-pulse",
        )}
      />
      {showText && <span className="ml-2">{isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}</span>}
    </Button>
  )
}
