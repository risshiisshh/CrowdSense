import React from 'react'
import { Lock } from 'lucide-react'
import type { Badge } from '../../types'
import { getRarityColor } from '../../lib/badges'

interface BadgeGridProps {
  badges: Badge[]
}

export default function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {badges.map(badge => {
        const rarityColor = getRarityColor(badge.rarity)
        return (
          <div
            key={badge.id}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl text-center transition-all duration-200"
            style={{
              background: badge.isEarned ? `${rarityColor}12` : 'var(--surface-2)',
              border: `1px solid ${badge.isEarned ? `${rarityColor}30` : 'var(--border-subtle)'}`,
              opacity: badge.isEarned ? 1 : 0.45,
            }}
          >
            <div className="relative text-2xl">
              {badge.emoji}
              {!badge.isEarned && (
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--surface-3)', border: '1px solid var(--border)' }}>
                  <Lock size={8} color="var(--text-muted)" />
                </span>
              )}
            </div>
            <span
              className="text-[10px] font-body font-semibold leading-tight"
              style={{ color: badge.isEarned ? rarityColor : 'var(--text-muted)' }}
            >
              {badge.name}
            </span>
            <span
              className="text-[9px] font-body capitalize"
              style={{ color: `${rarityColor}80` }}
            >
              {badge.rarity}
            </span>
          </div>
        )
      })}
    </div>
  )
}
