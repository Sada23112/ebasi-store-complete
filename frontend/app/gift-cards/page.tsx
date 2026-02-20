"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Gift, CreditCard, Calendar, Copy, Check, Mail, Download, Plus, Wallet, Sparkles } from "lucide-react"

const giftCardDesigns = [
  { id: 1, name: "Elegant Pink", preview: "/gift-card-pink.jpg", theme: "elegant" },
  { id: 2, name: "Traditional Gold", preview: "/gift-card-gold.jpg", theme: "traditional" },
  { id: 3, name: "Modern Floral", preview: "/gift-card-floral.jpg", theme: "modern" },
  { id: 4, name: "Festive Special", preview: "/gift-card-festive.jpg", theme: "festive" },
]

const myGiftCards = [
  {
    id: "GC-001",
    code: "EBASI2024GIFT",
    balance: 2500,
    originalAmount: 5000,
    expiryDate: "2024-12-31",
    status: "Active",
    purchaseDate: "2024-01-01",
  },
  {
    id: "GC-002",
    code: "WELCOME2024",
    balance: 1000,
    originalAmount: 1000,
    expiryDate: "2024-06-30",
    status: "Active",
    purchaseDate: "2024-01-15",
  },
]

export default function GiftCardsPage() {
  const [activeTab, setActiveTab] = useState("purchase")
  const [selectedDesign, setSelectedDesign] = useState(1)
  const [giftAmount, setGiftAmount] = useState("1000")
  const [copiedCode, setCopiedCode] = useState("")

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(""), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Gift Cards</h1>
          <p className="text-muted-foreground">Give the gift of fashion with EBASI STORE gift cards</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button
            variant={activeTab === "purchase" ? "default" : "outline"}
            onClick={() => setActiveTab("purchase")}
            className="flex-1 sm:flex-none"
          >
            <Gift className="w-4 h-4 mr-2" />
            Purchase Gift Card
          </Button>
          <Button
            variant={activeTab === "my-cards" ? "default" : "outline"}
            onClick={() => setActiveTab("my-cards")}
            className="flex-1 sm:flex-none"
          >
            <Wallet className="w-4 h-4 mr-2" />
            My Gift Cards
          </Button>
          <Button
            variant={activeTab === "redeem" ? "default" : "outline"}
            onClick={() => setActiveTab("redeem")}
            className="flex-1 sm:flex-none"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Redeem Gift Card
          </Button>
        </div>

        {activeTab === "purchase" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gift className="w-5 h-5 text-primary" />
                  <span>Purchase Gift Card</span>
                </CardTitle>
                <CardDescription>Perfect for any occasion - birthdays, festivals, or just because!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">Choose Design</Label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {giftCardDesigns.map((design) => (
                      <div
                        key={design.id}
                        className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                          selectedDesign === design.id
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-muted hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedDesign(design.id)}
                      >
                        <div className="aspect-[3/2] bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 flex items-center justify-center">
                          <div className="text-center">
                            <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                            <p className="text-sm font-medium">{design.name}</p>
                          </div>
                        </div>
                        {selectedDesign === design.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-4 block">Gift Card Amount</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {["500", "1000", "2000", "5000"].map((amount) => (
                      <Button
                        key={amount}
                        variant={giftAmount === amount ? "default" : "outline"}
                        onClick={() => setGiftAmount(amount)}
                        className="h-12"
                      >
                        ₹{amount}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="custom-amount" className="text-sm">
                      Custom Amount:
                    </Label>
                    <Input
                      id="custom-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={giftAmount}
                      onChange={(e) => setGiftAmount(e.target.value)}
                      className="w-32"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-4 block">Delivery Method</Label>
                  <RadioGroup defaultValue="email">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email">Email Delivery (Instant)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="physical" id="physical" />
                      <Label htmlFor="physical">Physical Card (3-5 business days)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="recipient-name">Recipient Name</Label>
                    <Input id="recipient-name" placeholder="Enter recipient's name" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="recipient-email">Recipient Email</Label>
                    <Input id="recipient-email" type="email" placeholder="Enter recipient's email" className="mt-2" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Personal Message (Optional)</Label>
                  <Textarea id="message" placeholder="Write a personal message for the recipient..." className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="sender-name">Your Name</Label>
                  <Input id="sender-name" placeholder="Enter your name" className="mt-2" />
                </div>

                <Separator />

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Gift Card Amount:</span>
                    <span className="font-bold">₹{giftAmount}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Processing Fee:</span>
                    <span className="text-sm">Free</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-lg">₹{giftAmount}</span>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  <Gift className="w-4 h-4 mr-2" />
                  Purchase Gift Card
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "my-cards" && (
          <div className="space-y-6">
            {myGiftCards.map((card) => (
              <Card key={card.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <span>Gift Card {card.id}</span>
                      </CardTitle>
                      <CardDescription>Purchased on {card.purchaseDate}</CardDescription>
                    </div>
                    <Badge variant={card.status === "Active" ? "default" : "secondary"}>{card.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                        <p className="text-2xl font-bold">₹{card.balance.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Original Amount</p>
                        <p className="text-lg font-semibold">₹{card.originalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono bg-background px-2 py-1 rounded">{card.code}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(card.code)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedCode === card.code ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Expires {card.expiryDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Send to Friend
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      View Transaction History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Plus className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Purchase Another Gift Card</h3>
                <p className="text-muted-foreground text-center mb-4">Give the perfect gift for any occasion</p>
                <Button onClick={() => setActiveTab("purchase")}>
                  <Gift className="w-4 h-4 mr-2" />
                  Purchase Gift Card
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "redeem" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <span>Redeem Gift Card</span>
              </CardTitle>
              <CardDescription>Enter your gift card code to add the balance to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="gift-code" className="text-base font-medium">
                  Gift Card Code
                </Label>
                <Input
                  id="gift-code"
                  placeholder="Enter your gift card code"
                  className="mt-2 font-mono"
                  maxLength={16}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Gift card codes are typically 12-16 characters long
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">How to find your gift card code:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Check your email for the gift card delivery message</li>
                  <li>• Look on the back of your physical gift card</li>
                  <li>• Find it in your "My Gift Cards" section if you purchased it</li>
                </ul>
              </div>

              <Button className="w-full" size="lg">
                <CreditCard className="w-4 h-4 mr-2" />
                Redeem Gift Card
              </Button>

              <Separator />

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Need help?</p>
                <Button variant="link" size="sm">
                  Contact Customer Support
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
