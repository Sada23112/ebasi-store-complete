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
    <section id="collections" className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">Our Collections</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link href={`/product/${product.slug || product.id}`} key={product.id} className="block group">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300 h-full">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={getAbsoluteImageUrl(product.images?.[0]?.image || product.image)}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary">
                        ₹{parseFloat(product.price)?.toLocaleString?.() ?? product.price}
                      </span>
                      {product.compare_price && (
                        <span className="text-sm text-muted-foreground line-through">
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
