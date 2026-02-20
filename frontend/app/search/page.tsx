"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid, List, Star, Heart, X, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import api from "@/lib/api"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Function to fetch results
  const fetchResults = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      // Use the API to search
      // The API endpoint /products/?search=query searches name, description, etc.
      const data = await api.searchProducts(query)

      // Client-side sorting if needed, though backend sorting is better. 
      // For now, we'll sort the results array on the client since dataset is likely small per page.
      let sortedData = [...(Array.isArray(data) ? data : [])]

      // Apply sorting
      switch (sortBy) {
        case "price-low":
          sortedData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
          break
        case "price-high":
          sortedData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
          break
        case "rating":
          sortedData.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
          break
        case "newest":
          sortedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          break
        // "relevance" and "popular" might be backend specific, but we'll leave as default order from API
      }

      setResults(sortedData)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // Effect to handle URL query param changes
  useEffect(() => {
    const query = searchParams.get("q") || ""
    setSearchQuery(query)
    if (query) {
      fetchResults(query)
    } else {
      setResults([])
    }
  }, [searchParams, sortBy]) // Re-run when URL changes or sort changes

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    router.push("/search")
  }

  return (
    <div className="min-h-screen bg-background">
      

      <main className="pt-20">
        {/* Search Header */}
        <section className="py-8 px-4 border-b">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Search Results</h1>
            <form onSubmit={handleSearchSubmit} className="flex gap-4 mb-6">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for products..."
                  className="pl-10 pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button type="submit">Search</Button>
            </form>

            {/* Results Summary and Controls */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                {searchQuery ? (
                  <p className="text-muted-foreground">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Searching...
                      </span>
                    ) : results.length > 0 ? (
                      <>
                        Showing {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
                        <span className="font-medium text-foreground">"{searchQuery}"</span>
                      </>
                    ) : (
                      <>
                        No results found for <span className="font-medium text-foreground">"{searchQuery}"</span>
                      </>
                    )}
                  </p>
                ) : (
                  <p className="text-muted-foreground">Enter a search term to find products</p>
                )}
              </div>

              {results.length > 0 && !loading && (
                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Most Relevant</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
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
                      <Grid className="h-4 w-4" />
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
              )}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search Results */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : !searchQuery ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">Start Your Search</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Search for your favorite products, categories, fabrics, or colors.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {/* Quick links could be dynamic, but static for now is fine */}
                <Button variant="outline" size="sm" onClick={() => router.push("/search?q=saree")}>Saree</Button>
                <Button variant="outline" size="sm" onClick={() => router.push("/search?q=kurti")}>Kurti</Button>
                <Button variant="outline" size="sm" onClick={() => router.push("/search?q=mekhela")}>Mekhela</Button>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">No Results Found</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find any products matching "{searchQuery}".
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/shop">
                  <Button>Browse All Products</Button>
                </Link>
                <Button variant="outline" onClick={clearSearch}>
                  Clear Search
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {results.map((product) => (
                <Card
                  key={product.id}
                  className={`group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 ${viewMode === "list" ? "flex" : ""
                    }`}
                >
                  <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                    <Image
                      src={product.images && product.images.length > 0 ? product.images[0].image : "/images/placeholders/placeholder.svg"}
                      alt={product.name}
                      width={400}
                      height={viewMode === "list" ? 300 : 500}
                      className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${viewMode === "list" ? "h-full" : "h-80"
                        }`}
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.is_on_sale && <Badge className="bg-red-500 text-white">Sale</Badge>}
                      {product.stock_status !== 'in_stock' && <Badge variant="secondary">Out of Stock</Badge>}
                    </div>
                  </div>
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
                      <span className="text-xs text-muted-foreground">({product.reviews_count || 0})</span>
                    </div>
                    <h3 className="font-medium text-foreground mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {/* Display category if available */}
                      {product.category?.name || "Uncategorized"}
                    </p>
                    {viewMode === "list" && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.short_description || product.description}</p>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-foreground">₹{product.price}</span>
                      {product.compare_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.compare_price}
                        </span>
                      )}
                      {product.discount_percentage > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {product.discount_percentage}% OFF
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/product/${product.slug}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      
    </div>
  )
}
