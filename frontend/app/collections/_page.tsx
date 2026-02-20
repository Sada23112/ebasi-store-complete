import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    id: 1,
    name: "Sarees",
    description: "Traditional and contemporary sarees",
    image: "/elegant-saree-collection.jpg",
    productCount: 45,
    href: "/saree",
  },
  {
    id: 2,
    name: "Women's Wear",
    description: "Trendy fashion for modern women",
    image: "/diverse-women-fashion.png",
    productCount: 32,
    href: "/women",
  },
  {
    id: 3,
    name: "Accessories",
    description: "Complete your look with our accessories",
    image: "/fashion-accessories-jewelry.jpg",
    productCount: 28,
    href: "/accessories",
  },
  {
    id: 4,
    name: "Mekhela Sador",
    description: "Traditional Assamese attire",
    image: "/mekhela-sador-traditional-dress.jpg",
    productCount: 18,
    href: "/mekhela-sador",
  },
  {
    id: 5,
    name: "Ethnic Wear",
    description: "Celebrate tradition with style",
    image: "/ethnic-wear-traditional-clothing.jpg",
    productCount: 25,
    href: "/ethnic",
  },
  {
    id: 6,
    name: "Casual Wear",
    description: "Comfortable everyday fashion",
    image: "/casual-wear-comfortable-clothing.jpg",
    productCount: 38,
    href: "/casual",
  },
]

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-20">
        {/* Header Section */}
        <section className="py-16 px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Collections</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of fashion categories, each designed to celebrate your unique style and
            personality.
          </p>
        </section>

        {/* Collections Grid */}
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{category.productCount} products</span>
                      <span className="text-pink-600 font-medium group-hover:text-pink-700 transition-colors">
                        Explore →
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Contact our style experts for personalized recommendations and exclusive pieces.
            </p>
            <button className="bg-pink-600 text-white px-8 py-3 rounded-md hover:bg-pink-700 transition-colors font-medium">
              Contact Us
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
