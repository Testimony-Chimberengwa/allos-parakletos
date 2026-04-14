import { Chrome, Sparkles } from 'lucide-react'
import { Button } from './index'

interface AuthScreenProps {
  onGoogleSignIn: () => Promise<void>
  isSigningIn: boolean
}

function AuthScreen({ onGoogleSignIn, isSigningIn }: AuthScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-container/20 via-surface to-primary-container/20 px-4 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl border border-on-surface/10 bg-surface-container p-8 shadow-ambient space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <h1 className="display font-display">Welcome to Allos Parakletos</h1>
          <p className="text-on-surface/70">
            Continue with Google to sync your personal Bible learning progress securely.
          </p>
        </div>

        <Button
          size="lg"
          className="w-full flex items-center justify-center gap-2"
          onClick={onGoogleSignIn}
          disabled={isSigningIn}
        >
          <Chrome className="w-5 h-5" />
          {isSigningIn ? 'Signing in...' : 'Continue with Google'}
        </Button>

        <p className="text-xs text-on-surface/60 text-center">
          Google SSO is the only sign-in method enabled in this app.
        </p>
      </div>
    </div>
  )
}

export default AuthScreen
