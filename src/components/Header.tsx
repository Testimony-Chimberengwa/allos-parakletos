import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { useAppStore } from '../store'
import { signOutUser } from '../services/authService'
import Button from './Button'

function Header() {
  const user = useAppStore((state) => state.user)

  return (
    <header className="bg-gradient-to-r from-primary to-primary-container shadow-ambient">
      <div className="container mx-auto px-4 py-4 max-w-6xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-on-primary/10">
            <BookOpen className="w-6 h-6 text-on-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-primary font-display">Allos Parakletos</h1>
            <p className="text-on-primary/80 text-xs font-body">Bible Learning Made Easy</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-on-primary font-semibold text-sm font-body">{user.name}</p>
                <p className="text-on-primary/70 text-xs">Level {user.level}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-on-primary/20 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                ) : (
                  <span className="text-on-primary font-bold">{user.name[0]}</span>
                )}
              </div>
              <Button variant="tertiary" size="sm" onClick={() => void signOutUser()}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
