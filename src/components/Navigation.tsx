import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, CheckSquare, Zap, Users, BookMarked, Mic2, Hand, MessageSquare, User } from 'lucide-react'

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/bible', label: 'Bible', icon: BookOpen },
  { path: '/reading-plans', label: 'Plans', icon: CheckSquare },
  { path: '/quizzes', label: 'Quizzes', icon: Zap },
  { path: '/children', label: 'Kids', icon: Users },
  { path: '/study', label: 'Study', icon: BookMarked },
  { path: '/sermons', label: 'Sermons', icon: Mic2 },
  { path: '/prayer', label: 'Prayer', icon: Hand },
  { path: '/assistant', label: 'Ask', icon: MessageSquare },
  { path: '/profile', label: 'Profile', icon: User },
]

function Navigation() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 glass-effect border-t border-outline-variant/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex overflow-x-auto justify-center">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center px-4 py-3 transition-colors ${
                  isActive
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface/60 hover:text-on-surface'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-semibold mt-1 font-display">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
