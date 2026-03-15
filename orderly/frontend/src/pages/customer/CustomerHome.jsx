import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import MicButton from '../../components/common/MicButton'
import VoiceResponse from '../../components/common/VoiceResponse'
import TodaysSpecials from '../../components/customer/TodaysSpecials'
import Cart from '../../components/customer/Cart'
import { UtensilsCrossed } from 'lucide-react'

export default function CustomerHome() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar title="Orderly" />

      <div className="customer-shell">
        {/* Left: Specials */}
        <aside className="shell-pane customer-specials" style={{
          padding: '28px 20px',
          overflowY: 'auto',
        }}>
          <TodaysSpecials />
        </aside>

        {/* Center */}
        <main className="shell-pane customer-main" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          gap: 32,
        }}>
          <div className="page-enter" style={{ textAlign: 'center' }}>
            <h1 style={{
              fontFamily: 'Playfair Display',
              fontSize: 36,
              fontWeight: 700,
              marginBottom: 8,
            }}>
              What would you like?
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
              Speak your order or browse the menu below
            </p>
          </div>

          {/* Menu Button */}
          <button
            onClick={() => navigate('/customer/menu')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '18px 32px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              color: 'var(--text-primary)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <UtensilsCrossed size={22} color="var(--accent)" />
            <span style={{ fontFamily: 'Playfair Display', fontSize: 18, fontWeight: 600 }}>Browse Full Menu</span>
          </button>

          {/* Mic */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <MicButton />
            <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Tap to speak your order</p>
          </div>

          {/* Sample commands */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '16px 20px',
            maxWidth: 340,
            width: '100%',
          }}>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Try saying…
            </p>
            {[
              '"Add chicken biryani"',
              '"I want two masala dosas"',
              '"Remove the naan"',
              '"What\'s in my cart?"',
            ].map((cmd, i) => (
              <p key={i} style={{ fontSize: 13, color: 'var(--text-muted)', padding: '4px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                {cmd}
              </p>
            ))}
          </div>
        </main>

        {/* Right: Cart */}
        <aside className="shell-pane customer-cart" style={{
          padding: '28px 20px',
          overflowY: 'auto',
        }}>
          <Cart />
        </aside>
      </div>
      <VoiceResponse />
    </div>
  )
}