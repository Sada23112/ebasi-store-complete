"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function FloatingCart() {
  const { state, updateQuantity, removeFromCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  if (state.itemCount === 0) {
    return null
  }

  return (
    <>
      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => setIsOpen(true)}
        >
          <ShoppingCart className="h-6 w-6" />
          <Badge
            variant="secondary"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs"
          >
            {state.itemCount}
          </Badge>
        </Button>
      </div>

      {/* Cart Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

        {/* Cart Panel */}
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-xl transition-transform duration-300",
            isOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <Card className="h-full rounded-none border-0 flex flex-col">
            <CardHeader className="flex-shrink-0 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Shopping Cart ({state.itemCount})</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-0">
              <div className="p-4 space-y-4">
                {state.items.map((item) => (
                  <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-3 p-3 border rounded-lg">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">{item.name}</h4>

                      {(item.color || item.size) && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {item.color && `Color: ${item.color}`}
                          {item.color && item.size && " • "}
                          {item.size && `Size: ${item.size}`}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">₹{item.price.toLocaleString()}</span>

                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>

                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-red-500 hover:text-red-600"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <div className="flex-shrink-0 border-t p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{state.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{state.total > 1999 ? "Free" : "₹99"}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{(state.total + (state.total > 1999 ? 0 : 99)).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link href="/cart" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Cart
                  </Button>
                </Link>
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Checkout</Button>
                </Link>
              </div>

              {state.total <= 1999 && (
                <p className="text-xs text-center text-muted-foreground">
                  Add ₹{(2000 - state.total).toLocaleString()} more for free shipping
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
