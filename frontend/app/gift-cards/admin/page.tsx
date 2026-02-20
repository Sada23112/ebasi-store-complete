"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Gift,
  CreditCard,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  XCircle,
  ArrowUpDown,
} from "lucide-react"

const giftCardStats = {
  totalSold: 1250,
  totalValue: 2850000,
  activeCards: 890,
  redeemedValue: 1950000,
  avgCardValue: 2280,
  monthlyGrowth: 15.3,
}

const giftCards = [
  {
    id: "GC-001",
    code: "EBASI2024GIFT",
    purchaser: "Priya Sharma",
    purchaserEmail: "priya@example.com",
    recipient: "Meera Patel",
    recipientEmail: "meera@example.com",
    originalAmount: 5000,
    currentBalance: 2500,
    status: "Active",
    purchaseDate: "2024-01-01",
    expiryDate: "2024-12-31",
    lastUsed: "2024-01-15",
    design: "Elegant Pink",
  },
  {
    id: "GC-002",
    code: "WELCOME2024",
    purchaser: "Anjali Singh",
    purchaserEmail: "anjali@example.com",
    recipient: "Self",
    recipientEmail: "anjali@example.com",
    originalAmount: 1000,
    currentBalance: 0,
    status: "Fully Redeemed",
    purchaseDate: "2024-01-15",
    expiryDate: "2024-06-30",
    lastUsed: "2024-01-20",
    design: "Traditional Gold",
  },
  {
    id: "GC-003",
    code: "FESTIVE2024",
    purchaser: "Kavya Reddy",
    purchaserEmail: "kavya@example.com",
    recipient: "Riya Sharma",
    recipientEmail: "riya@example.com",
    originalAmount: 3000,
    currentBalance: 3000,
    status: "Expired",
    purchaseDate: "2023-12-01",
    expiryDate: "2024-01-01",
    lastUsed: null,
    design: "Festive Special",
  },
]

const giftCardDesigns = [
  { id: 1, name: "Elegant Pink", active: true, sales: 450 },
  { id: 2, name: "Traditional Gold", active: true, sales: 320 },
  { id: 3, name: "Modern Floral", active: true, sales: 280 },
  { id: 4, name: "Festive Special", active: false, sales: 200 },
]

export default function AdminGiftCardsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCard, setSelectedCard] = useState<(typeof giftCards)[0] | null>(null)

  const filteredCards = giftCards.filter((card) => {
    const matchesSearch =
      card.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.purchaser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.recipient.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || card.status.toLowerCase().includes(statusFilter.toLowerCase())

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default"
      case "fully redeemed":
        return "secondary"
      case "expired":
        return "destructive"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Gift Cards Management</h1>
          <p className="text-muted-foreground">Manage gift card sales, redemptions, and analytics</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gift-cards">Gift Cards</TabsTrigger>
            <TabsTrigger value="designs">Designs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cards Sold</CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{giftCardStats.totalSold.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+{giftCardStats.monthlyGrowth}%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Value Sold</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{(giftCardStats.totalValue / 100000).toFixed(1)}L</div>
                  <p className="text-xs text-muted-foreground">All time sales</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{giftCardStats.activeCards}</div>
                  <p className="text-xs text-muted-foreground">With remaining balance</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Card Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{giftCardStats.avgCardValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+8.2%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gift Card Sales Trend</CardTitle>
                  <CardDescription>Monthly gift card sales over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Sales trend chart would be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Designs</CardTitle>
                  <CardDescription>Most popular gift card designs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {giftCardDesigns.map((design) => (
                      <div key={design.id} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{design.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-muted rounded-full">
                            <div
                              className="h-2 bg-primary rounded-full"
                              style={{ width: `${(design.sales / 450) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">{design.sales}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest gift card transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Gift card GC-004 purchased for ₹2,000</p>
                      <p className="text-xs text-muted-foreground">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Gift card WELCOME2024 fully redeemed</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Gift card FESTIVE2024 expired</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gift-cards" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Gift Cards</h2>
                <p className="text-muted-foreground">Manage all gift card transactions</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Gift Card
              </Button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search gift cards by ID, code, or customer..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="fully redeemed">Fully Redeemed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
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

            {/* Gift Cards Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4 font-medium">
                          <Button variant="ghost" className="h-auto p-0 font-medium">
                            Gift Card ID
                            <ArrowUpDown className="w-4 h-4 ml-1" />
                          </Button>
                        </th>
                        <th className="text-left p-4 font-medium">Code</th>
                        <th className="text-left p-4 font-medium">Purchaser</th>
                        <th className="text-left p-4 font-medium">Recipient</th>
                        <th className="text-left p-4 font-medium">Amount</th>
                        <th className="text-left p-4 font-medium">Balance</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Expiry</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCards.map((card) => (
                        <tr key={card.id} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-medium">{card.id}</td>
                          <td className="p-4">
                            <code className="bg-muted px-2 py-1 rounded text-sm">{card.code}</code>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-sm">{card.purchaser}</p>
                              <p className="text-xs text-muted-foreground">{card.purchaserEmail}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-sm">{card.recipient}</p>
                              <p className="text-xs text-muted-foreground">{card.recipientEmail}</p>
                            </div>
                          </td>
                          <td className="p-4 font-medium">₹{card.originalAmount.toLocaleString()}</td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium">₹{card.currentBalance.toLocaleString()}</p>
                              <div className="w-16 h-1 bg-muted rounded-full mt-1">
                                <div
                                  className="h-1 bg-primary rounded-full"
                                  style={{ width: `${(card.currentBalance / card.originalAmount) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={getStatusColor(card.status)}>{card.status}</Badge>
                          </td>
                          <td className="p-4 text-sm">{card.expiryDate}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="ghost" onClick={() => setSelectedCard(card)}>
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Gift Card Details - {selectedCard?.id}</DialogTitle>
                                    <DialogDescription>View and manage gift card information</DialogDescription>
                                  </DialogHeader>

                                  {selectedCard && (
                                    <div className="space-y-6">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                          <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                              Gift Card Code
                                            </Label>
                                            <p className="font-mono text-lg">{selectedCard.code}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                              Original Amount
                                            </Label>
                                            <p className="text-lg font-semibold">
                                              ₹{selectedCard.originalAmount.toLocaleString()}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                              Current Balance
                                            </Label>
                                            <p className="text-lg font-semibold">
                                              ₹{selectedCard.currentBalance.toLocaleString()}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="space-y-4">
                                          <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                                            <div className="mt-1">
                                              <Badge variant={getStatusColor(selectedCard.status)}>
                                                {selectedCard.status}
                                              </Badge>
                                            </div>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                              Purchase Date
                                            </Label>
                                            <p>{selectedCard.purchaseDate}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                              Expiry Date
                                            </Label>
                                            <p>{selectedCard.expiryDate}</p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Purchaser</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="space-y-2">
                                              <p className="font-medium">{selectedCard.purchaser}</p>
                                              <p className="text-sm text-muted-foreground">
                                                {selectedCard.purchaserEmail}
                                              </p>
                                            </div>
                                          </CardContent>
                                        </Card>

                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Recipient</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="space-y-2">
                                              <p className="font-medium">{selectedCard.recipient}</p>
                                              <p className="text-sm text-muted-foreground">
                                                {selectedCard.recipientEmail}
                                              </p>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </div>

                                      <div className="flex space-x-3">
                                        <Button variant="outline" className="flex-1 bg-transparent">
                                          <Edit className="w-4 h-4 mr-2" />
                                          Edit Details
                                        </Button>
                                        <Button variant="outline" className="flex-1 bg-transparent">
                                          <Calendar className="w-4 h-4 mr-2" />
                                          Extend Expiry
                                        </Button>
                                        {selectedCard.status === "Active" && (
                                          <Button variant="destructive" className="flex-1">
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Deactivate
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>

                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                              {card.status === "Active" && (
                                <Button size="sm" variant="ghost">
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
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

          <TabsContent value="designs" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Gift Card Designs</h2>
                <p className="text-muted-foreground">Manage available gift card designs</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add New Design
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {giftCardDesigns.map((design) => (
                <Card key={design.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{design.name}</CardTitle>
                      <Badge variant={design.active ? "default" : "secondary"}>
                        {design.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-[3/2] bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                      <Gift className="w-12 h-12 text-primary" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sales:</span>
                      <span className="font-medium">{design.sales} cards</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gift Card Settings</CardTitle>
                <CardDescription>Configure gift card policies and options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="min-amount">Minimum Gift Card Amount (₹)</Label>
                    <Input id="min-amount" type="number" defaultValue="100" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="max-amount">Maximum Gift Card Amount (₹)</Label>
                    <Input id="max-amount" type="number" defaultValue="50000" className="mt-2" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="validity-period">Default Validity Period (Days)</Label>
                    <Input id="validity-period" type="number" defaultValue="365" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="processing-fee">Processing Fee (%)</Label>
                    <Input id="processing-fee" type="number" defaultValue="0" className="mt-2" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="terms">Gift Card Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    placeholder="Enter terms and conditions for gift cards..."
                    className="mt-2"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="email-template">Email Template</Label>
                  <Textarea
                    id="email-template"
                    placeholder="Customize the gift card delivery email template..."
                    className="mt-2"
                    rows={6}
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
