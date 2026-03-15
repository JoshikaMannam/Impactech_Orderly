import React, { useEffect, useState } from 'react'
import { useCart } from '../../context/CartContext'
import { Plus, AlertCircle } from 'lucide-react'

export default function FoodItemsGrid({ category }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addItem } = useCart()

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`http://localhost:8000/menu/category?name=${encodeURIComponent(category)}`)
      .then(res => res.json())
      .then(data => {
        setItems(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load items')
        setLoading(false)
      })
  }, [category])

  if (loading) return (
    <div style={{ color: 'var(--text-muted)', padding: 20 }}>
      Loading {category} items...
    </div>
  )

  if (error) return (
    <div style={{ color: 'var(--danger)', padding: 20 }}>{error}</div>
  )

  if (items.length === 0) return (
    <div style={{ color: 'var(--text-dim)', padding: 20 }}>
      No items found in {category}.
    </div>
  )

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: 14,
    }}>
      {items.map((item, i) => (
        <div
          key={item.id}
          className="page-enter"
          style={{
            animationDelay: `${i * 0.03}s`,
            background: 'var(--bg-card)',
            border: `1px solid ${item.is_available ? 'var(--border)' : 'rgba(248,113,113,0.15)'}`,
            borderRadius: 12,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            opacity: item.is_available ? 1 : 0.5,
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
            <p style={{
              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1.4,
              flex: 1,
              color: 'var(--text-primary)',
            }}>
              {item.name}
            </p>
            {!item.is_available && (
              <AlertCircle
                size={13}
                color="var(--danger)"
                style={{ flexShrink: 0, marginLeft: 4 }}
              />
            )}
          </div>

          <p style={{
            fontSize: 14,
            color: 'var(--accent)',
            fontWeight: 700,
          }}>
            Rs.{item.price}
          </p>

          <button
            onClick={() => {
              if (item.is_available) {
                addItem({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  category: item.category,
                })
              }
            }}
            disabled={!item.is_available}
            style={{
              marginTop: 'auto',
              background: item.is_available ? 'var(--accent-soft)' : 'transparent',
              border: `1px solid ${item.is_available ? 'var(--accent-border)' : 'var(--border)'}`,
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
