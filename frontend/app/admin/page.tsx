"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MessageCircle,
  Heart,
  Package,
  FolderTree,
  Star,
  Inbox,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Plus,
  BarChart3,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Clock,
  ShieldCheck
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { adminApi, AdminDashboardData, AdminInsight } from "@/lib/admin-api"
import { cn } from "@/lib/utils"

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [insights, setInsights] = useState<AdminInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadDashboardData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true)
    else setIsLoading(true)
    setError(null)

    try {
      const [dashData, insightsData] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getInsights().catch(() => ({ insights: [] }))
      ])
      setData(dashData)
      setInsights(insightsData.insights || [])
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-muted rounded-xl animate-pulse" />
          <div className="h-9 w-28 bg-muted rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-card border border-border/70 rounded-2xl p-5 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-card border border-border/70 rounded-2xl animate-pulse" />
          <div className="h-96 bg-card border border-border/70 rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 rounded-2xl bg-destructive/10 border border-destructive/20 text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
        <div>
          <h3 className="text-lg font-bold text-destructive">Failed to Load Dashboard</h3>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
        <Button onClick={() => loadDashboardData()} variant="outline" className="rounded-xl">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry Connection
        </Button>
      </div>
    )
  }

  const kpis = data?.kpis
  const summary = data?.inventory_summary
  const recentActivity = data?.recent_activity || []
  const topWhatsApp = data?.top_whatsapp_products || []

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header & Quick Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-foreground">
            Business Overview
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time store traffic, customer purchase intent, and inventory health.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadDashboardData(true)}
            disabled={isRefreshing}
            className="h-9 px-3 rounded-xl border-border/70 text-xs font-medium"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isRefreshing && "animate-spin")} />
            Refresh
          </Button>

          <Link href="/admin/products">
            <Button
              size="sm"
              className="h-9 px-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm shadow-primary/20"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Manage Catalog
            </Button>
          </Link>
        </div>
      </div>

      {/* ACTIONABLE INSIGHTS BANNER (If any) */}
      {insights.length > 0 && (
        <div className="space-y-2.5">
          {insights.slice(0, 2).map((insight, idx) => (
            <div
              key={idx}
              className={cn(
                "p-4 rounded-2xl border flex items-start gap-3.5 text-xs sm:text-sm transition-all",
                insight.severity === "success"
                  ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-950 dark:text-emerald-200"
                  : insight.severity === "warning"
                  ? "bg-amber-500/5 border-amber-500/20 text-amber-950 dark:text-amber-200"
                  : insight.severity === "alert"
                  ? "bg-rose-500/5 border-rose-500/20 text-rose-950 dark:text-rose-200"
                  : "bg-primary/5 border-primary/20 text-foreground"
              )}
            >
              <Sparkles className="w-5 h-5 shrink-0 text-primary mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">{insight.title}: </span>
                <span className="text-muted-foreground">{insight.description}</span>
              </div>
              {insight.product_slug && (
                <Link
                  href={`/product/${insight.product_slug}`}
                  target="_blank"
                  className="text-xs font-semibold text-primary hover:underline shrink-0 inline-flex items-center gap-1"
                >
                  View Product <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 1. STORE ACTIVITY KPI CARDS (PHASE 2) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <span>Store Activity (Last 7 Days)</span>
          </h3>
          <Link href="/admin/analytics" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
            Detailed Analytics <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Visitors / Page Views */}
          <Card className="rounded-2xl border-border/70 shadow-sm bg-card hover-lift">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Page Views
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {kpis?.page_views?.last_7_days ?? 0}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                <span>All time: {kpis?.page_views?.total ?? 0}</span>
                {kpis?.page_views?.trend?.has_comparison ? (
                  <span
                    className={cn(
                      "font-semibold flex items-center gap-0.5",
                      kpis.page_views.trend.direction === "up"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : kpis.page_views.trend.direction === "down"
                        ? "text-rose-600"
                        : "text-muted-foreground"
                    )}
                  >
                    {kpis.page_views.trend.direction === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {kpis.page_views.trend.change_pct}%
                  </span>
                ) : (
                  <span className="text-muted-foreground">Active tracking</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Product Views */}
          <Card className="rounded-2xl border-border/70 shadow-sm bg-card hover-lift">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Product Views
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {kpis?.product_views?.last_7_days ?? 0}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                <span>All time: {kpis?.product_views?.total ?? 0}</span>
                {kpis?.product_views?.trend?.has_comparison ? (
                  <span
                    className={cn(
                      "font-semibold flex items-center gap-0.5",
                      kpis.product_views.trend.direction === "up"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600"
                    )}
                  >
                    {kpis.product_views.trend.direction === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {kpis.product_views.trend.change_pct}%
                  </span>
                ) : (
                  <span className="text-muted-foreground">Active tracking</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 3: WhatsApp Conversion Clicks (Highlighted Core Metric) */}
          <Card className="rounded-2xl border-primary/30 shadow-md shadow-primary/5 bg-gradient-to-br from-card via-card to-primary/5 hover-lift">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                WhatsApp Inquiries
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                <MessageCircle className="w-4 h-4 fill-current" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {kpis?.whatsapp_clicks?.last_7_days ?? 0}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                <span>Total intent: {kpis?.whatsapp_clicks?.total ?? 0}</span>
                <span className="font-bold text-primary">Purchase Intent</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Wishlist Additions */}
          <Card className="rounded-2xl border-border/70 shadow-sm bg-card hover-lift">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Wishlist Saves
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-rose-500/20" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {kpis?.wishlist_adds?.last_7_days ?? 0}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                <span>Active saved items: {kpis?.wishlist_adds?.total ?? 0}</span>
                <span className="text-muted-foreground">High Interest</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 2. INVENTORY & CONTENT HEALTH SUMMARY */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3.5">
          Store Content & Operational Health
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <Link href="/admin/products" className="group">
            <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Catalog Products</span>
                <Package className="w-4 h-4 text-primary" />
              </div>
              <div className="text-xl font-serif font-bold text-foreground mt-2">
                {summary?.total_products ?? 0}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {summary?.active_products ?? 0} active on site
              </p>
            </div>
          </Link>

          <Link href="/admin/products?stock_status=out_of_stock" className="group">
            <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-destructive/50 transition-all">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Out of Stock</span>
                <AlertCircle className={cn("w-4 h-4", (summary?.out_of_stock_products || 0) > 0 ? "text-destructive" : "text-muted-foreground")} />
              </div>
              <div className={cn("text-xl font-serif font-bold mt-2", (summary?.out_of_stock_products || 0) > 0 ? "text-destructive" : "text-foreground")}>
                {summary?.out_of_stock_products ?? 0}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Needs restock</p>
            </div>
          </Link>

          <Link href="/admin/categories" className="group">
            <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Categories</span>
                <FolderTree className="w-4 h-4 text-primary" />
              </div>
              <div className="text-xl font-serif font-bold text-foreground mt-2">
                {summary?.total_categories ?? 0}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {summary?.active_categories ?? 0} active
              </p>
            </div>
          </Link>

          <Link href="/admin/messages" className="group">
            <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Unread Inquiries</span>
                <Inbox className={cn("w-4 h-4", (summary?.unread_messages || 0) > 0 ? "text-primary" : "text-muted-foreground")} />
              </div>
              <div className={cn("text-xl font-serif font-bold mt-2", (summary?.unread_messages || 0) > 0 ? "text-primary" : "text-foreground")}>
                {summary?.unread_messages ?? 0}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {summary?.total_messages ?? 0} total inquiries
              </p>
            </div>
          </Link>

          <Link href="/admin/reviews" className="group">
            <div className="p-4 rounded-2xl bg-card border border-border/70 hover:border-primary/50 transition-all col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Total Reviews</span>
                <Star className="w-4 h-4 text-amber-500 fill-amber-500/20" />
              </div>
              <div className="text-xl font-serif font-bold text-foreground mt-2">
                {summary?.total_reviews ?? 0}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Customer feedback</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 3. TWO-COLUMN SPLIT: TOP WHATSAPP CONVERSIONS & RECENT ACTIVITY FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top WhatsApp Interest Products (8 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="rounded-2xl border-border/70 shadow-sm bg-card">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg font-serif font-bold text-foreground">
                    Top WhatsApp Interest Products
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Products generating direct purchase inquiries from customers
                  </CardDescription>
                </div>
                <Link href="/admin/analytics">
                  <Button variant="ghost" size="sm" className="text-xs text-primary h-8 px-2.5">
                    View Full Funnel
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {topWhatsApp.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-xs">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                  No WhatsApp click events recorded yet. When customers click WhatsApp on product pages, they will appear here.
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {topWhatsApp.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                          #{idx + 1}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/product/${item.product__slug}`}
                            target="_blank"
                            className="text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block"
                          >
                            {item.product__name}
                          </Link>
                          <span className="text-xs text-muted-foreground font-mono">
                            ₹{Number(item.product__price || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-mono text-xs px-2.5 py-0.5">
                          <MessageCircle className="w-3 h-3 mr-1 fill-current" />
                          {item.whatsapp_count} clicks
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Management Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/admin/products" className="block">
              <Card className="rounded-2xl border-border/70 hover:border-primary/50 hover-lift bg-card p-4 transition-all">
                <Package className="w-5 h-5 text-primary mb-2" />
                <h4 className="text-xs font-bold text-foreground">Manage Products</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">Edit prices, badges, images & stock</p>
              </Card>
            </Link>

            <Link href="/admin/messages" className="block">
              <Card className="rounded-2xl border-border/70 hover:border-primary/50 hover-lift bg-card p-4 transition-all">
                <Inbox className="w-5 h-5 text-primary mb-2" />
                <h4 className="text-xs font-bold text-foreground">Inquiries Inbox</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">Read & respond to customer questions</p>
              </Card>
            </Link>

            <Link href="/admin/reviews" className="block">
              <Card className="rounded-2xl border-border/70 hover:border-primary/50 hover-lift bg-card p-4 transition-all">
                <Star className="w-5 h-5 text-primary mb-2" />
                <h4 className="text-xs font-bold text-foreground">Moderate Reviews</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">Approve or dismiss testimonials</p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed (5 Cols) */}
        <div className="lg:col-span-5">
          <Card className="rounded-2xl border-border/70 shadow-sm bg-card h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg font-serif font-bold text-foreground">
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Live chronological audit of store events
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase font-mono">
                  Live Feed
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 flex-1 overflow-y-auto max-h-[460px]">
              {recentActivity.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-xs">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-muted-foreground/40" />
                  No recent activities recorded yet.
                </div>
              ) : (
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
                  {recentActivity.map((act) => {
                    const isMessage = act.type === "message"
                    const isReview = act.type === "review"
                    const isWhatsApp = act.type === "whatsapp"

                    return (
                      <div key={act.id} className="relative group">
                        {/* Dot indicator */}
                        <div
                          className={cn(
                            "absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-background flex items-center justify-center",
                            isMessage
                              ? "bg-blue-500"
                              : isReview
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          )}
                        />

                        <div className="p-3 rounded-xl bg-muted/30 border border-border/50 group-hover:bg-muted/60 transition-colors">
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span className="font-semibold uppercase tracking-wider">
                              {isMessage ? "Inquiry" : isReview ? "Review" : "WhatsApp Click"}
                            </span>
                            <span className="font-mono text-[10px]">
                              {new Date(act.created_at).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <div className="text-xs font-bold text-foreground mt-1">{act.title}</div>
                          {act.subtitle && (
                            <div className="text-xs text-muted-foreground truncate mt-0.5">
                              {act.subtitle}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
