"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Share2,
  Star,
  Minus,
  Plus,
  MapPin,
  Ban,
  Loader2,
  Check,
} from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"
import { ProductGallery } from "@/components/product-gallery"

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.id as string

  const [product, setProduct] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isSharing, setIsSharing] = useState(false)

  // Review form state
  const [reviewName, setReviewName] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [reviewHover, setReviewHover] = useState(0)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [reviewError, setReviewError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const slug = params.id as string
        const productData = await api.getProductBySlug(slug)
        setProduct(productData)

        const reviewsData = await api.getProductReviews(slug)
        // Handle both array and paginated response
        if (Array.isArray(reviewsData)) {
          setReviews(reviewsData)
        } else if (reviewsData && Array.isArray(reviewsData.results)) {
          setReviews(reviewsData.results)
        } else {
          setReviews([])
        }
      } catch (err) {
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id])

  // Combine images and videos for gallery
  const mediaItems = product ? [
    ...(product.images || []).map((img: any) => ({
      type: "image",
      url: img.image,
    })),
    ...(product.videos || []).map((vid: any) => ({
      type: "video",
      url: vid.video_file, // Adjust based on your API response structure, usually 'video_file' or 'video'
      thumbnail: vid.thumbnail,
    })),
  ] : []

  // Fallback if no media
  if (product && mediaItems.length === 0) {
    mediaItems.push({
      type: "image",
      url: "/images/placeholders/placeholder.svg",
    })
  }

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on EBASI STORE!\n\n`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setIsSharing(true)
        setTimeout(() => setIsSharing(false), 2000)
      }
    } catch (err) {
      console.error("Error sharing:", err)
    }
  }

  const getWhatsAppUrl = () => {
    if (!product) return "#"
    const message = `Hi! I'm interested in ordering:\n\n*${product.name}*\nPrice: ₹${product.price}\nQuantity: ${quantity}\n\nProduct link: ${typeof window !== "undefined" ? window.location.href : ""}`
    return `https://wa.me/917399291242?text=${encodeURIComponent(message)}`
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewComment.trim() || reviewRating < 1) return

    setSubmittingReview(true)
    try {
      const newReview = await api.submitReview(slug, {
        user_name: reviewName.trim() || "",
        rating: reviewRating,
        comment: reviewComment.trim(),
      })
      // Correctly update state by ensuring prev is treated as an array
      setReviews((prev) => {
        const prevReviews = Array.isArray(prev) ? prev : []
        return [newReview, ...prevReviews]
      })
      setReviewName("")
      setReviewRating(5)
      setReviewComment("")
      setReviewSuccess(true)
      setTimeout(() => setReviewSuccess(false), 3000)
    } catch (error) {
      console.error("Failed to submit review:", error)
      setReviewError("Failed to submit review. Please try again.")
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/shop" className="text-primary hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="px-4 py-4 border-b">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-foreground">
                Shop
              </Link>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Media Gallery */}
            <div className="space-y-4">
              <ProductGallery mediaItems={mediaItems} productName={product.name} />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {product.is_on_sale && <Badge className="bg-red-500 text-white">Sale</Badge>}
                  {product.is_featured && <Badge className="bg-primary text-primary-foreground">Trending</Badge>}
                </div>
                <h1 className="text-3xl font-serif font-bold text-foreground mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.average_rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.average_rating || 0} ({reviews.length} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-foreground">₹{product.price}</span>
                {product.compare_price && (
                  <span className="text-xl text-muted-foreground line-through">₹{product.compare_price}</span>
                )}
                {product.discount_percentage > 0 && (
                  <Badge variant="secondary" className="text-sm">
                    {product.discount_percentage}% OFF
                  </Badge>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {product.stock_status === 'in_stock' ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">In Stock ({product.stock_quantity} left)</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-600">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Quantity */}
              <div>
                <h3 className="font-medium text-foreground mb-3">Quantity</h3>
                <div className="flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setQuantity(Math.min(product.stock_quantity || 10, quantity + 1))}
                    disabled={quantity >= (product.stock_quantity || 10)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons — WhatsApp CTA */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="lg"
                      disabled={product.stock_status !== 'in_stock'}
                    >
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Order via WhatsApp
                    </Button>
                  </a>
                  <Button size="lg" variant="outline" onClick={handleShare}>
                    {isSharing ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Pickup & Payment Info */}
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium">Pickup Only — No Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ban className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">No COD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <p className="text-muted-foreground mb-4 whitespace-pre-line">{product.description}</p>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-8">
                  {/* Review Form */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        {/* Name (optional) */}
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Your Name <span className="text-xs">(optional — leave blank for anonymous)</span>
                          </label>
                          <Input
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            placeholder="Your name"
                            maxLength={100}
                          />
                        </div>

                        {/* Star Rating */}
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Rating
                          </label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                onMouseEnter={() => setReviewHover(star)}
                                onMouseLeave={() => setReviewHover(0)}
                                className="p-0.5"
                              >
                                <Star
                                  className={`h-6 w-6 cursor-pointer transition-colors ${star <= (reviewHover || reviewRating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                    }`}
                                />
                              </button>
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground">
                              {reviewRating} / 5
                            </span>
                          </div>
                        </div>

                        {/* Comment */}
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Your Review
                          </label>
                          <Textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your experience with this product..."
                            rows={4}
                            required
                          />
                        </div>

                        {/* Submit */}
                        <div className="flex items-center gap-3">
                          <Button type="submit" disabled={submittingReview || !reviewComment.trim()}>
                            {submittingReview ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              "Submit Review"
                            )}
                          </Button>
                          {reviewSuccess && (
                            <span className="text-sm text-green-600 font-medium">
                              ✓ Review submitted successfully!
                            </span>
                          )}
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Reviews List */}
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-foreground">
                                    {review.user_name || "Anonymous"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                          }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(review.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No reviews yet. Be the first to review this product!
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
