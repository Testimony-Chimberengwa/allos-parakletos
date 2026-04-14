export interface BibleLanguage {
  id?: string
  name?: string
  nameLocal?: string
  script?: string
  scriptDirection?: string
}

// Bible Data Types
export interface BibleVersion {
  id: string
  abbreviation: string
  language: string | BibleLanguage
  name: string
  nameLocal: string
  description: string
  descriptionLocal: string
}

export interface Chapter {
  id: string
  bibleId: string
  number: string | number
  bookId: string
  content?: string
}

export interface Verse {
  id: string
  orgId: string
  bibleId: string
  bookId: string
  chapter: number
  verse: number
  text: string
}

export interface Book {
  id: string
  bibleId: string
  abbreviation: string
  name: string
  nameLong: string
  regexPattern: string
}

// User Data Types
export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  streak: number
  totalXP: number
  level: number
  joinedDate: Date
}

export interface ReadingPlan {
  id: string
  title: string
  description: string
  startDate: Date
  endDate?: Date
  bibleVersionId: string
  dailyReadings: DailyReading[]
  isActive: boolean
  completed: boolean
}

export interface DailyReading {
  date: Date
  bookId: string
  chapter: number
  startVerse?: number
  endVerse?: number
  completed: boolean
}

// Quiz Types
export interface Quiz {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  questions: QuizQuestion[]
  timeLimit?: number
  passingScore: number
}

export interface QuizQuestion {
  id: string
  text: string
  type: 'multiple-choice' | 'true-false' | 'fill-blank'
  options: string[]
  correctAnswer: string | number
  explanation: string
  relatedVerse?: string
}

export interface QuizResult {
  id: string
  userId: string
  quizId: string
  score: number
  answers: Record<string, string | number>
  completedAt: Date
  timeSpent: number
}

// Prayer Points
export interface PrayerPoint {
  id: string
  title: string
  description: string
  category: string
  verses: string[]
  createdAt: Date
}

// Study Materials
export interface StudyMaterial {
  id: string
  title: string
  content: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  relatedVerses: string[]
  createdAt: Date
  updatedAt: Date
}

// Sermon
export interface Sermon {
  id: string
  title: string
  preacher: string
  date: Date
  mainVerse: string
  outline: string
  keyPoints: string[]
  downloadUrl?: string
}

// Chat/Assistant
export interface ChatMessage {
  id: string
  user: 'user' | 'assistant'
  content: string
  timestamp: Date
  relatedVerses?: string[]
}
