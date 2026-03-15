import React, { useEffect, useState } from 'react'
import Navbar from '../../components/common/Navbar'
import OrderCard from '../../components/staff/OrderCard'

export default function CompletedOrdersPage() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/order/list?status=completed')
      .then(res => res.json())
      .then(data => { setOrders(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar title="Completed Orders" backTo="/staff" />
      <div style={{ padding: '32px 40px' }}>
        <h2 style={{ fontFamily: 'Playfair Display', fontSize: 26, fontWeight: 700, marginBottom: 28 }}>
          Completed Orders
        </h2>
        {loading && <p style={{ color: 'var(--text-muted)' }}>Loading…</p>}
        {!loading && orders.length === 0 && (
          <p style={{ color: 'var(--text-dim)' }}>No completed orders yet.</p>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  )
}