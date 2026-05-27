"use client"

import { useState, useEffect, useMemo } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, Grid3X3, List, Star, SlidersHorizontal, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getAbsoluteImageUrl, getBadgeInfo } from "@/lib/utils"

const BADGES = [
  { key: "All", label: "All Badges" },
  { key: "trending", label: "Trending" },
  { key: "new_arrival", label: "New Arrival" },
  { key: "best_seller", label: "Best Seller" },
  { key: "hot", label: "Hot" },
  { key: "limited_edition", label: "Limited Edition" },
  { key: "featured", label: "Featured" }
]

interface FilterSidebarProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  categories: string[]
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  selectedBadge: string
  setSelectedBadge: (value: string) => void
  maxPrice: number[]
  setMaxPrice: (value: number[]) => void
  showInStockOnly: boolean
  setShowInStockOnly: (value: boolean) => void
  showOnSaleOnly: boolean
  setShowOnSaleOnly: (value: boolean) => void
  clearAllFilters: () => void
}

function FilterSidebar({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedBadge,
  setSelectedBadge,
  maxPrice,
  setMaxPrice,
  showInStockOnly,
  setShowInStockOnly,
  showOnSaleOnly,
  setShowOnSaleOnly,
  clearAllFilters,
}: FilterSidebarProps) {
  return (
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

      {/* Badges */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Filter by Badge</h3>
        <div className="space-y-1">
          {BADGES.map((badgeItem) => (
            <Button
              key={badgeItem.key}
              variant={selectedBadge === badgeItem.key ? "default" : "ghost"}
              className="w-full justify-start text-xs font-normal"
              onClick={() => setSelectedBadge(badgeItem.key)}
              size="sm"
            >
              {badgeItem.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Max Price</h3>
        <div className="px-2">
          <Slider 
             value={maxPrice} 
             onValueChange={setMaxPrice} 
             max={100000} 
             min={0} 
             step={500} 
             className="mb-4" 
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹0</span>
            <span>Up to ₹{maxPrice[0]}</span>
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
}

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedBadge, setSelectedBadge] = useState("All")
  const [maxPrice, setMaxPrice] = useState([100000]) // Single max price value
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [showOnSaleOnly, setShowOnSaleOnly] = useState(false)
  const [mounted, setMounted] = useState(false)

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
    setMounted(true)
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

    // Badge filter
    if (selectedBadge !== "All") {
      filtered = filtered.filter((product) => product.badge === selectedBadge)
    }

    // Price filter
    filtered = filtered.filter((product) => {
      const price = parseFloat(product.price)
      return price <= maxPrice[0]
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
  }, [products, searchQuery, selectedCategory, selectedBadge, maxPrice, sortBy, showInStockOnly, showOnSaleOnly])

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setSelectedBadge("All")
    setMaxPrice([100000])
    setShowInStockOnly(false)
    setShowOnSaleOnly(false)
  }

  const filtersProps = {
    searchQuery,
    setSearchQuery,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedBadge,
    setSelectedBadge,
    maxPrice,
    setMaxPrice,
    showInStockOnly,
    setShowInStockOnly,
    showOnSaleOnly,
    setShowOnSaleOnly,
    clearAllFilters,
  }

  return (
    <div className="min-h-screen bg-background">
      

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
                <FilterSidebar {...filtersProps} />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  {/* Mobile Filter */}
                  {mounted && (
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
                          <FilterSidebar {...filtersProps} />
                        </div>
                      </SheetContent>
                    </Sheet>
                  )}

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
                      ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredProducts.map((product) => (
                    <Link href={`/product/${product.slug || product.id}`} key={product.id} className="block group">
                      <Card
                        className={`cursor-pointer overflow-hidden border border-transparent hover:border-primary/20 shadow-sm hover:shadow-lg transition-all duration-300 h-full ${viewMode === "list" ? "flex" : ""
                          }`}
                      >
                        {/* Image */}
                        <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                          <Image
                            src={getAbsoluteImageUrl(product.primary_image || null)}
                            alt={product.name}
                            width={400}
                            height={viewMode === "list" ? 300 : 500}
                            className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${viewMode === "list" ? "h-full" : "h-48 sm:h-80"
                              }`}
                          />
                          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
                            {product.stock_status !== 'in_stock' && <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0 h-4 sm:h-5">Out of Stock</Badge>}
                            {product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price) && (
                              <Badge className={getBadgeInfo('sale')?.className + " text-[10px] sm:text-xs px-1.5 py-0 h-4 sm:h-5 shadow-sm"}>
                                Sale
                              </Badge>
                            )}
                            {product.badge ? (
                              getBadgeInfo(product.badge) && (
                                <Badge className={getBadgeInfo(product.badge)?.className + " text-[10px] sm:text-xs px-1.5 py-0 h-4 sm:h-5 shadow-sm"}>
                                  {getBadgeInfo(product.badge)?.label}
                                </Badge>
                              )
                            ) : (
                              product.is_featured && (
                                <Badge className={getBadgeInfo('trending')?.className + " text-[10px] sm:text-xs px-1.5 py-0 h-4 sm:h-5 shadow-sm"}>
                                  Trending
                                </Badge>
                              )
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <CardContent className={cn("p-3 sm:p-4 flex flex-col justify-between", viewMode === "list" ? "flex-1 h-auto" : "h-[calc(100%-192px)] sm:h-[calc(100%-320px)]")}>
                          <div className="space-y-2">
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
                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                              {product.category?.name || "Uncategorized"}
                            </p>
                            <div className="flex flex-wrap items-baseline gap-1.5 mb-3 min-w-0">
                              <span className="text-base sm:text-lg font-bold text-foreground shrink-0">₹{product.price}</span>
                              {product.compare_price && (
                                <span className="text-xs sm:text-sm text-muted-foreground line-through shrink-0">₹{product.compare_price}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <div 
                              className={cn(
                                buttonVariants({ size: "sm" }), 
                                "w-full text-center",
                                product.stock_status !== 'in_stock' && "opacity-50 pointer-events-none"
                              )}
                            >
                              {product.stock_status === 'in_stock' ? "View Details" : "Out of Stock"}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      
    </div>
  )
}
