import { Card, Button } from '../components'
import { Mic2, Download } from 'lucide-react'

function SermonPlanner() {
  const sermons = [
    {
      id: '1',
      title: 'The Resurrection Power',
      preacher: 'Pastor John',
      mainVerse: 'Romans 6:9',
      date: '2024-04-07',
      hasDownload: true,
    },
    {
      id: '2',
      title: 'Faith in the Storm',
      preacher: 'Pastor Sarah',
      mainVerse: 'Mark 4:35-41',
      date: '2024-03-31',
      hasDownload: true,
    },
    {
      id: '3',
      title: 'Living in Victory',
      preacher: 'Pastor Michael',
      mainVerse: '1 John 5:4',
      date: '2024-03-24',
      hasDownload: false,
    },
  ]

  return (
    <div className="pb-24 space-y-6">
      <div>
        <h1 className="display font-display mb-2">Sermons & Messages</h1>
        <p className="text-lg text-on-surface/70">Listen, read, and download sermons</p>
      </div>

      <Button size="lg" className="w-full">
        Create Sermon Outline
      </Button>

      <div className="space-y-3">
        {sermons.map((sermon) => (
          <Card key={sermon.id} className="hover:shadow-lg transition-shadow">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-primary/20 flex items-center justify-center">
                  <Mic2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="title-lg font-display">{sermon.title}</h3>
                  <p className="text-sm text-on-surface/60 mt-1">
                    by {sermon.preacher} • {sermon.mainVerse}
                  </p>
                  <p className="text-xs text-on-surface/50 mt-1">{sermon.date}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="tertiary" size="sm" className="flex-1">
                  Play
                </Button>
                {sermon.hasDownload && (
                  <Button variant="secondary" size="sm" className="flex items-center justify-center gap-1">
                    <Download className="w-4 h-4" />
                    PDF
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default SermonPlanner
