// ─── useCrowdZones — Firestore real-time with mock fallback ───
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { useAppStore } from '../store/useAppStore'
import { db, isFirebaseEnabled } from '../lib/firebase'
import { traceAsync } from '../lib/analytics'
import { MOCK_ZONES, MOCK_GATES } from '../data/mockData'
import { logger } from '../lib/logger'
import type { CrowdZone, Gate } from '../types'

export function useCrowdZones() {
  const { setActiveZones } = useAppStore()
  const [zones, setZones] = useState<CrowdZone[]>(MOCK_ZONES)
  const [gates, setGates] = useState<Gate[]>(MOCK_GATES)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // ─── Demo mode ───
    if (!isFirebaseEnabled || !db) {
      setActiveZones(MOCK_ZONES)
      const interval = setInterval(() => setLastUpdated(new Date()), 30000)
      return () => clearInterval(interval)
    }

    // ─── Firebase real-time: crowd zones ───
    setIsLoading(true)
    const zonesRef = collection(db, 'crowdZones')
    const unsubZones = onSnapshot(query(zonesRef), (snapshot) => {
      if (snapshot.empty) {
        // No Firestore data yet — fall back to mock
        setActiveZones(MOCK_ZONES)
        setIsLoading(false)
        return
      }
      const liveZones = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CrowdZone))
      setZones(liveZones)
      setActiveZones(liveZones)
      setLastUpdated(new Date())
      setIsLoading(false)
    }, (err) => {
      logger.warn('Firestore zones listener error — using mock data', err)
      setActiveZones(MOCK_ZONES)
      setIsLoading(false)
    })

    // ─── Firebase real-time: gates ───
    const gatesRef = collection(db, 'gates')
    const unsubGates = onSnapshot(query(gatesRef), (snapshot) => {
      if (!snapshot.empty) {
        setGates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gate)))
      }
    })

    return () => { unsubZones(); unsubGates() }
  }, [])

  return { zones, gates, lastUpdated, isLoading }
}
