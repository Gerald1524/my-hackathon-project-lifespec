'use client'

interface Props {
  text: string
  onComplete?: () => void
}

export function AIResponse({ text, onComplete }: Props) {
  return (
    <div style={{
      maxWidth: '32rem',
      margin: '1.5rem auto',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: 'var(--font-cormorant)',
        color: 'var(--cream)',
        fontSize: '1.2rem',
        lineHeight: 1.7,
        fontStyle: 'italic',
      }}>
        {text}
      </p>
      {onComplete && (
        <button
          onClick={onComplete}
          style={{
            marginTop: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            fontSize: '0.8rem',
            cursor: 'pointer',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Continue ›
        </button>
      )}
    </div>
  )
}
