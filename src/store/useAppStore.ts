import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Alert, CrowdZone, ToastMessage } from '../types'

interface MapState {
  selectedZoneId: string | null
  showSeatView: boolean
}

interface AppStore {
  // User
  user: User | null
  setUser: (user: User | null) => void
  updateUserPreference: (key: keyof User['preferences'], value: boolean | string) => void

  // Haptics
  triggerHaptic: (pattern?: number | number[]) => void

  // Alerts
  alerts: Alert[]
  unreadCount: number
  setAlerts: (alerts: Alert[]) => void
  markAlertRead: (id: string) => void
  markAllRead: () => void
  addAlert: (alert: Alert) => void

  // Map
  mapState: MapState
  setSelectedZone: (zoneId: string | null) => void
  setShowSeatView: (show: boolean) => void

  // Toast
  toasts: ToastMessage[]
  showToast: (message: string, type: ToastMessage['type']) => void
  dismissToast: (id: string) => void

  // Cart item count (quick read)
  cartCount: number
  setCartCount: (n: number) => void

  // Active event
  activeZones: CrowdZone[]
  setActiveZones: (zones: CrowdZone[]) => void

  // Sidebar
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebarCollapse: () => void

  // Chat
  chatOpen: boolean
  toggleChat: () => void
  setChatOpen: (open: boolean) => void

  // Theme
  theme: 'dark' | 'light'
  toggleTheme: () => void
  setTheme: (theme: 'dark' | 'light') => void

  // Compact View
  compactView: boolean
  toggleCompactView: () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ─── User ───
      user: null,
      setUser: (user) => set({ user }),
      updateUserPreference: (key, value) => {
        const user = get().user
        if (!user) return
        set({
          user: {
            ...user,
            preferences: { ...user.preferences, [key]: value },
          },
        })
      },

      // ─── Haptics ───
      triggerHaptic: (pattern = 10) => {
        const user = get().user
        if (!user?.preferences?.haptics) return
        if ('vibrate' in navigator) {
          navigator.vibrate(pattern)
        }
      },

      // ─── Alerts ───
      alerts: [],
      unreadCount: 0,
      setAlerts: (alerts) => set({ alerts, unreadCount: alerts.filter(a => !a.isRead).length }),
      markAlertRead: (id) => {
        const alerts = get().alerts.map(a => a.id === id ? { ...a, isRead: true } : a)
        set({ alerts, unreadCount: alerts.filter(a => !a.isRead).length })
      },
      markAllRead: () => {
        const alerts = get().alerts.map(a => ({ ...a, isRead: true }))
        set({ alerts, unreadCount: 0 })
      },
      addAlert: (alert) => {
        const alerts = [alert, ...get().alerts]
        set({ alerts, unreadCount: alerts.filter(a => !a.isRead).length })
      },

      // ─── Map ───
      mapState: { selectedZoneId: null, showSeatView: false },
      setSelectedZone: (zoneId) =>
        set(s => ({ mapState: { ...s.mapState, selectedZoneId: zoneId } })),
      setShowSeatView: (show) =>
        set(s => ({ mapState: { ...s.mapState, showSeatView: show } })),

      // ─── Toast ───
      toasts: [],
      showToast: (message, type) => {
        const id = `toast_${Date.now()}`
        set(s => ({ toasts: [...s.toasts, { id, message, type }] }))
        setTimeout(() => get().dismissToast(id), 3200)
      },
      dismissToast: (id) =>
        set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

      // ─── Cart ───
      cartCount: 0,
      setCartCount: (n) => set({ cartCount: n }),

      // ─── Zones ───
      activeZones: [],
      setActiveZones: (zones) => set({ activeZones: zones }),

      // ─── Sidebar ───
      sidebarOpen: false,
      sidebarCollapsed: false,
      toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebarCollapse: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // ─── Chat ───
      chatOpen: false,
      toggleChat: () => set(s => ({ chatOpen: !s.chatOpen })),
      setChatOpen: (open) => set({ chatOpen: open }),

      // ─── Theme ───
      theme: 'dark',
      toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setTheme: (theme) => set({ theme }),

      // ─── Compact View ───
      compactView: false,
      toggleCompactView: () => set(s => ({ compactView: !s.compactView })),
    }),
    {
      name: 'crowdsense-prefs',
      partialize: (state) => ({
        theme: state.theme,
        compactView: state.compactView,
        sidebarCollapsed: state.sidebarCollapsed,
        user: state.user,
      }),
    }
  )
)
