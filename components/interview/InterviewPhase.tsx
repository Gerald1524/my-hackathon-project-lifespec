'use client'

import { useState, useCallback } from 'react'
import { QuestionDisplay } from '@/components/interview/QuestionDisplay'
import { VoiceInput } from '@/components/interview/VoiceInput'
import { TextInput } from '@/components/interview/TextInput'
import { AIResponse } from '@/components/interview/AIResponse'
import { questions } from '@/lib/questions'
import { useInterviewState } from '@/hooks/useInterviewState'

const STUCK_PHRASES = [
  "i don't know", "i dont know", "not sure", "can't think", "cant think",
  "nothing comes to mind", "i have no idea", "no idea", "i'm not sure",
  "im not sure", "i don't have an answer", "i cant answer"
]
const SHORT_DEFLECTIONS = ["fine", "good", "okay", "ok", "i guess", "maybe", "sure", "yeah", "idk"]

type Props = {
  interview: ReturnType<typeof useInterviewState>
}

export function InterviewPhase({ interview }: Props) {
  const { state } = interview
  const [inputActive, setInputActive] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  const currentQ = questions[state.currentQuestion]

  const detectTask = (answer: string): 'followup' | 'reframe' => {
    const lower = answer.toLowerCase()
    if (STUCK_PHRASES.some(p => lower.includes(p))) return 'reframe'
    const words = lower.trim().split(/\s+/)
    if (words.length < 5 && SHORT_DEFLECTIONS.some(p => lower.includes(p))) return 'reframe'
    return 'followup'
  }

  const handleAnswer = useCallback(async (answer: string) => {
    if (!answer.trim() || isLoadingAI) return

    const task = detectTask(answer)
    setIsLoadingAI(true)
    setInputActive(false)

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task,
          userName: state.userName,
          mode: state.accountabilityMode,
          questionIndex: state.currentQuestion,
          questionText: currentQ.text,
          answer,
          priorAnswers: [],
        }),
      })
      const data = await res.json()

      if (data.documentFragment) {
        interview.addDocumentFragment(data.documentFragment.section, data.documentFragment.text)
      }

      const responseText = data.followUp || data.reframe || data.whatIf || ''
      setAiResponse(responseText)
    } catch {
      setAiResponse(null)
      setInputActive(true)
    } finally {
      setIsLoadingAI(false)
    }
  }, [state.userName, state.accountabilityMode, state.currentQuestion, currentQ.text, isLoadingAI, interview])

  const handleContinue = useCallback(() => {
    setAiResponse(null)
    setInputActive(false)
    interview.advanceQuestion()
  }, [interview])

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4"
      style={{ background: 'var(--bg)', paddingTop: '2rem', paddingBottom: '6rem' }}
    >
      <div style={{ width: '100%', maxWidth: '40rem' }}>
        <QuestionDisplay
          question={currentQ}
          userName={state.userName}
          onInputActivated={() => setInputActive(true)}
        />

        {isLoadingAI && (
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

        {aiResponse && !isLoadingAI && (
          <AIResponse text={aiResponse} onComplete={handleContinue} />
        )}

        {!aiResponse && !isLoadingAI && (
          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <VoiceInput
              disabled={!inputActive}
              onAnswer={handleAnswer}
            />
            <TextInput
              disabled={!inputActive}
              onAnswer={handleAnswer}
            />
          </div>
        )}
      </div>
    </div>
  )
}
