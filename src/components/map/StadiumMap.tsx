import React, { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { MOCK_ZONES } from '../../data/mockData'
import { getZoneFill, getZoneBorder, getZoneColor } from '../../lib/crowd'
import type { CrowdZone } from '../../types'

// Generic venue map — works for sports, concerts, F1, comedy shows, etc.
// viewBox: 0 0 700 460

const ZONE_PATHS: { id: string; d: string; label: string; lx: number; ly: number }[] = [
  { id: 'z1', d: 'M 70 20 L 630 20 L 600 80 L 100 80 Z',                                         label: 'North Stand',   lx: 350, ly: 50  },
  { id: 'z2', d: 'M 70 440 L 630 440 L 600 380 L 100 380 Z',                                      label: 'South Stand',   lx: 350, ly: 413 },
  { id: 'z3', d: 'M 630 20 L 700 60 L 700 400 L 630 440 L 600 380 L 640 240 L 600 80 Z',          label: 'East Pavilion', lx: 655, ly: 230 },
  { id: 'z4', d: 'M 70 20 L 0 60 L 0 400 L 70 440 L 100 380 L 60 240 L 100 80 Z',                label: 'West Wing',     lx: 45,  ly: 230 },
  { id: 'z5', d: 'M 100 80 L 600 80 L 570 140 L 130 140 Z',                                       label: 'VIP Lounge',    lx: 350, ly: 110 },
  { id: 'z6', d: 'M 100 380 L 600 380 L 570 320 L 130 320 Z',                                     label: 'Press Box',     lx: 350, ly: 352 },
  { id: 'z7', d: 'M 600 80 L 640 240 L 600 380 L 570 320 L 608 240 L 570 140 Z',                  label: 'Family Zone',   lx: 612, ly: 230 },
  { id: 'z8', d: 'M 100 80 L 60 240 L 100 380 L 130 320 L 92 240 L 130 140 Z',                   label: 'Upper Deck',    lx: 88,  ly: 230 },
]

const GATE_POSITIONS = [
  { id: 'g1', x: 350, y: 12,  label: 'G1' },
  { id: 'g2', x: 689, y: 230, label: 'G2' },
  { id: 'g3', x: 11,  y: 230, label: 'G3' },
  { id: 'g4', x: 350, y: 448, label: 'G4' },
]

type MapMode = '2d' | 'heatmap'

interface StadiumMapProps {
  onZoneSelect?: (zone: CrowdZone | null) => void
  selectedZoneId?: string | null
}

export default function StadiumMap({ onZoneSelect, selectedZoneId: externalSelected }: StadiumMapProps) {
  const { setSelectedZone, mapState } = useAppStore()
  const [mapMode, setMapMode] = useState<MapMode>('heatmap')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const zones = MOCK_ZONES
  const zoneMap = new Map(zones.map(z => [z.id, z]))
  const activeZoneId = externalSelected ?? mapState.selectedZoneId

  function handleZoneClick(zoneId: string) {
    const zone = zoneMap.get(zoneId)
    if (!zone) return
    const newId = activeZoneId === zoneId ? null : zoneId
    setSelectedZone(newId)
    onZoneSelect?.(newId ? zone : null)
  }

  function getZoneOpacity(id: string) {
    if (activeZoneId && activeZoneId !== id) return 0.45
    return 1
  }

  return (
    <div className="relative w-full flex flex-col gap-3">
      {/* Mode toggle */}
      <div className="flex items-center gap-2">
        {(['2d', 'heatmap'] as MapMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => setMapMode(mode)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
            style={mapMode === mode
              ? { background: '#F59E0B', color: '#08090D' }
              : { background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }
            }
          >
            {mode === '2d' ? '2D Plan' : 'Heatmap'}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" style={{ animation: 'pulseDot 1.4s ease-in-out infinite' }} />
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>LIVE</span>
        </div>
      </div>

      {/* SVG Map */}
      <div className="relative rounded-xl overflow-hidden" style={{ background: 'rgba(8,9,13,0.8)', border: '1px solid var(--border-subtle)' }}>
        <svg viewBox="0 0 700 460" className="w-full" style={{ maxHeight: 480, display: 'block' }}>
          <defs>
            {/* Generic venue area gradient */}
            <linearGradient id="venueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#1a1a2e" />
              <stop offset="50%"  stopColor="#16213e" />
              <stop offset="100%" stopColor="#1a1a2e" />
            </linearGradient>
            {/* Stage spotlight */}
            <radialGradient id="stageSpot" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(245,158,11,0.12)" />
              <stop offset="100%" stopColor="rgba(245,158,11,0)" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect x="0" y="0" width="700" height="460" fill="rgba(8,9,13,0.5)" />

          {/* === Seating zones === */}
          {ZONE_PATHS.map(({ id, d, label, lx, ly }) => {
            const zone = zoneMap.get(id)
            if (!zone) return null
            const fill   = mapMode === 'heatmap' ? getZoneFill(zone.level)   : 'rgba(30,37,53,0.9)'
            const border = mapMode === 'heatmap' ? getZoneBorder(zone.level) : 'rgba(42,48,71,0.8)'
            const color  = getZoneColor(zone.level)
            const isSelected = activeZoneId === id
            const isHovered  = hoveredId === id
            const pct = Math.round((zone.occupancy / zone.capacity) * 100)

            return (
              <g key={id} style={{ opacity: getZoneOpacity(id), transition: 'opacity 0.25s ease' }}>
                <path
                  d={d}
                  fill={fill}
                  stroke={isSelected ? color : border}
                  strokeWidth={isSelected ? 2.5 : 1}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    filter: isSelected
                      ? `drop-shadow(0 0 10px ${color}99)`
                      : isHovered
                      ? `drop-shadow(0 0 5px ${color}55)`
                      : undefined,
                  }}
                  onClick={() => handleZoneClick(id)}
                  onMouseEnter={() => setHoveredId(id)}
                  onMouseLeave={() => setHoveredId(null)}
                />
                {/* Zone label */}
                {!['z7','z8'].includes(id) && (
                  <text
                    x={lx} y={ly}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="10" fontFamily="DM Sans" fontWeight="600"
                    fill={mapMode === 'heatmap' ? color : 'rgba(148,163,184,0.8)'}
                    className="pointer-events-none select-none"
                  >
                    {id === 'z1' || id === 'z2' ? label : label.split(' ')[0]}
                  </text>
                )}
                {/* Occupancy % overlay */}
                {(isSelected || isHovered) && (
                  <text
                    x={lx} y={ly + 14}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="9" fontFamily="DM Sans" fontWeight="700"
                    fill={color}
                    className="pointer-events-none select-none"
                  >
                    {pct}%
                  </text>
                )}
              </g>
            )
          })}

          {/* === Generic EVENT AREA (works for all venue types) === */}
          <rect x="130" y="140" width="440" height="180"
            fill="url(#venueGrad)"
            stroke="rgba(245,158,11,0.2)" strokeWidth="1.5" rx="6" />

          {/* Spotlight overlay */}
          <ellipse cx="350" cy="230" rx="200" ry="80" fill="url(#stageSpot)" />

          {/* Subtle grid */}
          {[0,1,2,3,4,5,6].map(i => (
            <rect key={i} x={130 + i * 63} y="140" width="63" height="180"
              fill={i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent'} />
          ))}

          {/* Event area border glow */}
          <rect x="130" y="140" width="440" height="180"
            fill="none"
            stroke="rgba(245,158,11,0.08)" strokeWidth="8" rx="6" />

          {/* "EVENT AREA" label */}
          <text x="350" y="220" textAnchor="middle" dominantBaseline="middle"
            fontSize="11" fontFamily="DM Sans" fontWeight="700"
            letterSpacing="4"
            fill="rgba(245,158,11,0.35)" className="pointer-events-none select-none">
            EVENT AREA
          </text>
          {/* Decorative stage line */}
          <line x1="200" y1="240" x2="500" y2="240"
            stroke="rgba(245,158,11,0.15)" strokeWidth="1" strokeDasharray="8,6" />
          <text x="350" y="255" textAnchor="middle" dominantBaseline="middle"
            fontSize="8" fontFamily="DM Sans"
            fill="rgba(148,163,184,0.3)" className="pointer-events-none select-none">
            STAGE / FIELD / TRACK
          </text>

          {/* === Gate markers === */}
          {GATE_POSITIONS.map(g => (
            <g key={g.id}>
              <circle cx={g.x} cy={g.y} r="11"
                fill="rgba(245,158,11,0.18)" stroke="#F59E0B" strokeWidth="1.5" />
              <text x={g.x} y={g.y}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="7" fontFamily="DM Sans" fontWeight="700"
                fill="#F59E0B" className="pointer-events-none select-none">
                {g.label}
              </text>
            </g>
          ))}

          {/* === YOUR SEAT — static glow dot, NO pulseDot animation === */}
          {/* Outer glow ring — subtle, no movement */}
          <circle cx="290" cy="310" r="14"
            fill="none"
            stroke="rgba(245,158,11,0.2)"
            strokeWidth="1.5"
          />
          <circle cx="290" cy="310" r="9"
            fill="none"
            stroke="rgba(245,158,11,0.35)"
            strokeWidth="1"
          />
          {/* Static dot */}
          <circle cx="290" cy="310" r="5"
            fill="#F59E0B"
            style={{ filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.8))' }}
          />
          <text x="290" y="326" textAnchor="middle" fontSize="8"
            fontFamily="DM Sans" fontWeight="700" fill="#F59E0B" className="select-none">
            YOU
          </text>
        </svg>

        {/* Overlay: click hint */}
        {!activeZoneId && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-[11px] font-body pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
            Tap a zone to see details
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-1">
        {[
          { level: 'low',    label: 'Comfortable' },
          { level: 'medium', label: 'Moderate' },
          { level: 'high',   label: 'Crowded' },
          { level: 'full',   label: 'Packed' },
        ].map(({ level, label }) => (
          <div key={level} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: getZoneColor(level as any) }} />
            <span className="text-[11px] font-body" style={{ color: 'var(--text-secondary)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
