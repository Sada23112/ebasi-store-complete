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
import { API_BASE_URL } from "@/lib/constants"

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
  categories: any[]
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  selectedBadge: string
  setSelectedBadge: (value: string) => void
  maxPrice: number[]
  setMaxPrice: (value: number[]) => void
  dbMaxPrice: number
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
  dbMaxPrice,
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
              key={category.slug}
              variant={selectedCategory === category.slug ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedCategory(category.slug)}
            >
              {category.name}
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
             max={dbMaxPrice} 
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
  const [dbMaxPrice, setDbMaxPrice] = useState(100000)
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [showOnSaleOnly, setShowOnSaleOnly] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Categories states
  const [categories, setCategories] = useState<any[]>([{ name: "All", slug: "All" }])

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/`)
        if (response.ok) {
          const data = await response.json()
          setCategories([{ name: "All", slug: "All" }, ...data])
        }
      } catch (error) {
        console.error("Failed to fetch categories", error)
      }
    }
    fetchCategories()
    setMounted(true)
  }, [])

  // Fetch products with backend filters and pagination
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)

        let ordering = "-created_at"
        if (sortBy === "price-low") ordering = "price"
        if (sortBy === "price-high") ordering = "-price"
        if (sortBy === "rating") ordering = "-annotated_avg_rating"
        if (sortBy === "newest") ordering = "-created_at"

        const params: any = {
          page: currentPage,
          ordering: ordering,
        }

        if (searchQuery) params.search = searchQuery
        if (selectedCategory && selectedCategory !== "All") params.category = selectedCategory
        if (selectedBadge && selectedBadge !== "All") params.badge = selectedBadge
        if (maxPrice[0] < dbMaxPrice) params.max_price = maxPrice[0]
        if (showInStockOnly) params.in_stock = "true"
        if (showOnSaleOnly) params.on_sale = "true"

        const queryParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.append(key, String(value))
          }
        })

        const response = await fetch(`${API_BASE_URL}/products/?${queryParams.toString()}`)
        if (response.ok) {
          const data = await response.json()
          const list = data.results || []
          setProducts(list)
          setTotalCount(data.count || list.length)

          // Calculate total pages based on page size of 20
          const pageSize = 20
          setTotalPages(Math.ceil((data.count || list.length) / pageSize))

          // Initialize max price configuration if returned
          if (data.max_price !== undefined && dbMaxPrice === 100000) {
            setDbMaxPrice(data.max_price)
            setMaxPrice([data.max_price])
          }
        }
      } catch (error) {
        console.error("Failed to fetch products", error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [currentPage, searchQuery, selectedCategory, selectedBadge, maxPrice, sortBy, showInStockOnly, showOnSaleOnly, dbMaxPrice])

  const handleSetSearchQuery = (val: string) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }
  const handleSetSelectedCategory = (val: string) => {
    setSelectedCategory(val)
    setCurrentPage(1)
  }
  const handleSetSelectedBadge = (val: string) => {
    setSelectedBadge(val)
    setCurrentPage(1)
  }
  const handleSetMaxPrice = (val: number[]) => {
    setMaxPrice(val)
    setCurrentPage(1)
  }
  const handleSetShowInStockOnly = (val: boolean) => {
    setShowInStockOnly(val)
    setCurrentPage(1)
  }
  const handleSetShowOnSaleOnly = (val: boolean) => {
    setShowOnSaleOnly(val)
    setCurrentPage(1)
  }
  const handleSetSortBy = (val: string) => {
    setSortBy(val)
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setSelectedBadge("All")
    setMaxPrice([dbMaxPrice])
    setShowInStockOnly(false)
    setShowOnSaleOnly(false)
    setCurrentPage(1)
  }

  const filteredProducts = products

  const filtersProps = {
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    categories,
    selectedCategory,
    setSelectedCategory: handleSetSelectedCategory,
    selectedBadge,
    setSelectedBadge: handleSetSelectedBadge,
    maxPrice,
    setMaxPrice: handleSetMaxPrice,
    dbMaxPrice,
    showInStockOnly,
    setShowInStockOnly: handleSetShowInStockOnly,
    showOnSaleOnly,
    setShowOnSaleOnly: handleSetShowOnSaleOnly,
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
                <>
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
                          className={`cursor-pointer overflow-hidden border border-transparent hover:border-primary/20 shadow-sm hover:shadow-lg transition-all duration-300 h-full ${
                            viewMode === "list" ? "flex flex-col sm:flex-row sm:items-stretch" : ""
                          }`}
                        >
                          {/* Image */}
                          <div className={`relative overflow-hidden shrink-0 ${
                            viewMode === "list" ? "w-full sm:w-56 md:w-64 h-48 sm:h-auto" : "h-48 sm:h-80"
                          }`}>
                            <Image
                              src={getAbsoluteImageUrl(product.primary_image || null)}
                              alt={product.name}
                              width={400}
                              height={500}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
                              {product.stock_status !== 'in_stock' && <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0 h-4 sm:h-5 shadow-sm">Out of Stock</Badge>}
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
                          <CardContent className={cn(
                            "p-4 flex flex-1",
                            viewMode === "list" ? "flex-col sm:flex-row sm:items-center sm:justify-between gap-4" : "flex-col justify-between"
                          )}>
                            {/* Product Info Section */}
                            <div className="space-y-2 flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-1">
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
  
                              <h3 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm sm:text-base md:text-lg">
                                {product.name}
                              </h3>
  
                              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                {product.category?.name || "Uncategorized"}
                              </p>
  
                              {viewMode === "list" && (
                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-2 hidden md:block max-w-xl">
                                  {product.short_description || product.description}
                                </p>
                              )}
                            </div>
  
                            {/* Price & Actions Section */}
                            <div className={cn(
                              "flex shrink-0",
                              viewMode === "list" ? "flex-col sm:w-44 md:w-52 sm:border-l sm:pl-4 md:pl-6 sm:py-2 gap-3 justify-center" : "flex-col gap-2 mt-4"
                            )}>
                              <div className="flex flex-col">
                                <span className="text-base sm:text-lg md:text-xl font-bold text-foreground">₹{product.price}</span>
                                {product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price) && (
                                  <span className="text-xs sm:text-sm text-muted-foreground line-through">₹{product.compare_price}</span>
                                )}
                              </div>
  
                              <div 
                                className={cn(
                                  buttonVariants({ size: "sm" }), 
                                  "w-full text-center font-medium",
                                  viewMode === "list" ? "max-w-[140px] sm:max-w-none" : "",
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
  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12 pt-6 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => {
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }}
                        className="bg-transparent text-foreground hover:bg-muted"
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground px-4 font-medium">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => {
                          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }}
                        className="bg-transparent text-foreground hover:bg-muted"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      
    </div>
  )
}
