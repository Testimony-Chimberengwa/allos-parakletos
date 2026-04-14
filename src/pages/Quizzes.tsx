import { Card, Button } from '../components'
import { Zap, Trophy } from 'lucide-react'

function Quizzes() {
  const quizzes = [
    {
      id: '1',
      title: 'Genesis Foundation',
      difficulty: 'easy',
      questions: 10,
      xpReward: 100,
      completed: false,
    },
    {
      id: '2',
      title: 'Jesus Ministry',
      difficulty: 'medium',
      questions: 15,
      xpReward: 250,
      completed: true,
    },
    {
      id: '3',
      title: 'Paul\'s Epistles',
      difficulty: 'hard',
      questions: 20,
      xpReward: 500,
      completed: false,
    },
  ]

  return (
    <div className="pb-24 space-y-6">
      <div>
        <h1 className="display font-display mb-2">Quizzes</h1>
        <p className="text-lg text-on-surface/70">Test your Bible knowledge and earn XP</p>
      </div>

      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <Card
            key={quiz.id}
            className={`hover:shadow-lg transition-shadow cursor-pointer ${
              quiz.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="title-lg font-display">{quiz.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="label bg-tertiary/20 px-2 py-1 rounded-md">
                      {quiz.difficulty}
                    </span>
                    <span className="label text-primary">{quiz.questions} questions</span>
                  </div>
                </div>
                {quiz.completed && (
                  <Trophy className="w-5 h-5 text-secondary-container" />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-secondary-container" />
                <span className="text-sm font-semibold">{quiz.xpReward} XP</span>
              </div>

              <Button
                variant={quiz.completed ? 'secondary' : 'primary'}
                size="sm"
                className="w-full"
              >
                {quiz.completed ? 'Retake Quiz' : 'Start Quiz'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Quizzes
