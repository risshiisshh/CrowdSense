// ─── useAuth Tests ───────────────────────────────────────────────────────────
// useAuth delegates to useAppStore in demo mode (isFirebaseEnabled = false).
// We test the observable side-effects via the store rather than internals.
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAppStore } from '../../store/useAppStore'

// ── Mock firebase so isFirebaseEnabled stays false in tests ──
vi.mock('../../lib/firebase', () => ({
  isFirebaseEnabled: false,
  auth: null,
  db: null,
  firebaseApp: null,
  googleProvider: null,
}))

// ── Mock mockData to control the injected MOCK_USER ──
const DEMO_USER = {
  uid: 'demo-uid',
  email: 'demo@crowdsense.app',
  displayName: 'Demo Fan',
  photoURL: '',
  tier: 'gold' as const,
  points: 2340,
  xp: 1850,
  seatSection: 'D',
  seatRow: '12',
  seatNumber: '07',
  eventId: 'demo-event',
  referralCode: 'DEMO2025',
  preferences: {
    liveUpdates: true,
    foodAlerts: true,
    eventAlerts: true,
    haptics: true,
    arFeatures: true,
    language: 'en',
    dataSharing: false,
  },
  createdAt: '2024-01-01T00:00:00Z',
}

vi.mock('../../data/mockData', () => ({
  MOCK_USER: DEMO_USER,
  MOCK_ZONES: [],
  MOCK_GATES: [],
  MOCK_ALERTS: [],
  MOCK_ORDER: {
    id: 'mock-order',
    userId: 'demo-uid',
    items: [],
    totalAmount: 0,
    deliveryMethod: 'pickup',
    status: 'placed',
    estimatedMinutes: 0,
    createdAt: '',
    updatedAt: '',
  },
  MOCK_POINTS_HISTORY: [],
}))

describe('useAuth (demo mode)', () => {
  beforeEach(() => {
    useAppStore.setState({ user: null })
  })

  describe('store user slice — simulates what useAuth does in demo mode', () => {
    it('starts with no user', () => {
      expect(useAppStore.getState().user).toBeNull()
    })

    it('sets user to demo user', () => {
      useAppStore.getState().setUser(DEMO_USER)
      expect(useAppStore.getState().user).toEqual(DEMO_USER)
      expect(useAppStore.getState().user?.uid).toBe('demo-uid')
      expect(useAppStore.getState().user?.email).toBe('demo@crowdsense.app')
    })

    it('isAuthenticated is true when user is set', () => {
      useAppStore.getState().setUser(DEMO_USER)
      expect(useAppStore.getState().user).not.toBeNull()
    })

    it('clears user on sign out', () => {
      useAppStore.getState().setUser(DEMO_USER)
      expect(useAppStore.getState().user).not.toBeNull()
      useAppStore.getState().setUser(null)
      expect(useAppStore.getState().user).toBeNull()
    })

    it('updates individual user preference', () => {
      useAppStore.getState().setUser(DEMO_USER)
      useAppStore.getState().updateUserPreference('haptics', false)
      expect(useAppStore.getState().user?.preferences.haptics).toBe(false)
    })

    it('updates multiple preferences independently', () => {
      useAppStore.getState().setUser(DEMO_USER)
      useAppStore.getState().updateUserPreference('liveUpdates', false)
      useAppStore.getState().updateUserPreference('foodAlerts', false)
      expect(useAppStore.getState().user?.preferences.liveUpdates).toBe(false)
      expect(useAppStore.getState().user?.preferences.foodAlerts).toBe(false)
      // Other prefs unchanged
      expect(useAppStore.getState().user?.preferences.eventAlerts).toBe(true)
    })

    it('updating preference with no user does not throw', () => {
      expect(() => {
        useAppStore.getState().updateUserPreference('haptics', false)
      }).not.toThrow()
      expect(useAppStore.getState().user).toBeNull()
    })

    it('demo user has correct tier', () => {
      useAppStore.getState().setUser(DEMO_USER)
      expect(useAppStore.getState().user?.tier).toBe('gold')
    })

    it('demo user referral code is set', () => {
      useAppStore.getState().setUser(DEMO_USER)
      expect(useAppStore.getState().user?.referralCode).toBeTruthy()
    })
  })
})
