"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const sareeProducts = [
  {
    id: 1,
    name: "Banarasi Silk Saree",
    price: 4999,
    originalPrice: 6999,
    image: "/banarasi-silk-saree-traditional.jpg",
    fabric: "Silk",
    color: "Red",
    occasion: "Wedding",
  },
  {
    id: 2,
    name: "Cotton Handloom Saree",
    price: 1899,
    originalPrice: 2499,
    image: "/cotton-handloom-saree.jpg",
    fabric: "Cotton",
    color: "Blue",
    occasion: "Casual",
  },
  {
    id: 3,
    name: "Georgette Designer Saree",
    price: 3299,
    originalPrice: 4299,
    image: "/georgette-designer-saree.jpg",
    fabric: "Georgette",
    color: "Pink",
    occasion: "Party",
  },
  {
    id: 4,
    name: "Kanjivaram Silk Saree",
    price: 7999,
    originalPrice: 9999,
    image: "/kanjivaram-silk-saree-gold.jpg",
    fabric: "Silk",
    color: "Gold",
    occasion: "Wedding",
  },
  {
    id: 5,
    name: "Chiffon Printed Saree",
    price: 2199,
    originalPrice: 2899,
    image: "/chiffon-printed-saree-floral.jpg",
    fabric: "Chiffon",
    color: "Green",
    occasion: "Casual",
  },
  {
    id: 6,
    name: "Net Embroidered Saree",
    price: 3799,
    originalPrice: 4999,
    image: "/placeholder.svg?height=400&width=300",
    fabric: "Net",
    color: "Black",
    occasion: "Party",
  },
]

export default function SareePage() {
  const [selectedFabric, setSelectedFabric] = useState("All")
  const [selectedColor, setSelectedColor] = useState("All")
  const [selectedOccasion, setSelectedOccasion] = useState("All")

  const fabrics = ["All", "Silk", "Cotton", "Georgette", "Chiffon", "Net"]
  const colors = ["All", "Red", "Blue", "Pink", "Gold", "Green", "Black"]
  const occasions = ["All", "Wedding", "Party", "Casual"]

  const filteredProducts = sareeProducts.filter((product) => {
    return (
      (selectedFabric === "All" || product.fabric === selectedFabric) &&
      (selectedColor === "All" || product.color === selectedColor) &&
      (selectedOccasion === "All" || product.occasion === selectedOccasion)
    )
  })

  return (
    <div className="min-h-screen bg-white">
      

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-16 px-4 bg-gradient-to-r from-red-50 to-pink-50">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">Exquisite Saree Collection</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Embrace timeless elegance with our curated collection of sarees. From traditional handlooms to
              contemporary designs, find the perfect saree for every occasion.
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 px-4 bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fabric</label>
                <select
                  value={selectedFabric}
                  onChange={(e) => setSelectedFabric(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                >
                  {fabrics.map((fabric) => (
                    <option key={fabric} value={fabric}>
                      {fabric}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                >
                  {colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                >
                  {occasions.map((occasion) => (
                    <option key={occasion} value={occasion}>
                      {occasion}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-2xl font-bold text-gray-900">Sarees ({filteredProducts.length})</h2>
              <select className="p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-pink-600 hover:bg-pink-700">{product.fabric}</Badge>
                        <Badge variant="secondary">{product.occasion}</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-semibold text-gray-900">₹{product.price}</span>
                        <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Color: {product.color}</span>
                        <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Care Instructions */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">Saree Care Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧺</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Gentle Wash</h3>
                <p className="text-gray-600 text-sm">Hand wash or dry clean for best results</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">☀️</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Proper Drying</h3>
                <p className="text-gray-600 text-sm">Dry in shade to preserve colors</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👗</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Storage</h3>
                <p className="text-gray-600 text-sm">Store folded with tissue paper</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      
    </div>
  )
}
