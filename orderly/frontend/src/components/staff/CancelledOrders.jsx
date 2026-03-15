import React, { useEffect } from 'react'
import { useOrder } from '../../context/OrderContext'
import OrderCard from './OrderCard'

export default function CancelledOrders() {
  const { orders, loading, fetchOrders } = useOrder()
  useEffect(() => { fetchOrders('cancelled') }, [])
  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
      {orders.map(o => <OrderCard key={o.id} order={o} />)}
    </div>
  )
}