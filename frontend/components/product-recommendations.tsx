"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { RecommendationEngine } from "@/lib/recommendation-engine"
import { CartNotification } from "@/components/cart-notification"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { API_BASE_URL } from "@/lib/constants"
import { getAbsoluteImageUrl } from "@/lib/utils"


interface ProductRecommendationsProps {
  title: string
  type: "similar" | "personalized" | "trending" | "sale" | "frequently-bought"
  productId?: number
  limit?: number
  className?: string
}

export function ProductRecommendations({
  title,
  type,
  productId,
  limit = 4,
  className = "",
}: ProductRecommendationsProps) {
  const { addToCart, state: cartState } = useCart()
  const [products, setProducts] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<{
    isVisible: boolean
    product: { name: string; image: string; price: number } | null
  }>({
    isVisible: false,
    product: null,
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${API_BASE_URL}/products/`)
        if (!response.ok) return
        const data = await response.json()
        const rawProducts = Array.isArray(data) ? data : (data.results || [])

        // Adapt products for RecommendationEngine
        const engineProducts = rawProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: parseFloat(p.price),
          originalPrice: p.compare_price ? parseFloat(p.compare_price) : parseFloat(p.price),
          images: p.primary_image ? [p.primary_image] : (p.images?.map((img: any) => img.image) || []),
          rating: p.rating || 0,
          reviews: p.reviews_count || 0,
          category: p.category?.name || "Uncategorized",
          inStock: p.stock_status !== 'out_of_stock',
          stockCount: p.stock_quantity || 0,
          description: p.description || "",
          features: [], // API might not have features array yet
          badge: p.is_featured ? "Featured" : undefined
        }))

        const engine = new RecommendationEngine(engineProducts, {
          viewedProducts: [1, 2, 3], // Should come from context/storage
          cartItems: cartState.items.map((item) => item.id),
          purchasedProducts: [],
          searchQueries: [],
          categoryPreferences: {},
        })

        let recommendedProducts: any[] = []

        switch (type) {
          case "similar":
            if (productId) {
              recommendedProducts = engine.getSimilarProducts(productId, limit)
            }
            break
          case "personalized":
            recommendedProducts = engine.getPersonalizedRecommendations(limit)
            break
          case "trending":
            recommendedProducts = engine.getTrendingProducts(limit)
            break
          case "sale":
            recommendedProducts = engine.getSaleProducts(limit)
            break
          case "frequently-bought":
            if (productId) {
              recommendedProducts = engine.getFrequentlyBoughtTogether(productId, limit)
            }
            break
        }

        // Fallback if recommendation engine returns empty (e.g. not enough data)
        if (recommendedProducts.length === 0 && rawProducts.length > 0) {
          recommendedProducts = engineProducts.slice(0, limit)
        }

        setProducts(recommendedProducts)
      } catch (error) {
        console.error("Failed to fetch products for recommendations", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [type, productId, limit, cartState.items])

  const handleAddToCart = (product: any) => {
    addToCart(product, 1)

    setNotification({
      isVisible: true,
      product: {
        name: product.name,
        image: getAbsoluteImageUrl(product.images && product.images.length > 0 ? product.images[0] : null),
        price: product.price,
      },
    })
  }

  const handleCloseNotification = () => {
    setNotification({ isVisible: false, product: null })
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, products.length - limit + 1))
  }

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + Math.max(1, products.length - limit + 1)) % Math.max(1, products.length - limit + 1),
    )
  }

  if (products.length === 0) return null

  const visibleProducts = products.slice(currentIndex, currentIndex + limit)

  return (
    <section className={`py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          {products.length > limit && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="h-8 w-8 bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                disabled={currentIndex >= products.length - limit}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProducts.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={getAbsoluteImageUrl(product.images && product.images.length > 0 ? product.images[0] : null)}
                  alt={product.name}
                  width={300}
                  height={400}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.badge && (
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">{product.badge}</Badge>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-3 right-3 bg-white/80 hover:bg-white text-foreground"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-medium text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-foreground">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    </>
                  )}
                </div>
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <CartNotification
        isVisible={notification.isVisible}
        product={notification.product}
        onClose={handleCloseNotification}
      />
    </section>
  )
}
