import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useNotifications } from './hooks/useNotifications'
import { useAppStore } from './store/useAppStore'
import { trackPageView, setAnalyticsUser } from './lib/analytics'
import { initRemoteConfig } from './lib/remoteConfig'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import NavBar from './components/layout/NavBar'
import Sidebar from './components/layout/Sidebar'
import ToastContainer from './components/ui/Toast'
import ChatBot from './components/chat/ChatBot'

// Pages
import LoginPage           from './pages/LoginPage'
import HomePage            from './pages/HomePage'
import DashboardPage       from './pages/DashboardPage'
import FoodPage            from './pages/FoodPage'
import CartPage            from './pages/CartPage'
import WalletPage          from './pages/WalletPage'
import ProfilePage         from './pages/ProfilePage'
import NotificationsPage   from './pages/NotificationsPage'
import SettingsPage        from './pages/SettingsPage'
import ARPreviewPage       from './pages/ARPreviewPage'
import ActivityTimelinePage from './pages/ActivityTimelinePage'
import AdminPage           from './pages/AdminPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-dvh" style={{ background: 'var(--bg-root)' }}>
      <div
        className="w-10 h-10 rounded-md flex items-center justify-center font-display text-lg animate-pulse"
        style={{ background: '#F59E0B', color: '#08090D' }}
      >CS</div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

// Theme & compact synchroniser — runs once inside BrowserRouter context
function ThemeController() {
  const theme       = useAppStore(s => s.theme)
  const compactView = useAppStore(s => s.compactView)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-compact', String(compactView))
  }, [compactView])

  return null
}

// Analytics page-view tracker — fires on every route change
function AnalyticsTracker() {
  const location = useLocation()
  const user     = useAppStore(s => s.user)

  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    if (user) setAnalyticsUser(user.uid, user.tier)
  }, [user?.uid])

  return null
}

// Remote Config initializer — runs once at app mount
function RemoteConfigInit() {
  useEffect(() => {
    void initRemoteConfig()
  }, [])
  return null
}

// Inner shell — reads sidebar state for desktop offset
function AppShellInner({ children }: { children: React.ReactNode }) {
  useNotifications()
  const sidebarCollapsed = useAppStore(s => s.sidebarCollapsed)

  const desktopOffset = sidebarCollapsed
    ? 'var(--sidebar-collapsed)'
    : 'var(--sidebar-width)'

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: 'var(--bg-root)' }}
    >
      {/* Desktop sidebar — fixed, always visible on md+ */}
      <Sidebar mobile={false} />
      {/* Mobile sidebar — overlay drawer */}
      <Sidebar mobile={true} />

      {/* Content wrapper — offset on desktop to sit right of the sidebar */}
      <div
        className="flex-1 flex flex-col transition-[padding] duration-300 ease-out"
        style={{
          paddingLeft: `clamp(0px, calc((100vw - 767px) * 9999), ${desktopOffset})`,
        }}
      >
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
          style={{ background: '#F59E0B', color: '#08090D' }}
        >
          Skip to main content
        </a>
        <NavBar />
        <main
          id="main-content"
          role="main"
          className="flex-1 overflow-y-auto"
          style={{
            paddingTop:    'var(--nav-height)',
            paddingBottom: '32px',
            background:    'var(--bg-root)',
          }}
        >
          <div className="page-enter">
            {children}
          </div>
        </main>
      </div>

      {/* Global overlays */}
      <ChatBot />
      <ToastContainer />
    </div>
  )
}

function AppShell({ children }: { children: React.ReactNode }) {
  return <AppShellInner>{children}</AppShellInner>
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeController />
        <AnalyticsTracker />
        <RemoteConfigInit />
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={
            <ProtectedRoute>
              <AppShell><Navigate to="/home" replace /></AppShell>
            </ProtectedRoute>
          } />

          {[
            { path: '/home',          element: <HomePage /> },
            { path: '/dashboard',     element: <DashboardPage /> },
            { path: '/food',          element: <FoodPage /> },
            { path: '/cart',          element: <CartPage /> },
            { path: '/wallet',        element: <WalletPage /> },
            { path: '/profile',       element: <ProfilePage /> },
            { path: '/notifications', element: <NotificationsPage /> },
            { path: '/settings',      element: <SettingsPage /> },
            { path: '/ar',            element: <ARPreviewPage /> },
            { path: '/stats',         element: <ActivityTimelinePage /> },
            { path: '/admin',         element: <AdminPage /> },
          ].map(({ path, element }) => (
            <Route key={path} path={path} element={
              <ProtectedRoute>
                <AppShell>{element}</AppShell>
              </ProtectedRoute>
            } />
          ))}

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
