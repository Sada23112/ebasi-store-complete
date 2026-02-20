"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, Eye, BarChart3, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { QuickViewModal } from "./quick-view-modal"

interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  images: string[]
  rating: number
  reviews: number
  category: string
  colors?: string[]
  sizes?: string[]
  inStock: boolean
  stockCount: number
  description: string
  features: string[]
  badge?: string
}

interface ProductCardEnhancedProps {
  product: Product
  onAddToCart?: (productId: number, quantity: number, color?: string, size?: string) => void
  onAddToWishlist?: (productId: number) => void
  onAddToCompare?: (product: Product) => void
  showQuickView?: boolean
  showCompare?: boolean
}

export function ProductCardEnhanced({
  product,
  onAddToCart,
  onAddToWishlist,
  onAddToCompare,
  showQuickView = true,
  showCompare = true,
}: ProductCardEnhancedProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted)
    onAddToWishlist?.(product.id)
  }

  const handleAddToCompare = () => {
    onAddToCompare?.(product)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <>
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="relative overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={500}
            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.badge && <Badge className="bg-primary text-primary-foreground">{product.badge}</Badge>}
            {discountPercentage > 0 && (
              <Badge variant="secondary" className="bg-red-500 text-white">
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/80 hover:bg-white text-foreground"
              onClick={handleAddToWishlist}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            {showQuickView && (
              <Button
                size="icon"
                variant="ghost"
                className="bg-white/80 hover:bg-white text-foreground"
                onClick={() => setIsQuickViewOpen(true)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {showCompare && (
              <Button
                size="icon"
                variant="ghost"
                className="bg-white/80 hover:bg-white text-foreground"
                onClick={handleAddToCompare}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Quick Actions Overlay */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              className="w-full"
              size="sm"
              onClick={() => onAddToCart?.(product.id, 1)}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">{renderStars(Math.round(product.rating))}</div>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>
          <h3 className="font-medium text-foreground mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-foreground">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Color Options Preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xs text-muted-foreground mr-1">Colors:</span>
              {product.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-muted-foreground">+{product.colors.length - 4}</span>
              )}
            </div>
          )}

          <Link href={`/product/${product.id}`}>
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              View Details
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal
          product={product}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
        />
      )}
    </>
  )
}
