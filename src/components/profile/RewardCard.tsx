import React from 'react'
import { Lock } from 'lucide-react'
import { formatPoints } from '../../lib/points'

interface Reward {
  id: string
  name: string
  description: string
  emoji: string
  pointsCost: number
  isLocked: boolean
  tag?: string
}

interface RewardCardProps {
  reward: Reward
  userPoints: number
  onRedeem: (id: string) => void
}

export default function RewardCard({ reward, userPoints, onRedeem }: RewardCardProps) {
  const canAfford = userPoints >= reward.pointsCost
  const locked = reward.isLocked || !canAfford

  return (
    <div
      className="surface-card p-4 flex items-center gap-3 transition-all duration-200"
      style={{ opacity: locked ? 0.7 : 1 }}
    >
      {/* Emoji */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)' }}
      >
        {reward.emoji}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-body font-semibold text-sm text-text-primary truncate">{reward.name}</p>
          {reward.tag && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
              {reward.tag}
            </span>
          )}
        </div>
        <p className="text-[11px] text-text-muted mt-0.5">{reward.description}</p>
        <p className="text-xs font-semibold mt-1" style={{ color: '#F59E0B' }}>
          {formatPoints(reward.pointsCost)} pts
        </p>
      </div>

      {/* Redeem button */}
      <button
        disabled={locked}
        onClick={() => !locked && onRedeem(reward.id)}
        className="flex-shrink-0 px-3 py-1.5 rounded-pill text-xs font-semibold transition-all active:scale-95"
        style={
          locked
            ? { background: 'var(--surface-3)', color: 'var(--text-muted)', cursor: 'not-allowed' }
            : { background: '#F59E0B', color: '#08090D' }
        }
      >
        {locked ? <Lock size={12} /> : 'Redeem'}
      </button>
    </div>
  )
}

export type { Reward }
