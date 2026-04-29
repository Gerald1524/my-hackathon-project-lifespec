'use client'

import { useState } from 'react'
import { DocumentSections } from '@/types'

interface Props {
  documentId: string
  document: DocumentSections
  name: string
}

export function EmailCapture({ documentId, document, name }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const handleSubmit = async () => {
    if (!email.trim() || status !== 'idle') return
    setStatus('sending')
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), documentId, document, name }),
      })
      const data = await res.json()
      setStatus(data.success ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <p style={{ color: 'var(--cream)', fontFamily: 'var(--font-cormorant)', fontSize: '1rem', textAlign: 'center' }}>
        Done. Check your inbox.
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <p style={{ color: 'var(--muted)', fontSize: '0.875rem', textAlign: 'center' }}>
        Want us to send this to you? Enter your email.
      </p>
      {status === 'error' && (
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem', textAlign: 'center' }}>
          Something went wrong. You can still copy the URL above.
        </p>
      )}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
          placeholder="your@email.com"
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--muted)',
            color: 'var(--cream)',
            padding: '0.4rem 0.5rem',
            fontSize: '0.9rem',
            outline: 'none',
            width: '16rem',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!email.trim() || status === 'sending'}
          style={{
            background: 'none',
            border: '1px solid var(--gold)',
            color: 'var(--gold)',
            padding: '0.4rem 1rem',
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            cursor: email.trim() ? 'pointer' : 'default',
            textTransform: 'uppercase',
            opacity: status === 'sending' ? 0.5 : 1,
          }}
        >
          {status === 'sending' ? '…' : 'Send to my inbox'}
        </button>
      </div>
    </div>
  )
}
