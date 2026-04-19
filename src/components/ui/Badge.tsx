import React from 'react'
import type { CrowdLevel } from '../../types'

type BadgeVariant = CrowdLevel | 'info' | 'success' | 'warning' | 'error' | 'neutral' | 'amber'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  dot?: boolean
  className?: string
}

const VAR_COLORS: Record<BadgeVariant, { bg: string; border: string; text: string }> = {
  low:     { bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.35)',  text: '#10B981' },
  medium:  { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', text: '#F59E0B' },
  high:    { bg: 'rgba(255,107,107,0.12)',border: 'rgba(255,107,107,0.35)',text: '#FF6B6B' },
  full:    { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.35)',  text: '#EF4444' },
  info:    { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.35)', text: '#3B82F6' },
  success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)', text: '#10B981' },
  warning: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', text: '#F59E0B' },
  error:   { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.35)',  text: '#EF4444' },
  neutral: { bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.3)', text: '#94A3B8' },
  amber:   { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)',  text: '#F59E0B' },
}

export default function Badge({ label, variant = 'neutral', size = 'sm', dot = false, className = '' }: BadgeProps) {
  const { bg, border, text } = VAR_COLORS[variant]
  const sizeCls = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1 font-body font-semibold rounded-pill border ${sizeCls} ${className}`}
      style={{ background: bg, borderColor: border, color: text }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: text }}
        />
      )}
      {label}
    </span>
  )
}
