import { useCallback, useRef } from 'react'
import { useVoice as useVoiceContext } from '../context/VoiceContext'
import { useCart } from '../context/CartContext'
import { processVoiceCommand } from '../services/voiceService'

export function useVoice() {
  const voice = useVoiceContext()
  const { orderId, setOrderId, addItem, removeItem, clearCart } = useCart()
  const lastHandledRef = useRef('')

  const handleCommand = useCallback(async (transcript) => {
    const cleanTranscript = transcript?.trim()
    if (!cleanTranscript) return
    if (lastHandledRef.current === cleanTranscript) return

    lastHandledRef.current = cleanTranscript
    const result = await processVoiceCommand(transcript, orderId)
    if (result.success) {
      const { intent, item, message, order_id } = result.data
      if (order_id && order_id !== orderId) setOrderId(order_id)
      if (intent === 'ADD_ITEM' && item) addItem(item)
      if (intent === 'REMOVE_ITEM' && item) removeItem(item.id)
      if (intent === 'CANCEL_ORDER') {
        clearCart()
        setOrderId(null)
      }
      voice.setResponse(result.data)
      if (message) voice.speak(message)
    } else {
      voice.setResponse({ intent: 'VOICE_ERROR', message: result.error })
      voice.speak(result.error)
    }
  }, [orderId, setOrderId, addItem, removeItem, clearCart, voice])

  const listen = useCallback(() => {
    lastHandledRef.current = ''
    voice.startListening()
  }, [voice])

  return { ...voice, handleCommand, listen }
}