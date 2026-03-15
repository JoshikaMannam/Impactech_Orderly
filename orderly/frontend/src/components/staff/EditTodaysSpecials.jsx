import React, { useEffect, useState } from 'react'
import { Plus, X, Save } from 'lucide-react'

export default function EditTodaysSpecials() {
  const [allItems, setAllItems] = useState([])
  const [selected, setSelected] = useState([])
  const [search,   setSearch]   = useState('')
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  useEffect(() => {
    // Load all menu items
    fetch('http://localhost:8000/menu/')
      .then(res => res.json())
      .then(setAllItems)

    // Load current specials
    fetch('http://localhost:8000/menu/specials')
      .then(res => res.json())
      .then(setSelected)
  }, [])

  const filtered = allItems.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) &&
    !selected.find(s => s.id === i.id)
  )

  const addSpecial    = (item) => setSelected(prev => [...prev, item])
  const removeSpecial = (id)   => setSelected(prev => prev.filter(i => i.id !== id))

  const save = async () => {
    setSaving(true)
    try {
      await fetch('http://localhost:8000/menu/specials', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ items: selected.map(i => i.id) }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error('Failed to save specials', e)
    }
    setSaving(false)
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <h3 style={{ fontFamily: 'Playfair Display', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
        Edit Today's Specials
      </h3>

      {/* Current specials */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Current Specials ({selected.length})
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {selected.map(item => (
            <div
              key={item.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'var(--accent-soft)',
                border: '1px solid var(--accent-border)',
                borderRadius: 8, padding: '6px 10px',
              }}
            >
              <span style={{ fontSize: 13, color: 'var(--accent)' }}>{item.name}</span>
              <button
                onClick={() => removeSpecial(item.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 1 }}
              >
                <X size={12} color="var(--accent)" />
              </button>
            </div>
          ))}
          {selected.length === 0 && (
            <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>No specials selected</p>
          )}
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search menu items to add…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%', padding: '10px 14px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 8, color: 'var(--text-primary)',
          fontSize: 14, marginBottom: 10,
          outline: 'none', fontFamily: 'DM Sans',
        }}
      />
      <div style={{
        maxHeight: 200, overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20,
      }}>
        {filtered.slice(0, 20).map(item => (
          <button
            key={item.id}
            onClick={() => addSpecial(item)}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 8, padding: '8px 12px',
              cursor: 'pointer', color: 'var(--text-primary)',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-border)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <span style={{ fontSize: 13 }}>{item.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--accent)' }}>₹{item.price}</span>
              <Plus size={14} color="var(--text-dim)" />
            </div>
          </button>
        ))}
      </div>

      <button
        className="btn-accent"
        onClick={save}
        disabled={saving}
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <Save size={15} />
        {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Specials'}
      </button>
    </div>
  )
}