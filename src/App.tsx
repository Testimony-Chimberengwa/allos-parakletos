import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
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

function App() {
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
