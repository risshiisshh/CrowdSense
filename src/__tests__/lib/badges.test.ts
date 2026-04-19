import { describe, it, expect } from 'vitest'
import {
  BADGE_DEFINITIONS, checkAndUnlockBadges, getRarityColor
} from '../../lib/badges'
import type { Badge } from '../../types'

describe('badge utilities', () => {
  describe('BADGE_DEFINITIONS', () => {
    it('has 8 badge definitions', () => {
      expect(BADGE_DEFINITIONS).toHaveLength(8)
    })
    it('each badge has required fields', () => {
      BADGE_DEFINITIONS.forEach(badge => {
        expect(badge.id).toBeTruthy()
        expect(badge.name).toBeTruthy()
        expect(badge.description).toBeTruthy()
        expect(badge.emoji).toBeTruthy()
        expect(['common', 'rare', 'epic', 'legendary']).toContain(badge.rarity)
      })
    })
    it('has unique IDs', () => {
      const ids = BADGE_DEFINITIONS.map(b => b.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  describe('checkAndUnlockBadges', () => {
    const emptyBadges: Badge[] = BADGE_DEFINITIONS.map(d => ({
      ...d, isEarned: false, earnedAt: null,
    }))

    it('unlocks first_order badge when orderCount >= 1', () => {
      const result = checkAndUnlockBadges(1, 0, 0, 0, 0, emptyBadges)
      const firstOrder = result.find(b => b.id === 'first_order')
      expect(firstOrder?.isEarned).toBe(true)
      expect(firstOrder?.earnedAt).toBeTruthy()
    })

    it('does not unlock first_order when orderCount is 0', () => {
      const result = checkAndUnlockBadges(0, 0, 0, 0, 0, emptyBadges)
      const firstOrder = result.find(b => b.id === 'first_order')
      expect(firstOrder?.isEarned).toBe(false)
    })

    it('unlocks food_explorer when countersVisited >= 3', () => {
      const result = checkAndUnlockBadges(5, 3, 0, 0, 0, emptyBadges)
      const explorer = result.find(b => b.id === 'food_explorer')
      expect(explorer?.isEarned).toBe(true)
    })

    it('unlocks social_butterfly when referralCount >= 3', () => {
      const result = checkAndUnlockBadges(0, 0, 3, 0, 0, emptyBadges)
      const social = result.find(b => b.id === 'social_butterfly')
      expect(social?.isEarned).toBe(true)
    })

    it('unlocks season_warrior when eventCount >= 10', () => {
      const result = checkAndUnlockBadges(0, 0, 0, 10, 0, emptyBadges)
      const warrior = result.find(b => b.id === 'season_warrior')
      expect(warrior?.isEarned).toBe(true)
    })

    it('unlocks platinum_fan at 4000 XP', () => {
      const result = checkAndUnlockBadges(0, 0, 0, 0, 4000, emptyBadges)
      const platinum = result.find(b => b.id === 'platinum_fan')
      expect(platinum?.isEarned).toBe(true)
    })

    it('unlocks legend_status at 10000 XP', () => {
      const result = checkAndUnlockBadges(0, 0, 0, 0, 10000, emptyBadges)
      const legend = result.find(b => b.id === 'legend_status')
      expect(legend?.isEarned).toBe(true)
    })

    it('preserves already earned badges', () => {
      const earned: Badge[] = emptyBadges.map(b =>
        b.id === 'first_order' ? { ...b, isEarned: true, earnedAt: '2024-01-01' } : b
      )
      const result = checkAndUnlockBadges(0, 0, 0, 0, 0, earned)
      expect(result.find(b => b.id === 'first_order')?.isEarned).toBe(true)
    })
  })

  describe('getRarityColor', () => {
    it('returns correct colors for each rarity', () => {
      expect(getRarityColor('common')).toBe('#94A3B8')
      expect(getRarityColor('rare')).toBe('#3B82F6')
      expect(getRarityColor('epic')).toBe('#8B5CF6')
      expect(getRarityColor('legendary')).toBe('#F59E0B')
    })
  })
})
