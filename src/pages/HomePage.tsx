import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, MapPin, ShoppingBag, Zap, Settings } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import StatCard from '../components/ui/StatCard'
import LiveDot from '../components/ui/LiveDot'
import Badge from '../components/ui/Badge'
import OrderTracker from '../components/food/OrderTracker'
import { useAppStore } from '../store/useAppStore'
import { useCrowdZones } from '../hooks/useCrowdZones'
import { useOrders } from '../hooks/useOrders'
import { MOCK_EVENT, UPCOMING_EVENTS } from '../data/mockData'
import { getZoneColor } from '../lib/crowd'

export default function HomePage() {
  const navigate = useNavigate()
  const user = useAppStore(s => s.user)
  const alerts = useAppStore(s => s.alerts)
  const { zones, gates } = useCrowdZones()
  const { activeOrder } = useOrders()

  const unreadAlert = alerts.find(a => !a.isRead && a.type === 'warning')
  const avgOccupancy = zones.length
    ? Math.round(zones.reduce((s, z) => s + Math.round((z.occupancy / z.capacity) * 100), 0) / zones.length)
    : 0

  return (
    <PageWrapper>
      {/* ─── Live match hero ─── */}
      <div
        className="mt-4 rounded-2xl overflow-hidden relative hover-glow"
        style={{
          background: 'linear-gradient(135deg, #0F1117 0%, #1a1200 50%, #0F1117 100%)',
          border: '1px solid rgba(245,158,11,0.2)',
          boxShadow: '0 4px 40px rgba(245,158,11,0.1)',
        }}
      >
        {/* Background concentric rings */}
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
            {[...Array(5)].map((_, i) => (
              <ellipse key={i} cx="200" cy="100" rx={80 + i * 40} ry={40 + i * 20}
                fill="none" stroke="#F59E0B" strokeWidth="0.8" />
            ))}
          </svg>
        </div>

        <div className="p-5 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LiveDot color="#FF6B6B" size={6} />
              <span className="font-body text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Live · {MOCK_EVENT.venue}
              </span>
            </div>
            <Badge label={MOCK_EVENT.round} variant="amber" size="sm" />
          </div>

          {/* Scoreboard */}
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="font-body text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Home</p>
              <p className="font-display text-xl text-gradient-amber">
                {MOCK_EVENT.homeTeam.split(' ').pop()}
              </p>
              <p className="font-display text-6xl mt-1" style={{ color: '#F59E0B', lineHeight: 1 }}>
                {MOCK_EVENT.homeScore}
              </p>
            </div>
            <div className="text-center px-5">
              <div className="surface-card-2 rounded-xl px-4 py-2">
                <p className="font-display text-xl" style={{ color: 'var(--text-muted)', letterSpacing: '0.2em' }}>VS</p>
                <p className="text-[10px] font-body mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {MOCK_EVENT.attendance.toLocaleString()} fans
                </p>
              </div>
            </div>
            <div className="text-center flex-1">
              <p className="font-body text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Away</p>
              <p className="font-display text-xl" style={{ color: 'var(--text-secondary)' }}>
                {MOCK_EVENT.awayTeam.split(' ').pop()}
              </p>
              <p className="font-display text-6xl mt-1" style={{ color: 'var(--text-secondary)', lineHeight: 1 }}>
                {MOCK_EVENT.awayScore}
              </p>
            </div>
          </div>

          {/* Your seat */}
          <div className="mt-4 pt-4 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(245,158,11,0.15)' }}>
            <div className="flex items-center gap-1.5">
              <MapPin size={12} color="#F59E0B" />
              <span className="text-xs font-body" style={{ color: 'var(--text-secondary)' }}>
                Section {user?.seatSection} · Row {user?.seatRow} · Seat {user?.seatNumber}
              </span>
            </div>
            <button
              className="text-xs font-semibold flex items-center gap-0.5 transition-colors hover:text-amber-300"
              style={{ color: '#F59E0B' }}
              onClick={() => navigate('/dashboard')}
            >
              View map <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Alert banner ─── */}
      {unreadAlert && (
        <button
          className="mt-3 w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl hover-glow-coral"
          style={{
            background: 'rgba(255,107,107,0.12)',
            border: '1px solid rgba(255,107,107,0.35)',
            animation: 'staggerFadeUp 0.4s ease-out both',
          }}
          onClick={() => navigate('/notifications')}
        >
          <span className="text-base">⚠️</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: '#FF6B6B' }}>{unreadAlert.title}</p>
            <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{unreadAlert.message}</p>
          </div>
          <ChevronRight size={14} style={{ color: '#FF6B6B' }} />
        </button>
      )}

      {/* ─── Stats grid ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 stagger-children">
        <StatCard
          label="Avg Crowd"
          value={`${avgOccupancy}%`}
          sub="stadium occupancy"
          color={getZoneColor(avgOccupancy > 75 ? 'high' : avgOccupancy > 50 ? 'medium' : 'low')}
        />
        <StatCard
          label="Open Gates"
          value={gates.filter(g => g.status === 'open').length}
          sub={`of ${gates.length} total`}
          color="#10B981"
        />
        <StatCard
          label="Your Points"
          value={user?.points.toLocaleString() ?? '0'}
          sub={`${user?.tier ?? ''} tier`}
          color="#F59E0B"
        />
        <StatCard
          label="Food Counters"
          value="5"
          sub="counters open"
          color="#8B5CF6"
        />
      </div>

      {/* ─── Active order tracker ─── */}
      {activeOrder && (
        <div className="mt-4">
          <p className="text-xs font-body font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Active Order</p>
          <OrderTracker status={activeOrder.status} estimatedMinutes={activeOrder.estimatedMinutes} />
        </div>
      )}

      {/* ─── Quick actions ─── */}
      <div className="mt-5">
        <p className="text-xs font-body font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Quick Actions</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger-children">
          {[
            { icon: <MapPin size={20} />,       label: 'Live Map',   sub: 'Zone crowd levels', path: '/dashboard', color: '#F59E0B' },
            { icon: <ShoppingBag size={20} />,  label: 'Order Food', sub: 'Seat delivery',     path: '/food',      color: '#10B981' },
            { icon: <Zap size={20} />,          label: 'AR Preview', sub: 'View your area',    path: '/ar',        color: '#8B5CF6' },
            { icon: <Settings size={20} />,     label: 'Settings',   sub: 'Preferences',       path: '/settings',  color: '#3B82F6' },
          ].map(({ icon, label, sub, path, color }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="surface-card p-5 text-left hover-glow group"
            >
              <div className="mb-3 w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: `${color}18`, color }}>
                {icon}
              </div>
              <p className="font-body font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Upcoming events ─── */}
      <div className="mt-5 mb-2">
        <p className="text-xs font-body font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Coming Up</p>
        <div className="space-y-2 stagger-children">
          {UPCOMING_EVENTS.map(ev => (
            <div key={ev.id} className="surface-card p-4 flex items-center justify-between hover-glow">
              <div>
                <p className="font-body font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {ev.homeTeam} vs {ev.awayTeam}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {ev.venue} · {ev.date} · {ev.startTime}
                </p>
              </div>
              <Badge label="Upcoming" variant="info" size="sm" />
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}
