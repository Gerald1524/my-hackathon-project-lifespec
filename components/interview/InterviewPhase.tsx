'use client'

import { useState, useCallback, useRef } from 'react'
import { QuestionDisplay } from '@/components/interview/QuestionDisplay'
import { VoiceInput } from '@/components/interview/VoiceInput'
import { TextInput } from '@/components/interview/TextInput'
import { AIResponse } from '@/components/interview/AIResponse'
import { DepthChoice } from '@/components/interview/DepthChoice'
import { questions } from '@/lib/questions'
import { useInterviewState } from '@/hooks/useInterviewState'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { DocumentPanel } from '@/components/document/DocumentPanel'
import { ProgressSymbol } from '@/components/interview/ProgressSymbol'

const STUCK_PHRASES = [
  "i don't know", "i dont know", "not sure", "can't think", "cant think",
  "nothing comes to mind", "i have no idea", "no idea", "i'm not sure",
  "im not sure", "i don't have an answer", "i cant answer",
]
const SHORT_DEFLECTIONS = ["fine", "good", "okay", "ok", "i guess", "maybe", "sure", "yeah", "idk"]
const AFFIRMATION = "That's okay — not every question lands the same way. Let's keep going."

type InterviewPhaseState =
  | { status: 'question' }
  | { status: 'loading' }
  | { status: 'aiResponse'; text: string; isStuckResponse: boolean }
  | { status: 'depthChoice' }
  | { status: 'affirmation'; audioUrl: string | null }

type Props = {
  interview: ReturnType<typeof useInterviewState>
}

export function InterviewPhase({ interview }: Props) {
  const { state } = interview
  const [phaseState, setPhaseState] = useState<InterviewPhaseState>({ status: 'question' })
  const [inputActive, setInputActive] = useState(false)
  const pendingStuckRef = useRef(false)

  const currentQ = questions[state.currentQuestion]

  const detectClientStuck = (answer: string): boolean => {
    const lower = answer.toLowerCase()
    if (STUCK_PHRASES.some(p => lower.includes(p))) return true
    const words = lower.trim().split(/\s+/)
    if (words.length < 5 && SHORT_DEFLECTIONS.some(p => lower.includes(p))) return true
    return false
  }

  const advanceToNextQuestion = useCallback(() => {
    pendingStuckRef.current = false
    setPhaseState({ status: 'question' })
    setInputActive(false)
    interview.advanceQuestion()
  }, [interview])

  // Affirmation audio player
  const affirmationUrl = phaseState.status === 'affirmation' ? phaseState.audioUrl : null
  useAudioPlayer(affirmationUrl, {
    onEnded: advanceToNextQuestion,
  })

  const handleAnswer = useCallback(async (answer: string) => {
    if (!answer.trim() || phaseState.status === 'loading') return

    const isClientStuck = detectClientStuck(answer)
    const isStuck = isClientStuck || pendingStuckRef.current
    pendingStuckRef.current = false

    setPhaseState({ status: 'loading' })
    setInputActive(false)

    // Hard-coded affirmation path (stuckCount already at 4 or will reach it)
    if (isStuck && state.stuckCount >= 4) {
      let audioUrl: string | null = null
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: AFFIRMATION }),
        })
        const blob = await res.blob()
        audioUrl = URL.createObjectURL(blob)
      } catch { /* fall through — onEnded will fire on error */ }
      setPhaseState({ status: 'affirmation', audioUrl })
      interview.incrementStuckCount()
      return
    }

    // Determine task
    let task: 'followup' | 'reframe' | 'whatif' = 'followup'
    let whatIfForm: 1 | 2 | 3 | undefined
    if (isStuck) {
      const nextStuckCount = state.stuckCount
      if (nextStuckCount === 0) {
        task = 'reframe'
      } else if (nextStuckCount === 1) {
        task = 'whatif'; whatIfForm = 1
      } else if (nextStuckCount === 2) {
        task = 'whatif'; whatIfForm = 2
      } else {
        task = 'whatif'; whatIfForm = 3
      }
      interview.incrementStuckCount()
    }

    try {
      const body: Record<string, unknown> = {
        task,
        userName: state.userName,
        mode: state.accountabilityMode,
        questionIndex: state.currentQuestion,
        questionText: currentQ.text,
        answer,
        priorAnswers: state.answers.map(a => ({
          questionName: a.questionName,
          questionText: a.questionText,
          userAnswer: a.userAnswer,
          userFollowUp: a.userFollowUp,
        })),
      }
      if (whatIfForm) body.whatIfForm = whatIfForm
      if (task === 'reframe') body.reframeHints = currentQ.reframeHints

      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (data.documentFragment) {
        interview.addDocumentFragment(data.documentFragment.section, data.documentFragment.text)
      }

      if (!isStuck && data.stuck === true) {
        pendingStuckRef.current = true
      }

      if (!isStuck) {
        interview.incrementExchangeCount()
      }

      const responseText = data.followUp || data.reframe || data.whatIf || ''
      setPhaseState({ status: 'aiResponse', text: responseText, isStuckResponse: isStuck })
    } catch {
      setPhaseState({ status: 'question' })
      setInputActive(true)
    }
  }, [phaseState.status, state, currentQ, interview])

  const handleAIResponseComplete = useCallback(() => {
    const currentExchangeCount = state.exchangeCount
    if (currentExchangeCount >= 3) {
      // Auto-advance at max exchanges
      advanceToNextQuestion()
    } else {
      setPhaseState({ status: 'depthChoice' })
    }
  }, [state.exchangeCount, advanceToNextQuestion])

  const handleGoDeeper = useCallback(() => {
    setPhaseState({ status: 'question' })
    setInputActive(true)
  }, [])

  const handleMoveForward = useCallback(() => {
    advanceToNextQuestion()
  }, [advanceToNextQuestion])

  const inputDisabled = phaseState.status !== 'question' || !inputActive

  // Screen warmth: interpolate from #0D0D0D (Q0) to #110B00 (Q9) over 9 questions
  const bgColors = [
    '#0D0D0D', '#0E0D0C', '#0E0C0B', '#0F0C0A', '#0F0B09',
    '#100B08', '#100B07', '#100A06', '#110A05', '#110B00',
  ]
  const warmBg = bgColors[Math.min(state.currentQuestion, 8)]

  return (
    <div style={{ background: warmBg, minHeight: '100vh', display: 'flex', transition: 'background 2s ease' }}>
      {/* Conversation area */}
      <div style={{
        flex: '1 1 65%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 2rem 6rem',
      }}>
        <ProgressSymbol completedQuestions={state.currentQuestion} />

        <div style={{ width: '100%', maxWidth: '40rem' }}>
          <QuestionDisplay
            question={currentQ}
            userName={state.userName}
            onInputActivated={() => {
              if (phaseState.status === 'question') setInputActive(true)
            }}
          />

          {phaseState.status === 'loading' && (
            <p style={{
              textAlign: 'center',
              color: 'var(--muted)',
              fontSize: '0.875rem',
              marginTop: '2rem',
              letterSpacing: '0.1em',
            }}>
              …
            </p>
          )}

          {phaseState.status === 'aiResponse' && (
            <AIResponse text={phaseState.text} onComplete={handleAIResponseComplete} />
          )}

          {phaseState.status === 'affirmation' && (
            <div style={{ maxWidth: '32rem', margin: '2rem auto', textAlign: 'center' }}>
              <p style={{
                fontFamily: 'var(--font-cormorant)',
                color: 'var(--cream)',
                fontSize: '1.2rem',
                lineHeight: 1.7,
                fontStyle: 'italic',
              }}>
                {AFFIRMATION}
              </p>
            </div>
          )}

          {phaseState.status === 'depthChoice' && (
            <DepthChoice onGoDeeper={handleGoDeeper} onMoveForward={handleMoveForward} />
          )}

          {(phaseState.status === 'question' || phaseState.status === 'loading') && (
            <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <VoiceInput disabled={inputDisabled} onAnswer={handleAnswer} />
              <TextInput disabled={inputDisabled} onAnswer={handleAnswer} />
            </div>
          )}
        </div>
      </div>

      {/* Document panel */}
      <div style={{ flex: '0 0 35%', minHeight: '100vh', position: 'sticky', top: 0 }}>
        <DocumentPanel documentFragments={state.documentFragments} />
      </div>
    </div>
  )
}
