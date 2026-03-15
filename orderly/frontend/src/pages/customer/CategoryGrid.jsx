import React from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = [
  { name: 'Breakfast', emoji: '🍳' },
  { name: 'Chaat', emoji: '🥗' },
  { name: 'Starters', emoji: '🍢' },
  { name: 'Veg Curry', emoji: '🥘' },
  { name: 'Non-Veg Curry', emoji: '🍗' },
  { name: 'Breads', emoji: '🫓' },
  { name: 'Rice', emoji: '🍚' },
  { name: 'Combos', emoji: '🍱' },
  { name: 'Pizza', emoji: '🍕' },
  { name: 'Burgers', emoji: '🍔' },
  { name: 'Sides', emoji: '🍟' },
  { name: 'Desserts', emoji: '🍮' },
  { name: 'Beverages', emoji: '🥤' },
]

export default function CategoryGrid() {
  const navigate = useNavigate()

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
      gap: 14,
    }}>
      {CATEGORIES.map((cat, i) => (
        <button
          key={cat.name}
          onClick={() => navigate(/customer/menu/${encodeURIComponent(cat.name)})}
          className="page-enter"
          style={{
            animationDelay: ${i * 0.04}s,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '20px 16px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          <span style={{ fontSize: 28 }}>{cat.emoji}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
        </button>
      ))}
    </div>
  )
}