"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingCart, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface CartNotificationProps {
  isVisible: boolean
  product: {
    name: string
    image: string
    price: number
  } | null
  onClose: () => void
}

export function CartNotification({ isVisible, product, onClose }: CartNotificationProps) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
      const timer = setTimeout(() => {
        onClose()
      }, 4000) // Auto-hide after 4 seconds

      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 300) // Wait for animation to complete

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!shouldRender || !product) return null

  return (
    <div className="fixed top-20 right-4 z-50">
      <Card
        className={cn(
          "w-80 shadow-lg border-green-200 bg-green-50 transition-all duration-300",
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-green-800 text-sm">Added to cart!</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-green-600 hover:text-green-700"
                  onClick={onClose}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-green-700 line-clamp-2 mb-1">{product.name}</p>
                  <p className="text-sm font-semibold text-green-800">₹{product.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <Link href="/cart" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                    View Cart
                  </Button>
                </Link>
                <Link href="/checkout" className="flex-1">
                  <Button size="sm" className="w-full text-xs">
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
