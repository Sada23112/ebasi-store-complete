"use client";
import React, {createContext, useContext, useState, useEffect} from "react";

interface CartProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  primary_image?: string;
  quantity: number;
}

type CartContextType = {
  cart: CartProduct[];
  addToCart: (product: Omit<CartProduct, "quantity">) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  updateQuantity: (id: number, qty: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({children}: {children: React.ReactNode}) => {
  const [cart, setCart] = useState<CartProduct[]>([]);

  // Sync cart with localStorage
  useEffect(() => {
    const stored = localStorage.getItem("ebasi_cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);
  useEffect(() => {
    localStorage.setItem("ebasi_cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(product: Omit<CartProduct, "quantity">) {
    setCart(prev => {
      const i = prev.findIndex(prod => prod.id === product.id);
      if (i !== -1) {
        // Increase quantity if already in cart
        const updated = [...prev];
        updated[i].quantity += 1;
        return updated;
      }
      return [...prev, {...product, quantity: 1}];
    });
  }

  function updateQuantity(id: number, qty: number) {
    setCart(prev => prev.map(item => item.id === id ? {...item, quantity: qty} : item));
  }

  function removeFromCart(id: number) {
    setCart(prev => prev.filter(item => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{cart, addToCart, removeFromCart, clearCart, updateQuantity}}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
