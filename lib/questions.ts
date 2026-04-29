export interface Question {
  index: number
  name: string
  text: string
  reframeHints: string[]
}

export const questions: Question[] = [
  {
    index: 0,
    name: 'The Aliveness Question',
    text: 'When in your life did you feel most like yourself? Not happy necessarily. Just most like you.',
    reframeHints: [
      'Think about a specific moment, not a general feeling',
      'What were you doing? Who was there?',
      'When did time seem to disappear?',
    ],
  },
  {
    index: 1,
    name: 'The Strength Question',
    text: 'What do people come to you for that you almost take for granted because it comes so naturally?',
    reframeHints: [
      'What do friends or colleagues ask your advice on?',
      'What feels effortless to you that others struggle with?',
      'What would disappear from the world if you were not in it?',
    ],
  },
  {
    index: 2,
    name: 'The Mirror Question',
    text: 'Where in your life right now are you showing up as someone you don\'t fully recognize?',
    reframeHints: [
      'Where are you playing small?',
      'What role do you play that doesn\'t feel like you?',
      'Where do you say yes when you mean no?',
    ],
  },
  {
    index: 3,
    name: 'The Resistance Question',
    text: 'What is the thing you keep almost doing but pull back from? What is the story you tell yourself about why?',
    reframeHints: [
      'What idea keeps returning to you?',
      'What would you do if you knew it would work?',
      'What are you protecting yourself from by not doing it?',
    ],
  },
  {
    index: 4,
    name: 'The Legacy Question',
    text: 'Someone who loves you is describing the difference you made in their life. What do you want them to say?',
    reframeHints: [
      'Not what you want to be remembered for — what difference do you want to have made?',
      'What would make your life feel complete?',
      'Imagine the eulogy — what matters most in it?',
    ],
  },
  {
    index: 5,
    name: 'The Season Question',
    text: 'If this chapter of your life had a title, what would it be? What would you want the next chapter called?',
    reframeHints: [
      'What is the dominant theme of your life right now?',
      'What are you in the middle of?',
      'What needs to end so the next chapter can begin?',
    ],
  },
  {
    index: 6,
    name: 'The Next Step Question',
    text: 'Not the five-year plan. Just the next honest step — what is one thing you need to do or stop doing right now?',
    reframeHints: [
      'If you knew no one was watching, what would you do?',
      'What would you advise your best friend in your situation?',
      'What decision have you already made but haven\'t acted on?',
    ],
  },
  {
    index: 7,
    name: 'The Bridge Question',
    text: 'If the person you just described walked out the door and started living fully — what is the first thing the world would notice?',
    reframeHints: [
      'What changes in how you show up with people?',
      'What stops being part of your life?',
      'What becomes possible that isn\'t now?',
    ],
  },
  {
    index: 8,
    name: 'The Declaration',
    text: 'You have answered eight questions. You have been honest. Now speak directly — who are you, and what are you here to do?',
    reframeHints: [
      'Not who you were — who you are right now',
      'Speak as if you already know the answer',
      'What would you say if you were not afraid?',
    ],
  },
]
