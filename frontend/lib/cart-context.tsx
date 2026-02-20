"use client"

import type React from "react"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import api from "./api"

interface CartItem {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  color?: string
  size?: string
  quantity: number
  inStock: boolean
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isLoading: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SYNC_WITH_BACKEND"; payload: any }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addToCart: (product: any, quantity: number, color?: string, size?: string) => Promise<void>
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  syncCart: () => Promise<void>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SYNC_WITH_BACKEND": {
      // Convert backend cart format to frontend format
      const backendItems = action.payload.items || []
      const items: CartItem[] = backendItems.map((item: any) => ({
        id: item.product.id,
        name: item.product.name,
        price: parseFloat(item.product.price),
        originalPrice: parseFloat(item.product.compare_price || item.product.price),
        image: item.product.primary_image || "/placeholder.svg",
        quantity: item.quantity,
        inStock: item.product.stock_status === 'in_stock',
      }))

      const total = parseFloat(action.payload.total_price || '0')
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

      return { items, total, itemCount, isLoading: false }
    }

    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id && item.color === action.payload.color && item.size === action.payload.size,
      )

      let newItems
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.id === existingItem.id && item.color === existingItem.color && item.size === existingItem.size
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item,
        )
      } else {
        newItems = [...state.items, action.payload]
      }

      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: newItems, total, itemCount }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: newItems, total, itemCount }
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: newItems, total, itemCount }
    }

    case "CLEAR_CART":
      return { items: [], total: 0, itemCount: 0, isLoading: false }

    case "LOAD_CART": {
      const total = action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0)
      return { ...state, items: action.payload, total, itemCount }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    isLoading: false,
  })

  // Sync cart with backend when user logs in
  useEffect(() => {
    const syncWithBackend = async () => {
      if (user && api.getToken()) {
        try {
          dispatch({ type: "SET_LOADING", payload: true })
          const cartData = await api.getCart()
          dispatch({ type: "SYNC_WITH_BACKEND", payload: cartData })
        } catch (error) {
          console.error('Failed to sync cart:', error)
          dispatch({ type: "SET_LOADING", payload: false })
        }
      } else {
        // Load from localStorage if not logged in
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          try {
            const cartItems = JSON.parse(savedCart)
            dispatch({ type: "LOAD_CART", payload: cartItems })
          } catch (error) {
            console.error("Failed to load cart from localStorage:", error)
          }
        }
      }
    }

    syncWithBackend()
  }, [user])

  // Save cart to localStorage when not logged in
  useEffect(() => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(state.items))
    }
  }, [state.items, user])

  const syncCart = async () => {
    if (user && api.getToken()) {
      try {
        const cartData = await api.getCart()
        dispatch({ type: "SYNC_WITH_BACKEND", payload: cartData })
      } catch (error) {
        console.error('Failed to sync cart:', error)
      }
    }
  }

  const addToCart = async (product: any, quantity: number, color?: string, size?: string) => {
    // If user is logged in, add to backend
    if (user && api.getToken()) {
      try {
        await api.addToCart(product.id, quantity)
        // Refresh cart from backend
        await syncCart()
      } catch (error) {
        console.error('Failed to add to cart:', error)
        // Fall back to local cart
        const cartItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || product.compare_price,
          image: product.primary_image || (typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.image) || "/placeholder.svg",
          color,
          size,
          quantity,
          inStock: product.inStock || product.stock_status === 'in_stock',
        }
        dispatch({ type: "ADD_ITEM", payload: cartItem })
      }
    } else {
      // Local only cart
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.compare_price,
        image: product.primary_image || (typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.image) || "/placeholder.svg",
        color,
        size,
        quantity,
        inStock: product.inStock || product.stock_status === 'in_stock',
      }
      dispatch({ type: "ADD_ITEM", payload: cartItem })
    }
  }

  const removeFromCart = async (id: number) => {
    // Optimistic update first
    dispatch({ type: "REMOVE_ITEM", payload: id })

    // If user is logged in, sync with backend
    if (user && api.getToken()) {
      try {
        await api.removeCartItem(id)
        // Re-sync to ensure consistency
        await syncCart()
      } catch (error) {
        console.error('Failed to remove from backend cart:', error)
      }
    }
  }

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      // Optimistic local update
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })

      // If user is logged in, sync with backend 
      if (user && api.getToken()) {
        try {
          await api.updateCartItem(id, quantity)
          // Re-sync to ensure consistency
          await syncCart()
        } catch (error) {
          console.error('Failed to update backend cart:', error)
        }
      }
    }
  }

  const clearCart = async () => {
    if (user && api.getToken()) {
      try {
        await api.clearCart()
      } catch (error) {
        console.error('Failed to clear backend cart:', error)
      }
    }
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
