// useCrowdZones — Mission 1: returns mock zones
// Mission 3A: replace with Supabase realtime subscription
import { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { MOCK_ZONES, MOCK_GATES } from '../data/mockData'
import type { CrowdZone, Gate } from '../types'

export function useCrowdZones() {
  const { setActiveZones } = useAppStore()
  const [zones, setZones] = useState<CrowdZone[]>(MOCK_ZONES)
  const [gates, setGates] = useState<Gate[]>(MOCK_GATES)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setActiveZones(MOCK_ZONES)
    // Simulate live updates every 30s in Mission 1
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return { zones, gates, lastUpdated, isLoading }
}
