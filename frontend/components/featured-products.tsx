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
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Featured Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked collection of trending and bestselling pieces
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={getAbsoluteImageUrl(product.primary_image || (product.images && product.images.length > 0 ? product.images[0].image : null) || "/images/placeholders/placeholder.svg")}
                  alt={product.name}
                  width={400}
                  height={500}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.is_featured && <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">Featured</Badge>}
              </div>
              <CardContent className="p-4">
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
                <h3 className="font-medium text-foreground mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-foreground">₹{product.price}</span>
                  {product.compare_price && (
                    <>
                      <span className="text-sm text-muted-foreground line-through">₹{product.compare_price}</span>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
                      </Badge>
                    </>
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
