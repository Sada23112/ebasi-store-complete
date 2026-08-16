"use client"

import { useEffect, useState } from "react"
import { getAbsoluteImageUrl, getBadgeInfo } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { API_BASE_URL } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useWishlist } from "@/lib/wishlist"
import { ScrollReveal } from "@/components/scroll-reveal"

interface Product {
  id: number
  name: string
  price: number
  compare_price: number | null
  images: { id: number; image: string; is_primary: boolean }[]
  primary_image?: string | null
  average_rating?: number
  review_count?: number
  is_featured: boolean
  is_active: boolean
  stock_status: string
  badge?: string | null
  slug: string
  category: { name: string; slug: string }
}

import { ProductGridSkeleton } from "@/components/skeletons"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [poppingId, setPoppingId] = useState<number | null>(null)
  const { toggle, isSaved } = useWishlist()

  useEffect(() => {
    async function fetchProducts() {
      try {
        let response = await fetch(`${API_BASE_URL}/products/featured/`)
        let list: Product[] = []

        if (response.ok) {
          const data = await response.json()
          list = Array.isArray(data) ? data : (data.results || [])
        }

        // Fallback to all products if featured endpoint returns empty
        if (list.length === 0) {
          response = await fetch(`${API_BASE_URL}/products/`)
          if (response.ok) {
            const data = await response.json()
            list = Array.isArray(data) ? data : (data.results || [])
          }
        }

        setProducts(list.slice(0, 8))
      } catch (error) {
        console.error("Failed to fetch products", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section className="py-20 lg:py-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 tracking-tight">Featured Collection</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked collection of trending and bestselling pieces.
            </p>
          </div>
          <ProductGridSkeleton count={4} />
        </div>
      </section>
    )
  }

  const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    setPoppingId(product.id)
    setTimeout(() => setPoppingId(null), 350)
    toggle({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compare_price: product.compare_price,
      primary_image: product.primary_image,
      stock_status: product.stock_status,
      category: product.category,
    })
  }

  return (
    <section className="py-12 sm:py-20 lg:py-24 px-3 sm:px-4 bg-background scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4 tracking-tight">Featured Collection</h2>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Discover our handpicked collection of trending and bestselling pieces.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
          {products.map((product, idx) => {
            const saved = isSaved(product.id)
            const isOutOfStock = product.stock_status === 'out_of_stock'

            return (
              <ScrollReveal key={product.id} delay={idx * 100} direction="up">
                <div className="relative group flex flex-col h-full">
                  <Link href={`/product/${product.slug || product.id}`} className="block h-full cursor-pointer">
                    <Card className="overflow-hidden rounded-xl sm:rounded-2xl border border-transparent hover:border-primary/20 premium-shadow hover:premium-shadow-hover transition-all duration-300 ease-out hover:-translate-y-1 bg-card/50 backdrop-blur-sm h-full flex flex-col justify-between">
                      <div className="relative overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-muted hover-scale-img">
                        <Image
                          src={getAbsoluteImageUrl(product.primary_image || (product.images && product.images.length > 0 ? product.images[0].image : null) || "/images/placeholders/placeholder.svg")}
                          alt={product.name}
                          width={400}
                          height={500}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="w-full h-44 sm:h-80 object-cover rounded-t-xl sm:rounded-t-2xl"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        {/* Wishlist Button with Heart Pop Animation */}
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                          className={cn(
                            "absolute top-2 right-2 sm:top-3 sm:right-3 z-20 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md transition-all active:scale-90 min-h-[36px] min-w-[36px] sm:min-h-0 sm:min-w-0 focus-visible:ring-2 focus-visible:ring-primary",
                            saved ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground",
                            poppingId === product.id && "animate-heart-pop"
                          )}
                          onClick={(e) => handleWishlistToggle(e, product)}
                          title={saved ? "Remove from wishlist" : "Save to wishlist"}
                        >
                          <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
                        </Button>

                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10 pointer-events-none">
                          {isOutOfStock && (
                            <Badge variant="secondary" className="bg-red-600 text-white font-medium shadow-md text-[9px] sm:text-xs px-1.5 py-0">
                              Out of Stock
                            </Badge>
                          )}
                          {product.compare_price && product.compare_price > product.price && (
                            <Badge className={getBadgeInfo('sale')?.className + " shadow-md text-[9px] sm:text-xs px-1.5 py-0"}>
                              Sale
                            </Badge>
                          )}
                          {product.badge ? (
                            getBadgeInfo(product.badge) && (
                              <Badge className={getBadgeInfo(product.badge)?.className + " shadow-md text-[9px] sm:text-xs px-1.5 py-0"}>
                                {getBadgeInfo(product.badge)?.label}
                              </Badge>
                            )
                          ) : (
                            product.is_featured && (
                              <Badge className={getBadgeInfo('featured')?.className + " shadow-md text-[9px] sm:text-xs px-1.5 py-0"}>
                                Featured
                              </Badge>
                            )
                          )}
                        </div>
                      </div>

                      <CardContent className="p-2.5 sm:p-5 flex flex-col justify-between flex-1">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1 mb-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < Math.floor(product.average_rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] sm:text-xs text-muted-foreground">({product.review_count || 0})</span>
                          </div>
                          <h3 className="font-sans font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-xs sm:text-base leading-snug tracking-tight">{product.name}</h3>
                          <div className="flex flex-wrap items-baseline gap-1 mb-2 min-w-0">
                            <span className="text-sm sm:text-lg font-bold text-foreground shrink-0">₹{product.price}</span>
                            {product.compare_price && (
                              <div className="flex items-center gap-1 flex-wrap min-w-0">
                                <span className="text-[11px] sm:text-sm text-muted-foreground line-through shrink-0">₹{product.compare_price}</span>
                                <Badge variant="secondary" className="text-[9px] sm:text-xs px-1 py-0 h-4">
                                  {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 block">
                          <div className={cn(buttonVariants({ size: "sm" }), "w-full text-center text-xs sm:text-sm transition-all duration-300 active:scale-[0.98] py-1.5 h-8 sm:h-9")}>
                            {isOutOfStock ? "Inquire Restock" : "View Details"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        <ScrollReveal direction="up" delay={200}>
          <div className="text-center">
            <Link href="/shop">
              <Button variant="outline" size="lg" className="bg-transparent hover:bg-primary hover:text-white transition-all duration-300 active:scale-[0.98]">
                View All Products
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
