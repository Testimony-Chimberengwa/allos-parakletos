interface ExperienceBarProps {
  current: number
  max: number
  level: number
}

function ExperienceBar({ current, max, level }: ExperienceBarProps) {
  const percentage = (current / max) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="label font-display">Level {level}</span>
        <span className="text-sm font-body">
          {current} / {max} XP
        </span>
      </div>
      <div className="experience-bar">
        <div
          className="experience-bar-fill"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}

export default ExperienceBar
