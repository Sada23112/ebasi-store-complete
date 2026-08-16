"use client"

import { useState, useEffect } from "react"
import { useWishlist, WishlistItem } from "@/lib/wishlist"
import { getAbsoluteImageUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Trash2, ArrowLeft, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ScrollReveal } from "@/components/scroll-reveal"
import { WishlistGridSkeleton } from "@/components/skeletons"
import { STORE_INFO } from "@/lib/constants"

export default function WishlistPage() {
  const { items, toggle, count } = useWishlist()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getWhatsAppUrl = (product: WishlistItem) => {
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    const productUrl = `${origin}/product/${product.slug || product.id}`
    const isOutOfStock = product.stock_status === "out_of_stock"

    if (isOutOfStock) {
      const message = `Hi ${STORE_INFO.name}! 👋\n\nI noticed this item in my Wishlist is currently out of stock. Could you let me know when it might be available again?\n\n*${product.name}*\nPrice: ₹${product.price}\n\nProduct Link: ${productUrl}`
      return `${STORE_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`
    }

    const message = `Hi ${STORE_INFO.name}! 👋\n\nI would like to order this item from my Wishlist:\n\n*${product.name}*\nPrice: ₹${product.price}\n\nProduct Link: ${productUrl}`
    return `${STORE_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20 pb-16">
        {/* Header */}
        <section className="py-8 px-4 border-b">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <ScrollReveal direction="down">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Shop
                  </Link>
                </div>
                <h1 className="text-4xl font-serif font-bold text-foreground flex items-center gap-3">
                  <Heart className="h-8 w-8 text-primary fill-primary" /> My Saved Items
                </h1>
                <p className="text-muted-foreground mt-1">
                  {!mounted ? "Loading saved items..." : count === 0 ? "You have no saved items yet." : `You have ${count} item${count > 1 ? "s" : ""} saved in your wishlist.`}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {!mounted ? (
            <WishlistGridSkeleton count={3} />
          ) : count === 0 ? (
            <ScrollReveal direction="up">
              <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed p-8">
                <Heart className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Explore our collection of sarees, Mekhela Sadors, and ethnic wear, and save your favorites to order anytime!
                </p>
                <Link href="/shop">
                  <Button size="lg" className="bg-primary text-primary-foreground active:scale-95 transition-transform">
                    <ShoppingBag className="h-4 w-4 mr-2" /> Explore Shop
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, idx) => (
                <ScrollReveal key={item.id} delay={idx * 75} direction="up">
                  <Link href={`/product/${item.slug || item.id}`} className="block h-full cursor-pointer">
                    <Card key={item.id} className="overflow-hidden rounded-2xl border border-border shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                      <div className="relative bg-muted h-64 overflow-hidden rounded-t-2xl group">
                        <Image
                          src={getAbsoluteImageUrl(item.primary_image || null)}
                          alt={item.name}
                          width={400}
                          height={400}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="w-full h-full object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-500"
                        />

                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-3 right-3 h-10 w-10 min-h-[40px] min-w-[40px] rounded-full shadow-md opacity-90 hover:opacity-100"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggle(item)
                          }}
                          title="Remove from wishlist"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        {item.stock_status === "out_of_stock" && (
                          <Badge variant="secondary" className="absolute top-3 left-3 bg-red-600 text-white border-none text-xs">
                            Out of Stock
                          </Badge>
                        )}
                      </div>

                      <CardContent className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-4">
                        <div>
                          <span className="text-[11px] sm:text-xs font-semibold text-primary uppercase tracking-wider">
                            {item.category?.name || "Traditional Wear"}
                          </span>
                          <h3 className="font-sans font-semibold text-foreground text-base sm:text-lg hover:text-primary transition-colors line-clamp-1 mt-1 leading-snug tracking-tight">
                            {item.name}
                          </h3>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-lg sm:text-xl font-bold text-foreground">₹{item.price}</span>
                            {item.compare_price && parseFloat(String(item.compare_price)) > parseFloat(String(item.price)) && (
                              <span className="text-xs sm:text-sm text-muted-foreground line-through">₹{item.compare_price}</span>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 border-t flex flex-col gap-2">
                          <a
                            href={getWhatsAppUrl(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button className={`w-full ${item.stock_status === "out_of_stock" ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"} text-white font-medium min-h-[44px] text-sm`}>
                              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                              {item.stock_status === "out_of_stock" ? "Inquire Restock" : "Order via WhatsApp"}
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
