'use client'

import { DocumentSection } from '@/types'
import { DocumentSectionComponent } from '@/components/document/DocumentSection'

const SECTION_LABELS: Record<DocumentSection, string> = {
  whoYouAre: 'Who You Are',
  whereYouAre: 'Where You Are',
  whatIsInTheWay: 'What Is In The Way',
  whatYouAreHereFor: 'What You Are Here For',
  yourNextSteps: 'Your Next Steps',
  yourDeclaration: 'Your Declaration',
}

const SECTION_ORDER: DocumentSection[] = [
  'whoYouAre',
  'whereYouAre',
  'whatIsInTheWay',
  'whatYouAreHereFor',
  'yourNextSteps',
  'yourDeclaration',
]

interface Props {
  documentFragments: Partial<Record<DocumentSection, string[]>>
}

export function DocumentPanel({ documentFragments }: Props) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'var(--bg)',
      borderLeft: '1px solid rgba(201,168,76,0.15)',
      padding: '2rem 1.5rem',
      overflowY: 'auto',
    }}>
      <p style={{
        color: 'var(--gold)',
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom: '1.5rem',
        opacity: 0.5,
      }}>
        Your Document
      </p>
      {SECTION_ORDER.map(section => (
        <DocumentSectionComponent
          key={section}
          section={section}
          label={SECTION_LABELS[section]}
          fragments={documentFragments[section] ?? []}
        />
      ))}
    </div>
  )
}
