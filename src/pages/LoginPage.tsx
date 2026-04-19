import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, type AuthError } from 'firebase/auth'
import { useAppStore } from '../store/useAppStore'
import { auth, googleProvider, isFirebaseEnabled } from '../lib/firebase'
import { MOCK_USER } from '../data/mockData'
import { logger } from '../lib/logger'

/** Maps Firebase Auth error codes to user-friendly messages */
function authErrorMessage(err: unknown): string {
  const code = (err as AuthError)?.code
  switch (code) {
    case 'auth/user-not-found':      return 'No account found. Try signing up.'
    case 'auth/wrong-password':      return 'Incorrect password.'
    case 'auth/email-already-in-use':return 'Email already in use. Try signing in.'
    case 'auth/weak-password':       return 'Password must be at least 6 characters.'
    case 'auth/invalid-email':       return 'Invalid email address.'
    case 'auth/popup-closed-by-user':return 'Sign-in cancelled.'
    default:                          return (err instanceof Error) ? err.message : 'Authentication failed'
  }
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser, showToast } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')

  // ─── Google Sign In ───
  async function handleGoogleSignIn() {
    setLoading(true)
    setError('')

    if (!isFirebaseEnabled || !auth || !googleProvider) {
      // Demo mode
      setTimeout(() => {
        setUser(MOCK_USER)
        navigate('/home')
      }, 800)
      return
    }

    try {
      await signInWithPopup(auth, googleProvider)
      // useAuth listener will handle setting the user
      navigate('/home')
    } catch (err: unknown) {
      logger.warn('Google sign-in failed', err)
      setError(authErrorMessage(err))
      setLoading(false)
    }
  }

  // ─── Email/Password Sign In or Sign Up ───
  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    setLoading(true)
    setError('')

    if (!isFirebaseEnabled || !auth) {
      // Demo mode
      setTimeout(() => {
        setUser(MOCK_USER)
        navigate('/home')
      }, 800)
      return
    }

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
        showToast('Account created! Welcome to CrowdSense 🎉', 'success')
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      navigate('/home')
    } catch (err: unknown) {
      logger.warn('Email auth failed', err)
      setError(authErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-between px-6 py-12 relative overflow-hidden"
      style={{ background: 'var(--bg-root)' }}
    >
      {/* Background decorative rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ border: '1px solid rgba(245,158,11,0.07)' }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full"
          style={{ border: '1px solid rgba(245,158,11,0.05)' }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full"
          style={{ border: '1px solid rgba(245,158,11,0.08)', background: 'radial-gradient(circle, rgba(245,158,11,0.03) 0%, transparent 70%)' }} />
      </div>

      {/* Top spacer */}
      <div />

      {/* Center content */}
      <div className="flex flex-col items-center gap-6 z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center font-display text-4xl"
            style={{ background: '#F59E0B', color: '#08090D', boxShadow: '0 0 40px rgba(245,158,11,0.4)' }}
          >
            CS
          </div>
          <div className="text-center">
            <h1 className="font-display text-5xl tracking-widest text-gradient-amber">
              CROWDSENSE
            </h1>
            <p className="font-body text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Real-time venue intelligence
            </p>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="space-y-2 w-full">
          {[
            { emoji: '🗺️', text: 'Live crowd maps & navigation' },
            { emoji: '🍔', text: 'Order food from your seat' },
            { emoji: '🏆', text: 'Earn points & unlock badges' },
          ].map(({ emoji, text }) => (
            <div key={text} className="flex items-center gap-3 surface-card-2 px-4 py-2.5 rounded-xl">
              <span className="text-lg">{emoji}</span>
              <span className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="w-full space-y-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none transition-all focus:ring-2 focus:ring-amber-500/40"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none transition-all focus:ring-2 focus:ring-amber-500/40"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
          />

          {error && (
            <p className="text-xs text-center px-2 py-2 rounded-lg"
              style={{ background: 'rgba(255,107,107,0.1)', color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.2)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-body font-semibold text-sm transition-all active:scale-[0.97]"
            style={{
              background: loading ? 'rgba(245,158,11,0.6)' : '#F59E0B',
              color: '#08090D',
              boxShadow: loading ? 'none' : '0 0 30px rgba(245,158,11,0.3)',
            }}
          >
            {loading ? 'Signing you in...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError('') }}
              className="text-amber-500 font-semibold hover:text-amber-400 transition-colors">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
          <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>or</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
        </div>

        {/* Google Sign In Button */}
        <button
          id="google-signin-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-body font-semibold text-sm transition-all active:scale-[0.97]"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Demo mode indicator */}
        {!isFirebaseEnabled && (
          <p className="text-[10px] text-center px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.2)' }}>
            🧪 Demo Mode — using mock data
          </p>
        )}

        <p className="text-[11px] text-center leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          By continuing, you agree to our{' '}
          <span className="text-amber-500 cursor-pointer">Terms of Service</span>
          {' '}and{' '}
          <span className="text-amber-500 cursor-pointer">Privacy Policy</span>
        </p>
      </div>

      {/* Bottom: stadium silhouette */}
      <div className="w-full flex justify-center opacity-10 pointer-events-none">
        <svg width="280" height="60" viewBox="0 0 280 60">
          <ellipse cx="140" cy="45" rx="130" ry="40" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
          {[...Array(8)].map((_, i) => (
            <line key={i} x1={80 + i * 18} y1="45" x2={80 + i * 18} y2="10" stroke="#F59E0B" strokeWidth="1" />
          ))}
        </svg>
      </div>
    </div>
  )
}
