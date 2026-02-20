"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Package,
  ArrowLeft,
  Upload,
  CheckCircle,
  Clock,
  Truck,
  RefreshCw,
  AlertCircle,
  Camera,
  FileText,
} from "lucide-react"

const returnRequests = [
  {
    id: "RET-001",
    orderId: "ORD-001",
    product: "Elegant Silk Saree",
    reason: "Size Issue",
    status: "Approved",
    requestDate: "2024-01-10",
    refundAmount: 2999,
    trackingId: "RET123456",
  },
  {
    id: "RET-002",
    orderId: "ORD-002",
    product: "Designer Kurti Set",
    reason: "Damaged Item",
    status: "Processing",
    requestDate: "2024-01-12",
    refundAmount: 1599,
    trackingId: null,
  },
]

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = useState("my-returns")
  const [returnReason, setReturnReason] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Returns & Refunds</h1>
          <p className="text-muted-foreground">Manage your return requests and track refund status</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button
            variant={activeTab === "my-returns" ? "default" : "outline"}
            onClick={() => setActiveTab("my-returns")}
            className="flex-1 sm:flex-none"
          >
            My Returns
          </Button>
          <Button
            variant={activeTab === "new-return" ? "default" : "outline"}
            onClick={() => setActiveTab("new-return")}
            className="flex-1 sm:flex-none"
          >
            Request Return
          </Button>
          <Button
            variant={activeTab === "return-policy" ? "default" : "outline"}
            onClick={() => setActiveTab("return-policy")}
            className="flex-1 sm:flex-none"
          >
            Return Policy
          </Button>
        </div>

        {activeTab === "my-returns" && (
          <div className="space-y-6">
            {returnRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-lg">{request.product}</CardTitle>
                      <CardDescription>
                        Return ID: {request.id} • Order: {request.orderId}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        request.status === "Approved"
                          ? "default"
                          : request.status === "Processing"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Reason</Label>
                      <p className="text-sm">{request.reason}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Request Date</Label>
                      <p className="text-sm">{request.requestDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Refund Amount</Label>
                      <p className="text-sm font-medium">₹{request.refundAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {request.trackingId && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Truck className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Return Tracking</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Tracking ID: {request.trackingId}</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs">Approved</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span className="text-xs">Pickup Scheduled</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs">Refund Processing</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {request.status === "Processing" && (
                      <Button variant="outline" size="sm">
                        Cancel Request
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "new-return" && (
          <Card>
            <CardHeader>
              <CardTitle>Request a Return</CardTitle>
              <CardDescription>Select items from your recent orders to return</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Select Order</Label>
                <div className="space-y-3">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Checkbox
                        id="order-1"
                        checked={selectedItems.includes("order-1")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedItems([...selectedItems, "order-1"])
                          } else {
                            setSelectedItems(selectedItems.filter((item) => item !== "order-1"))
                          }
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium">Order #ORD-003</p>
                        <p className="text-sm text-muted-foreground">Placed on Jan 15, 2024</p>
                      </div>
                    </div>
                    <div className="ml-6 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Traditional Lehenga</span>
                        <span className="text-sm font-medium">₹4,999</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cotton Palazzo Set</span>
                        <span className="text-sm font-medium">₹1,299</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">Reason for Return</Label>
                <RadioGroup value={returnReason} onValueChange={setReturnReason}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="size-issue" id="size-issue" />
                    <Label htmlFor="size-issue">Size doesn't fit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="damaged" id="damaged" />
                    <Label htmlFor="damaged">Item arrived damaged</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-as-described" id="not-as-described" />
                    <Label htmlFor="not-as-described">Not as described</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quality-issue" id="quality-issue" />
                    <Label htmlFor="quality-issue">Quality issue</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-medium">
                  Additional Details
                </Label>
                <Textarea
                  id="description"
                  placeholder="Please provide more details about the issue..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">Upload Photos (Optional)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload photos to help us process your return faster
                  </p>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-1">Return Policy Reminder</p>
                    <p className="text-xs text-muted-foreground">
                      Items must be returned within 30 days of delivery in original condition with tags attached.
                      Refunds will be processed within 5-7 business days after we receive your return.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1">Submit Return Request</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "return-policy" && (
          <Card>
            <CardHeader>
              <CardTitle>Return Policy</CardTitle>
              <CardDescription>Everything you need to know about returns and refunds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Return Window</h3>
                <p className="text-muted-foreground">
                  You have 30 days from the date of delivery to return most items. Some items may have different return
                  windows as specified on the product page.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Return Conditions</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Items must be in original condition with all tags attached</li>
                  <li>• Items should be unworn and unwashed</li>
                  <li>• Original packaging should be included when possible</li>
                  <li>• Custom or personalized items cannot be returned</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Refund Process</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Submit Return Request</p>
                      <p className="text-sm text-muted-foreground">
                        Fill out the return form and we'll review your request
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Return Approval</p>
                      <p className="text-sm text-muted-foreground">
                        Once approved, we'll send you a prepaid return label
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Ship Your Return</p>
                      <p className="text-sm text-muted-foreground">
                        Package your items and drop them off at any courier location
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Refund Processing</p>
                      <p className="text-sm text-muted-foreground">
                        Refunds are processed within 5-7 business days after we receive your return
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Support</h3>
                <p className="text-muted-foreground mb-3">
                  Have questions about your return? Our customer service team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline">
                    <Package className="w-4 h-4 mr-2" />
                    Track Return
                  </Button>
                  <Button variant="outline">Contact Support</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
