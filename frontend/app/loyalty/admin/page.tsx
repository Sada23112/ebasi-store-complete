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
  Crown,
  Star,
  Users,
  Trophy,
  Coins,
  TrendingUp,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Download,
  Award,
  Target,
  Zap,
  ArrowUpDown,
} from "lucide-react"

const loyaltyStats = {
  totalMembers: 15420,
  activeMembers: 12350,
  totalPointsIssued: 2850000,
  totalPointsRedeemed: 1950000,
  avgPointsPerMember: 185,
  monthlyGrowth: 18.5,
}

const memberData = [
  {
    id: "M001",
    name: "Priya Sharma",
    email: "priya@example.com",
    tier: "Gold",
    points: 2750,
    totalEarned: 3200,
    totalRedeemed: 450,
    joinDate: "2024-01-01",
    lastActivity: "2024-01-15",
    orders: 12,
    referrals: 3,
  },
  {
    id: "M002",
    name: "Meera Patel",
    email: "meera@example.com",
    tier: "Platinum",
    points: 6850,
    totalEarned: 7500,
    totalRedeemed: 650,
    joinDate: "2023-11-15",
    lastActivity: "2024-01-14",
    orders: 28,
    referrals: 8,
  },
  {
    id: "M003",
    name: "Anjali Singh",
    email: "anjali@example.com",
    tier: "Silver",
    points: 450,
    totalEarned: 650,
    totalRedeemed: 200,
    joinDate: "2024-01-10",
    lastActivity: "2024-01-12",
    orders: 3,
    referrals: 1,
  },
]

const rewardCatalog = [
  {
    id: "R001",
    name: "₹100 Off Coupon",
    points: 500,
    type: "discount",
    description: "Valid on orders above ₹1000",
    active: true,
    redeemed: 245,
    category: "Discount",
  },
  {
    id: "R002",
    name: "₹250 Off Coupon",
    points: 1000,
    type: "discount",
    description: "Valid on orders above ₹2000",
    active: true,
    redeemed: 156,
    category: "Discount",
  },
  {
    id: "R003",
    name: "Free Shipping",
    points: 200,
    type: "shipping",
    description: "Free shipping on any order",
    active: true,
    redeemed: 389,
    category: "Shipping",
  },
  {
    id: "R004",
    name: "Exclusive Saree",
    points: 2500,
    type: "product",
    description: "Limited edition designer saree",
    active: false,
    redeemed: 12,
    category: "Product",
  },
]

export default function AdminLoyaltyPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [tierFilter, setTierFilter] = useState("all")
  const [selectedMember, setSelectedMember] = useState<(typeof memberData)[0] | null>(null)

  const filteredMembers = memberData.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTier = tierFilter === "all" || member.tier.toLowerCase() === tierFilter.toLowerCase()

    return matchesSearch && matchesTier
  })

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "silver":
        return "secondary"
      case "gold":
        return "default"
      case "platinum":
        return "default"
      case "diamond":
        return "default"
      default:
        return "secondary"
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "silver":
        return Star
      case "gold":
        return Award
      case "platinum":
        return Crown
      case "diamond":
        return Trophy
      default:
        return Star
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Loyalty Program Management</h1>
          <p className="text-muted-foreground">Manage rewards, tiers, and member engagement</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loyaltyStats.totalMembers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+{loyaltyStats.monthlyGrowth}%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loyaltyStats.activeMembers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {((loyaltyStats.activeMembers / loyaltyStats.totalMembers) * 100).toFixed(1)}% engagement rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Points Issued</CardTitle>
                  <Coins className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(loyaltyStats.totalPointsIssued / 1000000).toFixed(1)}M</div>
                  <p className="text-xs text-muted-foreground">Total points distributed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Points/Member</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loyaltyStats.avgPointsPerMember}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+12.3%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tier Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Member Tier Distribution</CardTitle>
                  <CardDescription>Breakdown of members by loyalty tier</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">Silver</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="w-16 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">8,450</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">Gold</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="w-12 h-2 bg-yellow-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">4,250</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Crown className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium">Platinum</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="w-6 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">2,120</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">Diamond</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="w-3 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">600</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Rewards</CardTitle>
                  <CardDescription>Most popular reward redemptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rewardCatalog
                      .sort((a, b) => b.redeemed - a.redeemed)
                      .slice(0, 4)
                      .map((reward) => (
                        <div key={reward.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{reward.name}</p>
                            <p className="text-xs text-muted-foreground">{reward.points} points</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{reward.redeemed}</p>
                            <p className="text-xs text-muted-foreground">redeemed</p>
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
                <CardDescription>Latest loyalty program activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Priya Sharma earned 150 points from purchase</p>
                      <p className="text-xs text-muted-foreground">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Meera Patel redeemed ₹250 off coupon</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Anjali Singh upgraded to Gold tier</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Loyalty Members</h2>
                <p className="text-muted-foreground">Manage member accounts and point balances</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search members by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                  <SelectItem value="diamond">Diamond</SelectItem>
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

            {/* Members Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4 font-medium">
                          <Button variant="ghost" className="h-auto p-0 font-medium">
                            Member
                            <ArrowUpDown className="w-4 h-4 ml-1" />
                          </Button>
                        </th>
                        <th className="text-left p-4 font-medium">Tier</th>
                        <th className="text-left p-4 font-medium">Points</th>
                        <th className="text-left p-4 font-medium">Total Earned</th>
                        <th className="text-left p-4 font-medium">Orders</th>
                        <th className="text-left p-4 font-medium">Referrals</th>
                        <th className="text-left p-4 font-medium">Last Active</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((member) => {
                        const TierIcon = getTierIcon(member.tier)
                        return (
                          <tr key={member.id} className="border-b hover:bg-muted/50">
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-muted-foreground">{member.email}</p>
                                <p className="text-xs text-muted-foreground">ID: {member.id}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant={getTierColor(member.tier)} className="flex items-center space-x-1 w-fit">
                                <TierIcon className="w-3 h-3" />
                                <span>{member.tier}</span>
                              </Badge>
                            </td>
                            <td className="p-4 font-medium">{member.points.toLocaleString()}</td>
                            <td className="p-4">{member.totalEarned.toLocaleString()}</td>
                            <td className="p-4">{member.orders}</td>
                            <td className="p-4">{member.referrals}</td>
                            <td className="p-4 text-sm">{member.lastActivity}</td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="ghost" onClick={() => setSelectedMember(member)}>
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Member Details - {selectedMember?.name}</DialogTitle>
                                      <DialogDescription>View and manage member loyalty information</DialogDescription>
                                    </DialogHeader>

                                    {selectedMember && (
                                      <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <Card>
                                            <CardHeader>
                                              <CardTitle className="text-lg">Member Information</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                              <div className="flex justify-between">
                                                <span className="text-muted-foreground">Name:</span>
                                                <span className="font-medium">{selectedMember.name}</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-muted-foreground">Email:</span>
                                                <span className="text-sm">{selectedMember.email}</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-muted-foreground">Member ID:</span>
                                                <span className="font-mono text-sm">{selectedMember.id}</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-muted-foreground">Join Date:</span>
                                                <span>{selectedMember.joinDate}</span>
                                              </div>
                                            </CardContent>
                                          </Card>

                                          <Card>
                                            <CardHeader>
                                              <CardTitle className="text-lg">Loyalty Status</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                              <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Current Tier:</span>
                                                <Badge variant={getTierColor(selectedMember.tier)}>
                                                  {selectedMember.tier}
                                                </Badge>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-muted-foreground">Points Balance:</span>
                                                <span className="font-bold">
                                                  {selectedMember.points.toLocaleString()}
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-muted-foreground">Total Earned:</span>
                                                <span>{selectedMember.totalEarned.toLocaleString()}</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-muted-foreground">Total Redeemed:</span>
                                                <span>{selectedMember.totalRedeemed.toLocaleString()}</span>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        </div>

                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Activity Summary</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="grid grid-cols-3 gap-4 text-center">
                                              <div>
                                                <p className="text-2xl font-bold">{selectedMember.orders}</p>
                                                <p className="text-sm text-muted-foreground">Total Orders</p>
                                              </div>
                                              <div>
                                                <p className="text-2xl font-bold">{selectedMember.referrals}</p>
                                                <p className="text-sm text-muted-foreground">Referrals</p>
                                              </div>
                                              <div>
                                                <p className="text-2xl font-bold">
                                                  {Math.round(selectedMember.totalEarned / selectedMember.orders)}
                                                </p>
                                                <p className="text-sm text-muted-foreground">Avg Points/Order</p>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>

                                        <div className="flex space-x-3">
                                          <Button className="flex-1">
                                            <Coins className="w-4 h-4 mr-2" />
                                            Adjust Points
                                          </Button>
                                          <Button variant="outline" className="flex-1 bg-transparent">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Member
                                          </Button>
                                          <Button variant="outline" className="flex-1 bg-transparent">
                                            <Zap className="w-4 h-4 mr-2" />
                                            Send Reward
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>

                                <Button size="sm" variant="ghost">
                                  <Edit className="w-4 h-4" />
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
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Reward Catalog</h2>
                <p className="text-muted-foreground">Manage available rewards and redemption options</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Reward
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewardCatalog.map((reward) => (
                <Card key={reward.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{reward.name}</CardTitle>
                      <Badge variant={reward.active ? "default" : "secondary"}>
                        {reward.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Points Required:</span>
                      <span className="font-bold text-primary">{reward.points} pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Times Redeemed:</span>
                      <span className="font-medium">{reward.redeemed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Category:</span>
                      <Badge variant="outline">{reward.category}</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Eye className="w-4 h-4 mr-2" />
                        View
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
                <CardTitle>Loyalty Program Settings</CardTitle>
                <CardDescription>Configure program rules and tier requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="points-per-rupee">Points per ₹1 Spent</Label>
                    <Input id="points-per-rupee" type="number" defaultValue="0.1" step="0.1" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="referral-bonus">Referral Bonus Points</Label>
                    <Input id="referral-bonus" type="number" defaultValue="100" className="mt-2" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="review-points">Points per Review</Label>
                    <Input id="review-points" type="number" defaultValue="50" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="birthday-bonus">Birthday Bonus Points</Label>
                    <Input id="birthday-bonus" type="number" defaultValue="200" className="mt-2" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tier-benefits">Tier Benefits Configuration</Label>
                  <Textarea
                    id="tier-benefits"
                    placeholder="Configure benefits for each tier..."
                    className="mt-2"
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="program-rules">Program Terms & Conditions</Label>
                  <Textarea
                    id="program-rules"
                    placeholder="Enter loyalty program terms and conditions..."
                    className="mt-2"
                    rows={4}
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
