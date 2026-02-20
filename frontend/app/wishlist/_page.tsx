"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Bell,
  Share2,
  ShoppingCart,
  Trash2,
  Eye,
  Star,
  TrendingDown,
  Clock,
  Mail,
  Smartphone,
  Filter,
  Grid3X3,
  List,
} from "lucide-react"

const wishlistItems = [
  {
    id: 1,
    name: "Elegant Silk Saree",
    price: 2999,
    originalPrice: 3499,
    image: "/elegant-silk-saree.jpg",
    inStock: true,
    rating: 4.8,
    reviews: 124,
    discount: 14,
    category: "Sarees",
    addedDate: "2024-01-10",
    priceDropped: true,
    backInStock: false,
  },
  {
    id: 2,
    name: "Designer Kurti Set",
    price: 1599,
    originalPrice: 1599,
    image: "/designer-kurti-set.jpg",
    inStock: false,
    rating: 4.6,
    reviews: 89,
    discount: 0,
    category: "Kurtis",
    addedDate: "2024-01-08",
    priceDropped: false,
    backInStock: false,
    waitlisted: true,
    expectedRestock: "2024-02-15",
  },
  {
    id: 3,
    name: "Traditional Lehenga",
    price: 4999,
    originalPrice: 5999,
    image: "/traditional-lehenga.jpg",
    inStock: true,
    rating: 4.9,
    reviews: 67,
    discount: 17,
    category: "Lehengas",
    addedDate: "2024-01-05",
    priceDropped: false,
    backInStock: true,
  },
]

const notificationSettings = [
  { id: "price_drop", label: "Price Drop Alerts", description: "Get notified when items go on sale", enabled: true },
  {
    id: "back_in_stock",
    label: "Back in Stock",
    description: "Alert when out-of-stock items are available",
    enabled: true,
  },
  { id: "low_stock", label: "Low Stock Warnings", description: "Notify when items are running low", enabled: false },
  {
    id: "similar_items",
    label: "Similar Item Suggestions",
    description: "Recommendations based on your wishlist",
    enabled: true,
  },
]

export default function WishlistPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortBy, setSortBy] = useState("date_added")

  const filteredItems = wishlistItems.filter(
    (item) => filterCategory === "all" || item.category.toLowerCase() === filterCategory,
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">Save your favorite items and get notified about updates</p>
        </div>

        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="items">My Items ({wishlistItems.length})</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="shared">Shared Lists</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6">
            {/* Alerts */}
            {wishlistItems.some((item) => item.priceDropped || item.backInStock) && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Bell className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-medium text-primary mb-1">Wishlist Updates!</h3>
                      <div className="space-y-1 text-sm">
                        {wishlistItems.filter((item) => item.priceDropped).length > 0 && (
                          <p>🎉 {wishlistItems.filter((item) => item.priceDropped).length} item(s) have price drops!</p>
                        )}
                        {wishlistItems.filter((item) => item.backInStock).length > 0 && (
                          <p>✨ {wishlistItems.filter((item) => item.backInStock).length} item(s) are back in stock!</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="border rounded px-3 py-1 text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="sarees">Sarees</option>
                    <option value="kurtis">Kurtis</option>
                    <option value="lehengas">Lehengas</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="sort" className="text-sm">
                    Sort:
                  </Label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded px-3 py-1 text-sm"
                  >
                    <option value="date_added">Date Added</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share List
                </Button>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredItems.map((item) => (
                <Card key={item.id} className={`relative ${viewMode === "list" ? "flex" : ""}`}>
                  {/* Notification badges */}
                  {(item.priceDropped || item.backInStock) && (
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                      {item.priceDropped && (
                        <Badge className="bg-green-500 text-white">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          Price Drop!
                        </Badge>
                      )}
                      {item.backInStock && <Badge className="bg-blue-500 text-white">✨ Back in Stock!</Badge>}
                    </div>
                  )}

                  <div
                    className={`${viewMode === "list" ? "w-32 h-32" : "aspect-square"} bg-muted rounded-lg ${viewMode === "list" ? "rounded-r-none" : "rounded-b-none"} relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-primary" />
                    </div>
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className={`${viewMode === "list" ? "flex-1" : ""} p-4`}>
                    <div className={`${viewMode === "list" ? "flex justify-between items-start" : "space-y-3"}`}>
                      <div className={viewMode === "list" ? "flex-1 pr-4" : ""}>
                        <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{item.rating}</span>
                            <span className="text-sm text-muted-foreground">({item.reviews})</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-lg font-bold">₹{item.price.toLocaleString()}</span>
                          {item.originalPrice > item.price && (
                            <>
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{item.originalPrice.toLocaleString()}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {item.discount}% OFF
                              </Badge>
                            </>
                          )}
                        </div>

                        {!item.inStock && item.waitlisted && (
                          <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>Expected: {item.expectedRestock}</span>
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground mt-1">Added {item.addedDate}</p>
                      </div>

                      <div
                        className={`${viewMode === "list" ? "flex flex-col space-y-2" : "flex justify-between items-center mt-4"}`}
                      >
                        <div className={`flex ${viewMode === "list" ? "flex-col" : ""} gap-2`}>
                          {item.inStock ? (
                            <Button size="sm" className="flex-1">
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              <Bell className="w-4 h-4 mr-2" />
                              {item.waitlisted ? "Waitlisted" : "Notify Me"}
                            </Button>
                          )}
                        </div>

                        <div className={`flex ${viewMode === "list" ? "flex-col" : ""} gap-1`}>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Heart className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Start adding items you love to keep track of them
                  </p>
                  <Button>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>Choose how you want to be notified about your wishlist items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {notificationSettings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <Label htmlFor={setting.id} className="font-medium">
                          {setting.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                      <Switch id={setting.id} defaultChecked={setting.enabled} />
                    </div>
                  ))}
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-4">Notification Methods</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">priya@example.com</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">SMS Notifications</p>
                          <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shared" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shared Wishlists</CardTitle>
                <CardDescription>Share your wishlist with friends and family</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-6 rounded-lg text-center">
                  <Share2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Share Your Wishlist</h3>
                  <p className="text-muted-foreground mb-4">
                    Let others see what you're hoping for - perfect for gifts and special occasions
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Button className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Generate Share Link
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Wishlist
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Privacy Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Make wishlist public</p>
                        <p className="text-sm text-muted-foreground">Anyone with the link can view</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Show prices</p>
                        <p className="text-sm text-muted-foreground">Display item prices to viewers</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Allow purchases</p>
                        <p className="text-sm text-muted-foreground">Let others buy items as gifts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
