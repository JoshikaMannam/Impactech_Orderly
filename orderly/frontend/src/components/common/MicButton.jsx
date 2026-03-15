import React, { useEffect } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { useVoice } from '../../hooks/useVoice'

export default function MicButton({ className = '' }) {
  const { isListening, transcript, startListening, stopListening, handleCommand } = useVoice()

  useEffect(() => {
    if (transcript) {
      handleCommand(transcript)
    }
  }, [transcript, handleCommand])

  const toggle = () => isListening ? stopListening() : startListening()

  return (
    <button
      onClick={toggle}
      className={className}
      title={isListening ? 'Stop listening' : 'Speak your order'}
      style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: isListening ? 'var(--danger)' : 'var(--accent)',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isListening
          ? '0 0 0 0 rgba(248,113,113,0.7)'
          : '0 4px 24px rgba(255,153,51,0.4)',
        animation: isListening ? 'pulseMic 1.5s ease-in-out infinite' : 'none',
        transition: 'background 0.2s, box-shadow 0.2s',
        flexShrink: 0,
      }}
    >
      {isListening
        ? <MicOff size={26} color="#0f0e0c" />
        : <Mic size={26} color="#0f0e0c" />}
    </button>
  )
}