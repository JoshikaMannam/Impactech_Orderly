import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const VoiceContext = createContext(null)

function getVoiceErrorMessage(errorCode) {
  switch (errorCode) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone permission denied. Please allow mic access and try again.'
    case 'no-speech':
      return 'No speech detected. Please speak a bit louder and try again.'
    case 'audio-capture':
      return 'No microphone was detected on this device.'
    case 'network':
      return 'Voice recognition network issue. Please retry in a moment.'
    case 'aborted':
      return 'Listening stopped. Tap mic and try again.'
    default:
      return 'Voice recognition failed. Please try again.'
  }
}

export function VoiceProvider({ children }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState(null)

  const recognitionRef = useRef(null)

  const fallbackToTypedCommand = useCallback(() => {
    const typed = window.prompt('Voice recognition is unavailable. Type your order command for demo mode:')
    const clean = typed?.trim()
    if (clean) {
      setTranscript(clean)
      setResponse({ intent: 'VOICE_CAPTURED', message: `Heard: ${clean}` })
      return true
    }
    return false
  }, [])

  const getRecognition = useCallback(() => {
    if (recognitionRef.current) return recognitionRef.current

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return null

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.interimResults = true
    recognition.continuous = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      let finalText = ''
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const chunk = event.results[i]?.[0]?.transcript?.trim() || ''
        if (event.results[i]?.isFinal && chunk) {
          finalText = `${finalText} ${chunk}`.trim()
        }
      }

      if (finalText) {
        setTranscript(finalText)
        setResponse({ intent: 'VOICE_CAPTURED', message: `Heard: ${finalText}` })
      }
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      setIsListening(false)
      setResponse({
        intent: 'VOICE_ERROR',
        message: getVoiceErrorMessage(event?.error),
      })
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    return recognition
  }, [])

  const startListening = useCallback(() => {
    const recognition = getRecognition()
    if (!recognition) {
      const typedWorked = fallbackToTypedCommand()
      if (!typedWorked) {
        setResponse({
          intent: 'VOICE_ERROR',
          message: 'Voice recognition is not supported in this browser. Use Chrome/Edge or type command in demo mode.',
        })
      }
      return
    }

    setTranscript('')
    setResponse({ intent: 'VOICE_LISTENING', message: 'Listening...' })
    setIsListening(true)
    try {
      recognition.start()
    } catch {
      setIsListening(false)
      const typedWorked = fallbackToTypedCommand()
      if (!typedWorked) {
        setResponse({
          intent: 'VOICE_ERROR',
          message: 'Voice recognition could not start. Please retry.',
        })
      }
    }
  }, [fallbackToTypedCommand, getRecognition])

  const stopListening = useCallback(() => {
    const recognition = getRecognition()
    if (recognition) recognition.stop()
    setIsListening(false)
  }, [getRecognition])

  const speak = useCallback((text) => {
    if (!text || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1.0
    window.speechSynthesis.speak(utterance)
  }, [])

  const value = useMemo(
    () => ({
      isListening,
      transcript,
      response,
      setResponse,
      startListening,
      stopListening,
      speak,
    }),
    [isListening, transcript, response, startListening, stopListening, speak],
  )

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>
}

export function useVoice() {
  const ctx = useContext(VoiceContext)
  if (!ctx) throw new Error('useVoice must be used within VoiceProvider')
  return ctx
}