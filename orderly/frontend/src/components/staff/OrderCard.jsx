import React, { useState } from 'react'
import { Clock, CheckCircle2, XCircle } from 'lucide-react'
import Recommendations from './Recommendations'

const statusStyles = {
  active:    { label: 'Active',    cls: 'badge-accent' },
  cancelled: { label: 'Cancelled', cls: 'badge-danger' },
  completed: { label: 'Completed', cls: 'badge-success' },
}

export default function OrderCard({ order, showRecommendations = false, onRefresh }) {
  const [updating, setUpdating] = useState(false)
  const s    = statusStyles[order.status] || { label: order.status, cls: 'badge-accent' }
  const time = new Date(order.created_at).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit'
  })

  const updateStatus = async (status) => {
    setUpdating(true)
    try {
      await fetch(`http://localhost:8000/order/status/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (onRefresh) onRefresh()
    } catch (e) {
      console.error('Failed to update status', e)
    }
    setUpdating(false)
  }

  return (
    <div
      className="page-enter"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontFamily: 'Playfair Display', fontSize: 15, fontWeight: 700 }}>
            Order #{order.id}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Clock size={11} color="var(--text-dim)" />
            <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{time}</span>
          </div>
        </div>
        <span className={`badge ${s.cls}`}>{s.label}</span>
      </div>

      {/* Items */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
        {order.items?.length > 0 ? (
          order.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 13 }}>
                {item.item_name} × {item.quantity}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>No items</p>
        )}
      </div>

      {/* Total */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        paddingTop: 8, borderTop: '1px solid var(--border)'
      }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>Total</span>
        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent)' }}>
          ₹{Number(order.total_price).toFixed(2)}
        </span>
      </div>

      {/* Action Buttons — only show for active orders */}
      {order.status === 'active' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => updateStatus('completed')}
            disabled={updating}
            style={{
              flex: 1, padding: '8px', borderRadius: 8, border: 'none',
              background: 'rgba(74,222,128,0.12)', color: '#4ade80',
              cursor: 'pointer', fontSize: 12, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}
          >
            <CheckCircle2 size={13} /> Complete
          </button>
          <button
            onClick={() => updateStatus('cancelled')}
            disabled={updating}
            style={{
              flex: 1, padding: '8px', borderRadius: 8, border: 'none',
              background: 'rgba(248,113,113,0.12)', color: '#f87171',
              cursor: 'pointer', fontSize: 12, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}
          >
            <XCircle size={13} /> Cancel
          </button>
        </div>
      )}

      {/* AI Recommendations */}
      {showRecommendations && (
        <Recommendations orderId={order.id} items={order.items} />
      )}
    </div>
  )
}
