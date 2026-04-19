import React from 'react'
import { TIERS } from '../../lib/points'
import type { TierName } from '../../types'

interface XPBarProps {
  xp: number
  tier: TierName
}

export default function XPBar({ xp, tier }: XPBarProps) {
  const tierConfig = TIERS[tier]
  const nextTierNames: TierName[] = ['bronze', 'silver', 'gold', 'platinum', 'legend']
  const currentIdx = nextTierNames.indexOf(tier)
  const nextTier = currentIdx < 4 ? TIERS[nextTierNames[currentIdx + 1]] : null

  const min = tierConfig.minXp
  const max = tierConfig.maxXp
  const pct = Math.min(100, Math.round(((xp - min) / (max - min)) * 100))
  const remaining = nextTier ? nextTier.minXp - xp : 0

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{tierConfig.emoji}</span>
          <span
            className="font-display text-xl tracking-wider capitalize"
            style={{ color: tierConfig.color }}
          >
            {tier}
          </span>
        </div>
        <span className="text-text-secondary text-xs font-body">
          {xp.toLocaleString()} XP
          {nextTier && ` · ${remaining.toLocaleString()} to ${nextTier.name}`}
        </span>
      </div>

      {/* Bar */}
      <div className="w-full h-2 rounded-pill overflow-hidden" style={{ background: 'var(--surface-3)' }}>
        <div
          className="h-full rounded-pill transition-all duration-1000"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${tierConfig.color} 0%, ${tierConfig.color}99 100%)`,
            boxShadow: `0 0 12px ${tierConfig.color}66`,
            animation: 'fillBar 1s ease-out',
          }}
        />
      </div>

      {/* Tier labels */}
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-text-muted font-body">{min.toLocaleString()} XP</span>
        <span className="text-[10px] text-text-muted font-body">{max.toLocaleString()} XP</span>
      </div>
    </div>
  )
}
