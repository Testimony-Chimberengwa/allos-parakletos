import { Card, Button } from '../components'
import { Hand } from 'lucide-react'

function PrayerPoints() {
  const prayerPoints = [
    {
      id: '1',
      title: 'Thanksgiving & Gratitude',
      description: 'Give thanks for God\'s blessings and protection',
      verses: ['Philippians 4:6', '1 Thessalonians 5:18'],
      category: 'Daily',
    },
    {
      id: '2',
      title: 'Spiritual Growth',
      description: 'Pray for deeper faith and understanding of Scripture',
      verses: ['Ephesians 1:17-19', '2 Peter 3:18'],
      category: 'Personal',
    },
    {
      id: '3',
      title: 'Missionary Work',
      description: 'Intercede for missionaries and evangelism efforts',
      verses: ['Matthew 9:37-38', '2 Corinthians 9:14'],
      category: 'Global',
    },
    {
      id: '4',
      title: 'Healing & Comfort',
      description: 'Prayer for those facing illness and hardship',
      verses: ['James 5:14-15', 'Psalm 23'],
      category: 'Compassion',
    },
  ]

  const categoryColor = {
    Daily: 'bg-tertiary/20 text-tertiary',
    Personal: 'bg-primary/20 text-primary',
    Global: 'bg-secondary-container/40 text-on-secondary-container',
    Compassion: 'bg-tertiary/30 text-tertiary',
  }

  return (
    <div className="pb-24 space-y-6">
      <div>
        <h1 className="display font-display mb-2 flex items-center gap-2">
          <Hand className="w-8 h-8" /> Prayer Points
        </h1>
        <p className="text-lg text-on-surface/70">Daily intercession guides</p>
      </div>

      <Button size="lg" className="w-full">
        Generate Prayer Points
      </Button>

      <div className="space-y-4">
        {prayerPoints.map((prayer) => (
          <Card key={prayer.id} className="hover:shadow-lg transition-shadow">
            <div className="space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="title-lg font-display flex-1">{prayer.title}</h3>
                  <span className={`label px-2 py-1 rounded-md whitespace-nowrap ${categoryColor[prayer.category as keyof typeof categoryColor]}`}>
                    {prayer.category}
                  </span>
                </div>
                <p className="text-sm text-on-surface/70 mt-2">{prayer.description}</p>
              </div>

              <div>
                <p className="label text-primary mb-1">Related Verses:</p>
                <div className="flex flex-wrap gap-2">
                  {prayer.verses.map((verse) => (
                    <span key={verse} className="bg-surface-container-low px-2 py-1 rounded-md text-xs">
                      {verse}
                    </span>
                  ))}
                </div>
              </div>

              <Button variant="tertiary" size="sm" className="w-full">
                Pray Now
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PrayerPoints
