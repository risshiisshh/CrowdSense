// ─────────────────────────────────────────────────────────────────────────────
// CrowdSense — Firebase Configuration
// Reads config from environment variables (Vite: import.meta.env.VITE_*).
// When VITE_USE_FIREBASE=false, the app runs in demo mode with mock data.
// Services initialized: Auth, Firestore, Analytics, Performance Monitoring
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAnalytics, type Analytics } from 'firebase/analytics'
import { getPerformance, type FirebasePerformance } from 'firebase/performance'
import { logger } from './logger'

/** True when Firebase services are enabled via environment configuration */
export const isFirebaseEnabled = import.meta.env.VITE_USE_FIREBASE === 'true'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || '',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || '',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || '',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '',
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID     || '',
}

let firebaseApp:    FirebaseApp        | null = null
let auth:           Auth               | null = null
let db:             Firestore          | null = null
let googleProvider: GoogleAuthProvider | null = null
let analytics:      Analytics          | null = null
let performance:    FirebasePerformance | null = null

if (isFirebaseEnabled && firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_api_key_here') {
  try {
    firebaseApp    = initializeApp(firebaseConfig)
    auth           = getAuth(firebaseApp)
    db             = getFirestore(firebaseApp)
    googleProvider = new GoogleAuthProvider()

    // Analytics — only available in browser environments
    try {
      analytics = getAnalytics(firebaseApp)
      logger.info('📊 Google Analytics initialized')
    } catch (analyticsErr) {
      logger.warn('Analytics initialization skipped', analyticsErr)
    }

    // Performance Monitoring — measures real-user page load and network data
    try {
      performance = getPerformance(firebaseApp)
      logger.info('⚡ Firebase Performance Monitoring initialized')
    } catch (perfErr) {
      logger.warn('Performance Monitoring skipped', perfErr)
    }

    logger.info('🔥 Firebase initialized successfully')
  } catch (err) {
    logger.warn('Firebase initialization failed — falling back to demo mode', err)
  }
} else {
  logger.info('📋 Running in demo mode (VITE_USE_FIREBASE=false)')
}

export { firebaseApp, auth, db, googleProvider, analytics, performance }
