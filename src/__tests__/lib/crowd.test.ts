import { describe, it, expect } from 'vitest'
import {
  getZoneColor, getZoneFill, getZoneBorder, getZoneStatus,
  getWaitBadgeColor, formatWait, getOccupancyPercent
} from '../../lib/crowd'

describe('crowd utilities', () => {
  describe('getZoneColor', () => {
    it('returns green for low crowd', () => {
      expect(getZoneColor('low')).toBe('#10B981')
    })
    it('returns amber for medium crowd', () => {
      expect(getZoneColor('medium')).toBe('#F59E0B')
    })
    it('returns red for high crowd', () => {
      expect(getZoneColor('high')).toBe('#FF6B6B')
    })
    it('returns dark red for full crowd', () => {
      expect(getZoneColor('full')).toBe('#EF4444')
    })
  })

  describe('getZoneFill', () => {
    it('returns rgba fill for each level', () => {
      expect(getZoneFill('low')).toContain('rgba(16, 185, 129')
      expect(getZoneFill('medium')).toContain('rgba(245, 158, 11')
      expect(getZoneFill('high')).toContain('rgba(255, 107, 107')
      expect(getZoneFill('full')).toContain('rgba(239, 68, 68')
    })
  })

  describe('getZoneBorder', () => {
    it('returns border color for each level', () => {
      expect(getZoneBorder('low')).toContain('0.5')
      expect(getZoneBorder('full')).toContain('0.6')
    })
  })

  describe('getZoneStatus', () => {
    it('returns human-readable status strings', () => {
      expect(getZoneStatus('low')).toBe('Comfortable')
      expect(getZoneStatus('medium')).toBe('Moderate')
      expect(getZoneStatus('high')).toBe('Crowded')
      expect(getZoneStatus('full')).toBe('Packed')
    })
  })

  describe('getWaitBadgeColor', () => {
    it('returns green for short wait (<=5 min)', () => {
      expect(getWaitBadgeColor(0)).toBe('#10B981')
      expect(getWaitBadgeColor(5)).toBe('#10B981')
    })
    it('returns amber for moderate wait (6-15 min)', () => {
      expect(getWaitBadgeColor(10)).toBe('#F59E0B')
      expect(getWaitBadgeColor(15)).toBe('#F59E0B')
    })
    it('returns red for long wait (16-25 min)', () => {
      expect(getWaitBadgeColor(20)).toBe('#FF6B6B')
    })
    it('returns dark red for extreme wait (>25 min)', () => {
      expect(getWaitBadgeColor(30)).toBe('#EF4444')
    })
  })

  describe('formatWait', () => {
    it('returns "No wait" for 0 minutes', () => {
      expect(formatWait(0)).toBe('No wait')
    })
    it('formats minutes correctly', () => {
      expect(formatWait(5)).toBe('5m wait')
      expect(formatWait(30)).toBe('30m wait')
    })
    it('formats hours and minutes for 60+ min', () => {
      expect(formatWait(90)).toBe('1h 30m wait')
      expect(formatWait(60)).toBe('1h 0m wait')
    })
  })

  describe('getOccupancyPercent', () => {
    it('calculates percentage correctly', () => {
      expect(getOccupancyPercent(500, 1000)).toBe(50)
      expect(getOccupancyPercent(750, 1000)).toBe(75)
    })
    it('caps at 100%', () => {
      expect(getOccupancyPercent(1200, 1000)).toBe(100)
    })
    it('rounds to nearest integer', () => {
      expect(getOccupancyPercent(333, 1000)).toBe(33)
    })
  })
})
