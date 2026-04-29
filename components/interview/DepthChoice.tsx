'use client'

interface Props {
  onGoDeeper: () => void
  onMoveForward: () => void
}

export function DepthChoice({ onGoDeeper, onMoveForward }: Props) {
  return (
    <div style={{
      display: 'flex',
      gap: '1.5rem',
      justifyContent: 'center',
      marginTop: '2rem',
    }}>
      <button
        onClick={onGoDeeper}
        style={{
          background: 'none',
          border: '1px solid var(--muted)',
          color: 'var(--cream)',
          padding: '0.6rem 1.5rem',
          fontSize: '0.875rem',
          letterSpacing: '0.08em',
          cursor: 'pointer',
          fontFamily: 'var(--font-cormorant)',
        }}
      >
        Go deeper
      </button>
      <button
        onClick={onMoveForward}
        style={{
          background: 'none',
          border: '1px solid var(--gold)',
          color: 'var(--gold)',
          padding: '0.6rem 1.5rem',
          fontSize: '0.875rem',
          letterSpacing: '0.08em',
          cursor: 'pointer',
          fontFamily: 'var(--font-cormorant)',
        }}
      >
        Move forward
      </button>
    </div>
  )
}
