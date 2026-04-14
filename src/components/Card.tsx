interface CardProps {
  children: React.ReactNode
  className?: string
  elevated?: boolean
}

function Card({ children, className = '', elevated = false }: CardProps) {
  const baseClasses = elevated ? 'card-elevated' : 'card'
  return <div className={`${baseClasses} ${className}`}>{children}</div>
}

export default Card
