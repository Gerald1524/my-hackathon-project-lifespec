export type Phase =
  | 'name' | 'welcome' | 'accountability' | 'commitment'
  | 'interview' | 'reveal' | 'complete'

export type AccountabilityMode = 'gentle' | 'direct' | 'accountable'

export type DocumentSection =
  | 'whoYouAre' | 'whereYouAre' | 'whatIsInTheWay'
  | 'whatYouAreHereFor' | 'yourNextSteps' | 'yourDeclaration'

export interface Answer {
  questionIndex: number
  questionName: string
  questionText: string
  userAnswer: string
  followUp?: string
  userFollowUp?: string
  documentFragment?: {
    section: DocumentSection
    text: string
  }
  stuckDetected: boolean
}

export interface DocumentSections {
  name: string
  whoYouAre: string
  whereYouAre: string
  whatIsInTheWay: string
  whatYouAreHereFor: string
  yourNextSteps: string
  yourDeclaration: string
  sevenDayIntention: string
  openInvitation: string
}

export interface SessionState {
  phase: Phase
  userName: string
  accountabilityMode: AccountabilityMode
  currentQuestion: number
  exchangeCount: number
  stuckCount: number
  answers: Answer[]
  documentFragments: Partial<Record<DocumentSection, string[]>>
  document: DocumentSections | null
  documentId: string | null
  documentUrl: string | null
  isVoiceEnabled: boolean
  isPlaying: boolean
  isLoading: boolean
}
