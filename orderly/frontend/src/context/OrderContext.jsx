import React, { createContext, useContext, useState, useCallback } from 'react'
import { ordersApi } from '../services/api'

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchOrders = useCallback(async (status) => {
    setLoading(true)
    setError(null)
    try {
      const data = await ordersApi.getByStatus(status)
      setOrders(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      await ordersApi.updateStatus(orderId, status)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    } catch (e) {
      setError(e.message)
    }
  }, [])

  return (
    <OrderContext.Provider value={{ orders, loading, error, fetchOrders, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = () => {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrder must be used within OrderProvider')
  return ctx
}