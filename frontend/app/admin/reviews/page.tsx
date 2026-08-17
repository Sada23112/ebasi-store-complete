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
  Sparkles
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { adminApi, AdminReview } from "@/lib/admin-api"
import { cn } from "@/lib/utils"

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState<string>("all")

  const [deletingReview, setDeletingReview] = useState<AdminReview | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadReviews = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await adminApi.getReviews({
        search: searchQuery,
        rating: ratingFilter !== "all" ? ratingFilter : undefined,
      })
      setReviews(res.results || [])
    } catch (err: any) {
      setError(err.message || "Failed to load reviews.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadReviews()
    }, 200)
    return () => clearTimeout(timer)
  }, [searchQuery, ratingFilter])

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

  const totalReviews = reviews.length
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "5.0"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-foreground">
            Customer Review Moderation
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Audit testimonials and feedback left by real customers on product pages.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => loadReviews()}
          className="h-9 px-3 rounded-xl border-border/70 text-xs self-start sm:self-auto"
        >
          <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isLoading && "animate-spin")} />
          Refresh
        </Button>
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
              Total Reviews
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by customer name, product, or comment..."
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
        </div>
      </Card>

      {/* Reviews Table */}
      <Card className="rounded-2xl border-border/70 shadow-sm bg-card overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
              <Star className="w-8 h-8 mx-auto text-muted-foreground/40" />
              <p className="font-semibold text-foreground">No customer reviews match your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/50">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Product</th>
                    <th className="py-3.5 px-4 font-semibold">Customer</th>
                    <th className="py-3.5 px-4 font-semibold">Rating</th>
                    <th className="py-3.5 px-4 font-semibold">Review Comment</th>
                    <th className="py-3.5 px-4 font-semibold">Date</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Moderate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {reviews.map((r) => (
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
                        {r.user_name || "Anonymous Customer"}
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingReview(r)}
                          className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                          title="Delete / Dismiss Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

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
