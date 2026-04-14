import { Card, Button } from '../components'
import { Smile } from 'lucide-react'

function ChildrenZone() {
  const activities = [
    {
      id: '1',
      title: 'Bible Stories Coloring',
      age: '4-8',
      icon: '🎨',
    },
    {
      id: '2',
      title: 'Noah\'s Adventure',
      age: '6-10',
      icon: '🚢',
    },
    {
      id: '3',
      title: 'David & Goliath Game',
      age: '8-12',
      icon: '⚔️',
    },
    {
      id: '4',
      title: 'Bible Memory Match',
      age: '5-12',
      icon: '🎮',
    },
  ]

  return (
    <div className="pb-24 space-y-6">
      <div className="space-y-2">
        <h1 className="display font-display mb-2 flex items-center gap-2">
          <Smile className="w-8 h-8" /> Children's Zone
        </h1>
        <p className="text-lg text-on-surface/70">Fun Bible learning for kids</p>
      </div>

      <Card elevated className="bg-gradient-to-r from-tertiary/20 to-secondary-container/20">
        <p className="body-lg font-body">
          Welcome to a safe, engaging space where children can learn about the Bible through fun activities,
          stories, and games!
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((activity) => (
          <Card key={activity.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center space-y-3">
              <div className="text-5xl">{activity.icon}</div>
              <h3 className="title-lg font-display">{activity.title}</h3>
              <p className="text-sm text-on-surface/60">Ages {activity.age}</p>
              <Button variant="tertiary" size="sm" className="w-full">
                Play Now
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ChildrenZone
