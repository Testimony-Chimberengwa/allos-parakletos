import { Flame } from 'lucide-react'

interface StreakBadgeProps {
  count: number
}

function StreakBadge({ count }: StreakBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="streak-badge">
        <span className="flex items-center gap-1">
          <Flame className="w-5 h-5" />
          {count}
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold text-on-surface font-display">Day Streak</p>
        <p className="text-xs text-on-surface/60">Keep it up!</p>
      </div>
    </div>
  )
}

export default StreakBadge
