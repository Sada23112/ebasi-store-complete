"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Smartphone, Banknote, Wallet } from "lucide-react"

interface PaymentMethodsProps {
  selectedMethod: string
  onMethodChange: (method: string) => void
  onPaymentSubmit: (paymentData: any) => void
  total: number
}

export function PaymentMethods({ selectedMethod, onMethodChange, onPaymentSubmit, total }: PaymentMethodsProps) {
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [upiId, setUpiId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, RuPay",
    },
    {
      id: "upi",
      name: "UPI",
      icon: Smartphone,
      description: "PhonePe, GPay, Paytm",
    },
    {
      id: "wallet",
      name: "Digital Wallet",
      icon: Wallet,
      description: "PayPal, Razorpay Wallet",
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: Banknote,
      description: "Pay when you receive (+₹50)",
    },
  ]

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      let paymentData = { method: selectedMethod, amount: total }

      switch (selectedMethod) {
        case "card":
          paymentData = { ...paymentData, card: cardData }
          break
        case "upi":
          paymentData = { ...paymentData, upiId }
          break
        case "wallet":
          // Redirect to wallet provider
          break
        case "cod":
          // No additional data needed
          break
      }

      await onPaymentSubmit(paymentData)
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
          {paymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <div key={method.id} className="flex items-center space-x-3">
                <RadioGroupItem value={method.id} id={method.id} />
                <Label
                  htmlFor={method.id}
                  className="flex items-center space-x-3 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-muted-foreground">{method.description}</div>
                  </div>
                </Label>
              </div>
            )
          })}
        </RadioGroup>

        {/* Card Payment Form */}
        {selectedMethod === "card" && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.number}
                  onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* UPI Payment Form */}
        {selectedMethod === "upi" && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <div>
              <Label htmlFor="upiId">UPI ID</Label>
              <Input id="upiId" placeholder="yourname@paytm" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
            </div>
          </div>
        )}

        {/* Wallet Payment */}
        {selectedMethod === "wallet" && (
          <div className="p-4 border rounded-lg bg-muted/20">
            <p className="text-sm text-muted-foreground">
              You will be redirected to your wallet provider to complete the payment.
            </p>
          </div>
        )}

        {/* COD Notice */}
        {selectedMethod === "cod" && (
          <div className="p-4 border rounded-lg bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Pay ₹{total + 50} when your order is delivered. Additional ₹50 COD charges apply.
            </p>
          </div>
        )}

        <Button onClick={handlePayment} className="w-full" size="lg" disabled={isProcessing}>
          {isProcessing ? "Processing..." : `Pay ₹${selectedMethod === "cod" ? total + 50 : total}`}
        </Button>
      </CardContent>
    </Card>
  )
}
