import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../../store/useAppStore'
import type { User, Alert } from '../../types'

const MOCK_USER: User = {
  uid: 'test-uid',
  email: 'test@test.com',
  displayName: 'Test User',
  photoURL: '',
  tier: 'gold',
  points: 2340,
  xp: 1850,
  seatSection: 'D',
  seatRow: '12',
  seatNumber: '07',
  eventId: 'e1',
  referralCode: 'TEST2025',
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

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      user: null,
      alerts: [],
      unreadCount: 0,
      toasts: [],
      cartCount: 0,
      activeZones: [],
      chatOpen: false,
      sidebarOpen: false,
      sidebarCollapsed: false,
    })
  })

  describe('user slice', () => {
    it('sets user correctly', () => {
      useAppStore.getState().setUser(MOCK_USER)
      expect(useAppStore.getState().user).toEqual(MOCK_USER)
    })

    it('clears user on sign out', () => {
      useAppStore.getState().setUser(MOCK_USER)
      useAppStore.getState().setUser(null)
      expect(useAppStore.getState().user).toBeNull()
    })

    it('updates user preferences', () => {
      useAppStore.getState().setUser(MOCK_USER)
      useAppStore.getState().updateUserPreference('haptics', false)
      expect(useAppStore.getState().user?.preferences.haptics).toBe(false)
    })

    it('does not crash when updating preferences with no user', () => {
      useAppStore.getState().updateUserPreference('haptics', false)
      expect(useAppStore.getState().user).toBeNull()
    })
  })

  describe('alerts slice', () => {
    const mockAlerts: Alert[] = [
      { id: 'a1', type: 'warning', title: 'Test', message: 'msg', isRead: false, createdAt: '' },
      { id: 'a2', type: 'info', title: 'Info', message: 'msg2', isRead: false, createdAt: '' },
    ]

    it('sets alerts and calculates unread count', () => {
      useAppStore.getState().setAlerts(mockAlerts)
      expect(useAppStore.getState().alerts).toHaveLength(2)
      expect(useAppStore.getState().unreadCount).toBe(2)
    })

    it('marks single alert as read', () => {
      useAppStore.getState().setAlerts(mockAlerts)
      useAppStore.getState().markAlertRead('a1')
      expect(useAppStore.getState().unreadCount).toBe(1)
      expect(useAppStore.getState().alerts.find(a => a.id === 'a1')?.isRead).toBe(true)
    })

    it('marks all alerts as read', () => {
      useAppStore.getState().setAlerts(mockAlerts)
      useAppStore.getState().markAllRead()
      expect(useAppStore.getState().unreadCount).toBe(0)
    })

    it('adds new alert and updates unread count', () => {
      useAppStore.getState().setAlerts(mockAlerts)
      useAppStore.getState().addAlert({ id: 'a3', type: 'emergency', title: 'New', message: 'new', isRead: false, createdAt: '' })
      expect(useAppStore.getState().alerts).toHaveLength(3)
      expect(useAppStore.getState().unreadCount).toBe(3)
    })
  })

  describe('toast slice', () => {
    it('adds a toast', () => {
      useAppStore.getState().showToast('Hello', 'success')
      expect(useAppStore.getState().toasts).toHaveLength(1)
      expect(useAppStore.getState().toasts[0].message).toBe('Hello')
    })

    it('dismisses a toast', () => {
      useAppStore.getState().showToast('Hello', 'success')
      const id = useAppStore.getState().toasts[0].id
      useAppStore.getState().dismissToast(id)
      expect(useAppStore.getState().toasts).toHaveLength(0)
    })
  })

  describe('map slice', () => {
    it('sets selected zone', () => {
      useAppStore.getState().setSelectedZone('zone-1')
      expect(useAppStore.getState().mapState.selectedZoneId).toBe('zone-1')
    })

    it('clears selected zone', () => {
      useAppStore.getState().setSelectedZone('zone-1')
      useAppStore.getState().setSelectedZone(null)
      expect(useAppStore.getState().mapState.selectedZoneId).toBeNull()
    })
  })

  describe('sidebar slice', () => {
    it('toggles sidebar open state', () => {
      useAppStore.getState().toggleSidebar()
      expect(useAppStore.getState().sidebarOpen).toBe(true)
      useAppStore.getState().toggleSidebar()
      expect(useAppStore.getState().sidebarOpen).toBe(false)
    })

    it('toggles sidebar collapse', () => {
      useAppStore.getState().toggleSidebarCollapse()
      expect(useAppStore.getState().sidebarCollapsed).toBe(true)
    })
  })

  describe('theme slice', () => {
    it('toggles between dark and light', () => {
      expect(useAppStore.getState().theme).toBe('dark')
      useAppStore.getState().toggleTheme()
      expect(useAppStore.getState().theme).toBe('light')
      useAppStore.getState().toggleTheme()
      expect(useAppStore.getState().theme).toBe('dark')
    })

    it('sets theme directly', () => {
      useAppStore.getState().setTheme('light')
      expect(useAppStore.getState().theme).toBe('light')
    })
  })

  describe('cart slice', () => {
    it('sets cart count', () => {
      useAppStore.getState().setCartCount(5)
      expect(useAppStore.getState().cartCount).toBe(5)
    })
  })

  describe('compact view', () => {
    it('toggles compact view', () => {
      expect(useAppStore.getState().compactView).toBe(false)
      useAppStore.getState().toggleCompactView()
      expect(useAppStore.getState().compactView).toBe(true)
    })
  })
})
