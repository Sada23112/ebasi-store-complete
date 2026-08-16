import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { trackWishlistAdd } from '@/lib/analytics'

export interface WishlistItem {
  id: number
  name: string
  slug: string
  price: number
  compare_price?: number | null
  primary_image?: string | null
  stock_status?: string
  category?: { name: string; slug: string }
}

const WISHLIST_KEY = 'ebasi_wishlist_items'

export function getLocalWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(WISHLIST_KEY)
    if (!data) return []
    const parsed = JSON.parse(data)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(item => item && typeof item === 'object' && item.id != null)
  } catch (err) {
    console.error('Error reading wishlist from localStorage:', err)
    return []
  }
}

export function saveLocalWishlist(items: WishlistItem[]) {
  if (typeof window === 'undefined') return
  try {
    const sanitized = Array.isArray(items) ? items.filter(item => item && item.id != null) : []
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(sanitized))
    window.dispatchEvent(new Event('wishlist-updated'))
  } catch (err) {
    console.error('Error saving wishlist to localStorage:', err)
  }
}

export async function toggleWishlistItem(product: WishlistItem): Promise<boolean> {
  if (!product || product.id == null) return false

  const current = getLocalWishlist()
  const exists = current.some(item => item.id === product.id)
  let updated: WishlistItem[]

  if (exists) {
    updated = current.filter(item => item.id !== product.id)
  } else {
    updated = [
      {
        id: product.id,
        name: product.name || "Traditional Item",
        slug: product.slug || String(product.id),
        price: product.price ?? 0,
        compare_price: product.compare_price,
        primary_image: product.primary_image || null,
        stock_status: product.stock_status || "in_stock",
        category: product.category,
      },
      ...current,
    ]
    trackWishlistAdd(product)
  }

  saveLocalWishlist(updated)

  // Try backend sync if token exists
  if (typeof window !== 'undefined' && localStorage.getItem('authToken')) {
    try {
      await api.toggleWishlist(product.id)
    } catch (err) {
      console.warn('Backend wishlist sync failed, kept local copy:', err)
    }
  }

  return !exists
}

export function isItemInWishlist(productId: number): boolean {
  const items = getLocalWishlist()
  return items.some(item => item.id === productId)
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([])

  useEffect(() => {
    setItems(getLocalWishlist())

    const handleUpdate = () => {
      setItems(getLocalWishlist())
    }

    window.addEventListener('wishlist-updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('wishlist-updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const toggle = async (product: WishlistItem) => {
    return await toggleWishlistItem(product)
  }

  const isSaved = (productId: number) => {
    return items.some(item => item.id === productId)
  }

  return {
    items,
    count: items.length,
    toggle,
    isSaved,
  }
}
