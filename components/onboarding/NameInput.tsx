'use client'

import { useState } from 'react'

interface Props {
  onSubmit: (name: string) => void
}

export function NameInput({ onSubmit }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    if (value.trim()) onSubmit(value.trim())
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: 'var(--bg)' }}>
      <p style={{
        fontFamily: 'var(--font-cormorant)',
        color: 'var(--cream)',
        fontSize: 'clamp(1.25rem, 3vw, 2rem)',
        marginBottom: '2rem',
        letterSpacing: '0.02em',
      }}>
        What would you like to be called?
      </p>
      <input
        autoFocus
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
        style={{
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid var(--gold)',
          color: 'var(--cream)',
          fontFamily: 'var(--font-cormorant)',
          fontSize: '1.5rem',
          textAlign: 'center',
          outline: 'none',
          padding: '0.5rem 1rem',
          width: '16rem',
          marginBottom: '2rem',
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        style={{
          border: '1px solid var(--gold)',
          color: value.trim() ? 'var(--gold)' : 'var(--muted)',
          background: 'transparent',
          padding: '0.6rem 2rem',
          fontSize: '0.875rem',
          letterSpacing: '0.12em',
          cursor: value.trim() ? 'pointer' : 'default',
          fontFamily: 'system-ui, sans-serif',
          textTransform: 'uppercase',
          borderColor: value.trim() ? 'var(--gold)' : 'var(--muted)',
        }}
      >
        Continue
      </button>
    </div>
  )
}
