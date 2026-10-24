"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  Star,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Plus,
  MessageCircle,
  Heart,
  Clock,
  XCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { adminApi, AdminReview, AdminProduct } from "@/lib/admin-api"
import { cn } from "@/lib/utils"

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [deletingReview, setDeletingReview] = useState<AdminReview | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Add Review / WhatsApp Testimonial Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSavingReview, setIsSavingReview] = useState(false)
  const [addModalError, setAddModalError] = useState<string | null>(null)
  const [formProductId, setFormProductId] = useState<number | string>("")
  const [formCustomerName, setFormCustomerName] = useState("")
  const [formCity, setFormCity] = useState("")
  const [formRating, setFormRating] = useState<number>(5)
  const [formRatingHover, setFormRatingHover] = useState<number>(0)
  const [formComment, setFormComment] = useState("")
  const [formIsWhatsApp, setFormIsWhatsApp] = useState(true)

  const isInitialMount = React.useRef(true)

  const loadReviews = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [res, prodRes] = await Promise.all([
        adminApi.getReviews({
          search: searchQuery,
          rating: ratingFilter !== "all" ? ratingFilter : undefined,
          is_approved: statusFilter === "approved" ? "true" : statusFilter === "pending" ? "false" : undefined,
        }),
        adminApi.getProducts({ page_size: 100 }),
      ])
      setReviews(res.results || [])
      setProducts(prodRes.results || [])
      if (!formProductId && prodRes.results?.length > 0) {
        setFormProductId(prodRes.results[0].id)
      }
    } catch (err: any) {
      setError(err.message || "Failed to load reviews.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      loadReviews()
      return
    }

    const timer = setTimeout(() => {
      loadReviews()
    }, 200)
    return () => clearTimeout(timer)
  }, [searchQuery, ratingFilter, statusFilter])

  const handleToggleApproval = async (review: AdminReview) => {
    try {
      if (review.is_approved) {
        await adminApi.rejectReview(review.id)
      } else {
        await adminApi.approveReview(review.id)
      }
      loadReviews()
    } catch (err: any) {
      alert(`Failed to update review status: ${err.message}`)
    }
  }

  const handleDeleteReview = async () => {
    if (!deletingReview) return
    setIsDeleting(true)
    try {
      await adminApi.deleteReview(deletingReview.id)
      setDeletingReview(null)
      loadReviews()
    } catch (err: any) {
      alert(`Failed to delete review: ${err.message}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const openAddModal = () => {
    setFormCustomerName("")
    setFormCity("")
    setFormRating(5)
    setFormComment("")
    setFormIsWhatsApp(true)
    setAddModalError(null)
    if (!formProductId && products.length > 0) {
      setFormProductId(products[0].id)
    }
    setIsAddModalOpen(true)
  }

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formProductId) {
      setAddModalError("Please select a product for this testimonial.")
      return
    }
    if (!formCustomerName.trim()) {
      setAddModalError("Please enter the customer name.")
      return
    }
    if (!formComment.trim()) {
      setAddModalError("Please enter the review feedback or testimonial message.")
      return
    }

    setIsSavingReview(true)
    setAddModalError(null)

    const displayName = `${formCustomerName.trim()}${formCity.trim() ? `, ${formCity.trim()}` : ""}${
      formIsWhatsApp ? " (Verified WhatsApp Buyer)" : ""
    }`

    try {
      await adminApi.createReview({
        product_id: formProductId,
        user_name: displayName,
        rating: formRating,
        comment: formComment.trim(),
      })
      setIsAddModalOpen(false)
      loadReviews()
    } catch (err: any) {
      setAddModalError(err.message || "Failed to save testimonial.")
    } finally {
      setIsSavingReview(false)
    }
  }

  const totalReviews = reviews.length
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "5.0"

  const canModerate = adminApi.hasPermission("reviews.moderate")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-foreground">
            Customer Reviews & WhatsApp Testimonials
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage customer feedback, WhatsApp reviews, and verified handloom testimonials.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadReviews()}
            className="h-9 px-3 rounded-xl border-border/70 text-xs"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isLoading && "animate-spin")} />
            Refresh
          </Button>

          {canModerate && (
            <Button
              size="sm"
              onClick={openAddModal}
              className="h-9 px-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm shadow-primary/20 gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add WhatsApp Testimonial
            </Button>
          )}
        </div>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-border/70 shadow-sm bg-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Average Rating
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1 flex items-center gap-1.5">
              <span>{avgRating}</span>
              <span className="text-sm font-normal text-muted-foreground">/ 5.0</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Star className="w-5 h-5 fill-amber-500" />
          </div>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm bg-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Testimonials
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
              {totalReviews}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm bg-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Verified Feedback
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              100%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Search & Filter Toolbar */}
      <Card className="rounded-2xl border-border/70 shadow-sm bg-card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by customer name, product, or review text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 rounded-xl text-xs bg-background"
            />
          </div>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="h-9 px-3 rounded-xl border border-border bg-background text-xs text-foreground font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 Stars ★★★★★</option>
            <option value="4">4 Stars ★★★★☆</option>
            <option value="3">3 Stars ★★★☆☆</option>
            <option value="2">2 Stars ★★☆☆☆</option>
            <option value="1">1 Star ★☆☆☆☆</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-xl border border-border bg-background text-xs text-foreground font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending Moderation</option>
          </select>
        </div>
      </Card>

      {/* Reviews Table */}
      <Card className="rounded-2xl border-border/70 shadow-sm bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/50">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Product</th>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Rating</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Review / Testimonial</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="py-3.5 px-4"><Skeleton className="h-4 w-32 rounded" /></td>
                      <td className="py-3.5 px-4"><Skeleton className="h-4 w-24 rounded" /></td>
                      <td className="py-3.5 px-4"><Skeleton className="h-4 w-16 rounded" /></td>
                      <td className="py-3.5 px-4"><Skeleton className="h-4 w-20 rounded" /></td>
                      <td className="py-3.5 px-4"><Skeleton className="h-4 w-52 rounded" /></td>
                      <td className="py-3.5 px-4"><Skeleton className="h-4 w-20 rounded" /></td>
                      <td className="py-3.5 px-4 text-right"><Skeleton className="h-8 w-16 rounded-lg ml-auto" /></td>
                    </tr>
                  ))
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-xs text-muted-foreground space-y-3">
                      <Star className="w-8 h-8 mx-auto text-muted-foreground/40" />
                      <p className="font-semibold text-foreground">No customer testimonials match your filters.</p>
                      {canModerate && (
                        <Button size="sm" variant="outline" onClick={openAddModal} className="h-8 text-xs">
                          <Plus className="w-3.5 h-3.5 mr-1.5" />
                          Add First Testimonial
                        </Button>
                      )}
                    </td>
                  </tr>
                ) : (
                  reviews.map((r) => {
                    const isWhatsApp = r.user_name?.toLowerCase().includes("whatsapp")

                    return (
                      <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-foreground">
                          <Link
                            href={`/product/${r.product_slug}`}
                            target="_blank"
                            className="hover:text-primary transition-colors flex items-center gap-1.5"
                          >
                            <span>{r.product_name}</span>
                            <ExternalLink className="w-3 h-3 text-muted-foreground opacity-60" />
                          </Link>
                        </td>

                        <td className="py-3.5 px-4 text-foreground font-medium">
                          <div className="flex flex-col gap-0.5">
                            <span>{r.user_name || "Verified Customer"}</span>
                            {isWhatsApp && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full w-fit">
                                <MessageCircle className="w-2.5 h-2.5 fill-current" /> WhatsApp Feedback
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-3.5 h-3.5",
                                  i < r.rating ? "fill-amber-500 text-amber-500" : "text-border"
                                )}
                              />
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {r.is_approved ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-muted-foreground max-w-sm text-xs leading-relaxed">
                          &quot;{r.comment}&quot;
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                          {new Date(r.created_at).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {canModerate ? (
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleApproval(r)}
                                className={cn(
                                  "h-8 w-8 rounded-lg",
                                  r.is_approved
                                    ? "text-amber-600 hover:bg-amber-500/10 hover:text-amber-700"
                                    : "text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700"
                                )}
                                title={r.is_approved ? "Unapprove Review" : "Approve Review"}
                              >
                                {r.is_approved ? (
                                  <XCircle className="w-3.5 h-3.5" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeletingReview(r)}
                                className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                                title="Delete / Dismiss Review"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-muted-foreground italic">Read-only</span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ADD REVIEW / WHATSAPP TESTIMONIAL MODAL */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Add Customer Testimonial
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Record a verified WhatsApp feedback or photo customer review on a handloom product.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateReview} className="space-y-4 pt-2">
            {addModalError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addModalError}</span>
              </div>
            )}

            {/* Product Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Target Product <span className="text-destructive">*</span>
              </label>
              <select
                value={formProductId}
                onChange={(e) => setFormProductId(e.target.value)}
                required
                className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (SKU: {p.sku || "N/A"})
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Name & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Customer Name <span className="text-destructive">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Priyanka Borah"
                  value={formCustomerName}
                  onChange={(e) => setFormCustomerName(e.target.value)}
                  required
                  className="h-9 rounded-xl text-xs bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Location / City <span className="text-muted-foreground text-[10px]">(Optional)</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Guwahati, Assam"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  className="h-9 rounded-xl text-xs bg-background"
                />
              </div>
            </div>

            {/* Rating Stars */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Rating</span>
                <span className="text-amber-500 font-bold">{formRating} / 5 Stars</span>
              </label>
              <div className="flex items-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormRating(star)}
                    onMouseEnter={() => setFormRatingHover(star)}
                    onMouseLeave={() => setFormRatingHover(0)}
                    className="p-1 rounded hover:scale-110 transition-transform"
                    title={`${star} Star`}
                  >
                    <Star
                      className={cn(
                        "w-6 h-6 transition-colors",
                        star <= (formRatingHover || formRating)
                          ? "fill-amber-500 text-amber-500"
                          : "text-border"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Verified WhatsApp Tag Switch */}
            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 cursor-pointer">
              <input
                type="checkbox"
                checked={formIsWhatsApp}
                onChange={(e) => setFormIsWhatsApp(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-border"
              />
              <div className="text-xs">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  Verified WhatsApp Order Feedback
                </span>
                <span className="text-[11px] text-muted-foreground block">
                  Attaches a green verified badge highlighting genuine customer satisfaction.
                </span>
              </div>
            </label>

            {/* Testimonial Comment */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Feedback / Review Text <span className="text-destructive">*</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormComment(
                      "The silk sheen and pallu drape is absolutely stunning in person! My mother loved the authentic Assamese handloom weave. Quick delivery and prompt WhatsApp updates! 🙏"
                    )
                  }
                  className="text-[10px] text-primary hover:underline font-medium"
                >
                  Insert Sample Praise
                </button>
              </div>
              <Textarea
                rows={3}
                placeholder="Paste the customer's WhatsApp message or review comments here..."
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                required
                className="rounded-xl text-xs bg-background"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                disabled={isSavingReview}
                className="h-9 rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSavingReview}
                className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm shadow-primary/20 gap-1.5"
              >
                {isSavingReview ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save Testimonial"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={!!deletingReview} onOpenChange={() => setDeletingReview(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif font-bold text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Remove Customer Review
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Are you sure you want to permanently remove this review for &quot;{deletingReview?.product_name}&quot;?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingReview(null)}
              disabled={isDeleting}
              className="h-9 rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteReview}
              disabled={isDeleting}
              className="h-9 rounded-xl text-xs font-semibold"
            >
              {isDeleting ? "Deleting..." : "Confirm Removal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
