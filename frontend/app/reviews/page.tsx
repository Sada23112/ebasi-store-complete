"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ThumbsUp, Verified, Filter, TrendingUp } from "lucide-react"
import Image from "next/image"

export default function ReviewsPage() {
  const [sortBy, setSortBy] = useState("recent")
  const [filterRating, setFilterRating] = useState("all")

  const stats = {
    totalReviews: 2847,
    averageRating: 4.6,
    ratingDistribution: [
      { stars: 5, count: 1823, percentage: 64 },
      { stars: 4, count: 682, percentage: 24 },
      { stars: 3, count: 227, percentage: 8 },
      { stars: 2, count: 85, percentage: 3 },
      { stars: 1, count: 30, percentage: 1 },
    ],
  }

  const featuredReviews = [
    {
      id: 1,
      name: "Priya Sharma",
      rating: 5,
      date: "2024-01-15",
      verified: true,
      product: "Elegant Silk Saree - Royal Blue",
      review:
        "Absolutely stunning saree! The silk quality is exceptional and the color is exactly as shown. The blouse fit perfectly and the customer service was outstanding. Will definitely order again!",
      helpful: 24,
      images: ["/placeholder.svg?height=100&width=100&text=Review1"],
    },
    {
      id: 2,
      name: "Anita Patel",
      rating: 5,
      date: "2024-01-12",
      verified: true,
      product: "Traditional Mekhela Sador Set",
      review:
        "This is my third purchase from EBASI STORE and they never disappoint. The traditional work is authentic and the fabric is comfortable to wear all day. Highly recommended for special occasions!",
      helpful: 18,
      images: [],
    },
    {
      id: 3,
      name: "Kavya Reddy",
      rating: 4,
      date: "2024-01-10",
      verified: true,
      product: "Designer Kurti with Palazzo",
      review:
        "Beautiful kurti with excellent embroidery work. The palazzo is very comfortable. Only minor issue was the delivery took a bit longer than expected, but the quality makes up for it.",
      helpful: 15,
      images: [
        "/placeholder.svg?height=100&width=100&text=Review2",
        "/placeholder.svg?height=100&width=100&text=Review3",
      ],
    },
    {
      id: 4,
      name: "Meera Joshi",
      rating: 5,
      date: "2024-01-08",
      verified: true,
      product: "Festive Lehenga Choli",
      review:
        "Wore this for my sister's wedding and received so many compliments! The lehenga is heavy and well-made. The blouse fitting was perfect. Thank you EBASI STORE for making me feel like a princess!",
      helpful: 32,
      images: ["/placeholder.svg?height=100&width=100&text=Review4"],
    },
  ]

  const topProducts = [
    {
      name: "Elegant Silk Saree Collection",
      rating: 4.8,
      reviews: 342,
      image: "/placeholder.svg?height=80&width=80&text=Product1",
    },
    {
      name: "Traditional Mekhela Sador",
      rating: 4.7,
      reviews: 198,
      image: "/placeholder.svg?height=80&width=80&text=Product2",
    },
    {
      name: "Designer Kurti Sets",
      rating: 4.6,
      reviews: 267,
      image: "/placeholder.svg?height=80&width=80&text=Product3",
    },
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold mb-4">Customer Reviews</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our customers are saying about their EBASI STORE experience
            </p>
          </div>

          {/* Review Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stats.averageRating}</div>
                <div className="flex justify-center mb-2">{renderStars(Math.round(stats.averageRating))}</div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stats.totalReviews.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">98%</div>
                <p className="text-sm text-muted-foreground">Recommend Us</p>
              </CardContent>
            </Card>
          </div>

          {/* Rating Distribution */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.ratingDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm">{item.stars}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Reviews */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle>Customer Reviews</CardTitle>
                    <div className="flex gap-2">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">Most Recent</SelectItem>
                          <SelectItem value="helpful">Most Helpful</SelectItem>
                          <SelectItem value="rating-high">Highest Rating</SelectItem>
                          <SelectItem value="rating-low">Lowest Rating</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filterRating} onValueChange={setFilterRating}>
                        <SelectTrigger className="w-[120px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ratings</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="1">1 Star</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {featuredReviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold">{review.name.charAt(0)}</span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{review.name}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Verified className="h-3 w-3 mr-1" />
                                Verified Purchase
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>

                          <p className="text-sm font-medium text-primary mb-2">{review.product}</p>
                          <p className="text-sm text-muted-foreground mb-3">{review.review}</p>

                          {review.images.length > 0 && (
                            <div className="flex gap-2 mb-3">
                              {review.images.map((image, index) => (
                                <Image
                                  key={index}
                                  src={image || "/placeholder.svg"}
                                  alt={`Review image ${index + 1}`}
                                  width={60}
                                  height={60}
                                  className="rounded-md object-cover"
                                />
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="text-xs">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Helpful ({review.helpful})
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="text-center pt-4">
                    <Button variant="outline">Load More Reviews</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Top Rated Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Top Rated Products
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex">{renderStars(Math.round(product.rating))}</div>
                          <span className="text-xs text-muted-foreground">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Write Review CTA */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Share Your Experience</h3>
                  <p className="text-sm text-muted-foreground mb-4">Help other customers by sharing your review</p>
                  <Button className="w-full">Write a Review</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
