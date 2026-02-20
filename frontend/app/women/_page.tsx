import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const trendingProducts = [
  {
    id: 1,
    name: "Floral Maxi Dress",
    price: 2499,
    originalPrice: 3299,
    image: "/floral-maxi-dress-women.jpg",
    badge: "Trending",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Silk Blouse",
    price: 1899,
    originalPrice: 2499,
    image: "/silk-blouse-women-fashion.jpg",
    badge: "Best Seller",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Designer Kurti",
    price: 1599,
    originalPrice: 2199,
    image: "/designer-kurti-women.jpg",
    badge: "New",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Palazzo Set",
    price: 2199,
    originalPrice: 2899,
    image: "/palazzo-set-women-clothing.jpg",
    badge: "Popular",
    rating: 4.6,
  },
  {
    id: 5,
    name: "Embroidered Top",
    price: 1299,
    originalPrice: 1799,
    image: "/embroidered-top-women.jpg",
    badge: "Sale",
    rating: 4.5,
  },
  {
    id: 6,
    name: "Casual Jumpsuit",
    price: 2799,
    originalPrice: 3599,
    image: "/casual-jumpsuit-women.jpg",
    badge: "Trending",
    rating: 4.8,
  },
]

export default function WomenPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Women's Fashion Collection
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Discover the latest trends in women's fashion. From elegant dresses to casual wear, find pieces that
                  express your unique style and confidence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-pink-600 text-white px-8 py-3 rounded-md hover:bg-pink-700 transition-colors font-medium">
                    Shop Now
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium">
                    View Lookbook
                  </button>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/fashionable-woman-in-trendy-outfit.jpg"
                  alt="Women's Fashion"
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trending Products */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">Trending Now</h2>
              <p className="text-lg text-gray-600">The most popular pieces loved by our customers</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingProducts.map((product) => (
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
                      <Badge className="absolute top-3 left-3 bg-pink-600 hover:bg-pink-700">{product.badge}</Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-semibold text-gray-900">₹{product.price}</span>
                        <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex text-yellow-400">{"★".repeat(Math.floor(product.rating))}</div>
                        <span className="text-sm text-gray-500">({product.rating})</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-gray-900 text-center mb-12">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {["Dresses", "Tops", "Bottoms", "Ethnic Wear"].map((category) => (
                <div key={category} className="text-center group cursor-pointer">
                  <div className="w-full h-32 bg-white rounded-lg shadow-md mb-4 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                    <span className="font-serif text-lg font-semibold text-gray-700 group-hover:text-pink-600 transition-colors">
                      {category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
