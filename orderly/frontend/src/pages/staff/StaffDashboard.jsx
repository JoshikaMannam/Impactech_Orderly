import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import { ClipboardList, XCircle, CheckCircle2, Pencil, TrendingUp } from 'lucide-react'

const tiles = [
  { label: 'Received Orders',      icon: ClipboardList, color: '#ff9933', path: '/staff/orders/received', desc: 'Incoming active orders' },
  { label: 'Cancelled Orders',     icon: XCircle,       color: '#f87171', path: '/staff/orders/cancelled', desc: 'Cancelled order records' },
  { label: 'Completed Orders',     icon: CheckCircle2,  color: '#4ade80', path: '/staff/orders/completed', desc: 'Successfully fulfilled orders' },
  { label: "Edit Today's Specials",icon: Pencil,        color: '#fbbf24', path: '/staff/specials',         desc: 'Update featured items for today' },
]

export default function StaffDashboard() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar title="Staff Dashboard" backTo="/" />
      <div style={{ padding: '40px 48px', maxWidth: 900, margin: '0 auto' }}>
        <div className="page-enter" style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <TrendingUp size={20} color="var(--accent)" />
            <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Staff Portal
            </span>
          </div>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: 34, fontWeight: 800 }}>
            Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 18,
        }}>
          {tiles.map(({ label, icon: Icon, color, path, desc }, i) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="page-enter"
              style={{
                animationDelay: `${i * 0.08}s`,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: '28px 24px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.22s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${color}44`
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = `0 10px 32px ${color}18`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 11,
                background: `${color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <Icon size={20} color={color} />
              </div>
              <p style={{ fontFamily: 'Playfair Display', fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
                {label}
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

