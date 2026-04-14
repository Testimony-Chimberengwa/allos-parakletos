import { Card, Button } from '../components'

function ReadingPlans() {
  const plans = [
    {
      id: '1',
      title: 'Old Testament Overview',
      description: 'Read through the entire Old Testament in 180 days',
      progress: 35,
      daysRemaining: 117,
    },
    {
      id: '2',
      title: 'New Testament Journey',
      description: 'Complete New Testament in 90 days',
      progress: 60,
      daysRemaining: 36,
    },
    {
      id: '3',
      title: 'Gospel Deep Dive',
      description: 'Study all four gospels in detail',
      progress: 10,
      daysRemaining: 85,
    },
  ]

  return (
    <div className="pb-24 space-y-6">
      <div>
        <h1 className="display font-display mb-2">Reading Plans</h1>
        <p className="text-lg text-on-surface/70">Choose a structured Bible reading plan</p>
      </div>

      <div className="space-y-4">
        {plans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="space-y-3">
              <div>
                <h3 className="title-lg font-display">{plan.title}</h3>
                <p className="text-sm text-on-surface/60 mt-1">{plan.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Progress</span>
                  <span>{plan.daysRemaining} days left</span>
                </div>
                <div className="w-full bg-surface-container-low rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-primary-container h-2 rounded-full"
                    style={{ width: `${plan.progress}%` }}
                  />
                </div>
              </div>

              <Button variant="secondary" size="sm" className="w-full">
                Continue → {plan.progress}%
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Button size="lg" className="w-full">
        Create New Reading Plan
      </Button>
    </div>
  )
}

export default ReadingPlans
