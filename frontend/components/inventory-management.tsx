"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Warehouse,
  Truck,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Bell,
  BarChart3,
} from "lucide-react"

const inventoryStats = {
  totalProducts: 1250,
  lowStockItems: 23,
  outOfStock: 8,
  totalValue: 4250000,
  avgTurnover: 4.2,
  reorderAlerts: 15,
}

const inventoryItems = [
  {
    id: "INV-001",
    sku: "SAR-ELG-001",
    name: "Elegant Silk Saree",
    category: "Sarees",
    currentStock: 15,
    minStock: 10,
    maxStock: 50,
    reorderPoint: 12,
    unitCost: 1500,
    sellingPrice: 2999,
    supplier: "Silk Weavers Ltd",
    location: "Warehouse A - Rack 15",
    lastRestocked: "2024-01-10",
    turnoverRate: 4.5,
    status: "In Stock",
    forecast: "High Demand",
  },
  {
    id: "INV-002",
    sku: "KUR-DES-002",
    name: "Designer Kurti Set",
    category: "Kurtis",
    currentStock: 8,
    minStock: 15,
    maxStock: 40,
    reorderPoint: 18,
    unitCost: 800,
    sellingPrice: 1599,
    supplier: "Fashion Hub",
    location: "Warehouse B - Rack 8",
    lastRestocked: "2024-01-05",
    turnoverRate: 3.2,
    status: "Low Stock",
    forecast: "Medium Demand",
  },
  {
    id: "INV-003",
    sku: "LEH-TRA-003",
    name: "Traditional Lehenga",
    category: "Lehengas",
    currentStock: 0,
    minStock: 5,
    maxStock: 20,
    reorderPoint: 8,
    unitCost: 2500,
    sellingPrice: 4999,
    supplier: "Royal Designs",
    location: "Warehouse A - Rack 22",
    lastRestocked: "2023-12-20",
    turnoverRate: 2.1,
    status: "Out of Stock",
    forecast: "Low Demand",
  },
]

const suppliers = [
  {
    id: "SUP-001",
    name: "Silk Weavers Ltd",
    contact: "contact@silkweavers.com",
    phone: "+91 98765 43210",
    products: 45,
    avgDelivery: "7 days",
    rating: 4.8,
    status: "Active",
  },
  {
    id: "SUP-002",
    name: "Fashion Hub",
    contact: "orders@fashionhub.com",
    phone: "+91 87654 32109",
    products: 32,
    avgDelivery: "5 days",
    rating: 4.5,
    status: "Active",
  },
]

export function InventoryManagement() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || item.status.toLowerCase().includes(statusFilter.toLowerCase())

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in stock":
        return "default"
      case "low stock":
        return "secondary"
      case "out of stock":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getForecastColor = (forecast: string) => {
    switch (forecast.toLowerCase()) {
      case "high demand":
        return "default"
      case "medium demand":
        return "secondary"
      case "low demand":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-muted-foreground">Track stock levels, suppliers, and forecasting</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventoryStats.totalProducts.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Across all categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStockItems}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{inventoryStats.outOfStock}</div>
                <p className="text-xs text-muted-foreground">Immediate reorder needed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <Warehouse className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{(inventoryStats.totalValue / 100000).toFixed(1)}L</div>
                <p className="text-xs text-muted-foreground">Total stock value</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common inventory management tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Bell className="w-4 h-4 mr-2" />
                  View Reorder Alerts ({inventoryStats.reorderAlerts})
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Truck className="w-4 h-4 mr-2" />
                  Create Purchase Order
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Stock Report
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export Inventory Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest inventory movements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Stock received: 25 units of Elegant Silk Saree</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Low stock alert: Designer Kurti Set</p>
                      <p className="text-xs text-muted-foreground">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Out of stock: Traditional Lehenga</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name, SKU, or category..."
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
                <SelectItem value="in stock">In Stock</SelectItem>
                <SelectItem value="low stock">Low Stock</SelectItem>
                <SelectItem value="out of stock">Out of Stock</SelectItem>
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

          {/* Inventory Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4 font-medium">Product</th>
                      <th className="text-left p-4 font-medium">SKU</th>
                      <th className="text-left p-4 font-medium">Current Stock</th>
                      <th className="text-left p-4 font-medium">Min/Max</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Forecast</th>
                      <th className="text-left p-4 font-medium">Location</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <code className="bg-muted px-2 py-1 rounded text-sm">{item.sku}</code>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{item.currentStock}</span>
                            <div className="w-16 h-2 bg-muted rounded-full">
                              <div
                                className={`h-2 rounded-full ${
                                  item.currentStock <= item.minStock
                                    ? "bg-destructive"
                                    : item.currentStock <= item.reorderPoint
                                      ? "bg-yellow-500"
                                      : "bg-primary"
                                }`}
                                style={{ width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm">
                          <div>
                            <p>Min: {item.minStock}</p>
                            <p>Max: {item.maxStock}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant={getForecastColor(item.forecast)}>{item.forecast}</Badge>
                        </td>
                        <td className="p-4 text-sm">{item.location}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                            {item.status === "Low Stock" || item.status === "Out of Stock" ? (
                              <Button size="sm" variant="outline">
                                Reorder
                              </Button>
                            ) : null}
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

        <TabsContent value="suppliers" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Suppliers</h3>
              <p className="text-muted-foreground">Manage supplier relationships</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suppliers.map((supplier) => (
              <Card key={supplier.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <Badge variant="default">{supplier.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Products</p>
                      <p className="font-medium">{supplier.products}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Delivery</p>
                      <p className="font-medium">{supplier.avgDelivery}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rating</p>
                      <p className="font-medium">{supplier.rating}/5</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Contact</p>
                      <p className="font-medium">{supplier.phone}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Truck className="w-4 h-4 mr-2" />
                      Create PO
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Demand Forecasting</CardTitle>
              <CardDescription>AI-powered inventory predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">↗ 15%</div>
                    <p className="text-sm text-muted-foreground">Predicted Growth</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">23</div>
                    <p className="text-sm text-muted-foreground">Items to Reorder</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">₹2.8L</div>
                    <p className="text-sm text-muted-foreground">Suggested Investment</p>
                  </div>
                </div>

                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Demand forecasting chart would be displayed here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
