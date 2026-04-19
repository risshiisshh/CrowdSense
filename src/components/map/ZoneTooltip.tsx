import React, { useEffect } from 'react'
import { X, Navigation } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { CrowdZone } from '../../types'
import { getZoneColor, getZoneStatus, formatWait } from '../../lib/crowd'
import Badge from '../ui/Badge'
import ProgressBar from '../ui/ProgressBar'

interface ZoneTooltipProps {
  zone: CrowdZone
  x: number
  y: number
  onClose: () => void
}

export default function ZoneTooltip({ zone, x, y, onClose }: ZoneTooltipProps) {
  const navigate = useNavigate()
  const color = getZoneColor(zone.level)
  const pct = Math.round((zone.occupancy / zone.capacity) * 100)

  // Auto-dismiss after 6s
  useEffect(() => {
    const t = setTimeout(onClose, 6000)
    return () => clearTimeout(t)
  }, [zone.id])

  // Position: prefer showing to the right, shift left if near right edge
  const left = x > 300 ? Math.max(0, x - 220) : x + 12

  return (
    <div
      className="absolute z-30 w-52 surface-card p-3"
      style={{
        top: Math.max(0, y - 60),
        left,
        animation: 'slideUp 0.2s ease-out',
        border: `1px solid ${color}44`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-body font-semibold text-sm text-text-primary">{zone.name}</span>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary">
          <X size={14} />
        </button>
      </div>

      {/* Status badge */}
      <Badge label={getZoneStatus(zone.level)} variant={zone.level} dot size="sm" />

      {/* Occupancy bar */}
      <div className="mt-2.5 mb-1">
        <div className="flex justify-between mb-1">
          <span className="text-[11px] text-text-muted">Occupancy</span>
          <span className="text-[11px] font-semibold" style={{ color }}>{pct}%</span>
        </div>
        <ProgressBar value={pct} color={color} height={4} />
      </div>

      {/* Wait time */}
      <p className="text-[11px] text-text-secondary mt-2">
        ⏱ {formatWait(zone.waitMinutes)}
        <span className="ml-2 opacity-60">
          {zone.trend === 'rising' ? '↑' : zone.trend === 'falling' ? '↓' : '→'} {zone.trend}
        </span>
      </p>

      {/* Action */}
      <button
        className="mt-2.5 w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 rounded-md transition-all"
        style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
        onClick={() => { navigate('/dashboard'); onClose() }}
      >
        <Navigation size={11} />
        View from seat
      </button>
    </div>
  )
}
