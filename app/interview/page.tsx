'use client'

import { useInterviewState } from '@/hooks/useInterviewState'
import { useBeforeUnload } from '@/hooks/useBeforeUnload'
import { NameInput } from '@/components/onboarding/NameInput'
import { AccountabilityMeter } from '@/components/onboarding/AccountabilityMeter'
import { CommitmentScreen } from '@/components/onboarding/CommitmentScreen'

export default function InterviewPage() {
  const interview = useInterviewState()
  const { state } = interview

  const beforeUnloadActive = ['interview', 'reveal', 'complete'].includes(state.phase)
  useBeforeUnload(beforeUnloadActive)

  if (state.phase === 'name') {
    return <NameInput onSubmit={interview.submitName} />
  }

  if (state.phase === 'welcome') {
    // WelcomeMoment will be built in item 5
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg)' }}>
        <p style={{ color: 'var(--cream)', fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem' }}>
          Welcome, {state.userName}. (Audio coming in step 5.)
        </p>
        <button
          onClick={interview.onWelcomeComplete}
          style={{ position: 'absolute', bottom: '2rem', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Continue →
        </button>
      </div>
    )
  }

  if (state.phase === 'accountability') {
    return <AccountabilityMeter onSelect={interview.selectMode} />
  }

  if (state.phase === 'commitment') {
    return <CommitmentScreen onBegin={interview.beginInterview} />
  }

  // interview / reveal / complete — stubs for now
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg)' }}>
      <p style={{ color: 'var(--cream)', fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem' }}>
        Phase: {state.phase} — coming in later steps.
      </p>
    </div>
  )
}
