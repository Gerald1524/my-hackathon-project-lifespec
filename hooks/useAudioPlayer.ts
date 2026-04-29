'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface UseAudioPlayerOptions {
  onEnded?: () => void
}

export function useAudioPlayer(audioUrl: string | null, options: UseAudioPlayerOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const onEndedRef = useRef(options.onEnded)

  useEffect(() => {
    onEndedRef.current = options.onEnded
  })

  useEffect(() => {
    if (!audioUrl) return

    const audio = new Audio(audioUrl)
    audioRef.current = audio

    audio.onplay = () => setIsPlaying(true)
    audio.onended = () => {
      setIsPlaying(false)
      onEndedRef.current?.()
    }
    audio.onerror = () => {
      setIsPlaying(false)
      onEndedRef.current?.()
    }

    audio.play().catch(() => {
      // autoplay blocked — call onEnded so the flow doesn't stall
      onEndedRef.current?.()
    })

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [audioUrl])

  const skip = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    setIsPlaying(false)
    onEndedRef.current?.()
  }, [])

  return { isPlaying, skip }
}
