"use client"

import { useEffect, useState } from "react"
import { getAbsoluteImageUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { API_BASE_URL } from "@/lib/constants"

interface Product {
  id: number
  name: string
  price: number
  compare_price: number | null
  images: { id: number; image: string; is_primary: boolean }[]
  primary_image?: string | null
  rating?: number
  reviews_count?: number
  is_featured: boolean
  is_active: boolean
  stock_status: string
  slug: string
  category: { name: string; slug: string }
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${API_BASE_URL}/products/`)
        if (response.ok) {
          const data = await response.json()
          const productList = Array.isArray(data) ? data : (data.results || [])
          setProducts(productList.filter((p: any) => p.is_featured).slice(0, 4))
        }
      } catch (error) {
        console.error("Failed to fetch products", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return <div className="py-16 text-center">Loading featured products...</div>
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-20 lg:py-24 px-4 bg-background scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 tracking-tight">Featured Collection</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked collection of trending and bestselling pieces.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 animate-stagger-2">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-transparent hover:border-primary/20 premium-shadow hover:premium-shadow-hover transition-all duration-500 ease-out hover:-translate-y-1.5 bg-card/50 backdrop-blur-sm"
            >
              <div className="relative overflow-hidden bg-muted">
                <Image
                  src={getAbsoluteImageUrl(product.primary_image || (product.images && product.images.length > 0 ? product.images[0].image : null) || "/images/placeholders/placeholder.svg")}
                  alt={product.name}
                  width={400}
                  height={500}
                  className="w-full h-48 sm:h-80 object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.05]"
                />
                
                {/* Gradient overlay for text contrast if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {product.is_featured && <Badge className="absolute top-3 left-3 bg-primary/95 backdrop-blur-sm text-primary-foreground premium-shadow">Featured</Badge>}
              </div>
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({product.reviews_count || 0})</span>
                </div>
                <h3 className="font-medium text-foreground mb-2 line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                <div className="flex flex-wrap items-baseline gap-1.5 mb-3 min-w-0">
                  <span className="text-base sm:text-lg font-bold text-foreground shrink-0">₹{product.price}</span>
                  {product.compare_price && (
                    <div className="flex items-center gap-1 flex-wrap min-w-0">
                      <span className="text-xs sm:text-sm text-muted-foreground line-through shrink-0">₹{product.compare_price}</span>
                      <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0 h-4 sm:h-5">
                        {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
                      </Badge>
                    </div>
                  )}
                </div>
                <Link href={`/product/${product.slug}`}>
                  <Button className="w-full" size="sm">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/shop">
            <Button variant="outline" size="lg" className="bg-transparent">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
