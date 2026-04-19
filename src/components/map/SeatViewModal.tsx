import React from 'react'
import { X, Users, Clock, Utensils, Navigation } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import type { CrowdZone } from '../../types'
import { getZoneColor, getZoneStatus, formatWait } from '../../lib/crowd'
import Badge from '../ui/Badge'
import ProgressBar from '../ui/ProgressBar'

interface SeatViewModalProps {
  zone: CrowdZone
}

export default function SeatViewModal({ zone }: SeatViewModalProps) {
  const setShowSeatView = useAppStore(s => s.setShowSeatView)
  const color = getZoneColor(zone.level)
  const pct = Math.round((zone.occupancy / zone.capacity) * 100)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', animation: 'fadeIn 0.2s' }}
      onClick={() => setShowSeatView(false)}
    >
      <div
        className="w-full max-w-lg surface-card rounded-t-2xl pb-8 pt-4 px-4"
        style={{ animation: 'slideUp 0.3s ease-out', maxHeight: '85dvh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: 'var(--border)' }} />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl tracking-wide" style={{ color }}>
              {zone.name}
            </h2>
            <Badge label={getZoneStatus(zone.level)} variant={zone.level} dot />
          </div>
          <button onClick={() => setShowSeatView(false)} className="text-text-muted hover:text-text-primary p-1">
            <X size={20} />
          </button>
        </div>

        {/* Canvas perspective view placeholder */}
        <div
          className="w-full rounded-xl mb-4 overflow-hidden flex items-center justify-center"
          style={{ height: 180, background: 'var(--surface-2)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="text-center">
            {/* Simple perspective grid as canvas placeholder */}
            <svg width="260" height="140" viewBox="0 0 260 140">
              {/* Pitch perspective lines */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((t, i) => (
                <line key={i}
                  x1={130 - 110 * t} y1={20 + 100 * t}
                  x2={130 + 110 * t} y2={20 + 100 * t}
                  stroke="rgba(16,185,129,0.25)" strokeWidth={0.8}
                />
              ))}
              {[-2,-1,0,1,2].map((n, i) => (
                <line key={`v${i}`}
                  x1={130 + n * 15} y1={20}
                  x2={130 + n * 55} y2={120}
                  stroke="rgba(16,185,129,0.2)" strokeWidth={0.6}
                />
              ))}
              {/* Field oval */}
              <ellipse cx="130" cy="70" rx="100" ry="50"
                fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="1" strokeDasharray="4,3" />
              {/* Players */}
              {[[130,70],[110,62],[145,58],[120,80],[140,75]].map(([cx,cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3" fill="rgba(245,158,11,0.7)" />
              ))}
              <text x="130" y="138" textAnchor="middle" fontSize="9" fill="rgba(148,163,184,0.7)" fontFamily="DM Sans">
                Section {zone.section} • Row 12 • Seat 7
              </text>
            </svg>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { icon: <Users size={14} />, label: 'Occupancy', value: `${pct}%` },
            { icon: <Clock size={14} />, label: 'Wait Time', value: formatWait(zone.waitMinutes) },
            { icon: <Utensils size={14} />, label: 'Counters', value: '2 Nearby' },
          ].map(({ icon, label, value }) => (
            <div key={label}
              className="surface-card-2 p-2.5 text-center rounded-lg"
            >
              <div className="flex justify-center mb-1" style={{ color }}>{icon}</div>
              <p className="font-display text-lg" style={{ color }}>{value}</p>
              <p className="text-[10px] text-text-muted">{label}</p>
            </div>
          ))}
        </div>

        {/* Occupancy bar */}
        <div className="mb-4">
          <p className="text-xs text-text-secondary mb-1.5">Zone Occupancy</p>
          <ProgressBar value={pct} color={color} height={6} />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-body font-semibold text-sm transition-all"
            style={{ background: '#F59E0B', color: '#08090D' }}
          >
            <Navigation size={14} />
            Navigate Here
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-body font-semibold text-sm border transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            onClick={() => setShowSeatView(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
