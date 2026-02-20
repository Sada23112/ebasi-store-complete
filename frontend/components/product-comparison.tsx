"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Star, ShoppingCart, Heart, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  rating: number
  reviews: number
  category: string
  fabric: string
  colors: string[]
  sizes: string[]
  features: string[]
  inStock: boolean
}

interface ProductComparisonProps {
  products: Product[]
  onRemoveProduct: (productId: number) => void
  onClearAll: () => void
}

export function ProductComparison({ products, onRemoveProduct, onClearAll }: ProductComparisonProps) {
  const [selectedAttribute, setSelectedAttribute] = useState<string>("all")

  const attributes = [
    { key: "price", label: "Price" },
    { key: "rating", label: "Rating" },
    { key: "fabric", label: "Fabric" },
    { key: "colors", label: "Colors" },
    { key: "sizes", label: "Sizes" },
    { key: "features", label: "Features" },
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (products.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowLeft className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Products to Compare</h3>
            <p className="text-muted-foreground mb-4">
              Add products to comparison from product listings or detail pages
            </p>
            <Link href="/shop">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold">Product Comparison</h2>
          <p className="text-muted-foreground">Compare up to 4 products side by side</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedAttribute}
            onChange={(e) => setSelectedAttribute(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">All Attributes</option>
            {attributes.map((attr) => (
              <option key={attr.key} value={attr.key}>
                {attr.label}
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={onClearAll}>
            Clear All
          </Button>
        </div>
      </div>

      {/* Comparison Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <td className="p-4 font-medium text-muted-foreground w-32">Product</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 min-w-64">
                      <div className="relative">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border"
                          onClick={() => onRemoveProduct(product.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <div className="space-y-3">
                          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium line-clamp-2">{product.name}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              <div className="flex">{renderStars(Math.round(product.rating))}</div>
                              <span className="text-xs text-muted-foreground">({product.reviews})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price Row */}
                {(selectedAttribute === "all" || selectedAttribute === "price") && (
                  <tr className="border-b">
                    <td className="p-4 font-medium">Price</td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4">
                        <div className="space-y-1">
                          <div className="text-lg font-bold">₹{product.price.toLocaleString()}</div>
                          {product.originalPrice > product.price && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{product.originalPrice.toLocaleString()}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                OFF
                              </Badge>
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                )}

                {/* Rating Row */}
                {(selectedAttribute === "all" || selectedAttribute === "rating") && (
                  <tr className="border-b">
                    <td className="p-4 font-medium">Rating</td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(Math.round(product.rating))}</div>
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                )}

                {/* Availability Row */}
                {(selectedAttribute === "all" || selectedAttribute === "stock") && (
                  <tr className="border-b">
                    <td className="p-4 font-medium">Availability</td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
                          <span className={`text-sm ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                )}

                {/* Fabric Row */}
                {(selectedAttribute === "all" || selectedAttribute === "fabric") && (
                  <tr className="border-b">
                    <td className="p-4 font-medium">Fabric</td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4">
                        <span className="text-sm">{product.fabric}</span>
                      </td>
                    ))}
                  </tr>
                )}

                {/* Colors Row */}
                {(selectedAttribute === "all" || selectedAttribute === "colors") && (
                  <tr className="border-b">
                    <td className="p-4 font-medium">Colors</td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {product.colors.slice(0, 4).map((color, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.toLowerCase() }}
                              title={color}
                            />
                          ))}
                          {product.colors.length > 4 && (
                            <div className="w-6 h-6 rounded-full bg-muted border border-gray-300 flex items-center justify-center text-xs">
                              +{product.colors.length - 4}
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                )}

                {/* Sizes Row */}
                {(selectedAttribute === "all" || selectedAttribute === "sizes") && (
                  <tr className="border-b">
                    <td className="p-4 font-medium">Sizes</td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.map((size, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {size}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                )}

                {/* Features Row */}
                {(selectedAttribute === "all" || selectedAttribute === "features") && (
                  <tr className="border-b">
                    <td className="p-4 font-medium">Features</td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4">
                        <ul className="space-y-1">
                          {product.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center gap-1">
                              <div className="w-1 h-1 bg-primary rounded-full" />
                              {feature}
                            </li>
                          ))}
                          {product.features.length > 3 && (
                            <li className="text-xs text-muted-foreground">+{product.features.length - 3} more</li>
                          )}
                        </ul>
                      </td>
                    ))}
                  </tr>
                )}

                {/* Actions Row */}
                <tr>
                  <td className="p-4 font-medium">Actions</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4">
                      <div className="space-y-2">
                        <Button className="w-full" size="sm" disabled={!product.inStock}>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Link href={`/product/${product.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full bg-transparent">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
