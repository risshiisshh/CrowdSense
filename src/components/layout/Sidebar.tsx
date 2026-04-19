import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home, Map, ShoppingBag, Wallet, User,
  Bell, Settings, Camera, Bot,
  ChevronLeft, ChevronRight, X,
  BarChart3, Shield
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import LiveDot from '../ui/LiveDot'

const PRIMARY_NAV = [
  { path: '/home',      icon: Home,        label: 'Home'    },
  { path: '/dashboard', icon: Map,         label: 'Map'     },
  { path: '/food',      icon: ShoppingBag, label: 'Food'    },
  { path: '/wallet',    icon: Wallet,      label: 'Wallet'  },
  { path: '/profile',   icon: User,        label: 'Profile' },
]

const SECONDARY_NAV = [
  { path: '/notifications', icon: Bell,      label: 'Alerts'   },
  { path: '/stats',         icon: BarChart3, label: 'My Stats' },
  { path: '/admin',         icon: Shield,    label: 'Admin'    },
  { path: '/settings',      icon: Settings,  label: 'Settings' },
  { path: '/ar',            icon: Camera,    label: 'AR View'  },
]

interface NavItemProps {
  path: string
  icon: React.ElementType
  label: string
  collapsed: boolean
  badge?: number
  onClick?: () => void
}

function NavItem({ path, icon: Icon, label, collapsed, badge, onClick }: NavItemProps) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
        ${isActive
          ? 'text-amber-400'
          : 'text-text-muted hover:text-text-secondary'
        }`
      }
      style={({ isActive }) => ({
        background: isActive ? 'rgba(245,158,11,0.1)' : 'transparent',
        ...(isActive ? { borderLeft: '2px solid #F59E0B', marginLeft: '-1px' } : {}),
      })}
      aria-label={label}
    >
      {({ isActive }) => (
        <>
          {/* Left active bar (when not using border trick above) */}
          <div className="relative flex-shrink-0">
            <Icon
              size={20}
              strokeWidth={isActive ? 2.5 : 1.8}
              style={{ color: isActive ? '#F59E0B' : undefined }}
            />
            {badge != null && badge > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: '#FF6B6B', color: '#fff' }}
              >
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </div>

          {/* Label — hidden when collapsed */}
          {!collapsed && (
            <span className="font-body font-medium text-sm whitespace-nowrap overflow-hidden">
              {label}
            </span>
          )}

          {/* Tooltip on collapsed hover */}
          {collapsed && (
            <div
              className="absolute left-full ml-2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap z-50 pointer-events-none
                opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              style={{ background: 'var(--surface-3)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}
            >
              {label}
            </div>
          )}
        </>
      )}
    </NavLink>
  )
}

interface SidebarProps {
  mobile?: boolean
}

export default function Sidebar({ mobile = false }: SidebarProps) {
  const navigate = useNavigate()
  const {
    user, cartCount, unreadCount,
    sidebarOpen, setSidebarOpen,
    sidebarCollapsed, toggleSidebarCollapse,
    toggleChat,
  } = useAppStore()

  // On desktop, use collapsed state; on mobile drawer always full width
  const collapsed = !mobile && sidebarCollapsed

  function handleMobileClose() {
    if (mobile) setSidebarOpen(false)
  }

  const tierEmoji: Record<string, string> = {
    bronze: '🥉', silver: '🥈', gold: '🥇', platinum: '💎', legend: '👑'
  }

  return (
    <>
      {/* Mobile backdrop */}
      {mobile && sidebarOpen && (
        <div
          className="sidebar-backdrop fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col
          transition-all duration-300 ease-out
          ${mobile
            ? `md:hidden w-[240px] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `hidden md:flex ${collapsed ? 'w-[72px]' : 'w-[240px]'}`
          }
        `}
        style={{
          background: 'var(--surface)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--border-subtle)',
        }}
      >
        {/* ── Header: Logo + Collapse toggle ── */}
        <div
          className="flex items-center justify-between px-3 flex-shrink-0"
          style={{
            height: 'var(--nav-height)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {/* Logo */}
          <button
            className="flex items-center gap-2.5 min-w-0"
            onClick={() => { navigate('/home'); handleMobileClose() }}
          >
            <div
              className="w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center font-display text-base"
              style={{ background: '#F59E0B', color: '#08090D' }}
            >
              CS
            </div>
            {!collapsed && (
              <span className="font-display text-base tracking-wider text-gradient-amber truncate">
                CROWDSENSE
              </span>
            )}
          </button>

          {/* Close on mobile / collapse toggle on desktop */}
          {mobile ? (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg flex-shrink-0"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={16} />
            </button>
          ) : (
            <button
              onClick={toggleSidebarCollapse}
              className="p-1.5 rounded-lg flex-shrink-0 transition-colors hover:text-amber-400"
              style={{ color: 'var(--text-muted)' }}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>

        {/* ── Live indicator ── */}
        {!collapsed && (
          <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <LiveDot color="#FF6B6B" size={5} />
            <span className="text-[10px] font-body font-semibold text-text-muted uppercase tracking-widest">Live · match in progress</span>
          </div>
        )}

        {/* ── Primary Nav ── */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-2 pt-3 space-y-0.5">
          {PRIMARY_NAV.map(({ path, icon, label }) => (
            <NavItem
              key={path}
              path={path}
              icon={icon}
              label={label}
              collapsed={collapsed}
              badge={path === '/food' ? cartCount : undefined}
              onClick={handleMobileClose}
            />
          ))}

          {/* Divider */}
          <div className="my-2 mx-1" style={{ height: 1, background: 'var(--border-subtle)' }} />

          {SECONDARY_NAV.map(({ path, icon, label }) => (
            <NavItem
              key={path}
              path={path}
              icon={icon}
              label={label}
              collapsed={collapsed}
              badge={path === '/notifications' ? unreadCount : undefined}
              onClick={handleMobileClose}
            />
          ))}
        </nav>

        {/* ── AI Chatbot button ── */}
        <div className="px-2 py-2 flex-shrink-0" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <button
            id="open-chatbot-btn"
            onClick={() => { toggleChat(); handleMobileClose() }}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
              hover:opacity-90 active:scale-98
            `}
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(59,130,246,0.2) 100%)',
              border: '1px solid rgba(139,92,246,0.35)',
            }}
          >
            <div
              className="w-5 h-5 flex items-center justify-center flex-shrink-0"
              style={{ color: '#8B5CF6' }}
            >
              <Bot size={18} />
            </div>
            {!collapsed && (
              <span className="font-body font-semibold text-sm" style={{ color: '#8B5CF6' }}>
                AI Assistant
              </span>
            )}
          </button>
        </div>

        {/* ── User card ── */}
        {user && (
          <div
            className="px-3 py-3 flex-shrink-0 flex items-center gap-3 min-w-0"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            {/* Avatar */}
            <button
              className="w-8 h-8 rounded-full overflow-hidden border-2 flex-shrink-0"
              style={{ borderColor: '#F59E0B' }}
              onClick={() => { navigate('/profile'); handleMobileClose() }}
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center font-display text-xs"
                  style={{ background: 'var(--surface-3)', color: '#F59E0B' }}
                >
                  {user.displayName?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </button>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="font-body font-semibold text-xs text-text-primary truncate">
                  {user.displayName}
                </p>
                <p className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
                  <span>{tierEmoji[user.tier] || '🥉'}</span>
                  <span className="capitalize">{user.tier}</span>
                  <span className="text-amber-400 font-semibold">· {user.points.toLocaleString()} pts</span>
                </p>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  )
}
