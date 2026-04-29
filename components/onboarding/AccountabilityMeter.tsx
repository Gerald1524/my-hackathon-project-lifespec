'use client'

import { AccountabilityMode } from '@/types'

interface Props {
  onSelect: (mode: AccountabilityMode) => void
}

const modes: { value: AccountabilityMode; label: string; description: string }[] = [
  { value: 'gentle', label: 'Gentle', description: 'You are held and reflected back with warmth and care.' },
  { value: 'direct', label: 'Direct', description: 'Your patterns are named plainly, without cruelty.' },
  { value: 'accountable', label: 'Accountable', description: 'You are not allowed to run from yourself.' },
]

export function AccountabilityMeter({ onSelect }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4" style={{ background: 'var(--bg)' }}>
      <p style={{
        fontFamily: 'var(--font-cormorant)',
        color: 'var(--cream)',
        fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
        marginBottom: '3rem',
        letterSpacing: '0.02em',
        textAlign: 'center',
      }}>
        How would you like to be held?
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '28rem' }}>
        {modes.map(m => (
          <button
            key={m.value}
            onClick={() => onSelect(m.value)}
            style={{
              background: 'transparent',
              border: '1px solid var(--muted)',
              padding: '1.25rem 1.5rem',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--muted)')}
          >
            <div style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--gold)', fontSize: '1.25rem', marginBottom: '0.4rem' }}>
              {m.label}
            </div>
            <div style={{ color: 'var(--cream)', fontSize: '0.875rem', opacity: 0.8 }}>
              {m.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
