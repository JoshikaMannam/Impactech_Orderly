import { voiceApi } from './api'

export async function processVoiceCommand(transcript, orderId) {
  try {
    const result = await voiceApi.process(transcript, orderId)
    return { success: true, data: result }
  } catch (err) {
    if (!err.response) return { success: false, error: 'Voice processing failed. Please try again.' }
    return { success: false, error: err.response?.data?.detail || 'Voice processing failed' }
  }
}

export function speakText(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.rate = 0.95
  utter.pitch = 1.0
  const voices = window.speechSynthesis.getVoices()
  const v = voices.find(v => v.lang === 'en-IN') || voices.find(v => v.lang.startsWith('en'))
  if (v) utter.voice = v
  window.speechSynthesis.speak(utter)
}