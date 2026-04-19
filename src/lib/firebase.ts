// ─────────────────────────────────────────────────────────────────────────────
// CrowdSense — Firebase Configuration
// REPLACE_WITH_YOUR_* values must be substituted before Mission 2!
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey:            'REPLACE_WITH_YOUR_API_KEY',
  authDomain:        'REPLACE_WITH_YOUR_AUTH_DOMAIN',
  projectId:         'REPLACE_WITH_YOUR_PROJECT_ID',
  storageBucket:     'REPLACE_WITH_YOUR_STORAGE_BUCKET',
  messagingSenderId: 'REPLACE_WITH_YOUR_MESSAGING_SENDER_ID',
  appId:             'REPLACE_WITH_YOUR_APP_ID',
}

export const firebaseApp = initializeApp(firebaseConfig)
export const auth         = getAuth(firebaseApp)
export const googleProvider = new GoogleAuthProvider()
