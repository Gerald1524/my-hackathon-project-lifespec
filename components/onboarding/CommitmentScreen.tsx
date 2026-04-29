'use client'

interface Props {
  onBegin: () => void
}

export function CommitmentScreen({ onBegin }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8" style={{ background: 'var(--bg)' }}>
      <p style={{
        fontFamily: 'var(--font-cormorant)',
        color: 'var(--cream)',
        fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
        maxWidth: '36rem',
        lineHeight: 1.8,
        textAlign: 'center',
        marginBottom: '3rem',
        fontStyle: 'italic',
      }}>
        This experience is designed to be completed in one sitting. If you close your browser or navigate away, your session will end and you will need to begin again. That is not a punishment — it is an invitation to be fully present. What you are about to do deserves your full attention.
      </p>
      <button
        onClick={onBegin}
        style={{
          border: '1px solid var(--gold)',
          color: 'var(--gold)',
          background: 'transparent',
          padding: '0.75rem 2.5rem',
          fontSize: '1rem',
          letterSpacing: '0.08em',
          cursor: 'pointer',
          fontFamily: 'var(--font-cormorant)',
          fontWeight: 600,
        }}
      >
        I&apos;m ready. Begin.
      </button>
    </div>
  )
}
