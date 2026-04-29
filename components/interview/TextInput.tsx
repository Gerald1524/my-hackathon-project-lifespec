'use client'

import { useState, useRef, useEffect } from 'react'

interface Props {
  disabled: boolean
  onAnswer: (text: string) => void
}

export function TextInput({ disabled, onAnswer }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [value])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    setValue('')
    onAnswer(trimmed)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '32rem' }}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
          }
        }}
        disabled={disabled}
        placeholder={disabled ? '' : 'Type your answer…'}
        rows={1}
        style={{
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${disabled ? 'var(--muted)' : 'var(--gold)'}`,
          color: 'var(--cream)',
          fontFamily: 'var(--font-cormorant)',
          fontSize: '1.1rem',
          lineHeight: 1.6,
          padding: '0.5rem 0',
          resize: 'none',
          outline: 'none',
          width: '100%',
          overflowY: 'hidden',
          opacity: disabled ? 0.3 : 1,
        }}
      />
      {value.trim() && !disabled && (
        <button
          onClick={handleSubmit}
          style={{
            alignSelf: 'flex-end',
            background: 'none',
            border: '1px solid var(--gold)',
            color: 'var(--gold)',
            padding: '0.4rem 1.25rem',
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          Send
        </button>
      )}
    </div>
  )
}
