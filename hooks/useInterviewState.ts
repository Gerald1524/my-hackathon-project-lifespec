'use client'

import { useState, useCallback } from 'react'
import { Phase, AccountabilityMode, SessionState, DocumentSection, DocumentSections } from '@/types'

const initialState: SessionState = {
  phase: 'name',
  userName: '',
  accountabilityMode: 'gentle',
  currentQuestion: 0,
  exchangeCount: 0,
  stuckCount: 0,
  answers: [],
  documentFragments: {},
  document: null,
  documentId: null,
  documentUrl: null,
  isVoiceEnabled: false,
  isPlaying: false,
  isLoading: false,
}

export function useInterviewState() {
  const [state, setState] = useState<SessionState>(initialState)

  const setPhase = useCallback((phase: Phase) => {
    setState(s => ({ ...s, phase }))
  }, [])

  const setUserName = useCallback((userName: string) => {
    setState(s => ({ ...s, userName }))
  }, [])

  const setAccountabilityMode = useCallback((accountabilityMode: AccountabilityMode) => {
    setState(s => ({ ...s, accountabilityMode }))
  }, [])

  const submitName = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setState(s => ({ ...s, userName: trimmed, phase: 'welcome' }))
  }, [])

  const onWelcomeComplete = useCallback(() => {
    setState(s => ({ ...s, phase: 'accountability' }))
  }, [])

  const selectMode = useCallback((mode: AccountabilityMode) => {
    setState(s => ({ ...s, accountabilityMode: mode, phase: 'commitment' }))
  }, [])

  const beginInterview = useCallback(() => {
    setState(s => ({ ...s, phase: 'interview' }))
  }, [])

  const addDocumentFragment = useCallback((section: DocumentSection, text: string) => {
    setState(s => ({
      ...s,
      documentFragments: {
        ...s.documentFragments,
        [section]: [...(s.documentFragments[section] ?? []), text],
      },
    }))
  }, [])

  const advanceQuestion = useCallback(() => {
    setState(s => {
      const next = s.currentQuestion + 1
      if (next >= 9) {
        return { ...s, phase: 'reveal', currentQuestion: next, exchangeCount: 0, stuckCount: 0 }
      }
      return { ...s, currentQuestion: next, exchangeCount: 0, stuckCount: 0 }
    })
  }, [])

  const incrementExchangeCount = useCallback(() => {
    setState(s => ({ ...s, exchangeCount: s.exchangeCount + 1 }))
  }, [])

  const incrementStuckCount = useCallback(() => {
    setState(s => ({ ...s, stuckCount: s.stuckCount + 1 }))
  }, [])

  const setIsPlaying = useCallback((isPlaying: boolean) => {
    setState(s => ({ ...s, isPlaying }))
  }, [])

  const setIsLoading = useCallback((isLoading: boolean) => {
    setState(s => ({ ...s, isLoading }))
  }, [])

  const completeReveal = useCallback(() => {
    setState(s => ({ ...s, phase: 'complete' }))
  }, [])

  const setDocument = useCallback((document: DocumentSections) => {
    setState(s => ({ ...s, document }))
  }, [])

  const setDocumentId = useCallback((documentId: string) => {
    setState(s => ({ ...s, documentId }))
  }, [])

  const setDocumentUrl = useCallback((documentUrl: string) => {
    setState(s => ({ ...s, documentUrl }))
  }, [])

  return {
    state,
    submitName,
    onWelcomeComplete,
    selectMode,
    beginInterview,
    addDocumentFragment,
    advanceQuestion,
    incrementExchangeCount,
    incrementStuckCount,
    setIsPlaying,
    setIsLoading,
    setPhase,
    setUserName,
    setAccountabilityMode,
    completeReveal,
    setDocument,
    setDocumentId,
    setDocumentUrl,
  }
}
