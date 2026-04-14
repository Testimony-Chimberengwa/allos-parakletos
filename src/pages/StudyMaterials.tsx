import { Card, Button } from '../components'
import { BookMarked } from 'lucide-react'

function StudyMaterials() {
  const materials = [
    {
      id: '1',
      title: 'Understanding the Trinity',
      difficulty: 'intermediate',
      readTime: '15 min',
      category: 'Theology',
    },
    {
      id: '2',
      title: 'Parables of Jesus Explained',
      difficulty: 'beginner',
      readTime: '20 min',
      category: 'Gospels',
    },
    {
      id: '3',
      title: 'Greek Translation Insights',
      difficulty: 'advanced',
      readTime: '30 min',
      category: 'Languages',
    },
    {
      id: '4',
      title: 'Historical Context of Acts',
      difficulty: 'intermediate',
      readTime: '18 min',
      category: 'History',
    },
  ]

  const difficultyColor = {
    beginner: 'bg-tertiary/20 text-tertiary',
    intermediate: 'bg-primary/20 text-primary',
    advanced: 'bg-secondary-container/40 text-on-secondary-container',
  }

  return (
    <div className="pb-24 space-y-6">
      <div>
        <h1 className="display font-display mb-2">Study Materials</h1>
        <p className="text-lg text-on-surface/70">Deep dive into Bible study resources</p>
      </div>

      <Card elevated>
        <input
          type="text"
          placeholder="Search study materials..."
          className="input-field w-full"
        />
      </Card>

      <div className="space-y-3">
        {materials.map((material) => (
          <Card key={material.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <h3 className="title-lg font-display flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-primary" />
                  {material.title}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <span className="label text-primary">{material.category}</span>
                  <span className={`label px-2 py-1 rounded-md ${difficultyColor[material.difficulty as keyof typeof difficultyColor]}`}>
                    {material.difficulty}
                  </span>
                  <span className="label text-on-surface/60">{material.readTime}</span>
                </div>
              </div>
              <Button variant="tertiary" size="sm">
                Read
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default StudyMaterials
