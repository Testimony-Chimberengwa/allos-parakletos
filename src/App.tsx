import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import Layout from './components/Layout'
import AuthScreen from './components/AuthScreen'
import Home from './pages/Home'
import BibleReader from './pages/BibleReader'
import ReadingPlans from './pages/ReadingPlans'
import Quizzes from './pages/Quizzes'
import ChildrenZone from './pages/ChildrenZone'
import StudyMaterials from './pages/StudyMaterials'
import SermonPlanner from './pages/SermonPlanner'
import PrayerPoints from './pages/PrayerPoints'
import BibleAssistant from './pages/BibleAssistant'
import Profile from './pages/Profile'
import { useAppStore } from './store'
import { onAuthStateChangedListener, signInWithGoogle } from './services/authService'
import { loadOrCreateUserProfile, saveUserProfile } from './services/userDataService'

function App() {
  const user = useAppStore((state) => state.user)
  const setUser = useAppStore((state) => state.setUser)
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [isSigningIn, setIsSigningIn] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (authUser) => {
      setFirebaseUser(authUser)

      if (!authUser) {
        setUser(null)
        setIsBootstrapping(false)
        return
      }

      try {
        const profile = await loadOrCreateUserProfile(authUser)
        setUser(profile)
      } catch (error) {
        console.error('Failed to load user profile:', error)
        setUser(null)
      } finally {
        setIsBootstrapping(false)
      }
    })

    return () => unsubscribe()
  }, [setUser])

  useEffect(() => {
    if (!firebaseUser || !user || isBootstrapping) {
      return
    }

    void saveUserProfile(firebaseUser.uid, user)
  }, [firebaseUser, user, isBootstrapping])

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true)
    try {
      await signInWithGoogle()
    } finally {
      setIsSigningIn(false)
    }
  }

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="text-center space-y-2">
          <p className="headline font-display">Preparing your study space...</p>
          <p className="text-on-surface/70">Loading your saved progress.</p>
        </div>
      </div>
    )
  }

  if (!firebaseUser || !user) {
    return <AuthScreen onGoogleSignIn={handleGoogleSignIn} isSigningIn={isSigningIn} />
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bible" element={<BibleReader />} />
          <Route path="/reading-plans" element={<ReadingPlans />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/children" element={<ChildrenZone />} />
          <Route path="/study" element={<StudyMaterials />} />
          <Route path="/sermons" element={<SermonPlanner />} />
          <Route path="/prayer" element={<PrayerPoints />} />
          <Route path="/assistant" element={<BibleAssistant />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
