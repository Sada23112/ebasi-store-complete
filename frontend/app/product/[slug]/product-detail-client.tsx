"use client"

import { useState, useEffect } from "react"
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
  MessageCircle,
  Loader2,
  Check,
  Heart,
  Store,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Home,
} from "lucide-react"
import Link from "next/link"
import { ProductDetailSkeleton } from "@/components/skeletons"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useWishlist } from "@/lib/wishlist"
import api from "@/lib/api"
import { getAbsoluteImageUrl, getBadgeInfo, cn } from "@/lib/utils"
import { ProductGallery } from "@/components/product-gallery"
import { STORE_INFO } from "@/lib/constants"

const SIZES = ["Free Size / Standard", "Unstitched", "S", "M", "L", "XL", "XXL"]

interface ProductDetailClientProps {
  slug: string
  initialProduct?: any
}

export function ProductDetailClient({ slug, initialProduct }: ProductDetailClientProps) {
  const [product, setProduct] = useState<any>(initialProduct || null)
  const [reviews, setReviews] = useState<any[]>(initialProduct?.reviews || [])
  const [loading, setLoading] = useState(!initialProduct)
  const [hasError, setHasError] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("Free Size / Standard")
  const [customNote, setCustomNote] = useState("")
  const [isSharing, setIsSharing] = useState(false)
  const [poppingHeart, setPoppingHeart] = useState(false)

  const { toggle, isSaved } = useWishlist()

  const [reviewName, setReviewName] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [reviewHover, setReviewHover] = useState(0)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [reviewError, setReviewError] = useState("")

  const fetchData = async () => {
    setLoading(true)
    setHasError(false)
    try {
      if (!slug) return
      const productData = await api.getProductBySlug(slug)
      if (productData && !productData.detail && productData.id) {
        setProduct(productData)
        if (Array.isArray(productData.reviews)) {
          setReviews(productData.reviews)
        } else {
          const reviewsData = await api.getProductReviews(slug)
          setReviews(Array.isArray(reviewsData) ? reviewsData : (reviewsData?.results || []))
        }
      } else {
        setProduct(null)
        setReviews([])
      }
    } catch (err) {
      console.error("Error fetching product data:", err)
      setProduct(null)
      setHasError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!initialProduct) {
      fetchData()
    }
  }, [slug])

  const mediaItems = product ? [
    ...(product.images || []).map((img: any) => ({
      type: "image",
      url: getAbsoluteImageUrl(img.image),
    })),
    ...(product.videos || []).map((vid: any) => ({
      type: "video",
      url: getAbsoluteImageUrl(vid.video || vid.video_file),
      thumbnail: vid.thumbnail ? getAbsoluteImageUrl(vid.thumbnail) : undefined,
    })),
  ] : []

  if (product && mediaItems.length === 0) {
    mediaItems.push({
      type: "image",
      url: "/images/placeholders/placeholder.svg",
    })
  }

  const isOutOfStock = product?.stock_status === "out_of_stock" || (product?.stock_quantity !== undefined && product.stock_quantity <= 0)

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on EBASI STORE!`,
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

  const handleWishlistClick = () => {
    setPoppingHeart(true)
    setTimeout(() => setPoppingHeart(false), 350)
    toggle(product)
  }

  const getWhatsAppUrl = () => {
    if (!product) return "#"
    const currentUrl = typeof window !== "undefined" ? window.location.href : ""

    if (isOutOfStock) {
      const message = `Hi ${STORE_INFO.name}! 👋\n\nI'm interested in knowing when this product will be back in stock:\n\n*Product:* ${product.name}\n*SKU:* ${product.sku || 'N/A'}\n\n*Product Link:* ${currentUrl}`
      return `${STORE_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`
    }

    const parsedPrice = parseFloat(String(product.price || 0))
    const validPrice = !isNaN(parsedPrice) ? parsedPrice : 0
    const totalPrice = (validPrice * quantity).toLocaleString('en-IN')
    let message = `Hi ${STORE_INFO.name}! 👋\n\nI would like to order:\n\n*Product:* ${product.name || 'Product'}\n*Price:* ₹${validPrice} each\n*Size:* ${selectedSize}\n`

    if (customNote.trim()) {
      message += `*Note/Color:* ${customNote.trim()}\n`
    }

    message += `*Quantity:* ${quantity}\n*Total Price:* ₹${totalPrice}\n`
    if (product.sku) {
      message += `*SKU:* ${product.sku}\n`
    }
    message += `\n*Product Link:* ${currentUrl}`

    return `${STORE_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submittingReview || !reviewComment.trim() || reviewRating < 1) return

    setSubmittingReview(true)
    setReviewError("")
    try {
      const newReview = await api.submitReview(slug, {
        user_name: reviewName.trim() || "",
        rating: reviewRating,
        comment: reviewComment.trim(),
      })
      setReviews((prev) => [newReview, ...(Array.isArray(prev) ? prev : [])])
      setReviewName("")
      setReviewRating(5)
      setReviewComment("")
      setReviewSuccess(true)
      setTimeout(() => setReviewSuccess(false), 4000)
    } catch (error) {
      console.error("Failed to submit review:", error)
      setReviewError("Unable to submit review right now. Please check your connection and try again.")
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return <ProductDetailSkeleton />
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center py-16 max-w-md">
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-3 text-foreground">Unable to Load Product</h1>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            We couldn't connect to the server to fetch this product. Please check your connection and try again.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="default" onClick={fetchData} className="bg-primary text-primary-foreground min-h-[44px]">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Connection
            </Button>
            <Button size="default" variant="outline" asChild className="min-h-[44px]">
              <Link href="/shop">
                <Store className="h-4 w-4 mr-2" />
                Browse Store
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center py-16 max-w-md">
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Store className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-3 text-foreground">Product Not Found</h1>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            The product you are looking for does not exist or has been removed from our catalog.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="default" asChild className="bg-primary text-primary-foreground min-h-[44px]">
              <Link href="/shop">
                <Store className="h-4 w-4 mr-2" />
                Browse Store
              </Link>
            </Button>
            <Button size="default" variant="outline" asChild className="min-h-[44px]">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const savedInWishlist = isSaved(product.id)

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <main className="pt-20 pb-28 sm:pb-16">
        {/* Breadcrumb */}
        <div className="px-4 py-3 border-b">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground overflow-x-auto scrollbar-hide whitespace-nowrap py-1">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-foreground transition-colors">
                Shop
              </Link>
              {product.category && (
                <>
                  <span>/</span>
                  <Link href={`/shop?category=${product.category.slug}`} className="hover:text-foreground transition-colors">
                    {product.category.name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-foreground font-medium truncate max-w-[150px] sm:max-w-[200px]">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Media Gallery */}
            <ScrollReveal direction="right">
              <div className="space-y-4">
                <ProductGallery mediaItems={mediaItems} productName={product.name} />
              </div>
            </ScrollReveal>

            {/* Product Details */}
            <ScrollReveal direction="left">
              <div className="space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {product.is_on_sale && (
                      <Badge className={getBadgeInfo('sale')?.className}>
                        Sale
                      </Badge>
                    )}
                    {product.badge ? (
                      getBadgeInfo(product.badge) && (
                        <Badge className={getBadgeInfo(product.badge)?.className}>
                          {getBadgeInfo(product.badge)?.label}
                        </Badge>
                      )
                    ) : (
                      product.is_featured && (
                        <Badge className={getBadgeInfo('trending')?.className}>
                          Trending
                        </Badge>
                      )
                    )}
                    {isOutOfStock && (
                      <Badge variant="secondary" className="bg-red-600 text-white">
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-3 leading-tight">
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.average_rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                      {product.average_rating || 0} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 p-5 bg-gradient-to-r from-muted/50 via-muted/30 to-background rounded-2xl border border-border/60 shadow-xs">
                  <span className="text-3xl sm:text-4xl font-bold text-foreground font-sans tracking-tight">₹{product.price}</span>
                  {product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price) && (
                    <span className="text-lg sm:text-xl text-muted-foreground line-through font-sans">₹{product.compare_price}</span>
                  )}
                  {product.discount_percentage > 0 && (
                    <Badge variant="secondary" className="bg-emerald-600 text-white font-semibold text-xs px-2.5 py-0.5 shadow-xs">
                      {product.discount_percentage}% OFF
                    </Badge>
                  )}
                </div>

                {/* Stock Status Indicator */}
                <div className="flex items-center gap-2 px-1">
                  {!isOutOfStock ? (
                    <>
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-600">In Stock — Ready to Dispatch from Assam</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-red-600">Currently Out of Stock — Inquire on WhatsApp for Restock</span>
                    </>
                  )}
                </div>

                {/* Size Selector */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      Select Size / Fitting Option:
                    </label>
                    <span className="text-xs text-primary font-medium">Size Guide</span>
                  </div>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Available sizing options">
                    {SIZES.map((size) => {
                      const isSelected = selectedSize === size
                      return (
                        <Button
                          key={size}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          aria-pressed={isSelected}
                          aria-label={`Select size option: ${size}`}
                          onClick={() => setSelectedSize(size)}
                          className={cn(
                            "transition-all duration-300 active:scale-95 text-xs sm:text-sm h-9 px-3.5 focus-visible:ring-2 focus-visible:ring-primary",
                            isSelected
                              ? "bg-primary text-primary-foreground font-semibold shadow-xs ring-2 ring-primary/30"
                              : "bg-transparent hover:border-primary/50 hover:bg-muted/30"
                          )}
                        >
                          {size}
                        </Button>
                      )
                    })}
                  </div>
                </div>

              {/* Customization / Color note */}
              <div>
                <label htmlFor="custom-color-note" className="block text-sm font-medium text-foreground mb-1">
                  Color / Customization Preference <span className="text-xs text-muted-foreground">(Optional)</span>
                </label>
                <Input
                  id="custom-color-note"
                  type="text"
                  placeholder="e.g. Pink border, custom blouse size 38..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="bg-background transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Quantity:</label>
                  <div className="flex items-center gap-3">
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="bg-transparent h-10 w-10 active:scale-90 transition-transform focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <span className="w-12 text-center font-bold text-lg" aria-live="polite" aria-label={`Selected quantity ${quantity}`}>
                      {quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity(Math.min(product.stock_quantity || 10, quantity + 1))}
                      disabled={quantity >= (product.stock_quantity || 10)}
                      className="bg-transparent h-10 w-10 active:scale-90 transition-transform focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Desktop CTA Row */}
              <div className="space-y-3 pt-2">
                <div className="flex gap-3">
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={isOutOfStock ? "Inquire about restock on WhatsApp" : "Place order on WhatsApp"}
                    className="flex-1"
                  >
                    <Button
                      className={`w-full text-white font-bold h-12 text-base shadow-md transition-all duration-300 active:scale-[0.98] ${
                        isOutOfStock ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      <svg className="h-5 w-5 mr-2.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      {isOutOfStock ? "Inquire Restock on WhatsApp" : "Order via WhatsApp"}
                    </Button>
                  </a>

                  {/* Wishlist Button */}
                  <Button
                    size="lg"
                    variant={savedInWishlist ? "default" : "outline"}
                    onClick={handleWishlistClick}
                    aria-label={savedInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    className={cn(
                      "h-12 px-4 transition-all duration-300 active:scale-90 focus-visible:ring-2 focus-visible:ring-primary",
                      savedInWishlist ? "bg-red-500 text-white hover:bg-red-600" : "bg-transparent",
                      poppingHeart && "animate-heart-pop"
                    )}
                    title={savedInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`h-5 w-5 ${savedInWishlist ? "fill-current" : ""}`} aria-hidden="true" />
                  </Button>

                  {/* Share Button */}
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleShare}
                    aria-label="Share this product"
                    className="h-12 px-4 bg-transparent transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {isSharing ? <Check className="h-5 w-5 text-green-500" aria-hidden="true" /> : <Share2 className="h-5 w-5" aria-hidden="true" />}
                  </Button>
                </div>
              </div>

              {/* Service & Store Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4 border-t border-b">
                <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Store className="h-4 w-4" />
                  </div>
                  <span>Store Pickup & Dispatch</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <div className="p-2 rounded-full bg-green-500/10 text-green-600">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <span>Direct WhatsApp Assistance</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <div className="p-2 rounded-full bg-amber-500/10 text-amber-600">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span>Authentic Handloom & Quality</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <div className="p-2 rounded-full bg-blue-500/10 text-blue-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span>100% Genuine Assamese Wear</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

          {/* Product Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="description" className="transition-all">Description & Details</TabsTrigger>
                <TabsTrigger value="reviews" className="transition-all">Reviews ({reviews.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6 animate-fade-up">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-base">
                      {product.description || product.short_description || "No detailed description available."}
                    </p>

                    {product.dimensions && (
                      <div className="mt-6 pt-4 border-t">
                        <span className="font-semibold text-foreground">Dimensions: </span>
                        <span className="text-muted-foreground">{product.dimensions}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 animate-fade-up">
                <div className="space-y-8">
                  {/* Write Review Form */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 text-foreground">Write a Customer Review</h3>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <label htmlFor="review-name-input" className="block text-sm font-medium text-foreground mb-1">
                            Your Name <span className="text-xs text-muted-foreground">(Optional)</span>
                          </label>
                          <Input
                            id="review-name-input"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            placeholder="e.g. Priyanshu Sharma"
                            maxLength={100}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Rating
                          </label>
                          <div className="flex items-center gap-1" role="group" aria-label="Product rating out of 5 stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                aria-label={`Rate ${star} out of 5 stars`}
                                aria-pressed={reviewRating === star}
                                onClick={() => setReviewRating(star)}
                                onMouseEnter={() => setReviewHover(star)}
                                onMouseLeave={() => setReviewHover(0)}
                                className="p-1 focus-visible:ring-2 focus-visible:ring-primary rounded-md focus:outline-none transition-transform active:scale-90"
                              >
                                <Star
                                  className={`h-6 w-6 transition-colors ${star <= (reviewHover || reviewRating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                    }`}
                                  aria-hidden="true"
                                />
                              </button>
                            ))}
                            <span className="ml-2 text-sm font-medium text-muted-foreground" aria-live="polite">
                              {reviewRating} / 5
                            </span>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="review-comment-input" className="block text-sm font-medium text-foreground mb-1">
                            Your Review <span className="text-xs text-primary">*</span>
                          </label>
                          <Textarea
                            id="review-comment-input"
                            aria-required="true"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your experience with this saree/fabric..."
                            rows={4}
                            required
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <Button
                            type="submit"
                            disabled={submittingReview || !reviewComment.trim()}
                            aria-busy={submittingReview}
                            className="active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            {submittingReview ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                                Submitting...
                              </>
                            ) : (
                              "Submit Review"
                            )}
                          </Button>
                          {reviewSuccess && (
                            <span role="status" aria-live="polite" className="text-sm text-green-600 font-medium flex items-center gap-1 animate-fade-up">
                              <Check className="h-4 w-4" aria-hidden="true" /> Review submitted successfully!
                            </span>
                          )}
                          {reviewError && (
                            <span role="alert" aria-live="assertive" className="text-sm text-red-600 font-medium flex items-center gap-1 animate-fade-up">
                              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" /> {reviewError}
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
                        <Card key={review.id} className="transition-all hover:shadow-xs">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="font-semibold text-foreground">
                                  {review.user_name || "Verified Customer"}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3.5 w-3.5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                          }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(review.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-muted-foreground mt-2">{review.comment}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-xl">
                      No reviews yet for this product. Be the first to write a review!
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Sticky Mobile WhatsApp Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden shadow-lg animate-fade-up">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-muted-foreground truncate">{product.name}</span>
            <span className="text-base font-bold text-foreground">₹{product.price}</span>
          </div>

          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 max-w-[200px]"
          >
            <Button
              className={`w-full text-white font-bold h-11 text-sm shadow-md active:scale-95 transition-transform ${
                isOutOfStock ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              <svg className="h-4 w-4 mr-1.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {isOutOfStock ? "Inquire Restock" : "Order on WhatsApp"}
          </Button>
        </a>
      </div>
    </div>
  </div>
  )
}
