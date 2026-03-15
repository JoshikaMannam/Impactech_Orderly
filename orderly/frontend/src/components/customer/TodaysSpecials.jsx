import React, { useEffect, useState } from 'react'
import { useCart } from '../../context/CartContext'
import { Sparkles, Plus } from 'lucide-react'

export default function TodaysSpecials() {
  const [specials, setSpecials] = useState([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    fetch('http://localhost:8000/menu/specials')
      .then(res => res.json())
      .then(data => {
        setSpecials(data)
        setLoading(false)
      })
      .catch(() => {
        setSpecials([])
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <Sparkles size={16} color="var(--accent)" />
        <h3 style={{ fontFamily: 'Playfair Display', fontSize: 16, fontWeight: 700 }}>
          Today's Specials
        </h3>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-dim)', fontSize: 14 }}>Loading…</div>
      ) : specials.length === 0 ? (
        <div style={{ color: 'var(--text-dim)', fontSize: 14 }}>No specials today.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {specials.map(item => (
            <div
              key={item.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{item.name}</p>
                <p style={{ fontSize: 12, color: 'var(--accent)' }}>₹{item.price}</p>
              </div>
              <button
                onClick={() => addItem({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  category: item.category,
                })}
                style={{
                  background: 'var(--accent-soft)',
                  border: '1px solid var(--accent-border)',
                  borderRadius: 6,
                  padding: '4px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--accent)',
                }}
              >
                <Plus size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}