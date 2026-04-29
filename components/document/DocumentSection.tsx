'use client'

import { useRef, useEffect, useState } from 'react'
import { DocumentSection as DocumentSectionType } from '@/types'

interface Props {
  section: DocumentSectionType
  label: string
  fragments: string[]
}

export function DocumentSectionComponent({ section: _section, label, fragments }: Props) {
  const prevLengthRef = useRef(fragments.length)
  const [newIndex, setNewIndex] = useState<number | null>(null)

  useEffect(() => {
    if (fragments.length > prevLengthRef.current) {
      setNewIndex(fragments.length - 1)
      const timer = setTimeout(() => setNewIndex(null), 2000)
      prevLengthRef.current = fragments.length
      return () => clearTimeout(timer)
    }
    prevLengthRef.current = fragments.length
  }, [fragments.length])

  if (fragments.length === 0) return null

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <p style={{
        color: 'var(--gold)',
        fontSize: '0.65rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        marginBottom: '0.4rem',
        opacity: 0.8,
      }}>
        {label}
      </p>
      {fragments.map((text, i) => (
        <p
          key={i}
          className={i === newIndex ? 'fragment-enter' : ''}
          style={{
            color: 'var(--cream)',
            fontFamily: 'var(--font-cormorant)',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            opacity: 0.85,
            marginBottom: '0.25rem',
          }}
        >
          {text}
        </p>
      ))}
    </div>
  )
}
