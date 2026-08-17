"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  BarChart3,
  TrendingUp,
  Eye,
  MessageCircle,
  Heart,
  Search,
  ExternalLink,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
  Filter,
  Layers,
  ShoppingBag
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { adminApi, AdminAnalyticsData, AdminInsight } from "@/lib/admin-api"
import { cn } from "@/lib/utils"

export default function AdminAnalyticsPage() {
  const [timeframe, setTimeframe] = useState<number>(7)
  const [data, setData] = useState<AdminAnalyticsData | null>(null)
  const [insights, setInsights] = useState<AdminInsight[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"whatsapp" | "traffic" | "searches">("whatsapp")

  const loadAnalytics = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [analyticsData, insightsData] = await Promise.all([
        adminApi.getAnalytics(timeframe),
        adminApi.getInsights().catch(() => ({ insights: [] }))
      ])
      setData(analyticsData)
      setInsights(insightsData.insights || [])
    } catch (err: any) {
      setError(err.message || "Failed to load analytics.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [timeframe])

  if (isLoading) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-fade-in">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-60 rounded-xl" />
            <Skeleton className="h-4 w-72 rounded-lg" />
          </div>
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-9 w-32 rounded-xl" />
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-2xl border-border/80 shadow-sm bg-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3.5 w-28 rounded" />
                <Skeleton className="w-8 h-8 rounded-xl" />
              </div>
              <Skeleton className="h-8 w-24 rounded-lg" />
              <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            </Card>
          ))}
        </div>

        {/* Big Chart Skeleton */}
        <Card className="rounded-2xl border-border/80 shadow-sm bg-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-48 rounded" />
              <Skeleton className="h-3.5 w-64 rounded" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded-xl" />
              <Skeleton className="h-8 w-24 rounded-xl" />
            </div>
          </div>

          <div className="h-72 flex items-end gap-3 sm:gap-6 pt-10 px-2 border-b border-border/40">
            {[45, 75, 35, 90, 60, 100, 80, 50, 65, 85].map((height, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <Skeleton className="w-full rounded-t-lg" style={{ height: `${height}%` }} />
                <Skeleton className="h-3 w-6 rounded" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-8 rounded-2xl bg-destructive/10 border border-destructive/20 text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
        <div>
          <h3 className="text-lg font-bold text-destructive">Failed to Load Analytics</h3>
          <p className="text-sm text-muted-foreground mt-1">{error || "No data available."}</p>
        </div>
        <Button onClick={() => loadAnalytics()} variant="outline" className="rounded-xl">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  const { daily_series, product_performance, top_searches, funnel } = data
  const maxDailyViews = Math.max(...daily_series.map((d) => d.page_views + d.product_views), 1)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header & Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-foreground">
            Analytics & Conversion Intent
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real customer behavior tracking, product interest velocity, and search insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-xl border border-border/50">
            <span>Period:</span>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(Number(e.target.value))}
              className="bg-transparent text-foreground font-bold focus:outline-none cursor-pointer"
            >
              <option value={7}>Last 7 Days</option>
              <option value={14}>Last 14 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => loadAnalytics()}
            className="h-9 px-3 rounded-xl border-border/70 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* 1. CONVERSION FUNNEL METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-border/70 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Product Views
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              {funnel.product_views}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Customer browsing engagement in the selected period
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Wishlist Saves
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              {funnel.wishlist_additions}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              High-intent saves to customer wishlists
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-primary/30 shadow-md shadow-primary/5 bg-gradient-to-br from-card to-primary/5">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              WhatsApp Inquiries (Direct Lead)
            </span>
            <MessageCircle className="w-4 h-4 text-emerald-600 fill-current" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              {funnel.whatsapp_inquiries}
            </div>
            <div className="flex items-center justify-between mt-1 text-xs">
              <span className="text-muted-foreground">Conversion Intent:</span>
              <span className="font-bold text-primary">{funnel.views_to_wa_conversion_rate}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. DAILY ACTIVITY & TRAFFIC TRENDS (CLEAN SVG VISUALIZATION) */}
      <Card className="rounded-2xl border-border/70 shadow-sm bg-card">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base sm:text-lg font-serif font-bold text-foreground">
                Traffic & Engagement Activity Over Time
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Daily breakdown of page views, product views, and WhatsApp inquiry clicks
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Page Views</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">Product Views</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground font-semibold">WhatsApp Clicks</span>
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {daily_series.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No daily traffic data available yet.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-56 w-full flex items-end gap-2 sm:gap-4 pt-6 pb-2">
                {daily_series.map((day, idx) => {
                  const totalDayViews = day.page_views + day.product_views
                  const heightPercent = Math.max(
                    Math.round((totalDayViews / maxDailyViews) * 100),
                    day.whatsapp_clicks > 0 || totalDayViews > 0 ? 12 : 4
                  )

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] py-1 px-2 rounded-lg shadow-lg pointer-events-none whitespace-nowrap mb-1 z-10 font-mono">
                        <div>{day.date}</div>
                        <div>Page Views: {day.page_views}</div>
                        <div>Product Views: {day.product_views}</div>
                        <div className="text-emerald-400 font-bold">WhatsApp: {day.whatsapp_clicks}</div>
                      </div>

                      {/* Stacked Visual Bar */}
                      <div className="w-full max-w-[40px] flex flex-col justify-end rounded-t-lg overflow-hidden bg-muted/40 transition-all group-hover:brightness-110" style={{ height: `${heightPercent}%` }}>
                        {day.whatsapp_clicks > 0 && (
                          <div
                            className="w-full bg-emerald-500 transition-all"
                            style={{ height: `${Math.min(day.whatsapp_clicks * 20, 40)}%` }}
                            title={`${day.whatsapp_clicks} WhatsApp clicks`}
                          />
                        )}
                        <div
                          className="w-full bg-primary/80 transition-all"
                          style={{ height: `${day.product_views > 0 ? 50 : 0}%` }}
                        />
                        <div
                          className="w-full bg-blue-500/70 transition-all"
                          style={{ height: `${day.page_views > 0 ? 50 : 0}%` }}
                        />
                      </div>

                      {/* Date label */}
                      <span className="text-[10px] text-muted-foreground font-mono truncate max-w-full">
                        {day.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. PRODUCT CONVERSION INTENT TABLE (CORE METRIC) */}
      <Card className="rounded-2xl border-border/70 shadow-sm bg-card">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base sm:text-lg font-serif font-bold text-foreground">
                WhatsApp Purchase Intent by Product
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Identify which products actually generate customer inquiries and purchase intent
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {product_performance.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">
              No products found in catalog.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/50">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Product</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Price</th>
                    <th className="py-3 px-4 font-semibold text-center">Period Views</th>
                    <th className="py-3 px-4 font-semibold text-center">Wishlist Saves</th>
                    <th className="py-3 px-4 font-semibold text-center">WhatsApp Inquiries</th>
                    <th className="py-3 px-4 font-semibold text-right">Intent %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {product_performance.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground">
                        <div className="flex items-center gap-2.5">
                          <Link
                            href={`/product/${item.slug}`}
                            target="_blank"
                            className="hover:text-primary transition-colors font-semibold"
                          >
                            {item.name}
                          </Link>
                          <Link href={`/product/${item.slug}`} target="_blank">
                            <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary inline opacity-60" />
                          </Link>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        <Badge variant="outline" className="text-[10px] font-normal">
                          {item.category_name}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-foreground font-semibold">
                        ₹{item.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-muted-foreground">
                        {item.period_views}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-rose-500 font-semibold">
                        {item.wishlist_count}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <Badge
                          className={cn(
                            "text-[11px] font-mono",
                            item.period_whatsapp_clicks > 0
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              : "bg-muted text-muted-foreground border-transparent"
                          )}
                        >
                          {item.period_whatsapp_clicks}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        <span
                          className={cn(
                            item.conversion_intent_pct > 0
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        >
                          {item.conversion_intent_pct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. SEARCH BEHAVIOR INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-border/70 shadow-sm bg-card">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg font-serif font-bold text-foreground">
                  Customer Search Queries
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  What visitors are searching for in the store search bar
                </CardDescription>
              </div>
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>

          <CardContent className="p-4">
            {top_searches.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No search queries logged in this period.
              </div>
            ) : (
              <div className="space-y-2">
                {top_searches.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors text-xs"
                  >
                    <span className="font-semibold text-foreground flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground">#{idx + 1}</span>
                      &quot;{s.query}&quot;
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {s.count} searches
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actionable Product Recommendations */}
        <Card className="rounded-2xl border-border/70 shadow-sm bg-card flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg font-serif font-bold text-foreground">
                  Catalog Optimization Advice
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Algorithmic tips based on active customer metrics
                </CardDescription>
              </div>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-3 flex-1">
            <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs space-y-1">
              <span className="font-bold text-primary block">Promote High-Intent Products:</span>
              <p className="text-muted-foreground">
                Products with regular WhatsApp clicks convert best. Feature them on the homepage hero or highlight them with &apos;Best Seller&apos; badges.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 text-xs space-y-1">
              <span className="font-bold text-foreground block">Resolve Viewing Bottlenecks:</span>
              <p className="text-muted-foreground">
                If a product has over 20 views but 0 WhatsApp inquiries, test offering a comparison sale price or adding richer close-up photos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
