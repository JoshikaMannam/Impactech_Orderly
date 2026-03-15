import React, { useEffect, useState } from 'react'
import OrderCard from './OrderCard'

export default function ReceivedOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {
    fetch('http://localhost:8000/order/list?status=active')
      .then(res => res.json())
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
    // Auto refresh every 10 seconds
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return (
    <p style={{ color: 'var(--text-muted)' }}>Loading orders…</p>
  )

  if (orders.length === 0) return (
    <p style={{ color: 'var(--text-dim)' }}>No active orders right now.</p>
  )

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
      gap: 16,
    }}>
      {orders.map(o => (
        <OrderCard key={o.id} order={o} showRecommendations onRefresh={fetchOrders} />
      ))}
    </div>
  )
}