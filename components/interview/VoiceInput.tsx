'use client'

import { useVoiceInput } from '@/hooks/useVoiceInput'

interface Props {
  disabled: boolean
  onAnswer: (transcript: string) => void
}

export function VoiceInput({ disabled, onAnswer }: Props) {
  const { isVoiceEnabled, isRecording, liveTranscript, startRecording, stopRecording } = useVoiceInput({
    onFinalTranscript: onAnswer,
  })

  if (!isVoiceEnabled) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
        style={{
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          border: `2px solid ${isRecording ? 'var(--gold)' : 'var(--muted)'}`,
          background: isRecording ? 'rgba(201,168,76,0.15)' : 'transparent',
          color: isRecording ? 'var(--gold)' : 'var(--muted)',
          fontSize: '1.25rem',
          cursor: disabled ? 'default' : 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? '■' : '🎙'}
      </button>

      {isRecording && liveTranscript && (
        <p style={{
          color: 'var(--cream)',
          fontFamily: 'var(--font-cormorant)',
          fontSize: '1.1rem',
          maxWidth: '32rem',
          textAlign: 'center',
          fontStyle: 'italic',
          opacity: 0.8,
        }}>
          {liveTranscript}
        </p>
      )}

      {isRecording && (
        <button
          onClick={stopRecording}
          style={{
            background: 'none',
            border: '1px solid var(--muted)',
            color: 'var(--muted)',
            padding: '0.4rem 1.25rem',
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          Done
        </button>
      )}
    </div>
  )
}
