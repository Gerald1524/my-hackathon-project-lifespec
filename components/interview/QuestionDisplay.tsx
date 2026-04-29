'use client'

import { useState, useEffect } from 'react'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { Question } from '@/lib/questions'

interface Props {
  question: Question
  userName: string
  onInputActivated: () => void
}

export function QuestionDisplay({ question, userName, onInputActivated }: Props) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [inputActive, setInputActive] = useState(false)

  const handleAudioEnd = () => {
    setInputActive(true)
    onInputActivated()
  }

  const { isPlaying, skip } = useAudioPlayer(audioUrl, { onEnded: handleAudioEnd })

  useEffect(() => {
    setInputActive(false)
    setAudioUrl(null)

    let cancelled = false
    const spokenText = `${userName}, ${question.text}`

    fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: spokenText }),
    })
      .then(res => res.blob())
      .then(blob => {
        if (!cancelled) setAudioUrl(URL.createObjectURL(blob))
      })
      .catch(() => {
        if (!cancelled) handleAudioEnd()
      })

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.index])  // re-fire when question changes

  // suppress unused variable warning — inputActive used by parent in step 6
  void inputActive

  return (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      <p style={{
        fontFamily: 'var(--font-cormorant)',
        color: 'var(--gold)',
        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '0.75rem',
        opacity: 0.8,
      }}>
        {question.name}
      </p>
      <p style={{
        fontFamily: 'var(--font-cormorant)',
        color: 'var(--cream)',
        fontSize: 'clamp(1.2rem, 3vw, 1.75rem)',
        lineHeight: 1.6,
        maxWidth: '36rem',
        margin: '0 auto',
      }}>
        {question.text}
      </p>

      {isPlaying && (
        <button
          onClick={skip}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          Skip ›
        </button>
      )}
    </div>
  )
}
