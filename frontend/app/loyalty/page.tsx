"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Crown,
  Star,
  Gift,
  Users,
  Trophy,
  Coins,
  Share2,
  Copy,
  Check,
  Calendar,
  ShoppingBag,
  Heart,
  Zap,
  Award,
  Target,
  TrendingUp,
} from "lucide-react"

const loyaltyTiers = [
  {
    name: "Silver",
    minPoints: 0,
    maxPoints: 999,
    benefits: ["5% cashback", "Free shipping on ₹999+", "Birthday discount"],
    color: "bg-gray-400",
    icon: Star,
  },
  {
    name: "Gold",
    minPoints: 1000,
    maxPoints: 4999,
    benefits: ["10% cashback", "Free shipping on ₹499+", "Early access to sales", "Priority support"],
    color: "bg-yellow-500",
    icon: Award,
  },
  {
    name: "Platinum",
    minPoints: 5000,
    maxPoints: 9999,
    benefits: ["15% cashback", "Free shipping always", "Exclusive products", "Personal stylist"],
    color: "bg-purple-500",
    icon: Crown,
  },
  {
    name: "Diamond",
    minPoints: 10000,
    maxPoints: Number.POSITIVE_INFINITY,
    benefits: ["20% cashback", "VIP treatment", "Custom designs", "Invite-only events"],
    color: "bg-blue-500",
    icon: Trophy,
  },
]

const recentActivity = [
  { type: "earned", points: 150, description: "Purchase - Order #ORD-001", date: "2024-01-15" },
  { type: "earned", points: 50, description: "Product review", date: "2024-01-14" },
  { type: "earned", points: 100, description: "Referral bonus", date: "2024-01-12" },
  { type: "redeemed", points: -200, description: "₹200 discount coupon", date: "2024-01-10" },
]

const availableRewards = [
  { id: 1, name: "₹100 Off Coupon", points: 500, type: "discount", description: "Valid on orders above ₹1000" },
  { id: 2, name: "₹250 Off Coupon", points: 1000, type: "discount", description: "Valid on orders above ₹2000" },
  { id: 3, name: "Free Shipping", points: 200, type: "shipping", description: "Free shipping on any order" },
  { id: 4, name: "Exclusive Saree", points: 2500, type: "product", description: "Limited edition designer saree" },
]

export default function LoyaltyPage() {
  const [currentPoints, setCurrentPoints] = useState(2750)
  const [referralCode, setReferralCode] = useState("PRIYA2024")
  const [copiedCode, setCopiedCode] = useState(false)

  const currentTier =
    loyaltyTiers.find((tier) => currentPoints >= tier.minPoints && currentPoints <= tier.maxPoints) || loyaltyTiers[0]

  const nextTier = loyaltyTiers.find((tier) => tier.minPoints > currentPoints)
  const progressToNext = nextTier
    ? ((currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">EBASI Rewards</h1>
          <p className="text-muted-foreground">Earn points, unlock rewards, and enjoy exclusive benefits</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Current Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Coins className="w-5 h-5 text-primary" />
                    <span>Your Rewards Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">{currentPoints.toLocaleString()}</p>
                      <p className="text-muted-foreground">Available Points</p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${currentTier.color} text-white`}
                      >
                        <currentTier.icon className="w-4 h-4" />
                        <span className="font-medium">{currentTier.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Current Tier</p>
                    </div>
                  </div>

                  {nextTier && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress to {nextTier.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {nextTier.minPoints - currentPoints} points to go
                        </span>
                      </div>
                      <Progress value={progressToNext} className="h-2" />
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-3">Your {currentTier.name} Benefits:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentTier.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-primary" />
                    <span>Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Earned</span>
                    <span className="font-medium">3,200 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Redeemed</span>
                    <span className="font-medium">450 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Referrals</span>
                    <span className="font-medium">3 friends</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <span className="font-medium">Jan 2024</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tier Progression */}
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Tiers</CardTitle>
                <CardDescription>Unlock more benefits as you earn points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {loyaltyTiers.map((tier, index) => (
                    <div
                      key={tier.name}
                      className={`relative p-4 rounded-lg border-2 transition-all ${
                        tier.name === currentTier.name
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      <div className="text-center mb-3">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${tier.color} text-white mb-2`}
                        >
                          <tier.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold">{tier.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {tier.minPoints === 0 ? "0" : tier.minPoints.toLocaleString()}
                          {tier.maxPoints === Number.POSITIVE_INFINITY ? "+" : ` - ${tier.maxPoints.toLocaleString()}`}{" "}
                          pts
                        </p>
                      </div>
                      <ul className="space-y-1">
                        {tier.benefits.slice(0, 2).map((benefit, i) => (
                          <li key={i} className="text-xs flex items-center space-x-1">
                            <Check className="w-3 h-3 text-green-500" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                        {tier.benefits.length > 2 && (
                          <li className="text-xs text-muted-foreground">+{tier.benefits.length - 2} more</li>
                        )}
                      </ul>
                      {tier.name === currentTier.name && (
                        <Badge className="absolute -top-2 -right-2" variant="default">
                          Current
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ways to Earn */}
            <Card>
              <CardHeader>
                <CardTitle>Ways to Earn Points</CardTitle>
                <CardDescription>Maximize your rewards with these activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <ShoppingBag className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">Make a Purchase</p>
                      <p className="text-sm text-muted-foreground">1 point per ₹10 spent</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Star className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">Write a Review</p>
                      <p className="text-sm text-muted-foreground">50 points per review</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Users className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">Refer a Friend</p>
                      <p className="text-sm text-muted-foreground">100 points per referral</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Share2 className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">Social Media Share</p>
                      <p className="text-sm text-muted-foreground">25 points per share</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">Birthday Bonus</p>
                      <p className="text-sm text-muted-foreground">200 points annually</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Heart className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">Add to Wishlist</p>
                      <p className="text-sm text-muted-foreground">10 points per item</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Rewards</CardTitle>
                <CardDescription>Redeem your points for exclusive rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableRewards.map((reward) => (
                    <div key={reward.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{reward.name}</h3>
                          <p className="text-sm text-muted-foreground">{reward.description}</p>
                        </div>
                        <Badge variant="outline">{reward.points} pts</Badge>
                      </div>
                      <Button
                        className="w-full"
                        disabled={currentPoints < reward.points}
                        variant={currentPoints >= reward.points ? "default" : "secondary"}
                      >
                        {currentPoints >= reward.points ? "Redeem Now" : "Not Enough Points"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Refer Friends & Earn</span>
                </CardTitle>
                <CardDescription>Share your referral code and both you and your friend get 100 points!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold mb-2">Your Referral Code</h3>
                    <div className="flex items-center justify-center space-x-2">
                      <code className="bg-background px-4 py-2 rounded-lg text-lg font-mono">{referralCode}</code>
                      <Button size="sm" variant="outline" onClick={copyReferralCode}>
                        {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share via WhatsApp
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share via Email
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl font-bold">3</span>
                    </div>
                    <p className="font-medium">Friends Referred</p>
                    <p className="text-sm text-muted-foreground">Total referrals</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl font-bold">300</span>
                    </div>
                    <p className="font-medium">Points Earned</p>
                    <p className="text-sm text-muted-foreground">From referrals</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <p className="font-medium">Rank #47</p>
                    <p className="text-sm text-muted-foreground">Top referrers</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Recent Referrals</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Meera P.</p>
                        <p className="text-sm text-muted-foreground">Joined Jan 12, 2024</p>
                      </div>
                      <Badge variant="default">+100 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Anita S.</p>
                        <p className="text-sm text-muted-foreground">Joined Jan 8, 2024</p>
                      </div>
                      <Badge variant="default">+100 pts</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Points History</CardTitle>
                <CardDescription>Track all your points earned and redeemed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === "earned" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {activity.type === "earned" ? <Zap className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${activity.type === "earned" ? "text-green-600" : "text-red-600"}`}>
                          {activity.type === "earned" ? "+" : ""}
                          {activity.points} pts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
