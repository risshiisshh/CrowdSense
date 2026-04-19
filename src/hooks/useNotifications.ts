// useNotifications — Mission 1: returns mock alerts
// Mission 3D: replace with Supabase realtime subscription
import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { MOCK_ALERTS } from '../data/mockData'

export function useNotifications() {
  const { alerts, setAlerts, markAlertRead, markAllRead, unreadCount } = useAppStore()

  useEffect(() => {
    if (alerts.length === 0) {
      setAlerts(MOCK_ALERTS)
    }
  }, [])

  return { alerts, unreadCount, markAlertRead, markAllRead, isLoading: false }
}
