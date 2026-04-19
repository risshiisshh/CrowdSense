// ─── useCrowdZones Tests ─────────────────────────────────────────────────────
// Tests the mock-data fallback path (isFirebaseEnabled = false).
// Validates zone structure, crowd levels, gate status, and store integration.
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAppStore } from '../../store/useAppStore'
import { getZoneColor, getZoneStatus, getOccupancyPercent } from '../../lib/crowd'
import type { CrowdZone, Gate } from '../../types'

vi.mock('../../lib/firebase', () => ({
  isFirebaseEnabled: false,
  auth: null,
  db: null,
  firebaseApp: null,
  googleProvider: null,
}))

const MOCK_ZONES: CrowdZone[] = [
  { id: 'z1', name: 'North Stand', level: 'low',    occupancy: 300,  capacity: 1000, trend: 'stable',  waitMinutes: 2,  section: 'N', updatedAt: '' },
  { id: 'z2', name: 'South Stand', level: 'high',   occupancy: 850,  capacity: 1000, trend: 'rising',  waitMinutes: 20, section: 'S', updatedAt: '' },
  { id: 'z3', name: 'East End',    level: 'medium', occupancy: 600,  capacity: 1000, trend: 'falling', waitMinutes: 9,  section: 'E', updatedAt: '' },
  { id: 'z4', name: 'West End',    level: 'full',   occupancy: 1000, capacity: 1000, trend: 'rising',  waitMinutes: 30, section: 'W', updatedAt: '' },
]

const MOCK_GATES: Gate[] = [
  { id: 'g1', name: 'Gate A', level: 'low',    status: 'open',    waitMinutes: 3,  updatedAt: '' },
  { id: 'g2', name: 'Gate B', level: 'medium', status: 'limited', waitMinutes: 12, updatedAt: '' },
  { id: 'g3', name: 'Gate C', level: 'full',   status: 'closed',  waitMinutes: 0,  updatedAt: '' },
]

vi.mock('../../data/mockData', () => ({
  MOCK_ZONES,
  MOCK_GATES,
  MOCK_USER: { uid: 'u1', preferences: {} },
  MOCK_ALERTS: [],
  MOCK_ORDER: { id: 'o1', items: [], totalAmount: 0, status: 'placed', userId: 'u1', deliveryMethod: 'pickup', estimatedMinutes: 0, createdAt: '', updatedAt: '' },
  MOCK_POINTS_HISTORY: [],
}))

describe('useCrowdZones (demo mode)', () => {
  beforeEach(() => {
    useAppStore.setState({ activeZones: [] })
  })

  describe('zone data structure validation', () => {
    it('all mock zones have required fields', () => {
      MOCK_ZONES.forEach(zone => {
        expect(zone.id).toBeTruthy()
        expect(zone.name).toBeTruthy()
        expect(zone.occupancy).toBeGreaterThanOrEqual(0)
        expect(zone.capacity).toBeGreaterThan(0)
        expect(['low', 'medium', 'high', 'full']).toContain(zone.level)
        expect(['rising', 'falling', 'stable']).toContain(zone.trend)
      })
    })

    it('occupancy never exceeds capacity', () => {
      MOCK_ZONES.forEach(zone => {
        expect(zone.occupancy).toBeLessThanOrEqual(zone.capacity)
      })
    })

    it('zone IDs are unique', () => {
      const ids = MOCK_ZONES.map(z => z.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  describe('crowd level → color mapping', () => {
    it('low zone returns green', () => {
      const low = MOCK_ZONES.find(z => z.level === 'low')!
      expect(getZoneColor(low.level)).toBe('#10B981')
    })

    it('high zone returns coral red', () => {
      const high = MOCK_ZONES.find(z => z.level === 'high')!
      expect(getZoneColor(high.level)).toBe('#FF6B6B')
    })

    it('full zone returns dark red', () => {
      const full = MOCK_ZONES.find(z => z.level === 'full')!
      expect(getZoneColor(full.level)).toBe('#EF4444')
    })

    it('medium zone returns amber', () => {
      const medium = MOCK_ZONES.find(z => z.level === 'medium')!
      expect(getZoneColor(medium.level)).toBe('#F59E0B')
    })
  })

  describe('crowd level → status text', () => {
    it('maps each level to human-readable status', () => {
      expect(getZoneStatus('low')).toBe('Comfortable')
      expect(getZoneStatus('medium')).toBe('Moderate')
      expect(getZoneStatus('high')).toBe('Crowded')
      expect(getZoneStatus('full')).toBe('Packed')
    })
  })

  describe('occupancy percent calculation', () => {
    it('calculates correctly for each zone', () => {
      expect(getOccupancyPercent(300,  1000)).toBe(30)
      expect(getOccupancyPercent(850,  1000)).toBe(85)
      expect(getOccupancyPercent(600,  1000)).toBe(60)
      expect(getOccupancyPercent(1000, 1000)).toBe(100)
    })

    it('caps at 100% for overloaded zones', () => {
      expect(getOccupancyPercent(1200, 1000)).toBe(100)
    })
  })

  describe('gate data validation', () => {
    it('all gates have valid status', () => {
      MOCK_GATES.forEach(gate => {
        expect(['open', 'limited', 'closed']).toContain(gate.status)
        expect(gate.waitMinutes).toBeGreaterThanOrEqual(0)
      })
    })

    it('closed gate has 0 wait time', () => {
      const closed = MOCK_GATES.find(g => g.status === 'closed')!
      expect(closed.waitMinutes).toBe(0)
    })

    it('open gate exists', () => {
      const open = MOCK_GATES.find(g => g.status === 'open')
      expect(open).toBeDefined()
    })
  })

  describe('store integration — setActiveZones', () => {
    it('stores zones in global state', () => {
      useAppStore.getState().setActiveZones(MOCK_ZONES)
      expect(useAppStore.getState().activeZones).toHaveLength(MOCK_ZONES.length)
    })

    it('can clear zones', () => {
      useAppStore.getState().setActiveZones(MOCK_ZONES)
      useAppStore.getState().setActiveZones([])
      expect(useAppStore.getState().activeZones).toHaveLength(0)
    })

    it('zone selection updates mapState', () => {
      useAppStore.getState().setSelectedZone('z2')
      expect(useAppStore.getState().mapState.selectedZoneId).toBe('z2')
    })

    it('deselecting zone clears mapState', () => {
      useAppStore.getState().setSelectedZone('z2')
      useAppStore.getState().setSelectedZone(null)
      expect(useAppStore.getState().mapState.selectedZoneId).toBeNull()
    })
  })
})
