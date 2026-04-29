'use client'

import { useState, useEffect } from 'react'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'

interface Props {
  userName: string
  onComplete: () => void
}

export function WelcomeMoment({ userName, onComplete }: Props) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const welcomeText = `${userName}, you could have been anywhere right now. You chose to be here. Over the next few minutes, nine questions will build something — a document made entirely from your own words, given structure and weight. A thin answer sounds like: I just want to be happy. A real answer sounds like: I felt most alive when I was building something and people kept showing up to help. The difference is specificity and honesty.`

  useEffect(() => {
    let cancelled = false
    fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: welcomeText }),
    })
      .then(res => res.blob())
      .then(blob => {
        if (!cancelled) setAudioUrl(URL.createObjectURL(blob))
      })
      .catch(() => {
        if (!cancelled) onComplete()
      })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentional: runs once on mount

  useAudioPlayer(audioUrl, { onEnded: onComplete })

  const beats = [
    `${userName}, you could have been anywhere right now. You chose to be here.`,
    `Over the next few minutes, nine questions will build something — a document made entirely from your own words, given structure and weight.`,
    `A thin answer sounds like: "I just want to be happy." A real answer sounds like: "I felt most alive when I was building something and people kept showing up to help." The difference is specificity and honesty.`,
  ]

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-8"
      style={{ background: 'var(--bg)' }}
    >
      <div style={{ maxWidth: '36rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {beats.map((beat, i) => (
          <p
            key={i}
            style={{
              fontFamily: 'var(--font-cormorant)',
              color: 'var(--cream)',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
              lineHeight: 1.7,
              textAlign: 'center',
              opacity: 0.9,
            }}
          >
            {beat}
          </p>
        ))}
      </div>
    </div>
  )
}
