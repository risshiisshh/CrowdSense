import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Menu } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import LiveDot from '../ui/LiveDot'

export default function NavBar() {
  const navigate = useNavigate()
  const unreadCount = useAppStore(s => s.unreadCount)
  const user = useAppStore(s => s.user)
  const { toggleSidebar, sidebarCollapsed } = useAppStore()

  return (
    <header
      className="navbar-desktop fixed top-0 z-40 flex items-center justify-between px-4 transition-[left] duration-300 ease-out"
      data-collapsed={sidebarCollapsed}
      style={{
        left: 0,
        right: 0,
        height: 'var(--nav-height)',
        background: 'var(--surface)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 0 var(--border-subtle)',
      }}
    >
      {/* Left: Hamburger (mobile) + Logo (mobile only / collapses on desktop behind sidebar) */}
      <div className="flex items-center gap-2">
        {/* Hamburger — mobile only */}
        <button
          className="p-2 rounded-lg md:hidden"
          style={{ color: 'var(--text-secondary)' }}
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Logo — mobile only (desktop shows logo in sidebar) */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 md:hidden"
        >
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center font-display text-base"
            style={{ background: '#F59E0B', color: '#08090D' }}
          >
            CS
          </div>
        </button>
      </div>

      {/* Center — LIVE indicator */}
      <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
        <LiveDot color="#FF6B6B" size={6} />
        <span className="text-xs font-body font-semibold text-text-secondary uppercase tracking-widest">
          Live
        </span>
      </div>

      {/* Right — Bell + Avatar */}
      <div className="flex items-center gap-3">
        <button
          className="relative w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)' }}
          onClick={() => navigate('/notifications')}
          aria-label="Notifications"
        >
          <Bell size={16} className="text-text-secondary" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-body font-bold"
              style={{ background: '#FF6B6B', color: '#fff' }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="w-9 h-9 rounded-full overflow-hidden border-2"
          style={{ borderColor: '#F59E0B' }}
          aria-label="Profile"
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-display text-sm"
              style={{ background: 'var(--surface-3)', color: '#F59E0B' }}
            >
              {user?.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </button>
      </div>
    </header>
  )
}
