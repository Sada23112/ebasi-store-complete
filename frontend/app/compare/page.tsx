"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { ProductComparison } from "@/components/product-comparison"

// Sample products for comparison
const sampleProducts = [
  {
    id: 1,
    name: "Elegant Silk Saree",
    price: 2499,
    originalPrice: 3499,
    image: "/elegant-silk-saree.jpg",
    rating: 4.8,
    reviews: 124,
    category: "Sarees",
    fabric: "Pure Silk",
    colors: ["Red", "Blue", "Green", "Pink"],
    sizes: ["Free Size"],
    features: ["100% Pure Silk", "Handwoven", "Traditional Design", "Matching Blouse", "Dry Clean Only"],
    inStock: true,
  },
  {
    id: 2,
    name: "Designer Kurti Set",
    price: 1899,
    originalPrice: 2499,
    image: "/designer-kurti-set.jpg",
    rating: 4.6,
    reviews: 89,
    category: "Kurtis",
    fabric: "Cotton Blend",
    colors: ["Blue", "White", "Black"],
    sizes: ["S", "M", "L", "XL"],
    features: ["Cotton Blend", "Machine Washable", "Contemporary Design", "Palazzo Included"],
    inStock: true,
  },
  {
    id: 3,
    name: "Traditional Lehenga",
    price: 4999,
    originalPrice: 6999,
    image: "/traditional-lehenga.jpg",
    rating: 4.9,
    reviews: 156,
    category: "Lehengas",
    fabric: "Georgette",
    colors: ["Pink", "Red", "Gold"],
    sizes: ["S", "M", "L"],
    features: ["Georgette Fabric", "Heavy Embroidery", "Semi-Stitched", "Dupatta Included"],
    inStock: true,
  },
]

export default function ComparePage() {
  const [compareProducts, setCompareProducts] = useState(sampleProducts)

  const handleRemoveProduct = (productId: number) => {
    setCompareProducts(compareProducts.filter((product) => product.id !== productId))
  }

  const handleClearAll = () => {
    setCompareProducts([])
  }

  return (
    <div className="min-h-screen bg-background">
      

      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <ProductComparison
            products={compareProducts}
            onRemoveProduct={handleRemoveProduct}
            onClearAll={handleClearAll}
          />
        </div>
      </main>

      
    </div>
  )
}
