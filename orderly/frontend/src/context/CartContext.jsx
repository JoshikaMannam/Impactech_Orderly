import React, { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [orderId, setOrderId] = useState(null)

  const addItem = useCallback((item) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === item.id)
      if (exists) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + (item.qty || 1) } : i)
      }
      return [...prev, { ...item, qty: item.qty || 1 }]
    })
  }, [])

  const removeItem = useCallback((itemId) => {
    setCartItems(prev => prev.filter(i => i.id !== itemId))
  }, [])

  const updateQty = useCallback((itemId, qty) => {
    if (qty <= 0) {
      setCartItems(prev => prev.filter(i => i.id !== itemId))
    } else {
      setCartItems(prev => prev.map(i => i.id === itemId ? { ...i, qty } : i))
    }
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)
  const itemCount = cartItems.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ cartItems, orderId, setOrderId, addItem, removeItem, updateQty, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}