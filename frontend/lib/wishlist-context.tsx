"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import api from "@/lib/api"

// Define Product type locally or import from a shared location if available
interface Product {
    id: number
    name: string
    price: number
    primary_image?: string
    images?: { image: string }[]
    [key: string]: any
}

interface WishlistItem {
    id: number
    product: Product
    product_id: number
    created_at: string
}

interface WishlistContextType {
    wishlist: WishlistItem[]
    addToWishlist: (product: Product) => Promise<void>
    removeFromWishlist: (productId: number) => Promise<void>
    toggleWishlist: (product: Product) => Promise<void>
    isInWishlist: (productId: number) => boolean
    isLoading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useAuth()

    // Fetch wishlist on load/login
    useEffect(() => {
        const fetchWishlist = async () => {
            if (user) {
                setIsLoading(true)
                try {
                    const data = await api.getWishlist()
                    setWishlist(Array.isArray(data) ? data : [])
                } catch (error) {
                    console.error("Failed to fetch wishlist:", error)
                } finally {
                    setIsLoading(false)
                }
            } else {
                // Load from local storage for guests
                const localWishlist = localStorage.getItem("wishlist")
                if (localWishlist) {
                    setWishlist(JSON.parse(localWishlist))
                } else {
                    setWishlist([])
                }
            }
        }

        fetchWishlist()
    }, [user])

    // Sync to local storage on change (for guests)
    useEffect(() => {
        if (!user) {
            localStorage.setItem("wishlist", JSON.stringify(wishlist))
        }
    }, [wishlist, user])

    const addToWishlist = async (product: Product) => {
        if (user) {
            try {
                await api.toggleWishlist(product.id)
                const data = await api.getWishlist() // Refresh from backend
                setWishlist(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error("Failed to add to wishlist:", error)
            }
        } else {
            const newItem: WishlistItem = {
                id: Date.now(), // Temporary ID
                product: product,
                product_id: product.id,
                created_at: new Date().toISOString(),
            }
            setWishlist((prev) => [...prev, newItem])
        }
    }

    const removeFromWishlist = async (productId: number) => {
        if (user) {
            try {
                await api.toggleWishlist(productId) // Toggle removes if exists
                const data = await api.getWishlist()
                setWishlist(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error("Failed to remove from wishlist:", error)
            }
        } else {
            setWishlist((prev) => prev.filter((item) => item.product_id !== productId))
        }
    }

    const toggleWishlist = async (product: Product) => {
        if (isInWishlist(product.id)) {
            await removeFromWishlist(product.id)
        } else {
            await addToWishlist(product)
        }
    }

    const isInWishlist = (productId: number) => {
        return Array.isArray(wishlist) && wishlist.some((item) => item.product_id === productId)
    }

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                isInWishlist,
                isLoading,
            }}
        >
            {children}
        </WishlistContext.Provider>
    )
}

export function useWishlist() {
    const context = useContext(WishlistContext)
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider")
    }
    return context
}
