// ─────────────────────────────────────────────────────────────────────────────
// CrowdSense — Firebase Configuration
// Reads config from environment variables (Vite: import.meta.env.VITE_*)
// When VITE_USE_FIREBASE=false, the app runs in demo mode with mock data.
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

// Check if Firebase is enabled
export const isFirebaseEnabled = import.meta.env.VITE_USE_FIREBASE === 'true'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || '',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || '',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || '',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '',
}

// Only initialize Firebase when enabled and config exists
let firebaseApp: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let googleProvider: GoogleAuthProvider | null = null

if (isFirebaseEnabled && firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_api_key_here') {
  try {
    firebaseApp = initializeApp(firebaseConfig)
    auth = getAuth(firebaseApp)
    db = getFirestore(firebaseApp)
    googleProvider = new GoogleAuthProvider()
    console.log('🔥 Firebase initialized successfully')
  } catch (err) {
    console.warn('⚠️ Firebase initialization failed, falling back to demo mode:', err)
  }
} else {
  console.log('📋 Running in demo mode (VITE_USE_FIREBASE=false)')
}

export { firebaseApp, auth, db, googleProvider }
