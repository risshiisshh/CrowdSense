// ─── useNotifications — Firestore real-time with mock fallback ───
import { useEffect } from 'react'
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore'
import { useAppStore } from '../store/useAppStore'
import { db, isFirebaseEnabled } from '../lib/firebase'
import { MOCK_ALERTS } from '../data/mockData'
import type { Alert } from '../types'

export function useNotifications() {
  const { alerts, setAlerts, markAlertRead, markAllRead, unreadCount } = useAppStore()

  useEffect(() => {
    // ─── Demo mode ───
    if (!isFirebaseEnabled || !db) {
      if (alerts.length === 0) setAlerts(MOCK_ALERTS)
      return
    }

    // ─── Firebase real-time: alerts ───
    const alertsRef = collection(db, 'alerts')
    const q = query(alertsRef, orderBy('createdAt', 'desc'), limit(50))

    const unsub = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        if (alerts.length === 0) setAlerts(MOCK_ALERTS)
        return
      }
      const liveAlerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert))
      setAlerts(liveAlerts)
    }, (err) => {
      console.warn('Firestore alerts listener error:', err)
      if (alerts.length === 0) setAlerts(MOCK_ALERTS)
    })

    return () => unsub()
  }, [])

  return { alerts, unreadCount, markAlertRead, markAllRead, isLoading: false }
}
