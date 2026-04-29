'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseVoiceInputOptions {
  onFinalTranscript: (transcript: string) => void
}

// Web Speech API types (not yet in TypeScript's lib.dom.d.ts for all versions)
interface ISpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: ISpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: ((event: Event) => void) | null
  start(): void
  stop(): void
}

type SpeechRecognitionConstructor = new () => ISpeechRecognition

export function useVoiceInput({ onFinalTranscript }: UseVoiceInputOptions) {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [liveTranscript, setLiveTranscript] = useState('')
  const recognitionRef = useRef<ISpeechRecognition | null>(null)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onFinalRef = useRef(onFinalTranscript)

  useEffect(() => {
    onFinalRef.current = onFinalTranscript
  })

  useEffect(() => {
    const w = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor
      webkitSpeechRecognition?: SpeechRecognitionConstructor
    }
    const SpeechRecognitionImpl = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!SpeechRecognitionImpl) {
      setIsVoiceEnabled(false)
      return
    }

    setIsVoiceEnabled(true)
    const recognition = new SpeechRecognitionImpl()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognitionRef.current = recognition
  }, [])

  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    silenceTimerRef.current = setTimeout(() => {
      recognitionRef.current?.stop()
    }, 3000)
  }, [])

  const startRecording = useCallback(() => {
    if (!recognitionRef.current) return
    setLiveTranscript('')

    const recognition = recognitionRef.current

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }
      setLiveTranscript(prev => prev + final + interim)
      resetSilenceTimer()
    }

    recognition.onend = () => {
      setIsRecording(false)
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      setLiveTranscript(prev => {
        if (prev.trim()) onFinalRef.current(prev.trim())
        return ''
      })
    }

    recognition.onerror = () => {
      setIsRecording(false)
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    }

    recognition.start()
    setIsRecording(true)
    resetSilenceTimer()
  }, [resetSilenceTimer])

  const stopRecording = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    recognitionRef.current?.stop()
  }, [])

  return { isVoiceEnabled, isRecording, liveTranscript, startRecording, stopRecording }
}
