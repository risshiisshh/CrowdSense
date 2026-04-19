import React from 'react'
import { ChevronRight, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import { useAppStore } from '../store/useAppStore'

function Toggle({
  value,
  onChange,
}: {
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      role="switch"
      aria-checked={value}
      className="w-11 h-6 rounded-full relative flex-shrink-0 transition-all duration-300"
      style={{ background: value ? '#F59E0B' : 'var(--surface-3)' }}
      onClick={() => onChange(!value)}
    >
      <div
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
        style={{ left: value ? 'calc(100% - 20px)' : '4px' }}
      />
    </button>
  )
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const {
    user, setUser, showToast,
    theme, toggleTheme, compactView, toggleCompactView,
    updateUserPreference, triggerHaptic,
  } = useAppStore()

  const prefs = user?.preferences

  function handleSignOut() {
    setUser(null)
    showToast('Signed out successfully', 'info')
    navigate('/login')
  }

  function handlePrefToggle(key: keyof NonNullable<typeof prefs>, current: boolean) {
    triggerHaptic(10)
    updateUserPreference(key, !current)
    showToast(`${key === 'haptics' ? 'Haptic Feedback' : key === 'liveUpdates' ? 'Live Updates' : key === 'foodAlerts' ? 'Food Alerts' : key === 'arFeatures' ? 'AR Features' : 'Setting'} ${!current ? 'enabled' : 'disabled'}`, !current ? 'success' : 'info')
  }

  const section = (title: string, items: React.ReactNode) => (
    <div className="mt-5">
      <p className="text-[10px] font-body font-semibold mb-2 uppercase tracking-widest px-1"
         style={{ color: 'var(--text-muted)' }}>{title}</p>
      <div className="surface-card overflow-hidden">
        {items}
      </div>
    </div>
  )

  const row = (label: string, sub?: string, right?: React.ReactNode, onClick?: () => void) => (
    <div
      className="flex items-center justify-between px-4 py-3.5 border-b last:border-0 transition-colors"
      style={{ borderColor: 'var(--border-subtle)', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div>
        <p className="font-body text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
        {sub && <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
      </div>
      {right ?? <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
    </div>
  )

  return (
    <PageWrapper>
      <div className="pt-5 pb-2 page-header">
        <h1 className="font-display text-4xl text-gradient-amber tracking-wide">SETTINGS</h1>
      </div>

      {/* Account */}
      {section('Account', <>
        {row('Profile', user?.email, <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />, () => navigate('/profile'))}
        {row('Seat & Ticket', `Section ${user?.seatSection} Row ${user?.seatRow} Seat ${user?.seatNumber}`)}
        {row('Language', 'English', <span className="text-xs" style={{ color: 'var(--text-muted)' }}>EN</span>)}
      </>)}

      {/* Experience — all toggles wired to user.preferences */}
      {section('Experience', <>
        {row(
          'Live Updates',
          prefs?.liveUpdates ? 'Real-time crowd data active' : 'Real-time crowd data off',
          <Toggle value={prefs?.liveUpdates ?? true} onChange={() => handlePrefToggle('liveUpdates', prefs?.liveUpdates ?? true)} />
        )}
        {row(
          'Food Alerts',
          prefs?.foodAlerts ? 'Counter wait time alerts on' : 'Counter wait time alerts off',
          <Toggle value={prefs?.foodAlerts ?? true} onChange={() => handlePrefToggle('foodAlerts', prefs?.foodAlerts ?? true)} />
        )}
        {row(
          'Haptic Feedback',
          prefs?.haptics ? 'Touch vibration active' : 'Touch vibration off',
          <Toggle value={prefs?.haptics ?? true} onChange={() => {
            // Special: vibrate before disabling
            if (prefs?.haptics && 'vibrate' in navigator) navigator.vibrate([20, 50, 20])
            updateUserPreference('haptics', !(prefs?.haptics ?? true))
            showToast(`Haptic Feedback ${!(prefs?.haptics ?? true) ? 'enabled' : 'disabled'}`, !(prefs?.haptics ?? true) ? 'success' : 'info')
          }} />
        )}
        {row(
          'AR Features',
          prefs?.arFeatures ? 'Augmented reality overlays on' : 'AR overlays off',
          <Toggle value={prefs?.arFeatures ?? true} onChange={() => handlePrefToggle('arFeatures', prefs?.arFeatures ?? true)} />
        )}
      </>)}

      {/* Preferences */}
      {section('Preferences', <>
        {row(
          'Dark Mode',
          theme === 'dark' ? 'Currently in dark mode' : 'Currently in light mode',
          <Toggle value={theme === 'dark'} onChange={() => { triggerHaptic(10); toggleTheme() }} />
        )}
        {row(
          'Compact View',
          compactView ? 'Compact spacing enabled' : 'Show more content in less space',
          <Toggle value={compactView} onChange={() => { triggerHaptic(10); toggleCompactView() }} />
        )}
        {row(
          'Show Points',
          'Display points in UI',
          <Toggle value={prefs?.eventAlerts ?? true} onChange={() => handlePrefToggle('eventAlerts', prefs?.eventAlerts ?? true)} />
        )}
      </>)}

      {/* Data & Privacy */}
      {section('Data & Privacy', <>
        {row(
          'Data Sharing',
          prefs?.dataSharing ? 'Helping improve CrowdSense' : 'Not sharing data',
          <Toggle value={prefs?.dataSharing ?? false} onChange={() => handlePrefToggle('dataSharing', prefs?.dataSharing ?? false)} />
        )}
        {row('Download My Data', undefined, <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />, () => showToast('Data export requested', 'info'))}
        {row('Delete Account',   undefined, <ChevronRight size={14} style={{ color: '#FF6B6B' }} />, () => showToast('Contact support to delete your account', 'info'))}
      </>)}

      {/* Sign out */}
      <div className="mt-5">
        <button
          id="signout-btn"
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-body font-semibold text-sm hover-glow-coral"
          style={{
            background: 'rgba(255,107,107,0.12)',
            border: '1px solid rgba(255,107,107,0.3)',
            color: '#FF6B6B',
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      {/* App info */}
      <div className="mt-6 mb-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-md flex items-center justify-center font-display text-sm"
            style={{ background: '#F59E0B', color: '#08090D' }}>CS</div>
          <span className="font-display text-lg tracking-widest text-amber-400">CROWDSENSE</span>
        </div>
        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Version 1.0.0 — Mission 1</p>
        <div className="flex items-center justify-center gap-4 mt-2">
          {['Privacy Policy', 'Terms of Service', 'Support'].map(link => (
            <span key={link} className="text-[11px] text-amber-500 cursor-pointer hover:text-amber-400 transition-colors">{link}</span>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}
