"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  MessageCircle,
  Heart,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Upload,
  Sparkles,
  Star,
  RefreshCw,
  MoreVertical,
  Layers,
  Image as ImageIcon,
  Check
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { adminApi, AdminProduct, AdminCategory, AdminProductImage } from "@/lib/admin-api"
import { cn } from "@/lib/utils"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>("all")
  const [selectedBadge, setSelectedBadge] = useState<string>("all")
  const [isFeaturedFilter, setIsFeaturedFilter] = useState<string>("all")

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)

  // Delete Confirmation State
  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Gallery Manager State for editing
  const [galleryImages, setGalleryImages] = useState<AdminProductImage[]>([])
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // Form Fields
  const [formName, setFormName] = useState("")
  const [formSlug, setFormSlug] = useState("")
  const [formCategoryId, setFormCategoryId] = useState<number | string>("")
  const [formPrice, setFormPrice] = useState("")
  const [formComparePrice, setFormComparePrice] = useState("")
  const [formSku, setFormSku] = useState("")
  const [formStockQuantity, setFormStockQuantity] = useState("10")
  const [formStockStatus, setFormStockStatus] = useState<"in_stock" | "out_of_stock" | "limited_stock">("in_stock")
  const [formBadge, setFormBadge] = useState<string>("")
  const [formShortDescription, setFormShortDescription] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formWeight, setFormWeight] = useState("")
  const [formDimensions, setFormDimensions] = useState("")
  const [formIsActive, setFormIsActive] = useState(true)
  const [formIsFeatured, setFormIsFeatured] = useState(false)

  const isInitialMount = React.useRef(true)

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [prodRes, catRes] = await Promise.all([
        adminApi.getProducts({
          search: searchQuery,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          stock_status: selectedStockStatus !== "all" ? selectedStockStatus : undefined,
          badge: selectedBadge !== "all" ? selectedBadge : undefined,
          is_featured: isFeaturedFilter !== "all" ? isFeaturedFilter : undefined,
        }),
        adminApi.getCategories(),
      ])
      setProducts(prodRes.results || [])
      setCategories(catRes.results || [])
    } catch (err: any) {
      setError(err.message || "Failed to load products.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      loadData()
      return
    }

    const timer = setTimeout(() => {
      loadData()
    }, 200)
    return () => clearTimeout(timer)
  }, [searchQuery, selectedCategory, selectedStockStatus, selectedBadge, isFeaturedFilter])

  const openAddModal = () => {
    setEditingProduct(null)
    setFormName("")
    setFormSlug("")
    setFormCategoryId(categories[0]?.id || "")
    setFormPrice("")
    setFormComparePrice("")
    setFormSku(`EBA-${Date.now().toString().slice(-6)}`)
    setFormStockQuantity("10")
    setFormStockStatus("in_stock")
    setFormBadge("")
    setFormShortDescription("")
    setFormDescription("")
    setFormWeight("")
    setFormDimensions("")
    setFormIsActive(true)
    setFormIsFeatured(false)
    setGalleryImages([])
    setModalError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (p: AdminProduct) => {
    setEditingProduct(p)
    setFormName(p.name)
    setFormSlug(p.slug)
    setFormCategoryId(p.category?.id || categories[0]?.id || "")
    setFormPrice(String(p.price))
    setFormComparePrice(p.compare_price ? String(p.compare_price) : "")
    setFormSku(p.sku || "")
    setFormStockQuantity(String(p.stock_quantity ?? 0))
    setFormStockStatus(p.stock_status)
    setFormBadge(p.badge || "")
    setFormShortDescription(p.short_description || "")
    setFormDescription(p.description || "")
    setFormWeight(p.weight ? String(p.weight) : "")
    setFormDimensions(p.dimensions || "")
    setFormIsActive(p.is_active)
    setFormIsFeatured(p.is_featured)
    setGalleryImages(p.images || [])
    setModalError(null)
    setIsModalOpen(true)
  }

  const handleNameChange = (val: string) => {
    setFormName(val)
    if (!editingProduct) {
      // Auto generate slug
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
      setFormSlug(generatedSlug)
    }
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formPrice || !formCategoryId) {
      setModalError("Please provide product name, price, and category.")
      return
    }

    setIsSaving(true)
    setModalError(null)

    const payload: Record<string, any> = {
      name: formName.trim(),
      slug: formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category_id: Number(formCategoryId),
      price: parseFloat(formPrice),
      compare_price: formComparePrice ? parseFloat(formComparePrice) : null,
      sku: formSku.trim() || `EBA-${Date.now().toString().slice(-6)}`,
      stock_quantity: parseInt(formStockQuantity, 10) || 0,
      stock_status: formStockStatus,
      badge: formBadge || null,
      short_description: formShortDescription.trim(),
      description: formDescription.trim() || formShortDescription.trim() || formName.trim(),
      weight: formWeight ? parseFloat(formWeight) : null,
      dimensions: formDimensions.trim(),
      is_active: formIsActive,
      is_featured: formIsFeatured,
    }

    try {
      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, payload)
      } else {
        await adminApi.createProduct(payload)
      }
      setIsModalOpen(false)
      loadData()
    } catch (err: any) {
      setModalError(err.message || "Failed to save product.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return
    setIsDeleting(true)
    try {
      await adminApi.deleteProduct(deletingProduct.id)
      setDeletingProduct(null)
      loadData()
    } catch (err: any) {
      alert(`Error deleting product: ${err.message}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleActive = async (p: AdminProduct) => {
    try {
      const res = await adminApi.toggleProductActive(p.id)
      setProducts((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, is_active: res.is_active } : item))
      )
    } catch (err: any) {
      alert(`Could not toggle active state: ${err.message}`)
    }
  }

  const handleToggleFeatured = async (p: AdminProduct) => {
    try {
      const res = await adminApi.toggleProductFeatured(p.id)
      setProducts((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, is_featured: res.is_featured } : item))
      )
    } catch (err: any) {
      alert(`Could not toggle featured state: ${err.message}`)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct || !e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setIsUploadingImage(true)

    try {
      const newImg = await adminApi.uploadProductImage(
        editingProduct.id,
        file,
        galleryImages.length === 0,
        editingProduct.name,
        galleryImages.length
      )
      setGalleryImages((prev) => [...prev, newImg])
      loadData()
    } catch (err: any) {
      alert(`Failed to upload image: ${err.message}`)
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleDeleteImage = async (imageId: number) => {
    if (!editingProduct) return
    try {
      await adminApi.deleteProductImage(editingProduct.id, imageId)
      setGalleryImages((prev) => prev.filter((img) => img.id !== imageId))
      loadData()
    } catch (err: any) {
      alert(`Failed to delete image: ${err.message}`)
    }
  }

  const handleSetPrimaryImage = async (imageId: number) => {
    if (!editingProduct) return
    try {
      await adminApi.setPrimaryProductImage(editingProduct.id, imageId)
      setGalleryImages((prev) =>
        prev.map((img) => ({ ...img, is_primary: img.id === imageId }))
      )
      loadData()
    } catch (err: any) {
      alert(`Failed to set primary image: ${err.message}`)
    }
  }

  const canCreate = adminApi.hasPermission("products.create")
  const canUpdate = adminApi.hasPermission("products.update")
  const canDelete = adminApi.hasPermission("products.delete")

  return (
    <div className="space-y-6">
      {/* Header & New Product Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-foreground">
            Product Catalog
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage inventory, pricing, promotional badges, and product media.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData()}
            className="h-9 px-3 rounded-xl border-border/70 text-xs"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isLoading && "animate-spin")} />
            Refresh
          </Button>

          {canCreate && (
            <Button
              size="sm"
              onClick={openAddModal}
              className="h-9 px-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm shadow-primary/20"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Product
            </Button>
          )}
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <Card className="rounded-2xl border-border/70 shadow-sm bg-card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, SKU, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 rounded-xl text-xs bg-background"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 px-3 rounded-xl border border-border bg-background text-xs text-foreground font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock Status Filter */}
          <select
            value={selectedStockStatus}
            onChange={(e) => setSelectedStockStatus(e.target.value)}
            className="h-9 px-3 rounded-xl border border-border bg-background text-xs text-foreground font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">In Stock</option>
            <option value="limited_stock">Limited Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          {/* Badge Filter */}
          <select
            value={selectedBadge}
            onChange={(e) => setSelectedBadge(e.target.value)}
            className="h-9 px-3 rounded-xl border border-border bg-background text-xs text-foreground font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Badges</option>
            <option value="trending">Trending</option>
            <option value="best_seller">Best Seller</option>
            <option value="new_arrival">New Arrival</option>
            <option value="hot">Hot</option>
            <option value="limited_edition">Limited Edition</option>
            <option value="featured">Featured</option>
          </select>
        </div>
      </Card>

      {/* PRODUCT LIST TABLE */}
      <Card className="rounded-2xl border-border/70 shadow-sm bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/50">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Product</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Price</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Badge</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Engagement</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Active</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <Skeleton className="h-4 w-40 rounded" />
                            <Skeleton className="h-3 w-24 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-20 rounded" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-16 rounded" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                      <td className="py-3 px-4 text-center"><Skeleton className="h-4 w-12 rounded mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><Skeleton className="h-4 w-8 rounded mx-auto" /></td>
                      <td className="py-3 px-4 text-right"><Skeleton className="h-8 w-16 rounded-lg ml-auto" /></td>
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-xs text-muted-foreground space-y-3">
                      <Package className="w-8 h-8 mx-auto text-muted-foreground/40" />
                      <p className="font-semibold text-foreground">No products match the selected filters.</p>
                      <Button size="sm" variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedStockStatus("all"); setSelectedBadge("all"); }}>
                        Clear Filters
                      </Button>
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const isOutOfStock = p.stock_status === "out_of_stock"
                    const isLimited = p.stock_status === "limited_stock"

                    return (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        {/* Product Info with Thumbnail */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-muted/60 border border-border/60 overflow-hidden shrink-0 relative flex items-center justify-center">
                              {p.primary_image ? (
                                <img
                                  src={p.primary_image}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/product/${p.slug}`}
                                target="_blank"
                                className="font-semibold text-foreground hover:text-primary transition-colors truncate block"
                              >
                                {p.name}
                              </Link>
                              <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                                SKU: {p.sku || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-[10px] font-normal">
                            {p.category?.name || "Uncategorized"}
                          </Badge>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-mono">
                          <div className="font-bold text-foreground">
                            ₹{Number(p.price).toLocaleString()}
                          </div>
                          {p.compare_price && Number(p.compare_price) > Number(p.price) && (
                            <div className="text-[10px] text-muted-foreground line-through">
                              ₹{Number(p.compare_price).toLocaleString()}
                            </div>
                          )}
                        </td>

                        {/* Stock Status */}
                        <td className="py-3 px-4">
                          <Badge
                            className={cn(
                              "text-[10px] font-medium uppercase tracking-wider",
                              isOutOfStock
                                ? "bg-destructive/15 text-destructive border-destructive/20"
                                : isLimited
                                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            )}
                          >
                            {isOutOfStock ? "Out of Stock" : isLimited ? "Limited" : "In Stock"}
                          </Badge>
                          <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                            Qty: {p.stock_quantity}
                          </div>
                        </td>

                        {/* Badge */}
                        <td className="py-3 px-4">
                          {p.badge ? (
                            <Badge variant="secondary" className="text-[10px] capitalize font-medium">
                              {p.badge.replace("_", " ")}
                            </Badge>
                          ) : (
                            <span className="text-[11px] text-muted-foreground/50">—</span>
                          )}
                        </td>

                        {/* Engagement Stats */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-2.5 text-[11px] font-mono text-muted-foreground">
                            <span className="flex items-center gap-1" title={`${p.views_count} Views`}>
                              <Eye className="w-3 h-3 text-blue-500" />
                              {p.views_count}
                            </span>
                            <span className="flex items-center gap-1" title={`${p.wishlist_count} Wishlist Saves`}>
                              <Heart className="w-3 h-3 text-rose-500" />
                              {p.wishlist_count}
                            </span>
                            <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400" title={`${p.whatsapp_clicks_count} WhatsApp Inquiries`}>
                              <MessageCircle className="w-3 h-3 fill-current" />
                              {p.whatsapp_clicks_count}
                            </span>
                          </div>
                        </td>

                        {/* Active Toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => canUpdate && handleToggleActive(p)}
                            disabled={!canUpdate}
                            className={cn(
                              "w-7 h-7 rounded-lg inline-flex items-center justify-center transition-colors",
                              p.is_active
                                ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25"
                                : "bg-muted text-muted-foreground hover:bg-muted/80",
                              !canUpdate && "cursor-not-allowed opacity-70"
                            )}
                            title={
                              !canUpdate
                                ? (p.is_active ? "Active" : "Inactive")
                                : (p.is_active ? "Active on site (Click to hide)" : "Hidden from site (Click to show)")
                            }
                          >
                            {p.is_active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link href={`/product/${p.slug}`} target="_blank">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground" title="View in Store">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Button>
                            </Link>

                            {canUpdate && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openEditModal(p)}
                                className="h-8 w-8 rounded-lg text-foreground hover:bg-muted"
                                title="Edit Product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                            )}

                            {canDelete && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeletingProduct(p)}
                                className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  }))}
                </tbody>
              </table>
            </div>
        </CardContent>
      </Card>

      {/* ADD / EDIT PRODUCT DIALOG MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif font-bold text-foreground">
              {editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Product"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Set product attributes, pricing, media, and promotional status.
            </DialogDescription>
          </DialogHeader>

          {modalError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <form onSubmit={handleSaveProduct} className="space-y-4 pt-2">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Product Name *</label>
                <Input
                  type="text"
                  placeholder="e.g. Pure Muga Silk Mekhela Sador"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="rounded-xl h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">URL Slug</label>
                <Input
                  type="text"
                  placeholder="pure-muga-silk-mekhela-sador"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="rounded-xl h-9 text-xs font-mono"
                />
              </div>
            </div>

            {/* Category & SKU */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Category *</label>
                <select
                  value={formCategoryId}
                  onChange={(e) => setFormCategoryId(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs font-medium focus:outline-none"
                  required
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">SKU Code</label>
                <Input
                  type="text"
                  placeholder="EBA-1002"
                  value={formSku}
                  onChange={(e) => setFormSku(e.target.value)}
                  className="rounded-xl h-9 text-xs font-mono"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Selling Price (₹) *</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="4500.00"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  className="rounded-xl h-9 text-xs font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Comparison / Original Price (₹)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="5500.00 (Optional for Sale badge)"
                  value={formComparePrice}
                  onChange={(e) => setFormComparePrice(e.target.value)}
                  className="rounded-xl h-9 text-xs font-mono"
                />
              </div>
            </div>

            {/* Stock Quantity & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Stock Quantity</label>
                <Input
                  type="number"
                  placeholder="10"
                  value={formStockQuantity}
                  onChange={(e) => setFormStockQuantity(e.target.value)}
                  className="rounded-xl h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Stock Status</label>
                <select
                  value={formStockStatus}
                  onChange={(e) => setFormStockStatus(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs font-medium focus:outline-none"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="limited_stock">Limited Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Promotional Badge</label>
                <select
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs font-medium focus:outline-none"
                >
                  <option value="">None</option>
                  <option value="trending">Trending</option>
                  <option value="best_seller">Best Seller</option>
                  <option value="new_arrival">New Arrival</option>
                  <option value="hot">Hot</option>
                  <option value="limited_edition">Limited Edition</option>
                  <option value="featured">Featured</option>
                </select>
              </div>
            </div>

            {/* Short & Full Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Short Summary</label>
              <Input
                type="text"
                placeholder="Brief 1-sentence product summary"
                value={formShortDescription}
                onChange={(e) => setFormShortDescription(e.target.value)}
                className="rounded-xl h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Full Description</label>
              <textarea
                placeholder="Full fabric, craftsmanship, and styling details..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none"
              />
            </div>

            {/* Checkbox Toggles */}
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                />
                <span>Active on Public Store</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                />
                <span>Feature in Homepage Highlights</span>
              </label>
            </div>

            {/* GALLERY MANAGER (When editing existing product) */}
            {editingProduct && (
              <div className="pt-3 border-t border-border/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Product Gallery Photos
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Upload high quality photographs. Select one as primary thumbnail.
                    </p>
                  </div>

                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isUploadingImage}
                      className="h-8 text-xs pointer-events-none"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                      {isUploadingImage ? "Uploading..." : "Upload Photo"}
                    </Button>
                  </label>
                </div>

                {galleryImages.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-border/70 text-center text-xs text-muted-foreground">
                    No images uploaded for this product yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {galleryImages.map((img) => (
                      <div
                        key={img.id}
                        className={cn(
                          "relative rounded-xl border p-1 group bg-card overflow-hidden",
                          img.is_primary ? "border-primary ring-2 ring-primary/20" : "border-border/60"
                        )}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted/40 relative">
                          <img
                            src={img.image_url || img.image}
                            alt="Product photo"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="mt-1.5 flex items-center justify-between px-1">
                          {img.is_primary ? (
                            <span className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Primary
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(img.id)}
                              className="text-[10px] text-muted-foreground hover:text-foreground font-medium"
                            >
                              Make Primary
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteImage(img.id)}
                            className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                            title="Delete Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="pt-4 border-t border-border/60 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
                className="h-9 rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm shadow-primary/20"
              >
                {isSaving ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif font-bold text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Product
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Are you sure you want to permanently delete &quot;{deletingProduct?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingProduct(null)}
              disabled={isDeleting}
              className="h-9 rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={isDeleting}
              className="h-9 rounded-xl text-xs font-semibold"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
