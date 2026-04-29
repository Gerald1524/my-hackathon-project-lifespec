'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { DocumentSections } from '@/types'

interface Props {
  userName: string
  accountabilityMode: 'gentle' | 'direct' | 'accountable'
  answers: Array<{
    questionName: string
    questionText: string
    userAnswer: string
    userFollowUp?: string
  }>
  onComplete: (document: DocumentSections) => void
}

type RevealStep =
  | 'silence'
  | 'heard-you'
  | 'revealing'
  | 'closing-audio'
  | 'extras'
  | 'done'

const SECTION_ORDER: Array<keyof DocumentSections> = [
  'name', 'whoYouAre', 'whereYouAre', 'whatIsInTheWay',
  'whatYouAreHereFor', 'yourNextSteps', 'yourDeclaration',
]

const SECTION_LABELS: Partial<Record<keyof DocumentSections, string>> = {
  name: 'Your Name',
  whoYouAre: 'Who You Are',
  whereYouAre: 'Where You Are',
  whatIsInTheWay: 'What Is In The Way',
  whatYouAreHereFor: 'What You Are Here For',
  yourNextSteps: 'Your Next Steps',
  yourDeclaration: 'Your Declaration',
}

export function DocumentReveal({ userName, accountabilityMode, answers, onComplete }: Props) {
  const [step, setStep] = useState<RevealStep>('silence')
  const [heardYouAudioUrl, setHeardYouAudioUrl] = useState<string | null>(null)
  const [closingAudioUrl, setClosingAudioUrl] = useState<string | null>(null)
  const [document, setDocument] = useState<DocumentSections | null>(null)
  const [visibleSections, setVisibleSections] = useState(0)
  const [showExtras, setShowExtras] = useState(false)

  const synthesisRef = useRef<Promise<DocumentSections> | null>(null)
  const synthesisResultRef = useRef<DocumentSections | null>(null)
  const heardYouDoneRef = useRef(false)
  const synthDoneRef = useRef(false)

  // Step 1: fire synthesis immediately on mount
  useEffect(() => {
    synthesisRef.current = fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task: 'synthesize',
        userName,
        mode: accountabilityMode,
        questionIndex: 8,
        questionText: answers[8]?.questionText ?? '',
        answer: answers[8]?.userAnswer ?? '',
        priorAnswers: answers.slice(0, 8).map(a => ({
          questionName: a.questionName,
          questionText: a.questionText,
          userAnswer: a.userAnswer,
          userFollowUp: a.userFollowUp,
        })),
      }),
    }).then(r => r.json()).then((data: DocumentSections) => {
      synthesisResultRef.current = data
      return data
    })

    // Step 2: 2.5s silence then fetch heard-you TTS
    const silenceTimer = setTimeout(() => {
      fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'I heard you. Let me show you what I found.' }),
      })
        .then(r => r.blob())
        .then(blob => {
          setHeardYouAudioUrl(URL.createObjectURL(blob))
          setStep('heard-you')
        })
        .catch(() => {
          heardYouDoneRef.current = true
          tryStartReveal()
        })
    }, 2500)

    return () => clearTimeout(silenceTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tryStartReveal = useCallback(() => {
    if (!heardYouDoneRef.current || !synthDoneRef.current) return

    const doc = synthesisResultRef.current
    if (!doc) return

    setDocument(doc)
    setStep('revealing')
    revealSectionsSequentially(doc)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const revealSectionsSequentially = useCallback((doc: DocumentSections) => {
    let count = 0
    const reveal = () => {
      count++
      setVisibleSections(count)
      if (count < SECTION_ORDER.length) {
        // 0.8s fade-in + 1.2s stillness = 2s total per section
        setTimeout(reveal, 2000)
      } else {
        // All sections revealed — 2s pause then closing audio
        setTimeout(() => {
          fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'This is yours. You built this. What you do next is up to you.' }),
          })
            .then(r => r.blob())
            .then(blob => {
              setClosingAudioUrl(URL.createObjectURL(blob))
              setStep('closing-audio')
            })
            .catch(() => {
              handleClosingAudioEnd()
            })
        }, 2000)
      }
    }
    // Start first reveal after a brief moment
    setTimeout(reveal, 300)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleHeardYouEnd = useCallback(() => {
    heardYouDoneRef.current = true
    // Check if synthesis is done
    if (synthesisResultRef.current) {
      synthDoneRef.current = true
      tryStartReveal()
    } else {
      // Wait for synthesis
      synthesisRef.current?.then(() => {
        synthDoneRef.current = true
        tryStartReveal()
      })
    }
  }, [tryStartReveal])

  const handleClosingAudioEnd = useCallback(() => {
    setStep('extras')
    setShowExtras(true)
    setTimeout(() => {
      if (document) {
        onComplete(document)
      }
    }, 1000)
  }, [document, onComplete])

  useAudioPlayer(heardYouAudioUrl, { onEnded: handleHeardYouEnd })
  useAudioPlayer(closingAudioUrl, { onEnded: handleClosingAudioEnd })

  const renderSection = (key: keyof DocumentSections, index: number) => {
    if (!document) return null
    const visible = index < visibleSections
    const label = SECTION_LABELS[key]
    const value = document[key]
    if (!label || !value) return null

    return (
      <div
        key={key}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
          marginBottom: key === 'yourDeclaration' ? '0' : '1.5rem',
          textAlign: key === 'yourDeclaration' ? 'center' : 'left',
        }}
      >
        {key !== 'name' && (
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
        )}
        <p style={{
          fontFamily: 'var(--font-cormorant)',
          color: key === 'yourDeclaration' ? 'var(--gold)' : 'var(--cream)',
          fontSize: key === 'name' ? 'clamp(1.5rem, 4vw, 2.5rem)'
            : key === 'yourDeclaration' ? 'clamp(1.1rem, 2.5vw, 1.5rem)'
            : 'clamp(0.95rem, 2vw, 1.1rem)',
          lineHeight: 1.7,
          fontWeight: key === 'name' ? 600 : 400,
          fontStyle: key === 'yourDeclaration' ? 'italic' : 'normal',
        }}>
          {value}
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        background: 'var(--bg)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '42rem' }}>
        {/* "I heard you" text */}
        {(step === 'heard-you' || step === 'revealing' || step === 'closing-audio' || step === 'extras' || step === 'done') && (
          <p style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'var(--muted)',
            fontSize: '1rem',
            textAlign: 'center',
            marginBottom: '3rem',
            fontStyle: 'italic',
          }}>
            I heard you. Let me show you what I found.
          </p>
        )}

        {/* Document sections */}
        {(step === 'revealing' || step === 'closing-audio' || step === 'extras' || step === 'done') &&
          SECTION_ORDER.map((key, i) => renderSection(key, i))
        }

        {/* Closing line */}
        {(step === 'closing-audio' || step === 'extras' || step === 'done') && (
          <p style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'var(--muted)',
            fontSize: '1rem',
            textAlign: 'center',
            marginTop: '2rem',
            fontStyle: 'italic',
          }}>
            This is yours. You built this. What you do next is up to you.
          </p>
        )}

        {/* Extras */}
        {showExtras && document && (
          <div style={{
            opacity: showExtras ? 1 : 0,
            transition: 'opacity 0.8s ease',
            marginTop: '2rem',
            borderTop: '1px solid rgba(201,168,76,0.2)',
            paddingTop: '2rem',
          }}>
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
              fontSize: '1.05rem',
              lineHeight: 1.7,
              marginBottom: '1.5rem',
            }}>
              {document.sevenDayIntention}
            </p>
            <p style={{
              fontFamily: 'var(--font-cormorant)',
              color: 'var(--muted)',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              fontStyle: 'italic',
            }}>
              {document.openInvitation}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
