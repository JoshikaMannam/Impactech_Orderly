import React from 'react'
import { useCart } from '../../context/CartContext'
import BillSummary from './BillSummary'
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'

export default function Cart() {
  const { cartItems, updateQty, removeItem, itemCount } = useCart()

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <ShoppingBag size={16} color="var(--accent)" />
        <h3 style={{ fontFamily: 'Playfair Display', fontSize: 16, fontWeight: 700 }}>
          Your Cart
        </h3>
        {itemCount > 0 && (
          <span className="badge badge-accent" style={{ marginLeft: 'auto' }}>
            {itemCount}
          </span>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <ShoppingBag size={32} color="var(--text-dim)" />
          <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>Your cart is empty</p>
          <p style={{ color: 'var(--text-dim)', fontSize: 12 }}>Speak or tap to add items</p>
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {cartItems.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '10px 12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, flex: 1, paddingRight: 8 }}>{item.name}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                  >
                    <Trash2 size={13} color="var(--text-dim)" />
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: 'var(--bg-card-hover)', border: '1px solid var(--border)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <Minus size={11} />
                    </button>
                    <span style={{ fontSize: 13, fontWeight: 600, minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: 'var(--bg-card-hover)', border: '1px solid var(--border)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>
                    ₹{(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <BillSummary />
        </>
      )}
    </div>
  )
}