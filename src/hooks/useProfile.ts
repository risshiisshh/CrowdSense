// ─── useProfile — Firestore with mock fallback ───
import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, orderBy, doc, updateDoc } from 'firebase/firestore'
import { useAppStore } from '../store/useAppStore'
import { db, isFirebaseEnabled } from '../lib/firebase'
import { MOCK_BADGES, MOCK_POINTS_HISTORY } from '../data/mockData'
import { logger } from '../lib/logger'
import type { Badge, PointsEntry, User } from '../types'

export function useProfile() {
  const user = useAppStore(s => s.user)
  const setUser = useAppStore(s => s.setUser)
  const showToast = useAppStore(s => s.showToast)
  const [badges, setBadges] = useState<Badge[]>(MOCK_BADGES)
  const [pointsHistory, setPointsHistory] = useState<PointsEntry[]>(MOCK_POINTS_HISTORY)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isFirebaseEnabled || !db || !user) return

    setIsLoading(true)
    Promise.all([
      getDocs(query(collection(db, 'badges'), where('userId', '==', user.uid))),
      getDocs(query(collection(db, 'pointsHistory'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'))),
    ]).then(([badgeSnap, pointsSnap]) => {
      if (!badgeSnap.empty) {
        setBadges(badgeSnap.docs.map(d => ({ id: d.id, ...d.data() } as Badge)))
      }
      if (!pointsSnap.empty) {
        setPointsHistory(pointsSnap.docs.map(d => ({ id: d.id, ...d.data() } as PointsEntry)))
      }
    }).catch(err => {
      logger.warn('Firestore profile data load failed', err)
    }).finally(() => setIsLoading(false))
  }, [user?.uid])

  // Update user profile in Firestore
  async function updateProfile(updates: Partial<User>) {
    if (!user) return

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)

    if (isFirebaseEnabled && db) {
      try {
        const userDocRef = doc(db, 'users', user.uid)
        await updateDoc(userDocRef, updates as Partial<User> & Record<string, unknown>)
      } catch (err) {
        logger.warn('Firestore profile update failed', err)
      }
    }
  }

  return {
    user,
    badges,
    pointsHistory,
    isLoading,
    updateProfile,
  }
}
