import React from 'react'

interface LiveDotProps {
  color?: string
  size?: number
  className?: string
}

export default function LiveDot({ color = '#FF6B6B', size = 7, className = '' }: LiveDotProps) {
  return (
    <span
      className={`inline-flex items-center justify-center relative ${className}`}
      style={{ width: size * 2.5, height: size * 2.5 }}
    >
      {/* Pulsing ring */}
      <span
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background: color,
          opacity: 0.6,
          animation: 'pulseRing 1.4s ease-in-out infinite',
          transform: 'scale(1)',
        }}
      />
      {/* Solid dot */}
      <span
        className="relative rounded-full"
        style={{
          width: size,
          height: size,
          background: color,
          boxShadow: `0 0 8px ${color}`,
          animation: 'pulseDot 1.4s ease-in-out infinite',
        }}
      />
    </span>
  )
}
