"use client"

import { useState, useEffect, useMemo } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, Grid3X3, List, Star, SlidersHorizontal, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { API_BASE_URL } from "@/lib/constants"
import { getAbsoluteImageUrl } from "@/lib/utils"

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  // For backend data, we might dynamically fetch categories/colors/fabrics or keep hardcoded for now
  // Let's keep filters simple for now or extract unique values from fetched products
  const [priceRange, setPriceRange] = useState([0, 100000]) // Increased max range
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [showOnSaleOnly, setShowOnSaleOnly] = useState(false)

  // Derived state for filters
  const [categories, setCategories] = useState<string[]>(["All"])

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/products/`)
        if (response.ok) {
          const data = await response.json()
          const list = Array.isArray(data) ? data : (data.results || [])
          setProducts(list)

          // Extract categories
          const cats = new Set<string>(["All"])
          list.forEach((p: any) => {
            if (p.category?.name) cats.add(p.category.name)
          })
          setCategories(Array.from(cats))
        }
      } catch (error) {
        console.error("Failed to fetch products", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category?.name === selectedCategory)
    }

    // Price filter
    filtered = filtered.filter((product) => {
      const price = parseFloat(product.price)
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Stock filter
    if (showInStockOnly) {
      filtered = filtered.filter((product) => product.stock_status === 'in_stock')
    }

    // On Sale filter
    if (showOnSaleOnly) {
      filtered = filtered.filter((product) => product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price))
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
        break
      case "price-high":
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        break
      case "rating":
        filtered.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        break
      default:
        // Featured or default order
        break
    }

    return filtered
  }, [products, searchQuery, selectedCategory, priceRange, sortBy, showInStockOnly, showOnSaleOnly])

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setPriceRange([0, 100000])
    setShowInStockOnly(false)
    setShowOnSaleOnly(false)
  }

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Price Range</h3>
        <div className="px-2">
          <Slider value={priceRange} onValueChange={setPriceRange} max={10000} min={0} step={100} className="mb-4" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Availability</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="in-stock" checked={showInStockOnly} onCheckedChange={(checked) => setShowInStockOnly(checked as boolean)} />
            <label htmlFor="in-stock" className="text-sm text-foreground">
              In Stock Only
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="on-sale" checked={showOnSaleOnly} onCheckedChange={(checked) => setShowOnSaleOnly(checked as boolean)} />
            <label htmlFor="on-sale" className="text-sm text-foreground">
              On Sale
            </label>
          </div>
        </div>
      </div>

      <Button variant="outline" onClick={clearAllFilters} className="w-full bg-transparent">
        Clear All Filters
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        {/* Header */}
        <section className="py-8 px-4 border-b">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Shop</h1>
            <p className="text-muted-foreground">Explore our collection of premium ethnic wear</p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  {/* Mobile Filter */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden bg-transparent">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterSidebar />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <span className="text-sm text-muted-foreground">{filteredProducts.length} products found</span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Toggle */}
                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">No products found matching your criteria</p>
                  <Button onClick={clearAllFilters}>Clear All Filters</Button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className={`group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 ${viewMode === "list" ? "flex" : ""
                        }`}
                    >
                      {/* Image */}
                      <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                        <Image
                          src={getAbsoluteImageUrl(product.primary_image || null)}
                          alt={product.name}
                          width={400}
                          height={viewMode === "list" ? 300 : 500}
                          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${viewMode === "list" ? "h-full" : "h-80"
                            }`}
                        />
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          {product.is_featured && <Badge className="bg-primary text-primary-foreground">Trending</Badge>}
                          {product.stock_status !== 'in_stock' && <Badge variant="secondary">Out of Stock</Badge>}
                          {product.compare_price && (
                            <Badge className="bg-red-500 text-white">
                              {Math.round(((parseFloat(product.compare_price) - parseFloat(product.price)) / parseFloat(product.compare_price)) * 100)}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < Math.floor(product.average_rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">({product.review_count || 0})</span>
                        </div>
                        <h3 className="font-medium text-foreground mb-2 line-clamp-2">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.category?.name || "Uncategorized"}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg font-bold text-foreground">₹{product.price}</span>
                          {product.compare_price && (
                            <span className="text-sm text-muted-foreground line-through">₹{product.compare_price}</span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/product/${product.slug || product.id}`} className="flex-1">
                            <Button className="w-full" size="sm" disabled={product.stock_status !== 'in_stock'}>
                              {product.stock_status === 'in_stock' ? "View Details" : "Out of Stock"}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
