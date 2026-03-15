import React, { useEffect, useState } from 'react'
import { useVoice } from '../../context/VoiceContext'
import { CheckCircle, XCircle, Info } from 'lucide-react'

export default function VoiceResponse() {
  const { response, transcript } = useVoice()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (response || transcript) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 4000)
      return () => clearTimeout(t)
    }
  }, [response, transcript])

  if (!visible) return null

  const intent = response?.intent
  const message = response?.message || transcript

  const iconMap = {
    ADD_ITEM: <CheckCircle size={16} color="var(--success)" />,
    REMOVE_ITEM: <XCircle size={16} color="var(--danger)" />,
    CANCEL_ORDER: <XCircle size={16} color="var(--danger)" />,
  }

  return (
    <div
      className="page-enter"
      style={{
        position: 'fixed',
        bottom: 100,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--bg-card)',
        border: '1px solid var(--accent-border)',
        borderRadius: 12,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        zIndex: 200,
        maxWidth: 380,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {iconMap[intent] || <Info size={16} color="var(--accent)" />}
      <p style={{ fontSize: 14, color: 'var(--text-primary)', margin: 0 }}>
        {message}
      </p>
    </div>
  )
}