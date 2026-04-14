import { useEffect } from 'react'
import { useAppStore } from '../store'
import { bibleService } from '../services/bibleService'
import { Card, Button, ExperienceBar, StreakBadge } from '../components'
import { BookOpen, Zap, Users, BookMarked, Mic2, Hand } from 'lucide-react'

function formatLanguageLabel(language: unknown): string {
  if (typeof language === 'string' && language.trim().length > 0) {
    return language.toUpperCase()
  }

  if (language && typeof language === 'object') {
    const value = language as { name?: string; nameLocal?: string; id?: string }
    const label = value.name || value.nameLocal || value.id
    if (label && label.trim().length > 0) {
      return label.toUpperCase()
    }
  }

  return 'UNKNOWN'
}

function Home() {
  const { bibleVersions, setBibleVersions, user, setUser } = useAppStore()

  useEffect(() => {
    // Initialize user if not exists
    if (!user) {
      setUser({
        id: '1',
        name: 'Student',
        email: 'student@allosparakletos.com',
        streak: 7,
        totalXP: 1250,
        level: 3,
        joinedDate: new Date('2024-01-15'),
      })
    }

    // Load Bible versions
    if (bibleVersions.length === 0) {
      bibleService
        .getPreferredVersions()
        .then((versions) => {
          setBibleVersions(versions)
        })
        .catch((error) => console.error('Failed to load Bible versions:', error))
    }
  }, [])

  const features = [
    {
      icon: BookOpen,
      title: 'Bible Reader',
      description: 'Read any book of the Bible in multiple versions',
      link: '/bible',
    },
    {
      icon: Zap,
      title: 'Quizzes',
      description: 'Test your knowledge with engaging quizzes',
      link: '/quizzes',
    },
    {
      icon: Users,
      title: "Children's Zone",
      description: 'Fun Bible learning for kids',
      link: '/children',
    },
    {
      icon: BookMarked,
      title: 'Study Materials',
      description: 'Deep dive into Bible study resources',
      link: '/study',
    },
    {
      icon: Mic2,
      title: 'Sermons',
      description: 'Curated sermons and teachings',
      link: '/sermons',
    },
    {
      icon: Hand,
      title: 'Prayer Points',
      description: 'Daily prayer guides and intercession',
      link: '/prayer',
    },
  ]

  return (
    <div className="pb-24 space-y-8">
      {/* Welcome Section */}
      <Card elevated className="bg-gradient-to-br from-primary to-primary-container text-on-primary">
        <div className="space-y-4">
          <h1 className="display font-display">Welcome Back, {user?.name}!</h1>
          <p className="body-lg font-body">Continue your Bible learning journey today</p>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card elevated>{user && <ExperienceBar current={user.totalXP % 500} max={500} level={user.level} />}</Card>
        <Card elevated>{user && <StreakBadge count={user.streak} />}</Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button size="lg" className="w-full">
          Continue Reading
        </Button>
        <Button variant="secondary" size="lg" className="w-full">
          Today's Quiz
        </Button>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="headline font-display mb-4 text-2xl">Explore Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-secondary-container/20 flex items-center justify-center group-hover:bg-secondary-container/40 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="title-lg font-display">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-on-surface/70">{feature.description}</p>
                  <Button variant="tertiary" size="sm" className="mt-2">
                    Explore →
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Bible Versions */}
      {bibleVersions.length > 0 && (
        <div>
          <h2 className="headline font-display mb-4 text-2xl">Available Bible Versions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bibleVersions.slice(0, 6).map((version) => (
              <Card key={version.id} className="cursor-pointer hover:bg-surface-container-low transition-colors">
                <div>
                  <p className="label text-primary mb-2">{formatLanguageLabel(version.language)}</p>
                  <p className="title-md font-display">{version.abbreviation}</p>
                  <p className="text-xs text-on-surface/60 mt-1">{version.name.substring(0, 40)}...</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
