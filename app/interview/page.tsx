'use client'

import { useInterviewState } from '@/hooks/useInterviewState'
import { useBeforeUnload } from '@/hooks/useBeforeUnload'
import { NameInput } from '@/components/onboarding/NameInput'
import { AccountabilityMeter } from '@/components/onboarding/AccountabilityMeter'
import { CommitmentScreen } from '@/components/onboarding/CommitmentScreen'
import { WelcomeMoment } from '@/components/onboarding/WelcomeMoment'
import { InterviewPhase } from '@/components/interview/InterviewPhase'
import { DocumentReveal } from '@/components/document/DocumentReveal'

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
    return <InterviewPhase interview={interview} />
  }

  if (state.phase === 'reveal') {
    return (
      <DocumentReveal
        userName={state.userName}
        accountabilityMode={state.accountabilityMode}
        answers={state.answers}
        onComplete={(doc) => {
          interview.setDocument(doc)
          interview.completeReveal()
        }}
      />
    )
  }

  if (state.phase === 'complete') {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg)' }}>
        <p style={{ color: 'var(--cream)', fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem', textAlign: 'center', maxWidth: '32rem' }}>
          Your document is ready. (Complete page coming in step 10.)
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg)' }}>
      <p style={{ color: 'var(--cream)', fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem' }}>
        Phase: {state.phase} — coming in later steps.
      </p>
    </div>
  )
}
