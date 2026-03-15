import React from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import MicButton from '../../components/common/MicButton'
import VoiceResponse from '../../components/common/VoiceResponse'
import FoodItemsGrid from '../../components/customer/FoodItemsGrid'
import Cart from '../../components/customer/Cart'

export default function CategoryItemsPage() {
  const { category } = useParams()
  const label = decodeURIComponent(category)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar title={label} backTo="/customer/menu" />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        minHeight: 'calc(100vh - 64px)',
      }}>
        <main style={{ padding: '32px 36px' }}>
          <div className="page-enter" style={{ marginBottom: 32 }}>
            <h2 style={{
              fontFamily: 'Playfair Display',
              fontSize: 28,
              fontWeight: 700,
            }}>
              {label}
            </h2>
          </div>
          <FoodItemsGrid category={label} />
        </main>

        <aside style={{
          borderLeft: '1px solid var(--border)',
          padding: '28px 20px',
          overflowY: 'auto',
        }}>
          <Cart />
        </aside>
      </div>

      {/* Floating Mic */}
      <div style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
      }}>
        <MicButton />
      </div>

      <VoiceResponse />
    </div>
  )
}