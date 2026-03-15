import React from 'react'
import Navbar from '../../components/common/Navbar'
import MicButton from '../../components/common/MicButton'
import VoiceResponse from '../../components/common/VoiceResponse'
import CategoryGrid from '../../components/customer/CategoryGrid'
import Cart from '../../components/customer/Cart'

export default function MenuPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar title="Menu" backTo="/customer" />

      <div className="menu-shell">
        <main className="shell-pane" style={{ padding: '32px 36px' }}>
          <div className="page-enter" style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: 28, fontWeight: 700 }}>Our Menu</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>13 categories · 159 items</p>
          </div>
          <CategoryGrid />
        </main>

        <aside className="shell-pane" style={{ padding: '28px 20px' }}>
          <Cart />
        </aside>
      </div>

      {/* Floating Mic */}
      <div className="floating-mic">
        <MicButton />
      </div>

      <VoiceResponse />
    </div>
  )
}