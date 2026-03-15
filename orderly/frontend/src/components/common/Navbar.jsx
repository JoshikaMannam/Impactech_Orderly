import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ChefHat, ArrowLeft } from 'lucide-react'

export default function Navbar({ title, backTo, actions }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isRoot = location.pathname === '/'

  return (
    <nav style={{
      background: 'rgba(255, 248, 238, 0.78)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {backTo && (
          <button
            onClick={() => navigate(backTo)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <ArrowLeft size={18} />
          </button>
        )}
        {isRoot && !backTo ? (
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <ChefHat size={22} color="var(--accent)" />
            <span style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: 20, color: 'var(--text-primary)' }}>
              Orderly
            </span>
          </Link>
        ) : (
          <span style={{ fontFamily: 'Playfair Display', fontWeight: 600, fontSize: 18 }}>
            {title || 'Orderly'}
          </span>
        )}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
    </nav>
  )
}