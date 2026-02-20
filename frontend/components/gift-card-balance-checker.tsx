"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Search, Calendar, AlertCircle, CheckCircle } from "lucide-react"

interface GiftCardInfo {
  code: string
  balance: number
  originalAmount: number
  status: "active" | "expired" | "fully-redeemed"
  expiryDate: string
  lastUsed?: string
}

export function GiftCardBalanceChecker() {
  const [giftCardCode, setGiftCardCode] = useState("")
  const [cardInfo, setCardInfo] = useState<GiftCardInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const checkBalance = async () => {
    if (!giftCardCode.trim()) {
      setError("Please enter a gift card code")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      // Mock data - in real app, this would be an API call
      const mockCards: Record<string, GiftCardInfo> = {
        EBASI2024GIFT: {
          code: "EBASI2024GIFT",
          balance: 2500,
          originalAmount: 5000,
          status: "active",
          expiryDate: "2024-12-31",
          lastUsed: "2024-01-15",
        },
        WELCOME2024: {
          code: "WELCOME2024",
          balance: 0,
          originalAmount: 1000,
          status: "fully-redeemed",
          expiryDate: "2024-06-30",
          lastUsed: "2024-01-20",
        },
        EXPIRED2023: {
          code: "EXPIRED2023",
          balance: 1500,
          originalAmount: 1500,
          status: "expired",
          expiryDate: "2024-01-01",
        },
      }

      const foundCard = mockCards[giftCardCode.toUpperCase()]
      if (foundCard) {
        setCardInfo(foundCard)
      } else {
        setError("Gift card not found. Please check your code and try again.")
      }
      setIsLoading(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "expired":
        return "destructive"
      case "fully-redeemed":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "expired":
      case "fully-redeemed":
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-primary" />
          <span>Check Gift Card Balance</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="gift-card-code">Gift Card Code</Label>
          <div className="flex space-x-2 mt-2">
            <Input
              id="gift-card-code"
              placeholder="Enter your gift card code"
              value={giftCardCode}
              onChange={(e) => setGiftCardCode(e.target.value)}
              className="font-mono"
              maxLength={16}
            />
            <Button onClick={checkBalance} disabled={isLoading}>
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}

        {cardInfo && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                  <p className="text-2xl font-bold">₹{cardInfo.balance.toLocaleString()}</p>
                </div>
                <Badge variant={getStatusColor(cardInfo.status)} className="flex items-center space-x-1">
                  {getStatusIcon(cardInfo.status)}
                  <span className="capitalize">{cardInfo.status.replace("-", " ")}</span>
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original Amount:</span>
                  <span className="font-medium">₹{cardInfo.originalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gift Card Code:</span>
                  <span className="font-mono">{cardInfo.code}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Expires:</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{cardInfo.expiryDate}</span>
                  </div>
                </div>
                {cardInfo.lastUsed && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Used:</span>
                    <span>{cardInfo.lastUsed}</span>
                  </div>
                )}
              </div>

              {cardInfo.balance > 0 && (
                <div className="w-full h-2 bg-muted rounded-full mt-3">
                  <div
                    className="h-2 bg-primary rounded-full transition-all"
                    style={{ width: `${(cardInfo.balance / cardInfo.originalAmount) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>

            {cardInfo.status === "expired" && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <p className="text-sm text-destructive">
                    This gift card has expired and can no longer be used. Please contact customer support for
                    assistance.
                  </p>
                </div>
              </div>
            )}

            {cardInfo.status === "fully-redeemed" && (
              <div className="bg-muted/50 border rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    This gift card has been fully redeemed. Thank you for shopping with EBASI STORE!
                  </p>
                </div>
              </div>
            )}

            {cardInfo.status === "active" && cardInfo.balance > 0 && (
              <Button className="w-full">Use This Gift Card</Button>
            )}
          </div>
        )}

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Need help?{" "}
            <Button variant="link" className="h-auto p-0 text-xs">
              Contact Support
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
