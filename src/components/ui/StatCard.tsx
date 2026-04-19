import React from 'react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  color?: string
  accent?: boolean
  icon?: React.ReactNode
  onClick?: () => void
}

export default function StatCard({ label, value, sub, color = '#F59E0B', accent = true, icon, onClick }: StatCardProps) {
  return (
    <div
      className={`surface-card p-4 relative overflow-hidden hover-glow stat-card-value ${onClick ? 'cursor-pointer' : ''}`}
      style={{ borderLeftColor: accent ? color : undefined, borderLeftWidth: accent ? 3 : undefined }}
      onClick={onClick}
    >
      {/* Background glow blob */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.07] blur-2xl pointer-events-none"
        style={{ background: color }}
      />

      {icon && (
        <div className="mb-2 opacity-80" style={{ color }}>
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
}
