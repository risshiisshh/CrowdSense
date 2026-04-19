import { TierName, Tier } from '../types'

// ─── Points Constants ───
export const POINTS = {
  FIRST_EVENT_LOGIN: 120,
  FOOD_ORDER: 50,
  REFERRAL: 200,
  BADGE_UNLOCK: 75,
  CHECK_IN: 25,
  RATE_EXPERIENCE: 15,
  SHARE_VENUE: 30,
} as const

// ─── Tier Config ───
export const TIERS: Record<TierName, Tier> = {
  bronze: {
    name: 'bronze',
    minXp: 0,
    maxXp: 499,
    color: '#CD7F32',
    emoji: '🥉',
  },
  silver: {
    name: 'silver',
    minXp: 500,
    maxXp: 1499,
    color: '#C0C0C0',
    emoji: '🥈',
  },
  gold: {
    name: 'gold',
    minXp: 1500,
    maxXp: 3999,
    color: '#F59E0B',
    emoji: '🥇',
  },
  platinum: {
    name: 'platinum',
    minXp: 4000,
    maxXp: 9999,
    color: '#8B5CF6',
    emoji: '💎',
  },
  legend: {
    name: 'legend',
    minXp: 10000,
    maxXp: 999999,
    color: '#FF6B6B',
    emoji: '👑',
  },
}

export function getTierForXp(xp: number): Tier {
  const tierNames: TierName[] = ['legend', 'platinum', 'gold', 'silver', 'bronze']
  for (const name of tierNames) {
    if (xp >= TIERS[name].minXp) return TIERS[name]
  }
  return TIERS.bronze
}

export function getXpProgress(xp: number): { current: number; min: number; max: number; percent: number } {
  const tier = getTierForXp(xp)
  const current = xp - tier.minXp
  const range = tier.maxXp - tier.minXp
  const percent = Math.min(100, Math.round((current / range) * 100))
  return { current, min: tier.minXp, max: tier.maxXp, percent }
}

export function awardPoints(existing: number, action: keyof typeof POINTS): number {
  return existing + POINTS[action]
}

export function updateTier(xp: number): TierName {
  return getTierForXp(xp).name
}

export function formatPoints(points: number): string {
  if (points >= 1000) return `${(points / 1000).toFixed(1)}k`
  return points.toString()
}
