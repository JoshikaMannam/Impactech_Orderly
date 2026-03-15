import React, { useEffect, useState } from 'react'
import { menuApi } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { Plus, AlertCircle } from 'lucide-react'

export default function FoodItemsGrid({ category }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    setLoading(true)
    menuApi.getByCategory(category)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [category])

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
      {Array(8).fill(0).map((_, i) => (
        <div key={i} style={{ height: 120, borderRadius: 12, background: 'var(--bg-card)', animation: 'pulse 1.5s ease infinite' }} />
      ))}
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
      {items.map((item, i) => (
        <div
          key={item.id}
          className="page-enter"
          style={{
            animationDelay: ${i * 0.03}s,
            background: 'var(--bg-card)',
            border: 1px solid ${item.is_available ? 'var(--border)' : 'rgba(248,113,113,0.15)'},
            borderRadius: 12,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            opacity: item.is_available ? 1 : 0.5,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, flex: 1 }}>{item.name}</p>
            {!item.is_available && <AlertCircle size={13} color="var(--danger)" style={{ flexShrink: 0, marginLeft: 4 }} />}
          </div>
          <p style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 700 }}>₹{item.price}</p>
          <button
            onClick={() => item.is_available && addItem(item)}
            disabled={!item.is_available}
            style={{
              marginTop: 'auto',
              background: item.is_available ? 'var(--accent-soft)' : 'transparent',
              border: 1px solid ${item.is_available ? 'var(--accent-border)' : 'var(--border)'},
              borderRadius: 7,
              padding: '6px',
              cursor: item.is_available ? 'pointer' : 'not-allowed',
              color: item.is_available ? 'var(--accent)' : 'var(--text-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 600,
              transition: 'all 0.15s',
            }}
          >
            <Plus size={13} />
            {item.is_available ? 'Add' : 'Unavailable'}
          </button>
        </div>
      ))}
    </div>
  )
}