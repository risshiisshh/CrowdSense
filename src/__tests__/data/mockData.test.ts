import { describe, it, expect } from 'vitest'
import {
  MOCK_USER, MOCK_ZONES, MOCK_GATES, MOCK_FOOD_COUNTERS,
  MOCK_MENU_ITEMS, MOCK_BADGES, MOCK_ALERTS, MOCK_ORDER,
  MOCK_POINTS_HISTORY
} from '../../data/mockData'

describe('mockData integrity', () => {
  it('MOCK_USER has valid structure', () => {
    expect(MOCK_USER.uid).toBeTruthy()
    expect(MOCK_USER.email).toContain('@')
    expect(MOCK_USER.displayName).toBeTruthy()
    expect(MOCK_USER.tier).toBeTruthy()
    expect(MOCK_USER.points).toBeGreaterThanOrEqual(0)
    expect(MOCK_USER.preferences).toBeDefined()
  })

  it('MOCK_ZONES has valid zones', () => {
    expect(MOCK_ZONES.length).toBeGreaterThan(0)
    MOCK_ZONES.forEach(zone => {
      expect(zone.id).toBeTruthy()
      expect(zone.name).toBeTruthy()
      expect(zone.occupancy).toBeLessThanOrEqual(zone.capacity)
      expect(['low', 'medium', 'high', 'full']).toContain(zone.level)
      expect(['rising', 'falling', 'stable']).toContain(zone.trend)
    })
  })

  it('MOCK_GATES has valid gates', () => {
    expect(MOCK_GATES.length).toBeGreaterThan(0)
    MOCK_GATES.forEach(gate => {
      expect(gate.id).toBeTruthy()
      expect(['open', 'limited', 'closed']).toContain(gate.status)
      expect(gate.waitMinutes).toBeGreaterThanOrEqual(0)
    })
  })

  it('MOCK_FOOD_COUNTERS has open counters', () => {
    expect(MOCK_FOOD_COUNTERS.length).toBeGreaterThan(0)
    const openCount = MOCK_FOOD_COUNTERS.filter(c => c.isOpen).length
    expect(openCount).toBeGreaterThan(0)
  })

  it('MOCK_MENU_ITEMS has items with valid prices', () => {
    expect(MOCK_MENU_ITEMS.length).toBeGreaterThan(0)
    MOCK_MENU_ITEMS.forEach(item => {
      expect(item.price).toBeGreaterThan(0)
      expect(item.name).toBeTruthy()
      expect(item.category).toBeTruthy()
    })
  })

  it('MOCK_BADGES includes all rarity types', () => {
    const rarities = new Set(MOCK_BADGES.map(b => b.rarity))
    expect(rarities.has('common')).toBe(true)
    expect(rarities.has('rare')).toBe(true)
  })

  it('MOCK_ALERTS has valid alert types', () => {
    expect(MOCK_ALERTS.length).toBeGreaterThan(0)
    MOCK_ALERTS.forEach(alert => {
      expect(['info', 'warning', 'emergency', 'promo']).toContain(alert.type)
    })
  })

  it('MOCK_ORDER has valid order structure', () => {
    expect(MOCK_ORDER.id).toBeTruthy()
    expect(MOCK_ORDER.items.length).toBeGreaterThan(0)
    expect(MOCK_ORDER.totalAmount).toBeGreaterThan(0)
    expect(['placed', 'preparing', 'on_the_way', 'delivered', 'cancelled']).toContain(MOCK_ORDER.status)
  })

  it('MOCK_POINTS_HISTORY has entries', () => {
    expect(MOCK_POINTS_HISTORY.length).toBeGreaterThan(0)
    MOCK_POINTS_HISTORY.forEach(entry => {
      expect(entry.points).not.toBe(0)
      expect(entry.action).toBeTruthy()
    })
  })
})
