"use client"

import type React from "react"

import type { ReactElement } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, X, AlertCircle, Save } from "lucide-react"
import { cn } from "@/lib/utils"

// Types
interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
}

interface ProductVariant {
  id: string
  name: string
  values: string[]
}

interface Product {
  id: string
  name: string
  description: string
  shortDescription: string
  category: string
  price: number
  comparePrice?: number
  discountPercentage?: number
  images: ProductImage[]
  sku: string
  stock: number
  stockStatus: "in_stock" | "out_of_stock" | "low_stock" | "preorder"
  variants: ProductVariant[]
  visibility: "visible" | "hidden" | "draft"
  tags: string[]
  brand: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  slug: string
  metaTitle: string
  metaDescription: string
  ogImage?: string
  searchKeywords: string[]
  shippingCode?: string
  barcode?: string
  saleEnabled: boolean
  saleFromDate?: string
  saleToDate?: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

// Mock data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Elegant Silk Saree",
    description:
      "Beautiful handwoven silk saree with intricate gold border and traditional motifs. Perfect for weddings and special occasions.",
    shortDescription: "Handwoven silk saree with gold border",
    category: "Sarees",
    price: 2999,
    comparePrice: 3999,
    discountPercentage: 25,
    images: [
      { id: "1", url: "/elegant-silk-saree.png", alt: "Elegant Silk Saree", isPrimary: true },
      { id: "2", url: "/silk-saree-detail.jpg", alt: "Saree Detail", isPrimary: false },
    ],
    sku: "SAR-001",
    stock: 15,
    stockStatus: "in_stock",
    variants: [
      { id: "1", name: "Color", values: ["Red", "Blue", "Green"] },
      { id: "2", name: "Size", values: ["Free Size"] },
    ],
    visibility: "visible",
    tags: ["silk", "traditional", "wedding", "handwoven"],
    brand: "EBASI",
    weight: 0.8,
    dimensions: { length: 550, width: 110, height: 2 },
    slug: "elegant-silk-saree",
    metaTitle: "Elegant Silk Saree - Traditional Handwoven | EBASI STORE",
    metaDescription:
      "Shop beautiful handwoven silk saree with gold border. Perfect for weddings and special occasions. Free shipping available.",
    searchKeywords: ["silk saree", "wedding saree", "traditional wear", "handwoven"],
    shippingCode: "SAREE",
    barcode: "8901234567890",
    saleEnabled: true,
    saleFromDate: "2024-01-01",
    saleToDate: "2024-12-31",
    sortOrder: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Designer Kurti Set",
    description:
      "Contemporary designer kurti set with matching dupatta. Made from premium cotton fabric with beautiful embroidery work.",
    shortDescription: "Designer kurti set with dupatta",
    category: "Kurtis",
    price: 1599,
    comparePrice: 2199,
    discountPercentage: 27,
    images: [{ id: "3", url: "/designer-kurti-set.jpg", alt: "Designer Kurti Set", isPrimary: true }],
    sku: "KUR-002",
    stock: 8,
    stockStatus: "low_stock",
    variants: [
      { id: "3", name: "Size", values: ["S", "M", "L", "XL"] },
      { id: "4", name: "Color", values: ["Pink", "White", "Yellow"] },
    ],
    visibility: "visible",
    tags: ["kurti", "designer", "cotton", "embroidery"],
    brand: "EBASI",
    weight: 0.4,
    slug: "designer-kurti-set",
    metaTitle: "Designer Kurti Set with Dupatta | EBASI STORE",
    metaDescription:
      "Shop premium cotton designer kurti set with beautiful embroidery. Available in multiple sizes and colors.",
    searchKeywords: ["kurti set", "designer kurti", "cotton kurti", "embroidery"],
    saleEnabled: false,
    sortOrder: 2,
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-16T00:00:00Z",
  },
]

const categories = ["Sarees", "Kurtis", "Lehengas", "Accessories", "Blouses", "Dupattas"]
const stockStatuses = [
  { value: "in_stock", label: "In Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "preorder", label: "Pre-order" },
]
const visibilityOptions = [
  { value: "visible", label: "Visible" },
  { value: "hidden", label: "Hidden" },
  { value: "draft", label: "Draft" },
]

export function ProductManagement(): ReactElement {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { api } = await import("@/lib/api")
        const data = await api.getAdminProducts()
        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        })
      }
    }
    fetchProducts()
  }, [toast])

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsAddDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsEditDialogOpen(true)
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsViewDialogOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedProduct) return

    setIsLoading(true)
    try {
      const { api } = await import("@/lib/api")
      await api.deleteProduct(selectedProduct.id)

      setProducts(products.filter((p) => p.id !== selectedProduct.id))
      toast({
        title: "Product Deleted",
        description: `${selectedProduct.name} has been successfully deleted.`,
      })
      setIsDeleteDialogOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button onClick={handleAddProduct} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                          <img
                            src={product.images[0]?.url || "/placeholder.svg?height=48&width=48"}
                            alt={product.images[0]?.alt || product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4">
                      <div>
                        <span className="font-medium">₹{product.price.toLocaleString()}</span>
                        {product.comparePrice && (
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            ₹{product.comparePrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          product.stockStatus === "in_stock"
                            ? "default"
                            : product.stockStatus === "low_stock"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {stockStatuses.find((s) => s.value === product.stockStatus)?.label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewProduct(product)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEditProduct(product)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteProduct(product)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <ProductFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        product={null}
        onSave={(savedProduct) => {
          setProducts((prev) => [...prev, savedProduct])
          setIsAddDialogOpen(false)
          toast({
            title: "Product Added",
            description: `${savedProduct.name} has been successfully added.`,
          })
        }}
        title="Add New Product"
        description="Create a new product in your catalog"
      />

      {/* Edit Product Dialog */}
      <ProductFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        product={selectedProduct}
        onSave={(savedProduct) => {
          setProducts((prev) => prev.map((p) => (p.id === savedProduct.id ? savedProduct : p)))
          setIsEditDialogOpen(false)
          toast({
            title: "Product Updated",
            description: `${savedProduct.name} has been successfully updated.`,
          })
        }}
        title="Edit Product"
        description="Update product information"
      />

      {/* View Product Dialog */}
      <ProductViewDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        product={selectedProduct}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Product Form Dialog Component
interface ProductFormDialogProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onSave: (product: Product) => void
  title: string
  description: string
}

function ProductFormDialog({ isOpen, onClose, product, onSave, title, description }: ProductFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    shortDescription: "",
    category: "",
    price: 0,
    comparePrice: 0,
    discountPercentage: 0,
    images: [],
    sku: "",
    stock: 0,
    stockStatus: "in_stock",
    variants: [],
    visibility: "visible",
    tags: [],
    brand: "",
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    slug: "",
    metaTitle: "",
    metaDescription: "",
    searchKeywords: [],
    shippingCode: "",
    barcode: "",
    saleEnabled: false,
    saleFromDate: "",
    saleToDate: "",
    sortOrder: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [newKeyword, setNewKeyword] = useState("")
  const { toast } = useToast()

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      setFormData(product)
    } else {
      setFormData({
        name: "",
        description: "",
        shortDescription: "",
        category: "",
        price: 0,
        comparePrice: 0,
        discountPercentage: 0,
        images: [],
        sku: "",
        stock: 0,
        stockStatus: "in_stock",
        variants: [],
        visibility: "visible",
        tags: [],
        brand: "",
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
        slug: "",
        metaTitle: "",
        metaDescription: "",
        searchKeywords: [],
        shippingCode: "",
        barcode: "",
        saleEnabled: false,
        saleFromDate: "",
        saleToDate: "",
        sortOrder: 0,
      })
    }
    setErrors({})
  }, [product])

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !product) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      setFormData((prev) => ({ ...prev, slug }))
    }
  }, [formData.name, product])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }))
  }

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !formData.searchKeywords?.includes(newKeyword.trim())) {
      setFormData((prev) => ({
        ...prev,
        searchKeywords: [...(prev.searchKeywords || []), newKeyword.trim()],
      }))
      setNewKeyword("")
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      searchKeywords: prev.searchKeywords?.filter((k) => k !== keyword) || [],
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
    if (!formData.name?.trim()) newErrors.name = "Product name is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required"
    if (!formData.sku?.trim()) newErrors.sku = "SKU is required"
    if (formData.stock === undefined || formData.stock < 0) newErrors.stock = "Valid stock quantity is required"

    // Format validation
    if (formData.name && formData.name.length < 2) newErrors.name = "Product name must be at least 2 characters"
    if (formData.sku && !/^[A-Z0-9\-_]{3,}$/.test(formData.sku))
      newErrors.sku = "SKU must be at least 3 characters (A-Z, 0-9, -, _)"
    if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug))
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const { api } = await import("@/lib/api")

      let savedProduct;
      if (product) {
        // Update existing
        savedProduct = await api.updateProduct(product.id, formData)
      } else {
        // Create new
        savedProduct = await api.createProduct(formData)
      }

      onSave(savedProduct)
      onClose() // Close dialog on success
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={cn(errors.name && "border-destructive")}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <div className="flex items-center space-x-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category || ""}
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger className={cn(errors.category && "border-destructive")}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <div className="flex items-center space-x-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.category}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  value={formData.shortDescription || ""}
                  onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                  placeholder="Brief product description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Detailed product description"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price || ""}
                    onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                    className={cn(errors.price && "border-destructive")}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <div className="flex items-center space-x-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.price}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comparePrice">Compare Price</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    value={formData.comparePrice || ""}
                    onChange={(e) => handleInputChange("comparePrice", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountPercentage">Discount %</Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    value={formData.discountPercentage || ""}
                    onChange={(e) => handleInputChange("discountPercentage", Number.parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku || ""}
                    onChange={(e) => handleInputChange("sku", e.target.value.toUpperCase())}
                    className={cn(errors.sku && "border-destructive")}
                    placeholder="PROD-001"
                  />
                  {errors.sku && (
                    <div className="flex items-center space-x-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.sku}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock || ""}
                    onChange={(e) => handleInputChange("stock", Number.parseInt(e.target.value) || 0)}
                    className={cn(errors.stock && "border-destructive")}
                    placeholder="0"
                  />
                  {errors.stock && (
                    <div className="flex items-center space-x-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.stock}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockStatus">Stock Status</Label>
                  <Select
                    value={formData.stockStatus || ""}
                    onValueChange={(value) => handleInputChange("stockStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {stockStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand || ""}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    placeholder="Brand name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight || ""}
                    onChange={(e) => handleInputChange("weight", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dimensions (cm)</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    type="number"
                    value={formData.dimensions?.length || ""}
                    onChange={(e) =>
                      handleInputChange("dimensions", {
                        ...formData.dimensions,
                        length: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Length"
                  />
                  <Input
                    type="number"
                    value={formData.dimensions?.width || ""}
                    onChange={(e) =>
                      handleInputChange("dimensions", {
                        ...formData.dimensions,
                        width: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Width"
                  />
                  <Input
                    type="number"
                    value={formData.dimensions?.height || ""}
                    onChange={(e) =>
                      handleInputChange("dimensions", {
                        ...formData.dimensions,
                        height: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Height"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingCode">Shipping Code</Label>
                  <Input
                    id="shippingCode"
                    value={formData.shippingCode || ""}
                    onChange={(e) => handleInputChange("shippingCode", e.target.value)}
                    placeholder="STANDARD"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode || ""}
                    onChange={(e) => handleInputChange("barcode", e.target.value)}
                    placeholder="1234567890123"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags and Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags & Keywords</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Search Keywords</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.searchKeywords?.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="flex items-center gap-1">
                      {keyword}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveKeyword(keyword)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add keyword"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword())}
                  />
                  <Button type="button" onClick={handleAddKeyword} variant="outline">
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug || ""}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  className={cn(errors.slug && "border-destructive")}
                  placeholder="product-url-slug"
                />
                {errors.slug && (
                  <div className="flex items-center space-x-2 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.slug}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle || ""}
                  onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                  placeholder="SEO title for search engines"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription || ""}
                  onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                  placeholder="SEO description for search engines"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sale Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sale Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="saleEnabled"
                  checked={formData.saleEnabled || false}
                  onCheckedChange={(checked) => handleInputChange("saleEnabled", checked)}
                />
                <Label htmlFor="saleEnabled">Enable Sale</Label>
              </div>

              {formData.saleEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="saleFromDate">Sale From Date</Label>
                    <Input
                      id="saleFromDate"
                      type="date"
                      value={formData.saleFromDate || ""}
                      onChange={(e) => handleInputChange("saleFromDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="saleToDate">Sale To Date</Label>
                    <Input
                      id="saleToDate"
                      type="date"
                      value={formData.saleToDate || ""}
                      onChange={(e) => handleInputChange("saleToDate", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Visibility */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="visibility">Product Visibility</Label>
                <Select
                  value={formData.visibility || ""}
                  onValueChange={(value) => handleInputChange("visibility", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    {visibilityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder || ""}
                  onChange={(e) => handleInputChange("sortOrder", Number.parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Product
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Product View Dialog Component
interface ProductViewDialogProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

function ProductViewDialog({ isOpen, onClose, product }: ProductViewDialogProps) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>View complete product information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Product Name</Label>
                  <p className="text-sm">{product.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                  <p className="text-sm">{product.category}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Short Description</Label>
                <p className="text-sm">{product.shortDescription}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="text-sm">{product.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Price</Label>
                  <p className="text-sm font-medium">₹{product.price.toLocaleString()}</p>
                </div>
                {product.comparePrice && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Compare Price</Label>
                    <p className="text-sm">₹{product.comparePrice.toLocaleString()}</p>
                  </div>
                )}
                {product.discountPercentage && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Discount</Label>
                    <p className="text-sm">{product.discountPercentage}%</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">SKU</Label>
                  <p className="text-sm font-mono">{product.sku}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Stock</Label>
                  <p className="text-sm">{product.stock}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge
                    variant={
                      product.stockStatus === "in_stock"
                        ? "default"
                        : product.stockStatus === "low_stock"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {stockStatuses.find((s) => s.value === product.stockStatus)?.label}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SEO Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">URL Slug</Label>
                <p className="text-sm font-mono">{product.slug}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Meta Title</Label>
                <p className="text-sm">{product.metaTitle}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Meta Description</Label>
                <p className="text-sm">{product.metaDescription}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-6 border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
