"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface RecentProduct {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  rating: number
  reviews: number
  viewedAt: string
}

interface RecentlyViewedProps {
  maxItems?: number
  showHeader?: boolean
  className?: string
}

export function RecentlyViewed({ maxItems = 6, showHeader = true, className = "" }: RecentlyViewedProps) {
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([])

  // Products would come from localStorage/API in a real app
  useEffect(() => {
    setRecentProducts([])
  }, [maxItems])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const formatViewedTime = (viewedAt: string) => {
    const now = new Date()
    const viewed = new Date(viewedAt)
    const diffInHours = Math.floor((now.getTime() - viewed.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  if (recentProducts.length === 0) {
    return null
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-serif font-bold">Recently Viewed</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setRecentProducts([])}>
            Clear All
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {recentProducts.map((product) => (
          <Card key={product.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all">
            <div className="relative overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={200}
                height={250}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart className="h-3 w-3" />
              </Button>
              <div className="absolute bottom-2 left-2">
                <Badge variant="secondary" className="text-xs">
                  {formatViewedTime(product.viewedAt)}
                </Badge>
              </div>
            </div>
            <CardContent className="p-3">
              <div className="flex items-center gap-1 mb-1">
                <div className="flex">{renderStars(Math.round(product.rating))}</div>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>
              <h3 className="font-medium text-sm line-clamp-2 mb-2">{product.name}</h3>
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm">₹{product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <Link href={`/product/${product.id}`} className="block mt-2">
                <Button size="sm" className="w-full text-xs">
                  View Again
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
