import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "The Art of Draping: 10 Different Saree Styles You Must Try",
      excerpt:
        "Discover the elegance and versatility of saree draping with these timeless styles that celebrate Indian heritage and modern fashion.",
      image: "/saree-draping-styles.jpg",
      category: "Fashion Tips",
      author: "Priya Sharma",
      date: "March 15, 2024",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Sustainable Fashion: Why Handloom Textiles Matter",
      excerpt:
        "Learn about the importance of supporting traditional artisans and choosing eco-friendly fashion options for a better future.",
      image: "/handloom-textile-weaving.jpg",
      category: "Sustainability",
      author: "Anjali Mehta",
      date: "March 12, 2024",
      readTime: "7 min read",
    },
    {
      id: 3,
      title: "Wedding Season Essentials: Complete Guide to Bridal Wear",
      excerpt:
        "Everything you need to know about choosing the perfect bridal outfit, from lehengas to sarees and accessories.",
      image: "/bridal-wedding-lehenga.jpg",
      category: "Bridal",
      author: "Kavya Reddy",
      date: "March 10, 2024",
      readTime: "8 min read",
    },
    {
      id: 4,
      title: "Color Psychology in Indian Fashion: What Your Outfit Says",
      excerpt: "Explore the cultural significance and psychological impact of colors in traditional Indian clothing.",
      image: "/colorful-indian-traditional-clothing.jpg",
      category: "Culture",
      author: "Dr. Meera Joshi",
      date: "March 8, 2024",
      readTime: "6 min read",
    },
    {
      id: 5,
      title: "Caring for Your Silk Sarees: Maintenance Tips from Experts",
      excerpt:
        "Professional tips on how to properly store, clean, and maintain your precious silk sarees to last generations.",
      image: "/silk-saree-care-maintenance.jpg",
      category: "Care Guide",
      author: "Textile Expert Team",
      date: "March 5, 2024",
      readTime: "4 min read",
    },
    {
      id: 6,
      title: "Fusion Fashion: Mixing Traditional and Contemporary Styles",
      excerpt: "Creative ways to blend traditional Indian wear with modern fashion for a unique, contemporary look.",
      image: "/fusion-indian-contemporary-fashion.jpg",
      category: "Style Guide",
      author: "Fashion Team",
      date: "March 3, 2024",
      readTime: "5 min read",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold mb-4">Fashion & Style Blog</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the latest trends, styling tips, and cultural insights from the world of Indian fashion.
          </p>
        </div>

        {/* Featured Post */}
        <Card className="mb-12 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative aspect-[4/3] md:aspect-auto">
              <Image
                src={blogPosts[0].image || "/placeholder.svg"}
                alt={blogPosts[0].title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-8 flex flex-col justify-center">
              <Badge className="w-fit mb-4">{blogPosts[0].category}</Badge>
              <h2 className="font-serif text-2xl font-bold mb-4">{blogPosts[0].title}</h2>
              <p className="text-muted-foreground mb-6">{blogPosts[0].excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {blogPosts[0].author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {blogPosts[0].date}
                </div>
                <span>{blogPosts[0].readTime}</span>
              </div>
              <Button asChild>
                <Link href={`/blog/${blogPosts[0].id}`}>
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </div>
        </Card>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <Card key={post.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <Badge className="mb-3">{post.category}</Badge>
                  <h3 className="font-serif text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Articles
          </Button>
        </div>
      </main>

      
    </div>
  )
}
