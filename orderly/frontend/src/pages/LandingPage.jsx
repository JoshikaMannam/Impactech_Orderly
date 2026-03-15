import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, Users, Mic } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `
        linear-gradient(120deg, rgba(255, 248, 235, 0.88), rgba(248, 233, 213, 0.82)),
        url('/dashboard-bg.jpg')
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative background glow */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,153,51,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div className="page-enter" style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
          <ChefHat size={40} color="var(--accent)" />
          <h1 style={{
            fontFamily: 'Playfair Display',
            fontWeight: 900,
            fontSize: 'clamp(40px, 8vw, 68px)',
            color: 'var(--text-primary)',
            letterSpacing: '-1px',
          }}>
            Orderly
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 340, lineHeight: 1.6 }}>
          AI-powered voice order management. Speak your order, we handle the rest.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 }}>
          <Mic size={14} color="var(--accent)" />
          <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>Voice-first experience</span>
        </div>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 20,
        maxWidth: 620,
        width: '100%',
        animationDelay: '0.1s',
      }} className="page-enter">
        {/* Customer Card */}
        <button
          onClick={() => navigate('/customer')}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '36px 28px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.25s',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent-border)'
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,153,51,0.12)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'var(--accent-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Mic size={22} color="var(--accent)" />
          </div>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            I'm a Customer
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
            Browse the menu, place orders by voice, and track your meal in real time.
          </p>
          <div style={{
            marginTop: 24,
            fontSize: 13,
            color: 'var(--accent)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            Start ordering →
          </div>
        </button>
{/* Staff Card */}
        <button
          onClick={() => navigate('/staff')}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '36px 28px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(251,191,36,0.3)'
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(251,191,36,0.08)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(251,191,36,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Users size={22} color="#fbbf24" />
          </div>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            I'm Staff
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
            Manage incoming orders, edit today's specials, and view analytics.
          </p>
          <div style={{
            marginTop: 24,
            fontSize: 13,
            color: '#fbbf24',
            fontWeight: 600,
          }}>
            Open dashboard →
          </div>
        </button>
      </div>

      <p style={{ marginTop: 40, color: 'var(--text-dim)', fontSize: 12 }}>
        © {new Date().getFullYear()} Orderly — Restaurant Voice OS
      </p>
    </div>
  )
}