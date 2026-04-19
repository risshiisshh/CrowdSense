import React from 'react'
import type { PointsEntry } from '../../types'

interface PointsHistoryProps {
  entries: PointsEntry[]
}

const ACTION_ICONS: Record<string, { emoji: string; color: string }> = {
  FIRST_EVENT_LOGIN: { emoji: '🎉', color: '#F59E0B' },
  FOOD_ORDER:        { emoji: '🍽️', color: '#10B981' },
  BADGE_UNLOCK:      { emoji: '🏅', color: '#8B5CF6' },
  CHECK_IN:          { emoji: '📍', color: '#3B82F6' },
  REFERRAL:          { emoji: '👥', color: '#FF6B6B' },
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60)   return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function PointsHistory({ entries }: PointsHistoryProps) {
  return (
    <div className="space-y-2">
      {entries.map(entry => {
        const meta = ACTION_ICONS[entry.action] || { emoji: '⭐', color: '#F59E0B' }
        return (
          <div
            key={entry.id}
            className="flex items-center gap-3 surface-card-2 p-3 rounded-xl"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}30` }}
            >
              {meta.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body font-semibold text-sm text-text-primary">{entry.description}</p>
              <p className="text-[11px] text-text-muted">{timeAgo(entry.createdAt)}</p>
            </div>
            <span
              className="font-display text-lg flex-shrink-0"
              style={{ color: meta.color }}
            >
              +{entry.points}
            </span>
          </div>
        )
      })}
    </div>
  )
}
