// useAuth — Mission 1: returns mock user, wires real auth in Mission 2
import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { MOCK_USER } from '../data/mockData'

export function useAuth() {
  const { user, setUser } = useAppStore()

  useEffect(() => {
    // Mission 1: auto-sign in with mock user
    // Mission 2: replace with onAuthStateChanged from Firebase
    setUser(MOCK_USER)
  }, [])

  return { user, isLoading: false, isAuthenticated: !!user }
}
