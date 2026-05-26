"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

import { API_BASE_URL } from "@/lib/constants"
import { getAbsoluteImageUrl } from "@/lib/utils"

export function CollectionsSection() {
  const [categories, setCategories] = useState<string[]>(["All Products"])
  const [products, setProducts] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState("All Products")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    // Fetch products and categories from backend
    Promise.all([
      fetch(`${API_BASE_URL}/products/`).then(r => r.json()),
      fetch(`${API_BASE_URL}/categories/`).then(r => r.json())
    ]).then(([productsData, categoriesData]) => {
      const p = Array.isArray(productsData) ? productsData : (productsData.results || [])
      setProducts(p)
      const catList = Array.isArray(categoriesData) ? categoriesData.map((cat: any) => cat.name) : []
      setCategories(["All Products", ...catList])
    }).catch((err) => {
      console.error('API error:', err)
    }).finally(() => setLoading(false))
  }, [])

  const filteredProducts =
    activeCategory === "All Products"
      ? products
      : products.filter((product) => product.category?.name === activeCategory || product.category === activeCategory)

  if (loading) {
    return (
      <section id="collections" className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">Our Collections</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
              Loading EBASI products...
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="collections" className="py-20 lg:py-24 bg-background scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 tracking-tight">Our Collections</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Explore our carefully curated collection of traditional and contemporary fashion pieces, designed to
            celebrate your unique style.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => {
            if (category === "All Products") {
              return (
                <Link key={category} href="/shop">
                  <Button
                    variant={activeCategory === category ? "default" : "outline"}
                    className={
                      activeCategory === category
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "border-primary text-primary-dark hover:bg-primary hover:text-primary-foreground"
                    }
                  >
                    {category}
                  </Button>
                </Link>
              )
            }
            return (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className={
                  activeCategory === category
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "border-primary text-primary-dark hover:bg-primary hover:text-primary-foreground"
                }
              >
                {category}
              </Button>
            )
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 animate-stagger-2">
          {filteredProducts.map((product) => (
            <Link href={`/product/${product.slug || product.id}`} key={product.id} className="block group">
              <Card className="cursor-pointer overflow-hidden rounded-2xl border border-transparent hover:border-primary/20 premium-shadow hover:premium-shadow-hover transition-all duration-500 ease-out hover:-translate-y-1.5 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 bg-card/50 backdrop-blur-sm h-full">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden bg-muted">
                    <img
                      src={getAbsoluteImageUrl(product.images?.[0]?.image || product.image)}
                      alt={product.name}
                      className="w-full h-48 sm:h-64 object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.05]"
                    />
                    {/* Gradient overlay for text contrast if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                  <div className="p-3 sm:p-5 space-y-2">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1 text-sm sm:text-base">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap items-baseline gap-1.5 min-w-0">
                      <span className="text-base sm:text-lg font-bold text-primary shrink-0">
                        ₹{parseFloat(product.price)?.toLocaleString?.() ?? product.price}
                      </span>
                      {product.compare_price && (
                        <span className="text-xs sm:text-sm text-muted-foreground line-through shrink-0">
                          ₹{parseFloat(product.compare_price).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View More Button */}

      </div>
    </section>
  )
}
