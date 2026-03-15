import React from 'react'
import { useCart } from '../../context/CartContext'

export default function BillSummary() {
  const { cartItems, total } = useCart()
  const tax = total * 0.05
  const grandTotal = total + tax

  return (
    <div style={{
      marginTop: 16,
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '16px',
    }}>
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 10 }}>
        {cartItems.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.name} × {item.qty}</span>
            <span style={{ fontSize: 12 }}>₹{(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Subtotal</span>
        <span style={{ fontSize: 12 }}>₹{total.toFixed(2)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>GST (5%)</span>
        <span style={{ fontSize: 12 }}>₹{tax.toFixed(2)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>Total</span>
        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent)' }}>₹{grandTotal.toFixed(2)}</span>
      </div>
      <button className="btn-accent" style={{ width: '100%', marginTop: 14, borderRadius: 10 }}>
        Place Order
      </button>
    </div>
  )
}