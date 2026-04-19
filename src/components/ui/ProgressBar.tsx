import React from 'react'

interface ProgressBarProps {
  value: number       // 0–100
  color?: string
  height?: number
  animated?: boolean
  className?: string
  showLabel?: boolean
  bg?: string
}

export default function ProgressBar({
  value,
  color = '#F59E0B',
  height = 6,
  animated = true,
  className = '',
  showLabel = false,
  bg = 'var(--surface-3)',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value))

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-text-secondary font-body">{pct}%</span>
        </div>
      )}
      <div
        className="w-full rounded-pill overflow-hidden"
        style={{ height, background: bg }}
      >
        <div
          className="h-full rounded-pill transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color} 0%, ${color}cc 100%)`,
            animation: animated ? 'fillBar 0.8s ease-out' : undefined,
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
    </div>
  )
}
