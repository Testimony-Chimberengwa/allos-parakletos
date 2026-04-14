import { Card, Button, ExperienceBar } from '../components'
import { useAppStore } from '../store'
import { User, Mail, Award, Zap, Calendar } from 'lucide-react'

function Profile() {
  const user = useAppStore((state) => state.user)

  return (
    <div className="pb-24 space-y-6">
      <div>
        <h1 className="display font-display mb-2">My Profile</h1>
        <p className="text-lg text-on-surface/70">View your learning progress</p>
      </div>

      {user && (
        <>
          {/* Profile Header */}
          <Card
            elevated
            className="bg-gradient-to-r from-primary/10 to-primary-container/10 border-l-4 border-primary"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="title-lg font-display">{user.name}</h2>
                <p className="text-sm text-on-surface/70">{user.email}</p>
                <p className="text-xs text-on-surface/50 mt-1">Member since {new Date(user.joinedDate).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center space-y-2">
              <Zap className="w-6 h-6 text-secondary-container mx-auto" />
              <p className="label text-on-surface/60">Total XP</p>
              <p className="display text-primary">{user.totalXP}</p>
            </Card>
            <Card className="text-center space-y-2">
              <Award className="w-6 h-6 text-primary mx-auto" />
              <p className="label text-on-surface/60">Level</p>
              <p className="display text-primary">{user.level}</p>
            </Card>
            <Card className="text-center space-y-2">
              <Calendar className="w-6 h-6 text-tertiary mx-auto" />
              <p className="label text-on-surface/60">Streak</p>
              <p className="display text-tertiary">{user.streak} days</p>
            </Card>
          </div>

          {/* Experience Bar */}
          <Card elevated>
            <ExperienceBar
              current={user.totalXP % 500}
              max={500}
              level={user.level}
            />
          </Card>

          {/* Account Settings */}
          <div className="space-y-4">
            <h3 className="title-lg font-display">Account Settings</h3>

            <Card>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="label text-primary">Email</p>
                      <p className="text-sm">{user.email}</p>
                    </div>
                  </div>
                  <Button variant="tertiary" size="sm">
                    Change
                  </Button>
                </div>
              </div>
            </Card>

            <Card>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="label text-primary">Preferred Bible Version</p>
                    <p className="text-sm">King James Version (KJV)</p>
                  </div>
                  <Button variant="tertiary" size="sm">
                    Change
                  </Button>
                </div>
              </div>
            </Card>

            <Card>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="label text-primary">Daily Reminders</p>
                    <p className="text-sm">Enabled at 8:00 AM</p>
                  </div>
                  <Button variant="tertiary" size="sm">
                    Change
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Danger Zone */}
          <div className="space-y-4">
            <h3 className="title-lg font-display">Account Management</h3>
            <Button variant="secondary" size="lg" className="w-full">
              Logout
            </Button>
            <Button variant="secondary" size="lg" className="w-full opacity-50">
              Delete Account
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default Profile
