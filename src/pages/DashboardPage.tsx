import React, { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import StadiumMap from '../components/map/StadiumMap'
import Badge from '../components/ui/Badge'
import ProgressBar from '../components/ui/ProgressBar'
import LiveDot from '../components/ui/LiveDot'
import { useCrowdZones } from '../hooks/useCrowdZones'
import { getZoneColor, getZoneStatus, formatWait } from '../lib/crowd'
import { useAppStore } from '../store/useAppStore'
import { MOCK_ZONES, MOCK_GATES } from '../data/mockData'
import type { CrowdZone } from '../types'
import { TrendingUp, TrendingDown, Minus, Navigation, Shield, Utensils, DoorOpen, Search } from 'lucide-react'

// Nearby facilities per zone
const NEARBY: Record<string, { icon: React.ReactNode; name: string; dist: string; status: 'clear' | 'busy' | 'high' }[]> = {
  z1: [{ icon: <DoorOpen size={14} />, name: 'Exit A', dist: '60m away', status: 'clear' }, { icon: <Utensils size={14} />, name: 'Spice Route', dist: 'North end', status: 'high' }],
  z2: [{ icon: <DoorOpen size={14} />, name: 'Exit B', dist: '45m away', status: 'clear' }, { icon: <Utensils size={14} />, name: 'Grill 112', dist: 'South end', status: 'busy' }],
  z3: [{ icon: <DoorOpen size={14} />, name: 'Exit C', dist: '30m away', status: 'clear' }, { icon: <Utensils size={14} />, name: 'Chai Corner', dist: 'East entry', status: 'clear' }],
  z4: [{ icon: <DoorOpen size={14} />, name: 'Exit D', dist: '35m away', status: 'busy' }, { icon: <Utensils size={14} />, name: 'Mega Bites', dist: 'West wing', status: 'high' }],
  z5: [{ icon: <DoorOpen size={14} />, name: 'VIP Gate', dist: '20m away', status: 'clear' }, { icon: <Utensils size={14} />, name: 'Lounge Bar', dist: 'Level 2', status: 'clear' }],
  z6: [{ icon: <DoorOpen size={14} />, name: 'Press Exit', dist: '15m away', status: 'clear' }, { icon: <Utensils size={14} />, name: 'Media Café', dist: 'Press box', status: 'clear' }],
  z7: [{ icon: <DoorOpen size={14} />, name: 'East Gate', dist: '40m away', status: 'clear' }, { icon: <Utensils size={14} />, name: 'Green Bowl', dist: 'Family zone', status: 'busy' }],
  z8: [{ icon: <DoorOpen size={14} />, name: 'Upper Exit', dist: '55m away', status: 'busy' }, { icon: <Utensils size={14} />, name: 'Burger Blvd', dist: 'Upper deck', status: 'high' }],
}

const statusColor = { clear: '#10B981', busy: '#F59E0B', high: '#FF6B6B' }
const statusLabel = { clear: 'Clear', busy: 'Moderate', high: 'High Traffic' }

export default function DashboardPage() {
  const { zones, gates, lastUpdated } = useCrowdZones()
  const { mapState } = useAppStore()
  const [selectedZone, setSelectedZone] = useState<CrowdZone | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const now = new Date()
  const secAgo = Math.round((now.getTime() - lastUpdated.getTime()) / 1000)

  const activeZone = selectedZone ?? (mapState.selectedZoneId ? MOCK_ZONES.find(z => z.id === mapState.selectedZoneId) ?? null : null)
  const activeColor = activeZone ? getZoneColor(activeZone.level) : '#F59E0B'
  const activePct = activeZone ? Math.round((activeZone.occupancy / activeZone.capacity) * 100) : null
  const nearby = activeZone ? (NEARBY[activeZone.id] ?? []) : []

  const TrendIcon = activeZone?.trend === 'rising' ? TrendingUp : activeZone?.trend === 'falling' ? TrendingDown : Minus

  return (
    <PageWrapper fullBleed>
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 pt-5 pb-3 flex items-center justify-between page-header">
        <div>
          <h1 className="font-display text-4xl text-gradient-amber tracking-wide">VENUE MAP</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <LiveDot color="#10B981" size={5} />
            <span className="text-[11px] font-body" style={{ color: 'var(--text-muted)' }}>
              Updated {secAgo < 5 ? 'just now' : `${secAgo}s ago`}
            </span>
          </div>
        </div>
        <Badge label="LIVE" variant="success" dot />
      </div>

      {/* Search bar */}
      <div className="px-4 md:px-6 lg:px-8 pb-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search sections, exits, stalls…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-body outline-none"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>

      {/* Main content — two-column on desktop */}
      <div className="px-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-5">

          {/* Left: Map */}
          <div className="flex-1 min-w-0">
            <StadiumMap
              onZoneSelect={setSelectedZone}
              selectedZoneId={activeZone?.id ?? null}
            />
          </div>

          {/* Right: Detail panel */}
          <div className="lg:w-80 xl:w-96 flex-shrink-0">
            {activeZone ? (
              <div className="scale-in flex flex-col gap-3">
                {/* Zone header */}
                <div className="surface-card p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Selected Zone</p>
                      <h2 className="font-display text-2xl mt-0.5" style={{ color: 'var(--text-primary)' }}>{activeZone.name}</h2>
                      <p className="text-xs font-body mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        Section {activeZone.section} · {getZoneStatus(activeZone.level)}
                      </p>
                    </div>
                    <Badge label="LIVE" variant="success" dot />
                  </div>
                </div>

                {/* Crowd density */}
                <div className="surface-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Crowd Density</p>
                    <div className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: activeColor }}>
                      <TrendIcon size={12} />
                      <span>{activeZone.trend === 'rising' ? 'Trending Up' : activeZone.trend === 'falling' ? 'Trending Down' : 'Stable'}</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="font-display text-5xl" style={{ color: activeColor }}>{activePct}</span>
                    <span className="font-display text-2xl" style={{ color: activeColor }}>%</span>
                    <span className="text-xs font-body ml-1" style={{ color: 'var(--text-muted)' }}>Capacity</span>
                  </div>
                  <ProgressBar value={activePct!} color={activeColor} height={6} />
                  <div className="flex justify-between mt-2">
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{formatWait(activeZone.waitMinutes)}</span>
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{activeZone.occupancy}/{activeZone.capacity}</span>
                  </div>
                </div>

                {/* Nearby facilities */}
                {nearby.length > 0 && (
                  <div className="surface-card p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Nearby Facilities</p>
                    <div className="grid grid-cols-2 gap-2">
                      {nearby.map((f, i) => (
                        <div key={i} className="surface-card-2 p-3 hover-glow">
                          <div className="mb-1.5" style={{ color: 'var(--text-muted)' }}>{f.icon}</div>
                          <p className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>{f.name}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{f.dist}</p>
                          <p className="text-[10px] font-semibold mt-1" style={{ color: statusColor[f.status] }}>
                            {statusLabel[f.status]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dispatch button */}
                <button
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-body font-semibold text-sm hover-glow"
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <Shield size={15} style={{ color: '#F59E0B' }} />
                  Dispatch Security
                </button>
              </div>
            ) : (
              /* No zone selected — show summary cards */
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Zone Overview</p>
                <div className="grid grid-cols-2 gap-2 stagger-children">
                  {MOCK_ZONES.slice(0, 6).map(zone => {
                    const color = getZoneColor(zone.level)
                    const pct = Math.round((zone.occupancy / zone.capacity) * 100)
                    return (
                      <div key={zone.id} className="surface-card p-3 hover-glow cursor-pointer"
                        onClick={() => setSelectedZone(zone)}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {zone.name.split(' ')[0]}
                          </span>
                          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                        </div>
                        <span className="font-display text-xl" style={{ color }}>{pct}%</span>
                        <ProgressBar value={pct} color={color} height={3} className="mt-1.5" />
                      </div>
                    )
                  })}
                </div>

                {/* Gate status */}
                <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--text-secondary)' }}>Gate Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {MOCK_GATES.map(gate => {
                    const color = getZoneColor(gate.level)
                    return (
                      <div key={gate.id} className="surface-card p-3 hover-glow">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-body font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>{gate.name.split(' ').slice(0,2).join(' ')}</span>
                          <span className="w-2 h-2 rounded-full"
                            style={{ background: gate.status === 'closed' ? '#EF4444' : gate.status === 'limited' ? '#F59E0B' : '#10B981' }} />
                        </div>
                        <p className="font-display text-2xl" style={{ color }}>{gate.waitMinutes}m</p>
                        <p className="text-[10px] capitalize" style={{ color: 'var(--text-muted)' }}>{gate.status}</p>
                      </div>
                    )
                  })}
                </div>

                {/* Crowd flow chart */}
                <div className="surface-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>Crowd Flow (Last 2h)</p>
                  <svg viewBox="0 0 300 80" className="w-full">
                    {[20, 40, 60].map(y => (
                      <line key={y} x1="0" y1={y} x2="300" y2={y}
                        stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    ))}
                    <defs>
                      <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 60 C30 55, 60 40, 90 35 S140 42 170 30 S220 15 260 20 L300 18 L300 80 L0 80 Z"
                      fill="url(#flowGrad)" />
                    <path d="M0 60 C30 55, 60 40, 90 35 S140 42 170 30 S220 15 260 20 L300 18"
                      fill="none" stroke="#F59E0B" strokeWidth="2" className="chart-line"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(245,158,11,0.5))' }} />
                    {['7PM','8PM','9PM','NOW'].map((label, i) => (
                      <text key={label} x={i * 98 + 2} y={78} fontSize="7" fontFamily="DM Sans"
                        fill="rgba(148,163,184,0.6)">{label}</text>
                    ))}
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
