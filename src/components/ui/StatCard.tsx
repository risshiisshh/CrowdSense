import React, { memo } from 'react'

interface StatCardProps {
  /** Label shown above the value */
  label: string
  /** Primary value — number or string (e.g. "72%", 2340) */
  value: string | number
  /** Optional sub-text shown below the value */
  sub?: string
  /** Accent/glow colour (CSS colour string, defaults to amber) */
  color?: string
  /** Whether to show the left accent border */
  accent?: boolean
  /** Optional icon shown above the label */
  icon?: React.ReactNode
  /** Makes the card interactive when provided */
  onClick?: () => void
}

/**
 * Displays a highlighted data point with optional icon, sub-text and accent bar.
 * Memoised — only re-renders when props change, preventing cascade re-renders
 * from parent pages that update unrelated state.
 */
const StatCard = memo(function StatCard({
  label,
  value,
  sub,
  color = '#F59E0B',
  accent = true,
  icon,
  onClick,
}: StatCardProps) {
  return (
    <div
      className={`surface-card p-4 relative overflow-hidden hover-glow stat-card-value ${onClick ? 'cursor-pointer' : ''}`}
      style={{ borderLeftColor: accent ? color : undefined, borderLeftWidth: accent ? 3 : undefined }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick() } : undefined}
      aria-label={onClick ? `${label}: ${value}` : undefined}
    >
      {/* Background glow blob */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.07] blur-2xl pointer-events-none"
        style={{ background: color }}
        aria-hidden="true"
      />

      {icon && (
        <div className="mb-2 opacity-80" style={{ color }} aria-hidden="true">
          {icon}
        </div>
      )}

      <p className="text-xs font-body mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      <p className="font-display text-3xl tracking-wide count-up" style={{ color }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs font-body mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</p>
      )}
    </div>
  )
})

export default StatCard
