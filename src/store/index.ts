import { create } from 'zustand'
import type { BibleVersion, UserProfile, ReadingPlan, Quiz, QuizResult } from '../types'

interface AppState {
  // Bible state
  bibleVersions: BibleVersion[]
  selectedBibleVersion: BibleVersion | null
  setBibleVersions: (versions: BibleVersion[]) => void
  setSelectedBibleVersion: (version: BibleVersion) => void

  // User state
  user: UserProfile | null
  setUser: (user: UserProfile) => void
  updateUserXP: (xp: number) => void
  updateUserStreak: (streak: number) => void

  // Reading plans
  readingPlans: ReadingPlan[]
  setReadingPlans: (plans: ReadingPlan[]) => void
  addReadingPlan: (plan: ReadingPlan) => void

  // Quizzes
  quizzes: Quiz[]
  setQuizzes: (quizzes: Quiz[]) => void
  quizResults: QuizResult[]
  addQuizResult: (result: QuizResult) => void

  // UI state
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Bible state
  bibleVersions: [],
  selectedBibleVersion: null,
  setBibleVersions: (versions) => set({ bibleVersions: versions }),
  setSelectedBibleVersion: (version) => set({ selectedBibleVersion: version }),

  // User state
  user: null,
  setUser: (user) => set({ user }),
  updateUserXP: (xp) =>
    set((state) => ({
      user: state.user ? { ...state.user, totalXP: state.user.totalXP + xp } : null,
    })),
  updateUserStreak: (streak) =>
    set((state) => ({
      user: state.user ? { ...state.user, streak } : null,
    })),

  // Reading plans
  readingPlans: [],
  setReadingPlans: (plans) => set({ readingPlans: plans }),
  addReadingPlan: (plan) =>
    set((state) => ({
      readingPlans: [...state.readingPlans, plan],
    })),

  // Quizzes
  quizzes: [],
  setQuizzes: (quizzes) => set({ quizzes }),
  quizResults: [],
  addQuizResult: (result) =>
    set((state) => ({
      quizResults: [...state.quizResults, result],
    })),

  // UI state
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setError: (error) => set({ error }),
}))
