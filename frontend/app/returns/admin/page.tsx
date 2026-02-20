"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Package,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  DollarSign,
  TrendingUp,
  Users,
  ArrowUpDown,
} from "lucide-react"

const returnRequests = [
  {
    id: "RET-001",
    orderId: "ORD-001",
    customer: "Priya Sharma",
    customerEmail: "priya@example.com",
    customerPhone: "+91 98765 43210",
    product: "Elegant Silk Saree",
    productImage: "/placeholder.svg?height=60&width=60",
    reason: "Size Issue",
    description: "The saree is too long for my height. I need a shorter length.",
    status: "Pending Review",
    requestDate: "2024-01-10",
    refundAmount: 2999,
    photos: ["/placeholder.svg?height=100&width=100"],
    priority: "Medium",
    assignedTo: "Meera Patel",
  },
  {
    id: "RET-002",
    orderId: "ORD-002",
    customer: "Anjali Singh",
    customerEmail: "anjali@example.com",
    customerPhone: "+91 87654 32109",
    product: "Designer Kurti Set",
    productImage: "/placeholder.svg?height=60&width=60",
    reason: "Damaged Item",
    description: "The kurti has a tear near the neckline and some loose threads.",
    status: "Approved",
    requestDate: "2024-01-12",
    refundAmount: 1599,
    photos: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"],
    priority: "High",
    assignedTo: "Ravi Kumar",
    trackingId: "RET123456",
  },
  {
    id: "RET-003",
    orderId: "ORD-003",
    customer: "Kavya Reddy",
    customerEmail: "kavya@example.com",
    customerPhone: "+91 76543 21098",
    product: "Traditional Lehenga",
    productImage: "/placeholder.svg?height=60&width=60",
    reason: "Quality Issue",
    description: "The embroidery work is not as shown in the product images.",
    status: "Rejected",
    requestDate: "2024-01-08",
    refundAmount: 4999,
    photos: ["/placeholder.svg?height=100&width=100"],
    priority: "Low",
    assignedTo: "Priya Sharma",
    rejectionReason: "Item shows normal wear consistent with product description",
  },
]

const returnStats = {
  totalReturns: 156,
  pendingReview: 23,
  approved: 89,
  rejected: 44,
  totalRefundAmount: 245000,
  avgProcessingTime: "2.3 days",
}

export default function AdminReturnsPage() {
  const [activeTab, setActiveTab] = useState("all-returns")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReturn, setSelectedReturn] = useState<(typeof returnRequests)[0] | null>(null)

  const filteredReturns = returnRequests.filter((returnReq) => {
    const matchesSearch =
      returnReq.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnReq.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnReq.product.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || returnReq.status.toLowerCase().includes(statusFilter.toLowerCase())

    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = (returnId: string, newStatus: string) => {
    // Handle status update logic here
    console.log(`Updating return ${returnId} to status: ${newStatus}`)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending review":
        return "secondary"
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      case "refund processed":
        return "default"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Returns Management</h1>
          <p className="text-muted-foreground">Manage customer return requests and refund processing</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="all-returns">All Returns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="all-returns" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{returnStats.totalReturns}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+12%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{returnStats.pendingReview}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{returnStats.totalRefundAmount.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Processing</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{returnStats.avgProcessingTime}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">-0.5 days</span> improvement
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search returns by ID, customer, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Returns Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4 font-medium">
                          <Button variant="ghost" className="h-auto p-0 font-medium">
                            Return ID
                            <ArrowUpDown className="w-4 h-4 ml-1" />
                          </Button>
                        </th>
                        <th className="text-left p-4 font-medium">Customer</th>
                        <th className="text-left p-4 font-medium">Product</th>
                        <th className="text-left p-4 font-medium">Reason</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Priority</th>
                        <th className="text-left p-4 font-medium">Amount</th>
                        <th className="text-left p-4 font-medium">Date</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReturns.map((returnReq) => (
                        <tr key={returnReq.id} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-medium">{returnReq.id}</td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{returnReq.customer}</p>
                              <p className="text-sm text-muted-foreground">{returnReq.customerEmail}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={returnReq.productImage || "/placeholder.svg"}
                                alt={returnReq.product}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium text-sm">{returnReq.product}</p>
                                <p className="text-xs text-muted-foreground">Order: {returnReq.orderId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{returnReq.reason}</span>
                          </td>
                          <td className="p-4">
                            <Badge variant={getStatusColor(returnReq.status)}>{returnReq.status}</Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant={getPriorityColor(returnReq.priority)}>{returnReq.priority}</Badge>
                          </td>
                          <td className="p-4 font-medium">₹{returnReq.refundAmount.toLocaleString()}</td>
                          <td className="p-4 text-sm">{returnReq.requestDate}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="ghost" onClick={() => setSelectedReturn(returnReq)}>
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Return Request Details - {selectedReturn?.id}</DialogTitle>
                                    <DialogDescription>Review and manage this return request</DialogDescription>
                                  </DialogHeader>

                                  {selectedReturn && (
                                    <div className="space-y-6">
                                      {/* Customer Info */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Customer Information</CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                              <Users className="w-4 h-4 text-muted-foreground" />
                                              <span className="font-medium">{selectedReturn.customer}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <Mail className="w-4 h-4 text-muted-foreground" />
                                              <span className="text-sm">{selectedReturn.customerEmail}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <Phone className="w-4 h-4 text-muted-foreground" />
                                              <span className="text-sm">{selectedReturn.customerPhone}</span>
                                            </div>
                                          </CardContent>
                                        </Card>

                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Return Details</CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-3">
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Return ID:</span>
                                              <span className="font-medium">{selectedReturn.id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Order ID:</span>
                                              <span className="font-medium">{selectedReturn.orderId}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Request Date:</span>
                                              <span className="font-medium">{selectedReturn.requestDate}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Refund Amount:</span>
                                              <span className="font-medium">
                                                ₹{selectedReturn.refundAmount.toLocaleString()}
                                              </span>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </div>

                                      {/* Product Info */}
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Product Information</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="flex items-center space-x-4">
                                            <img
                                              src={selectedReturn.productImage || "/placeholder.svg"}
                                              alt={selectedReturn.product}
                                              className="w-20 h-20 rounded-lg object-cover"
                                            />
                                            <div>
                                              <h4 className="font-medium">{selectedReturn.product}</h4>
                                              <p className="text-sm text-muted-foreground">
                                                Reason: {selectedReturn.reason}
                                              </p>
                                              <Badge
                                                variant={getPriorityColor(selectedReturn.priority)}
                                                className="mt-2"
                                              >
                                                {selectedReturn.priority} Priority
                                              </Badge>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      {/* Description */}
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Customer Description</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <p className="text-sm">{selectedReturn.description}</p>
                                        </CardContent>
                                      </Card>

                                      {/* Photos */}
                                      {selectedReturn.photos && selectedReturn.photos.length > 0 && (
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Uploaded Photos</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                              {selectedReturn.photos.map((photo, index) => (
                                                <img
                                                  key={index}
                                                  src={photo || "/placeholder.svg"}
                                                  alt={`Return photo ${index + 1}`}
                                                  className="w-full h-24 rounded-lg object-cover border"
                                                />
                                              ))}
                                            </div>
                                          </CardContent>
                                        </Card>
                                      )}

                                      {/* Status Update */}
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Update Status</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                          <div className="flex items-center space-x-4">
                                            <Label>Current Status:</Label>
                                            <Badge variant={getStatusColor(selectedReturn.status)}>
                                              {selectedReturn.status}
                                            </Badge>
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                              <Label htmlFor="new-status">Update Status</Label>
                                              <Select>
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Select new status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="pending">Pending Review</SelectItem>
                                                  <SelectItem value="approved">Approved</SelectItem>
                                                  <SelectItem value="rejected">Rejected</SelectItem>
                                                  <SelectItem value="refund-processed">Refund Processed</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>

                                            <div>
                                              <Label htmlFor="assigned-to">Assigned To</Label>
                                              <Select defaultValue={selectedReturn.assignedTo}>
                                                <SelectTrigger>
                                                  <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="Meera Patel">Meera Patel</SelectItem>
                                                  <SelectItem value="Ravi Kumar">Ravi Kumar</SelectItem>
                                                  <SelectItem value="Priya Sharma">Priya Sharma</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          </div>

                                          <div>
                                            <Label htmlFor="admin-notes">Admin Notes</Label>
                                            <Textarea
                                              id="admin-notes"
                                              placeholder="Add internal notes about this return..."
                                              className="mt-2"
                                            />
                                          </div>

                                          <div className="flex space-x-3">
                                            <Button className="flex-1">
                                              <CheckCircle className="w-4 h-4 mr-2" />
                                              Approve Return
                                            </Button>
                                            <Button variant="destructive" className="flex-1">
                                              <XCircle className="w-4 h-4 mr-2" />
                                              Reject Return
                                            </Button>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>

                              {returnReq.status === "Pending Review" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleStatusUpdate(returnReq.id, "approved")}
                                  >
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleStatusUpdate(returnReq.id, "rejected")}
                                  >
                                    <XCircle className="w-4 h-4 text-red-600" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Return Reasons</CardTitle>
                  <CardDescription>Most common reasons for returns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Size Issues</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="w-16 h-2 bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Quality Issues</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="w-12 h-2 bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">30%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Damaged Items</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="w-6 h-2 bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Other</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="w-3 h-2 bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Processing Performance</CardTitle>
                  <CardDescription>Return processing metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average Processing Time</span>
                      <span className="font-medium">2.3 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Approval Rate</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer Satisfaction</span>
                      <span className="font-medium">4.2/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Refund Processing Time</span>
                      <span className="font-medium">5.1 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Return Policy Settings</CardTitle>
                <CardDescription>Configure return policy parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="return-window">Return Window (Days)</Label>
                    <Input id="return-window" type="number" defaultValue="30" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="refund-processing">Refund Processing Time (Days)</Label>
                    <Input id="refund-processing" type="number" defaultValue="7" className="mt-2" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="auto-approval">Auto-Approval Rules</Label>
                  <Textarea
                    id="auto-approval"
                    placeholder="Define conditions for automatic return approval..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="rejection-reasons">Common Rejection Reasons</Label>
                  <Textarea
                    id="rejection-reasons"
                    placeholder="List common reasons for return rejection..."
                    className="mt-2"
                  />
                </div>

                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
