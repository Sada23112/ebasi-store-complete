"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Package,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Search
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { adminApi, AdminCategory } from "@/lib/admin-api"
import { cn } from "@/lib/utils"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null)
  const [formName, setFormName] = useState("")
  const [formSlug, setFormSlug] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formIsActive, setFormIsActive] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)

  // Delete Guard Dialog
  const [deletingCategory, setDeletingCategory] = useState<AdminCategory | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const isInitialMount = React.useRef(true)

  const loadCategories = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await adminApi.getCategories({ search: searchQuery })
      setCategories(res.results || [])
    } catch (err: any) {
      setError(err.message || "Failed to load categories.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      loadCategories()
      return
    }

    const timer = setTimeout(() => {
      loadCategories()
    }, 200)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const openAddModal = () => {
    setEditingCategory(null)
    setFormName("")
    setFormSlug("")
    setFormDescription("")
    setFormIsActive(true)
    setModalError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (c: AdminCategory) => {
    setEditingCategory(c)
    setFormName(c.name)
    setFormSlug(c.slug)
    setFormDescription(c.description || "")
    setFormIsActive(c.is_active)
    setModalError(null)
    setIsModalOpen(true)
  }

  const handleNameChange = (val: string) => {
    setFormName(val)
    if (!editingCategory) {
      const slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
      setFormSlug(slug)
    }
  }

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) {
      setModalError("Category name is required.")
      return
    }

    setIsSaving(true)
    setModalError(null)

    const payload = {
      name: formName.trim(),
      slug: formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: formDescription.trim(),
      is_active: formIsActive,
    }

    try {
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, payload)
      } else {
        await adminApi.createCategory(payload)
      }
      setIsModalOpen(false)
      loadCategories()
    } catch (err: any) {
      setModalError(err.message || "Failed to save category.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleActive = async (c: AdminCategory) => {
    try {
      const res = await adminApi.toggleCategoryActive(c.id)
      setCategories((prev) =>
        prev.map((item) => (item.id === c.id ? { ...item, is_active: res.is_active } : item))
      )
    } catch (err: any) {
      alert(`Could not toggle category status: ${err.message}`)
    }
  }

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return
    setIsDeleting(true)
    try {
      await adminApi.deleteCategory(deletingCategory.id)
      setDeletingCategory(null)
      loadCategories()
    } catch (err: any) {
      alert(err.message || "Failed to delete category.")
    } finally {
      setIsDeleting(false)
    }
  }

  const canCreate = adminApi.hasPermission("categories.create")
  const canUpdate = adminApi.hasPermission("categories.update")
  const canDelete = adminApi.hasPermission("categories.delete")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-foreground">
            Category Management
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Organize the boutique catalog into intuitive departments and collections.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadCategories()}
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
              Add Category
            </Button>
          )}
        </div>
      </div>

      {/* Search Toolbar */}
      <Card className="rounded-2xl border-border/70 shadow-sm bg-card p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search categories by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 rounded-xl text-xs bg-background"
          />
        </div>
      </Card>

      {/* Categories Grid/Table */}
      <Card className="rounded-2xl border-border/70 shadow-sm bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/50">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Category Name</th>
                  <th className="py-3.5 px-4 font-semibold">URL Slug</th>
                  <th className="py-3.5 px-4 font-semibold">Description</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Products</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-muted/70 shrink-0" />
                          <div className="h-4 w-32 bg-muted/80 rounded" />
                        </div>
                      </td>
                      <td className="py-3 px-4"><div className="h-4 w-24 bg-muted/70 rounded" /></td>
                      <td className="py-3 px-4"><div className="h-4 w-44 bg-muted/60 rounded" /></td>
                      <td className="py-3 px-4 text-center"><div className="h-4 w-8 bg-muted/70 rounded mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><div className="h-5 w-16 bg-muted/70 rounded-full mx-auto" /></td>
                      <td className="py-3 px-4 text-right"><div className="h-8 w-16 bg-muted/70 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-xs text-muted-foreground space-y-3">
                      <FolderTree className="w-8 h-8 mx-auto text-muted-foreground/40" />
                      <p className="font-semibold text-foreground">No categories found.</p>
                      <Button size="sm" onClick={openAddModal} className="rounded-xl">
                        Create First Category
                      </Button>
                    </td>
                  </tr>
                ) : (
                  categories.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            <FolderTree className="w-4 h-4" />
                          </div>
                          <span>{c.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">
                        /{c.slug}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">
                        {c.description || "—"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Link href={`/admin/products?category=${c.id}`}>
                          <Badge variant="outline" className="text-[11px] font-mono hover:bg-muted cursor-pointer">
                            <Package className="w-3 h-3 mr-1 text-primary" />
                            {c.products_count ?? 0} items
                          </Badge>
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => canUpdate && handleToggleActive(c)}
                          disabled={!canUpdate}
                          className={cn(
                            "w-7 h-7 rounded-lg inline-flex items-center justify-center transition-colors",
                            c.is_active
                              ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25"
                              : "bg-muted text-muted-foreground hover:bg-muted/80",
                            !canUpdate && "cursor-not-allowed opacity-70"
                          )}
                          title={
                            !canUpdate
                              ? (c.is_active ? "Active" : "Inactive")
                              : (c.is_active ? "Active (Click to hide)" : "Hidden (Click to activate)")
                          }
                        >
                          {c.is_active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/shop?category=${c.slug}`} target="_blank">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground" title="View in Storefront">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </Link>

                          {canUpdate && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openEditModal(c)}
                              className="h-8 w-8 rounded-lg text-foreground hover:bg-muted"
                              title="Edit Category"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                          )}

                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingCategory(c)}
                              className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )))}
                </tbody>
                </table>
            </div>
        </CardContent>
      </Card>

      {/* ADD / EDIT CATEGORY MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif font-bold text-foreground">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Category"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define the category name, SEO slug, and description.
            </DialogDescription>
          </DialogHeader>

          {modalError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <form onSubmit={handleSaveCategory} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Category Name *</label>
              <Input
                type="text"
                placeholder="e.g. Traditional Mekhela Sador"
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
                placeholder="traditional-mekhela-sador"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                className="rounded-xl h-9 text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Description</label>
              <textarea
                placeholder="Brief category description displayed on shop filter..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                />
                <span>Active on Public Storefront</span>
              </label>
            </div>

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
                {isSaving ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* SAFE DELETE DIALOG */}
      <Dialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif font-bold text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Category
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              {deletingCategory && deletingCategory.products_count > 0 ? (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium space-y-1">
                  <span className="font-bold block flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> Cannot delete active category
                  </span>
                  <span>
                    &quot;{deletingCategory.name}&quot; currently contains {deletingCategory.products_count} linked product(s). Please reassign or delete those products first.
                  </span>
                </div>
              ) : (
                <span>
                  Are you sure you want to delete category &quot;{deletingCategory?.name}&quot;?
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingCategory(null)}
              disabled={isDeleting}
              className="h-9 rounded-xl text-xs"
            >
              Cancel
            </Button>
            {deletingCategory && deletingCategory.products_count === 0 && (
              <Button
                variant="destructive"
                onClick={handleDeleteCategory}
                disabled={isDeleting}
                className="h-9 rounded-xl text-xs font-semibold"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
