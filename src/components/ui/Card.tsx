import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  glass?: boolean
  glowColor?: string
}

export default function Card({
  children,
  className = '',
  onClick,
  hover = false,
  padding = 'md',
  glass = false,
  glowColor,
}: CardProps) {
  const pads = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  }

  const base = glass ? 'glassmorphic' : 'surface-card'

  return (
    <div
      className={`
        ${base} ${pads[padding]}
        ${hover || onClick ? 'hover-glow cursor-pointer' : ''}
        ${className}
      `}
      style={glowColor ? {
        '--hover-glow-color': glowColor,
      } as React.CSSProperties : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {children}
    </div>
  )
}
