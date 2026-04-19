import { describe, it, expect } from 'vitest'
import {
  POINTS, TIERS, getTierForXp, getXpProgress,
  awardPoints, updateTier, formatPoints
} from '../../lib/points'

describe('points utilities', () => {
  describe('POINTS constants', () => {
    it('has all expected action types', () => {
      expect(POINTS.FIRST_EVENT_LOGIN).toBe(120)
      expect(POINTS.FOOD_ORDER).toBe(50)
      expect(POINTS.REFERRAL).toBe(200)
      expect(POINTS.BADGE_UNLOCK).toBe(75)
      expect(POINTS.CHECK_IN).toBe(25)
    })
  })

  describe('TIERS config', () => {
    it('has all 5 tiers', () => {
      expect(Object.keys(TIERS)).toHaveLength(5)
      expect(TIERS.bronze).toBeDefined()
      expect(TIERS.silver).toBeDefined()
      expect(TIERS.gold).toBeDefined()
      expect(TIERS.platinum).toBeDefined()
      expect(TIERS.legend).toBeDefined()
    })

    it('tiers have ascending XP ranges', () => {
      expect(TIERS.bronze.minXp).toBeLessThan(TIERS.silver.minXp)
      expect(TIERS.silver.minXp).toBeLessThan(TIERS.gold.minXp)
      expect(TIERS.gold.minXp).toBeLessThan(TIERS.platinum.minXp)
      expect(TIERS.platinum.minXp).toBeLessThan(TIERS.legend.minXp)
    })
  })

  describe('getTierForXp', () => {
    it('returns bronze for 0 XP', () => {
      expect(getTierForXp(0).name).toBe('bronze')
    })
    it('returns silver for 500 XP', () => {
      expect(getTierForXp(500).name).toBe('silver')
    })
    it('returns gold for 1500 XP', () => {
      expect(getTierForXp(1500).name).toBe('gold')
    })
    it('returns platinum for 4000 XP', () => {
      expect(getTierForXp(4000).name).toBe('platinum')
    })
    it('returns legend for 10000+ XP', () => {
      expect(getTierForXp(10000).name).toBe('legend')
      expect(getTierForXp(50000).name).toBe('legend')
    })
  })

  describe('getXpProgress', () => {
    it('calculates progress within tier', () => {
      const progress = getXpProgress(2000)
      expect(progress.min).toBe(1500) // gold min
      expect(progress.max).toBe(3999) // gold max
      expect(progress.current).toBe(500) // 2000 - 1500
    })
    it('caps percent at 100', () => {
      const progress = getXpProgress(3999) // top of gold
      expect(progress.percent).toBeLessThanOrEqual(100)
    })
  })

  describe('awardPoints', () => {
    it('adds correct points for action', () => {
      expect(awardPoints(100, 'FOOD_ORDER')).toBe(150)
      expect(awardPoints(0, 'FIRST_EVENT_LOGIN')).toBe(120)
      expect(awardPoints(500, 'REFERRAL')).toBe(700)
    })
  })

  describe('updateTier', () => {
    it('returns correct tier name for XP', () => {
      expect(updateTier(0)).toBe('bronze')
      expect(updateTier(500)).toBe('silver')
      expect(updateTier(1500)).toBe('gold')
      expect(updateTier(4000)).toBe('platinum')
      expect(updateTier(10000)).toBe('legend')
    })
  })

  describe('formatPoints', () => {
    it('formats small numbers as-is', () => {
      expect(formatPoints(500)).toBe('500')
      expect(formatPoints(0)).toBe('0')
    })
    it('formats thousands with k suffix', () => {
      expect(formatPoints(1000)).toBe('1.0k')
      expect(formatPoints(2500)).toBe('2.5k')
      expect(formatPoints(10000)).toBe('10.0k')
    })
  })
})
