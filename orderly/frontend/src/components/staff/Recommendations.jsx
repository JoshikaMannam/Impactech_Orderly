import React, { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import api from '../../services/api'

export default function Recommendations({ orderId, items }) {
  const [recs, setRecs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!items?.length) { setLoading(false); return }
    api.post('/recommendations', { order_id: orderId, items })
      .then(r => setRecs(r.data.recommendations || []))
      .catch(() => setRecs([]))
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading || recs.length === 0) return null

  return (
    <div style={{
      background: 'rgba(255,153,51,0.06)',
      border: '1px solid var(--accent-border)',
      borderRadius: 10,
      padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Sparkles size={13} color="var(--accent)" />
        <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          AI Suggestions
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {recs.map((r, i) => (
          <span
            key={i}
            style={{
              fontSize: 12,
              background: 'var(--accent-soft)',
              border: '1px solid var(--accent-border)',
              borderRadius: 6,
              padding: '3px 8px',
              color: 'var(--accent)',
            }}
          >
            {r}
          </span>
        ))}
      </div>
    </div>
  )
}