'use client'

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main
      style={{ background: 'var(--bg)' }}
      className="min-h-screen flex flex-col items-center justify-center px-4"
    >
      <p
        style={{
          fontFamily: 'var(--font-cormorant)',
          color: 'var(--gold)',
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 600,
          textAlign: 'center',
          maxWidth: '36rem',
          lineHeight: 1.3,
          marginBottom: '2.5rem',
          letterSpacing: '0.01em',
        }}
      >
        Be the architect of your life<br />before life happens to you.
      </p>

      <button
        onClick={() => router.push('/interview')}
        style={{
          border: '1px solid var(--gold)',
          color: 'var(--gold)',
          background: 'transparent',
          padding: '0.75rem 2.5rem',
          fontSize: '1rem',
          letterSpacing: '0.12em',
          cursor: 'pointer',
          fontFamily: 'system-ui, sans-serif',
          textTransform: 'uppercase',
        }}
      >
        Begin
      </button>
    </main>
  );
}
