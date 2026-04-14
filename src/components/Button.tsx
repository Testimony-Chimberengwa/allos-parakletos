interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-display'

  const variantClasses = {
    primary: 'bg-primary text-on-primary hover:shadow-button active:translate-y-1',
    secondary: 'bg-secondary-container text-on-secondary-container hover:opacity-90',
    tertiary: 'bg-tertiary text-on-surface hover:opacity-90',
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
