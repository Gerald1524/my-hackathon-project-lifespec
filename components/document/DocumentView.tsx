import { DocumentSections } from '@/types'

interface Props {
  document: DocumentSections
}

export function DocumentView({ document }: Props) {
  return (
    <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto' }}>
      {/* Name */}
      <h1 style={{
        fontFamily: 'var(--font-cormorant)',
        color: 'var(--gold)',
        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
        fontWeight: 600,
        marginBottom: '2.5rem',
        textAlign: 'center',
      }}>
        {document.name}
      </h1>

      {[
        { key: 'whoYouAre', label: 'Who You Are' },
        { key: 'whereYouAre', label: 'Where You Are' },
        { key: 'whatIsInTheWay', label: 'What Is In The Way' },
        { key: 'whatYouAreHereFor', label: 'What You Are Here For' },
        { key: 'yourNextSteps', label: 'Your Next Steps' },
      ].map(({ key, label }) => (
        <div key={key} style={{ marginBottom: '2rem' }}>
          <p style={{
            color: 'var(--gold)',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
            opacity: 0.8,
          }}>
            {label}
          </p>
          <p style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'var(--cream)',
            fontSize: 'clamp(1rem, 2vw, 1.1rem)',
            lineHeight: 1.8,
          }}>
            {document[key as keyof DocumentSections]}
          </p>
        </div>
      ))}

      {/* Declaration — styled distinctly */}
      <div style={{
        margin: '2.5rem 0',
        padding: '2rem',
        borderTop: '1px solid rgba(201,168,76,0.3)',
        borderBottom: '1px solid rgba(201,168,76,0.3)',
        textAlign: 'center',
      }}>
        <p style={{
          color: 'var(--gold)',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
          opacity: 0.8,
        }}>
          Your Declaration
        </p>
        <p style={{
          fontFamily: 'var(--font-cormorant)',
          color: 'var(--cream)',
          fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
          lineHeight: 1.7,
          fontStyle: 'italic',
        }}>
          {document.yourDeclaration}
        </p>
      </div>

      {/* 7-Day Intention */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{
          color: 'var(--gold)',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '0.5rem',
          opacity: 0.8,
        }}>
          Your 7-Day Intention
        </p>
        <p style={{
          fontFamily: 'var(--font-cormorant)',
          color: 'var(--cream)',
          fontSize: 'clamp(1rem, 2vw, 1.1rem)',
          lineHeight: 1.8,
        }}>
          {document.sevenDayIntention}
        </p>
      </div>

      {/* Open Invitation */}
      <p style={{
        fontFamily: 'var(--font-cormorant)',
        color: 'var(--muted)',
        fontSize: '0.9rem',
        lineHeight: 1.7,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: '2rem',
      }}>
        {document.openInvitation}
      </p>
    </div>
  )
}
