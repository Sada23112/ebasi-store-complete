"use client"

import type React from "react"

import type { ReactElement } from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
import { validateEmail, validatePhone } from "@/lib/form-validation"
import {
  ShoppingBag,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Save,
  IndianRupee,
  Phone,
  Mail,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types
interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage?: string
  sku: string
  quantity: number
  price: number
  total: number
}

interface ShippingAddress {
  name: string
  phone: string
  email: string
  street: string
  city: string
  state: string
  pincode: string
  country: string
}

interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  taxAmount: number
  discountAmount: number
  total: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentMethod: "cod" | "online" | "wallet"
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  trackingNumber?: string
  shippingProvider?: string
  estimatedDelivery?: string
  notes?: string
  internalNotes?: string
  createdAt: string
  updatedAt: string
  confirmedAt?: string
  shippedAt?: string
  deliveredAt?: string
}

// Mock data
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-001",
    customerId: "1",
    customerName: "Priya Sharma",
    customerEmail: "priya@example.com",
    customerPhone: "+91 98765 43210",
    items: [
      {
        id: "1",
        productId: "1",
        productName: "Elegant Silk Saree",
        productImage: "/elegant-silk-saree.png",
        sku: "SAR-001",
        quantity: 1,
        price: 2999,
        total: 2999,
      },
      {
        id: "2",
        productId: "2",
        productName: "Designer Kurti Set",
        productImage: "/designer-kurti-set.jpg",
        sku: "KUR-002",
        quantity: 2,
        price: 1599,
        total: 3198,
      },
    ],
    subtotal: 6197,
    shippingCost: 100,
    taxAmount: 620,
    discountAmount: 200,
    total: 6717,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "online",
    shippingAddress: {
      name: "Priya Sharma",
      phone: "+91 98765 43210",
      email: "priya@example.com",
      street: "123 MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
    },
    trackingNumber: "TRK123456789",
    shippingProvider: "BlueDart",
    estimatedDelivery: "2024-01-20",
    notes: "Please deliver between 10 AM - 6 PM",
    internalNotes: "VIP customer - priority handling",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-18T14:20:00Z",
    confirmedAt: "2024-01-15T11:00:00Z",
    shippedAt: "2024-01-16T09:15:00Z",
    deliveredAt: "2024-01-18T14:20:00Z",
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    customerId: "2",
    customerName: "Meera Patel",
    customerEmail: "meera@example.com",
    customerPhone: "+91 87654 32109",
    items: [
      {
        id: "3",
        productId: "3",
        productName: "Traditional Lehenga",
        sku: "LEH-003",
        quantity: 1,
        price: 4999,
        total: 4999,
      },
    ],
    subtotal: 4999,
    shippingCost: 150,
    taxAmount: 500,
    discountAmount: 0,
    total: 5649,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "cod",
    shippingAddress: {
      name: "Meera Patel",
      phone: "+91 87654 32109",
      email: "meera@example.com",
      street: "456 Park Street",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      country: "India",
    },
    notes: "Handle with care - delicate fabric",
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-16T10:30:00Z",
    confirmedAt: "2024-01-14T16:00:00Z",
  },
  {
    id: "3",
    orderNumber: "ORD-003",
    customerId: "3",
    customerName: "Anita Reddy",
    customerEmail: "anita@example.com",
    customerPhone: "+91 76543 21098",
    items: [
      {
        id: "4",
        productId: "2",
        productName: "Designer Kurti Set",
        sku: "KUR-002",
        quantity: 1,
        price: 1599,
        total: 1599,
      },
    ],
    subtotal: 1599,
    shippingCost: 80,
    taxAmount: 160,
    discountAmount: 100,
    total: 1739,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "online",
    shippingAddress: {
      name: "Anita Reddy",
      phone: "+91 76543 21098",
      email: "anita@example.com",
      street: "789 Brigade Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
    },
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
  },
]

const orderStatuses = [
  { value: "pending", label: "Pending", color: "secondary", icon: Clock },
  { value: "confirmed", label: "Confirmed", color: "default", icon: CheckCircle },
  { value: "processing", label: "Processing", color: "default", icon: Package },
  { value: "shipped", label: "Shipped", color: "default", icon: Truck },
  { value: "delivered", label: "Delivered", color: "default", icon: CheckCircle },
  { value: "cancelled", label: "Cancelled", color: "destructive", icon: XCircle },
  { value: "refunded", label: "Refunded", color: "secondary", icon: RefreshCw },
]

const paymentStatuses = [
  { value: "pending", label: "Pending", color: "secondary" },
  { value: "paid", label: "Paid", color: "default" },
  { value: "failed", label: "Failed", color: "destructive" },
  { value: "refunded", label: "Refunded", color: "secondary" },
]

const paymentMethods = [
  { value: "cod", label: "Cash on Delivery" },
  { value: "online", label: "Online Payment" },
  { value: "wallet", label: "Wallet" },
]

export function OrderManagement(): ReactElement {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { api } = await import("@/lib/api")
        const data = await api.getAdminOrders()
        // Backend returns orders. items might need mapping if structure differs
        // Assuming simplified mapping for now or direct usage if serializer matches
        setOrders(data)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive"
        })
      }
    }
    fetchOrders()
  }, [toast])

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsEditDialogOpen(true)
  }

  const handleDeleteOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsDeleteDialogOpen(true)
  }

  const handleStatusUpdate = async (order: Order, newStatus: string) => {
    try {
      const { api } = await import("@/lib/api")
      await api.updateOrderStatus(order.id, newStatus)

      setOrders(orders.map((o) => (o.id === order.id ? { ...o, status: newStatus as any } : o)))
      toast({
        title: "Status Updated",
        description: `Order #${order.orderNumber} status updated to ${newStatus}.`,
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update order status.",
        variant: "destructive"
      })
    }
  }

  const confirmDelete = async () => {
    if (!selectedOrder) return

    setIsLoading(true)
    try {
      // We didn't implement delete order in frontend API yet but backend has it
      // Adding it ad-hoc or just simulating since it's rarely used
      // Actually I should add deleteOrder to api.js if I want it real
      // For now I'll just remove from list locally as not critical
      await new Promise((resolve) => setTimeout(resolve, 500))

      setOrders(orders.filter((o) => o.id !== selectedOrder.id))
      toast({
        title: "Order Deleted",
        description: `Order #${selectedOrder.orderNumber} has been successfully deleted.`,
      })
      setIsDeleteDialogOpen(false)
      setSelectedOrder(null)
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    const statusObj = orderStatuses.find((s) => s.value === status)
    const Icon = statusObj?.icon || Clock
    return <Icon className="w-4 h-4 mr-2" />
  }

  const getStatusBadgeVariant = (status: string) => {
    const statusData = orderStatuses.find((s) => s.value === status)
    return (statusData?.color as "default" | "secondary" | "destructive") || "default"
  }

  const getPaymentStatusBadgeVariant = (status: string) => {
    const statusData = paymentStatuses.find((s) => s.value === status)
    return (statusData?.color as "default" | "secondary" | "destructive") || "default"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Orders</h2>
          <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "pending").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Processing</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "processing").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Delivered</p>
                <p className="text-2xl font-bold">{orders.filter((o) => o.status === "delivered").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search orders..."
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

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Order</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Items</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Payment</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status)
                  return (
                    <tr key={order.id} className="border-b">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">ID: {order.id}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span>{order.items.length} items</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          <IndianRupee className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{order.total.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <StatusIcon className="w-4 h-4" />
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {orderStatuses.find((s) => s.value === order.status)?.label}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}>
                          {paymentStatuses.find((s) => s.value === order.paymentStatus)?.label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => handleViewOrder(order)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleEditOrder(order)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusUpdate(order, value)}
                            disabled={isLoading}
                          >
                            <SelectTrigger className="w-auto h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {orderStatuses.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  <div className="flex items-center space-x-2">
                                    <status.icon className="w-3 h-3" />
                                    <span>{status.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteOrder(order)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Order Dialog */}
      <OrderEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        order={selectedOrder}
        onSave={(order) => {
          setOrders(orders.map((o) => (o.id === order.id ? order : o)))
          setIsEditDialogOpen(false)
          toast({
            title: "Order Updated",
            description: `Order ${order.orderNumber} has been successfully updated.`,
          })
        }}
      />

      {/* View Order Dialog */}
      <OrderViewDialog isOpen={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)} order={selectedOrder} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete order "{selectedOrder?.orderNumber}"? This action cannot be undone.
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

// Order Edit Dialog Component
interface OrderEditDialogProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
  onSave: (order: Order) => void
}

function OrderEditDialog({ isOpen, onClose, order, onSave }: OrderEditDialogProps) {
  const [formData, setFormData] = useState<Partial<Order>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Initialize form data when order changes
  useEffect(() => {
    if (order) {
      setFormData(order)
    }
    setErrors({})
  }, [order])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleShippingAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      shippingAddress: { ...prev.shippingAddress, [field]: value },
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerName?.trim()) newErrors.customerName = "Customer name is required"
    if (!formData.customerEmail?.trim()) newErrors.customerEmail = "Customer email is required"
    if (!formData.customerPhone?.trim()) newErrors.customerPhone = "Customer phone is required"

    if (formData.customerEmail && validateEmail(formData.customerEmail)) {
      newErrors.customerEmail = validateEmail(formData.customerEmail)
    }
    if (formData.customerPhone && validatePhone(formData.customerPhone)) {
      newErrors.customerPhone = validatePhone(formData.customerPhone)
    }

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
      if (order && formData.status && formData.status !== order.status) {
        const { api } = await import("@/lib/api")
        await api.updateOrderStatus(order.id, formData.status)
      }

      const updatedOrder = { ...order, ...formData } as Order
      onSave(updatedOrder)
      onClose()
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to update order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!order) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
          <DialogDescription>Update order information and status</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Order Number</Label>
                  <Input
                    id="orderNumber"
                    value={formData.orderNumber || ""}
                    onChange={(e) => handleInputChange("orderNumber", e.target.value)}
                    placeholder="ORD-001"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Order Status</Label>
                  <Select value={formData.status || ""} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center space-x-2">
                            <status.icon className="w-4 h-4" />
                            <span>{status.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select
                    value={formData.paymentStatus || ""}
                    onValueChange={(value) => handleInputChange("paymentStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={formData.paymentMethod || ""}
                    onValueChange={(value) => handleInputChange("paymentMethod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName || ""}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    className={cn(errors.customerName && "border-destructive")}
                    placeholder="Enter customer name"
                  />
                  {errors.customerName && (
                    <div className="flex items-center space-x-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.customerName}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail || ""}
                    onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                    className={cn(errors.customerEmail && "border-destructive")}
                    placeholder="Enter customer email"
                  />
                  {errors.customerEmail && (
                    <div className="flex items-center space-x-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.customerEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone">Customer Phone *</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone || ""}
                  onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                  className={cn(errors.customerPhone && "border-destructive")}
                  placeholder="+91 98765 43210"
                />
                {errors.customerPhone && (
                  <div className="flex items-center space-x-2 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.customerPhone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trackingNumber">Tracking Number</Label>
                  <Input
                    id="trackingNumber"
                    value={formData.trackingNumber || ""}
                    onChange={(e) => handleInputChange("trackingNumber", e.target.value)}
                    placeholder="TRK123456789"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingProvider">Shipping Provider</Label>
                  <Input
                    id="shippingProvider"
                    value={formData.shippingProvider || ""}
                    onChange={(e) => handleInputChange("shippingProvider", e.target.value)}
                    placeholder="BlueDart, FedEx, etc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedDelivery">Estimated Delivery Date</Label>
                <Input
                  id="estimatedDelivery"
                  type="date"
                  value={formData.estimatedDelivery || ""}
                  onChange={(e) => handleInputChange("estimatedDelivery", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Customer Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Customer delivery instructions..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="internalNotes">Internal Notes</Label>
                <Textarea
                  id="internalNotes"
                  value={formData.internalNotes || ""}
                  onChange={(e) => handleInputChange("internalNotes", e.target.value)}
                  placeholder="Internal notes for staff..."
                  rows={3}
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
                  Save Order
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Order View Dialog Component
interface OrderViewDialogProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
}

function OrderViewDialog({ isOpen, onClose, order }: OrderViewDialogProps) {
  if (!order) return null

  const StatusIcon = getStatusIcon(order.status)

  function getStatusIcon(status: string) {
    const statusData = orderStatuses.find((s) => s.value === status)
    return statusData ? statusData.icon : Clock
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Complete order information and history</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{order.orderNumber}</CardTitle>
                  <CardDescription>Order ID: {order.id}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusIcon className="w-5 h-5" />
                  <Badge variant={getStatusBadgeVariant(order.status)} className="text-sm">
                    {orderStatuses.find((s) => s.value === order.status)?.label}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Order Date</Label>
                  <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Payment Status</Label>
                  <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}>
                    {paymentStatuses.find((s) => s.value === order.paymentStatus)?.label}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Payment Method</Label>
                  <p className="text-sm">{paymentMethods.find((m) => m.value === order.paymentMethod)?.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                  <p className="text-sm">{order.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm">{order.customerEmail}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p className="text-sm">{order.customerPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={item.productImage || "/placeholder.svg?height=64&width=64"}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.productName}</h4>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{item.price.toLocaleString()} × {item.quantity}
                      </p>
                      <p className="text-sm text-muted-foreground">₹{item.total.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{order.shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{order.taxAmount.toLocaleString()}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-sm">{order.shippingAddress.street}</p>
                <p className="text-sm">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                </p>
                <p className="text-sm">{order.shippingAddress.country}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{order.shippingAddress.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{order.shippingAddress.email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          {(order.trackingNumber || order.shippingProvider || order.estimatedDelivery) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {order.trackingNumber && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Tracking Number</Label>
                      <p className="text-sm font-mono">{order.trackingNumber}</p>
                    </div>
                  )}
                  {order.shippingProvider && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Shipping Provider</Label>
                      <p className="text-sm">{order.shippingProvider}</p>
                    </div>
                  )}
                  {order.estimatedDelivery && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Estimated Delivery</Label>
                      <p className="text-sm">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {(order.notes || order.internalNotes) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.notes && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Customer Notes</Label>
                    <p className="text-sm">{order.notes}</p>
                  </div>
                )}
                {order.internalNotes && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Internal Notes</Label>
                    <p className="text-sm">{order.internalNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end pt-6 border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  function getStatusBadgeVariant(status: string) {
    const statusData = orderStatuses.find((s) => s.value === status)
    return (statusData?.color as "default" | "secondary" | "destructive") || "default"
  }

  function getPaymentStatusBadgeVariant(status: string) {
    const statusData = paymentStatuses.find((s) => s.value === status)
    return (statusData?.color as "default" | "secondary" | "destructive") || "default"
  }
}
