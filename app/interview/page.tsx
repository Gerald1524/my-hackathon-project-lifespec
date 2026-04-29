'use client'

import { useInterviewState } from '@/hooks/useInterviewState'
import { useBeforeUnload } from '@/hooks/useBeforeUnload'
import { NameInput } from '@/components/onboarding/NameInput'
import { AccountabilityMeter } from '@/components/onboarding/AccountabilityMeter'
import { CommitmentScreen } from '@/components/onboarding/CommitmentScreen'
import { WelcomeMoment } from '@/components/onboarding/WelcomeMoment'
import { QuestionDisplay } from '@/components/interview/QuestionDisplay'
import { questions } from '@/lib/questions'

export default function InterviewPage() {
  const interview = useInterviewState()
  const { state } = interview

  const beforeUnloadActive = ['interview', 'reveal', 'complete'].includes(state.phase)
  useBeforeUnload(beforeUnloadActive)

  if (state.phase === 'name') {
    return <NameInput onSubmit={interview.submitName} />
  }

  if (state.phase === 'welcome') {
    return <WelcomeMoment userName={state.userName} onComplete={interview.onWelcomeComplete} />
  }

  if (state.phase === 'accountability') {
    return <AccountabilityMeter onSelect={interview.selectMode} />
  }

  if (state.phase === 'commitment') {
    return <CommitmentScreen onBegin={interview.beginInterview} />
  }

  if (state.phase === 'interview') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4" style={{ background: 'var(--bg)' }}>
        <QuestionDisplay
          question={questions[state.currentQuestion]}
          userName={state.userName}
          onInputActivated={() => {/* input activation in step 6 */}}
        />
        <p style={{ color: 'var(--muted)', marginTop: '2rem', fontSize: '0.875rem' }}>
          Q{state.currentQuestion + 1} / 9 — Input coming in step 6
        </p>
      </div>
    )
  }

  // reveal / complete — stubs for now
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg)' }}>
      <p style={{ color: 'var(--cream)', fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem' }}>
        Phase: {state.phase} — coming in later steps.
      </p>
    </div>
  )
}
