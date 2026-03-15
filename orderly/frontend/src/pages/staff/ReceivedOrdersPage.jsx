import React, { useEffect, useState } from 'react'
import Navbar from '../../components/common/Navbar'
import OrderCard from '../../components/staff/OrderCard'
import { RefreshCw } from 'lucide-react'

export default function ReceivedOrdersPage() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {
    setLoading(true)
    fetch('http://localhost:8000/order/list?status=active')
      .then(res => res.json())
      .then(data => { setOrders(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar title="Received Orders" backTo="/staff" actions={
        <button
          className="btn-ghost"
          onClick={fetchOrders}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      } />
      <div style={{ padding: '32px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: 26, fontWeight: 700 }}>
            Active Orders
          </h2>
          {orders.length > 0 && (
            <span className="badge badge-accent">{orders.length} orders</span>
          )}
        </div>
        {loading && <p style={{ color: 'var(--text-muted)' }}>Loading orders…</p>}
        {!loading && orders.length === 0 && (
          <p style={{ color: 'var(--text-dim)' }}>No active orders right now.</p>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              showRecommendations
              onRefresh={fetchOrders}
            />
          ))}
        </div>
      </div>
    </div>
  )
}