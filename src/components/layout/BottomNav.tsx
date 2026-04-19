import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home, Map, ShoppingBag, Wallet, User } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

const NAV_ITEMS = [
  { path: '/home',      icon: Home,       label: 'Home'   },
  { path: '/dashboard', icon: Map,        label: 'Map'    },
  { path: '/food',      icon: ShoppingBag,label: 'Food'   },
  { path: '/wallet',    icon: Wallet,     label: 'Wallet' },
  { path: '/profile',   icon: User,       label: 'Profile'},
]

export default function BottomNav() {
  const location = useLocation()
  const cartCount = useAppStore(s => s.cartCount)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2"
      style={{
        height: 'var(--bottom-nav-height)',
        background: 'rgba(8,9,13,0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-subtle)',
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
      }}
    >
      {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
        const active = location.pathname === path
        const isFood = path === '/food'

        return (
          <NavLink
            key={path}
            to={path}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 relative"
            aria-label={label}
          >
            <div className="relative">
              <Icon
                size={20}
                style={{ color: active ? '#F59E0B' : 'var(--text-muted)' }}
                strokeWidth={active ? 2.5 : 1.8}
              />
              {/* Cart badge on Food icon */}
              {isFood && cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ background: '#FF6B6B', color: '#fff' }}
                >
                  {cartCount}
                </span>
              )}
            </div>
            <span
              className="text-[10px] font-body font-medium"
              style={{ color: active ? '#F59E0B' : 'var(--text-muted)' }}
            >
              {label}
            </span>
            {/* Active dot */}
            {active && (
              <span
                className="absolute -bottom-1 w-1 h-1 rounded-full"
                style={{ background: '#F59E0B' }}
              />
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
