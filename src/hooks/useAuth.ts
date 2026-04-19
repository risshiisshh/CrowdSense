// ─── useAuth — Firebase Auth with mock fallback ───
import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useAppStore } from '../store/useAppStore'
import { auth, db, isFirebaseEnabled } from '../lib/firebase'
import { MOCK_USER } from '../data/mockData'
import type { User } from '../types'

// Default preferences for new users
const DEFAULT_PREFERENCES = {
  liveUpdates: true,
  foodAlerts: true,
  eventAlerts: true,
  haptics: true,
  arFeatures: true,
  language: 'en',
  dataSharing: false,
}

// Convert Firebase user to CrowdSense user
function firebaseUserToAppUser(fbUser: FirebaseUser, extraData?: Partial<User>): User {
  return {
    uid: fbUser.uid,
    email: fbUser.email || '',
    displayName: fbUser.displayName || 'CrowdSense User',
    photoURL: fbUser.photoURL || '',
    tier: 'bronze',
    points: 0,
    xp: 0,
    seatSection: 'D',
    seatRow: '12',
    seatNumber: '07',
    eventId: 'default_event',
    referralCode: fbUser.uid.slice(0, 8).toUpperCase(),
    preferences: DEFAULT_PREFERENCES,
    createdAt: new Date().toISOString(),
    ...extraData,
  }
}

export function useAuth() {
  const { user, setUser } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // ─── Demo mode: use mock user ───
    if (!isFirebaseEnabled || !auth) {
      setUser(MOCK_USER)
      setIsLoading(false)
      return
    }

    // ─── Firebase mode: listen to auth state ───
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          // Try to load profile from Firestore
          if (db) {
            const userDocRef = doc(db, 'users', fbUser.uid)
            const userDoc = await getDoc(userDocRef)

            if (userDoc.exists()) {
              // Existing user — merge Firestore data
              const firestoreData = userDoc.data() as Partial<User>
              setUser(firebaseUserToAppUser(fbUser, firestoreData))
            } else {
              // New user — create profile in Firestore
              const newUser = firebaseUserToAppUser(fbUser)
              await setDoc(userDocRef, {
                displayName: newUser.displayName,
                email: newUser.email,
                photoURL: newUser.photoURL,
                tier: newUser.tier,
                points: newUser.points,
                xp: newUser.xp,
                seatSection: newUser.seatSection,
                seatRow: newUser.seatRow,
                seatNumber: newUser.seatNumber,
                preferences: newUser.preferences,
                referralCode: newUser.referralCode,
                createdAt: newUser.createdAt,
              })
              setUser(newUser)
            }
          } else {
            setUser(firebaseUserToAppUser(fbUser))
          }
        } catch (err) {
          console.warn('Firestore profile load failed, using basic auth data:', err)
          setUser(firebaseUserToAppUser(fbUser))
        }
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, isLoading, isAuthenticated: !!user }
}
