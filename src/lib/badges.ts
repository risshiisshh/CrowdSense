import { Badge } from '../types'

// ─── Badge Definitions ───
export const BADGE_DEFINITIONS: Omit<Badge, 'earnedAt' | 'isEarned'>[] = [
  {
    id: 'first_order',
    name: 'First Bite',
    description: 'Place your first food order',
    emoji: '🍔',
    rarity: 'common',
  },
  {
    id: 'early_bird',
    name: 'Early Arrival',
    description: 'Check in 60+ minutes before the match',
    emoji: '🐦',
    rarity: 'common',
  },
  {
    id: 'crowd_master',
    name: 'Crowd Master',
    description: 'Successfully navigate 5 high-density zones',
    emoji: '🏟️',
    rarity: 'rare',
  },
  {
    id: 'food_explorer',
    name: 'Food Explorer',
    description: 'Order from 3 different food counters',
    emoji: '🍽️',
    rarity: 'rare',
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Refer 3 friends to CrowdSense',
    emoji: '🦋',
    rarity: 'epic',
  },
  {
    id: 'season_warrior',
    name: 'Season Warrior',
    description: 'Attend 10+ events with CrowdSense',
    emoji: '⚔️',
    rarity: 'epic',
  },
  {
    id: 'platinum_fan',
    name: 'Platinum Fan',
    description: 'Reach Platinum tier',
    emoji: '💎',
    rarity: 'legendary',
  },
  {
    id: 'legend_status',
    name: 'Legend Status',
    description: 'Reach Legend tier — you are CrowdSense royalty',
    emoji: '👑',
    rarity: 'legendary',
  },
]

export function checkAndUnlockBadges(
  orderCount: number,
  countersVisited: number,
  referralCount: number,
  eventCount: number,
  xp: number,
  existingBadges: Badge[]
): Badge[] {
  const earnedIds = new Set(existingBadges.filter(b => b.isEarned).map(b => b.id))

  return BADGE_DEFINITIONS.map(def => {
    const existing = existingBadges.find(b => b.id === def.id)
    if (existing?.isEarned) return existing

    let shouldEarn = false
    switch (def.id) {
      case 'first_order':      shouldEarn = orderCount >= 1; break
      case 'early_bird':       shouldEarn = false; break // checked server-side
      case 'crowd_master':     shouldEarn = false; break
      case 'food_explorer':    shouldEarn = countersVisited >= 3; break
      case 'social_butterfly': shouldEarn = referralCount >= 3; break
      case 'season_warrior':   shouldEarn = eventCount >= 10; break
      case 'platinum_fan':     shouldEarn = xp >= 4000; break
      case 'legend_status':    shouldEarn = xp >= 10000; break
    }

    return {
      ...def,
      isEarned: shouldEarn,
      earnedAt: shouldEarn ? new Date().toISOString() : null,
    }
  })
}

export function getRarityColor(rarity: Badge['rarity']): string {
  switch (rarity) {
    case 'common':    return '#94A3B8'
    case 'rare':      return '#3B82F6'
    case 'epic':      return '#8B5CF6'
    case 'legendary': return '#F59E0B'
  }
}

// Mark set used
void (new Set<string>())
