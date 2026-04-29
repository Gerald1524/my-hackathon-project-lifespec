'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { DocumentView } from '@/components/document/DocumentView'
import { EmailCapture } from '@/components/complete/EmailCapture'
import { DocumentPDF } from '@/components/document/DocumentPDF'
import { DocumentSections } from '@/types'

// CRITICAL: dynamic import for PDFDownloadLink — never import @react-pdf/renderer at module level
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { ssr: false }
)

interface Props {
  document: DocumentSections
  userName: string
}

export function CompletePage({ document, userName }: Props) {
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [documentUrl, setDocumentUrl] = useState<string | null>(null)
  const [copyLabel, setCopyLabel] = useState('Copy text')

  // Save document to Supabase on mount
  useEffect(() => {
    fetch('/api/document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userName, document }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) setDocumentId(data.id)
        if (data.url) setDocumentUrl(data.url)
      })
      .catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCopyText = () => {
    const text = [
      userName,
      '',
      'WHO YOU ARE',
      document.whoYouAre,
      '',
      'WHERE YOU ARE',
      document.whereYouAre,
      '',
      'WHAT IS IN THE WAY',
      document.whatIsInTheWay,
      '',
      'WHAT YOU ARE HERE FOR',
      document.whatYouAreHereFor,
      '',
      'YOUR NEXT STEPS',
      document.yourNextSteps,
      '',
      'YOUR DECLARATION',
      document.yourDeclaration,
      '',
      'YOUR 7-DAY INTENTION',
      document.sevenDayIntention,
      '',
      document.openInvitation,
    ].join('\n')

    navigator.clipboard.writeText(text).then(() => {
      setCopyLabel('Copied ✓')
      setTimeout(() => setCopyLabel('Copy text'), 2000)
    })
  }

  const handleCopyUrl = () => {
    if (documentUrl) navigator.clipboard.writeText(documentUrl)
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '4rem 2rem' }}>
      <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto' }}>

        {/* Permanent URL */}
        {documentUrl && (
          <div style={{
            marginBottom: '2.5rem',
            padding: '1rem 1.25rem',
            border: '1px solid rgba(201,168,76,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Your document has a permanent home:
              </p>
              <p style={{ color: 'var(--cream)', fontSize: '0.85rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {documentUrl}
              </p>
            </div>
            <button
              onClick={handleCopyUrl}
              style={{ background: 'none', border: '1px solid var(--muted)', color: 'var(--muted)', padding: '0.4rem 0.75rem', fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
            >
              Copy URL
            </button>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <PDFDownloadLink
            document={<DocumentPDF document={document} />}
            fileName={`lifespec-${userName.toLowerCase().replace(/\s+/g, '-')}.pdf`}
            style={{
              border: '1px solid var(--gold)',
              color: 'var(--gold)',
              padding: '0.6rem 1.5rem',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'inline-block',
              cursor: 'pointer',
            }}
          >
            {({ loading }: { loading: boolean }) => loading ? 'Preparing PDF…' : 'Download PDF'}
          </PDFDownloadLink>

          <button
            onClick={handleCopyText}
            style={{
              background: 'none',
              border: '1px solid var(--muted)',
              color: 'var(--muted)',
              padding: '0.6rem 1.5rem',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {copyLabel}
          </button>
        </div>

        {/* Document */}
        <DocumentView document={document} />

        {/* Email capture */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
          {documentId ? (
            <EmailCapture documentId={documentId} document={document} name={userName} />
          ) : (
            <p style={{ color: 'var(--muted)', fontSize: '0.8rem', textAlign: 'center' }}>Saving your document…</p>
          )}
        </div>

      </div>
    </div>
  )
}
