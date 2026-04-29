'use client'

import { useState, useEffect } from 'react'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'

interface Props {
  text: string
  onComplete: () => void
}

export function AIResponse({ text, onComplete }: Props) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
      .then(res => res.blob())
      .then(blob => { if (!cancelled) setAudioUrl(URL.createObjectURL(blob)) })
      .catch(() => { if (!cancelled) onComplete() })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  useAudioPlayer(audioUrl, { onEnded: onComplete })

  return (
    <div style={{ maxWidth: '32rem', margin: '2rem auto', textAlign: 'center' }}>
      <p style={{
        fontFamily: 'var(--font-cormorant)',
        color: 'var(--cream)',
        fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
        lineHeight: 1.7,
        fontStyle: 'italic',
      }}>
        {text}
      </p>
    </div>
  )
}
