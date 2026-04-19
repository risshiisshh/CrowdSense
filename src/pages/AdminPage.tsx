import React, { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import LiveDot from '../components/ui/LiveDot'
import { useAppStore } from '../store/useAppStore'
import { Users, AlertTriangle, Clock, Bell, Send, TrendingUp, Shield, PlayCircle } from 'lucide-react'

const LIVE_ALERTS = [
  {
    severity: 'HIGH', color: '#FF6B6B', bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.3)',
    time: '19:30', message: 'Gate A at 92% capacity — deploy crowd control staff.',
  },
  {
    severity: 'CAUTION', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)',
    time: '19:45', message: 'Food Court Main: wait time rising — 15 min now.',
  },
  {
    severity: 'INFO', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)',
    time: '20:02', message: 'Gate C now open. Redirect North Stand overflow.',
  },
]

const TREND_DATA = {
  food:  [25, 30, 38, 50, 62, 68, 72, 75, 78, 80],
  gateA: [40, 50, 65, 80, 90, 88, 85, 82, 80, 78],
  rest:  [15, 20, 28, 35, 45, 55, 60, 65, 68, 70],
}

const X_LABELS = ['18:00', '18:20', '18:40', '19:00', '19:20', '19:40', '20:00', '20:20', '20:40', '21:00']

const W = 460, H = 140

function buildPath(data: number[], w: number, h: number): string {
  const xStep = w / (data.length - 1)
  return data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * xStep} ${h - (v / 100) * h}`).join(' ')
}

function buildArea(data: number[], w: number, h: number): string {
  return buildPath(data, w, h) + ` L ${(data.length - 1) * (w / (data.length - 1))} ${h} L 0 ${h} Z`
}

interface ChartTooltip {
  x: number
  y: number
  value: number
  label: string
  color: string
  time: string
}

const SERIES = [
  { key: 'food' as const,  color: '#F59E0B', label: 'Food Court',  gradId: 'foodGrad' },
  { key: 'gateA' as const, color: '#3B82F6', label: 'Gate A',      gradId: 'gateGrad' },
  { key: 'rest' as const,  color: '#10B981', label: 'Restrooms',   gradId: 'restGrad'  },
]

export default function AdminPage() {
  const showToast = useAppStore(s => s.showToast)
  const [broadcastMsg, setBroadcastMsg] = useState('')
  const [alertLog, setAlertLog] = useState(LIVE_ALERTS)
  const [tooltip, setTooltip] = useState<ChartTooltip | null>(null)
  const [clickedPoint, setClickedPoint] = useState<{ seriesKey: string; idx: number } | null>(null)

  function handleSend() {
    if (!broadcastMsg.trim()) return
    setAlertLog(prev => [{
      severity: 'BROADCAST',
      color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.3)',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      message: broadcastMsg,
    }, ...prev])
    setBroadcastMsg('')
    showToast('📢 Alert broadcast sent!', 'success')
  }

  function simulate(scenario: string) {
    showToast(`⚡ Simulating: ${scenario}`, 'info')
    setAlertLog(prev => [{
      severity: 'SIM',
      color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      message: `Simulation triggered: ${scenario} — monitoring AI response.`,
    }, ...prev])
  }

  const xStep = W / (TREND_DATA.food.length - 1)

  function getPointCoords(seriesKey: keyof typeof TREND_DATA, idx: number) {
    const val = TREND_DATA[seriesKey][idx]
    return { x: idx * xStep, y: H - (val / 100) * H }
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div className="pt-5 pb-2 page-header">
        <div className="flex items-center gap-3 mb-1">
          <Shield size={22} style={{ color: '#F59E0B' }} />
          <h1 className="font-display text-4xl text-gradient-amber tracking-wide">ADMIN CONTROL</h1>
        </div>
        <p className="text-sm font-body" style={{ color: 'var(--text-muted)' }}>
          Live analytics · Multi-agent AI monitoring · Event simulation
        </p>
      </div>

      {/* Simulation buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { label: 'Simulate Goal',      color: '#10B981', border: 'rgba(16,185,129,0.4)' },
          { label: 'Simulate Halftime',  color: '#F59E0B', border: 'rgba(245,158,11,0.4)' },
          { label: 'Simulate Match End', color: '#8B5CF6', border: 'rgba(139,92,246,0.4)' },
          { label: 'Emergency Drill',    color: '#FF6B6B', border: 'rgba(255,107,107,0.4)' },
        ].map(btn => (
          <button
            key={btn.label}
            onClick={() => simulate(btn.label)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold hover-glow transition-all active:scale-95"
            style={{ background: `${btn.color}14`, border: `1.5px solid ${btn.border}`, color: btn.color }}
          >
            <PlayCircle size={14} />
            {btn.label}
          </button>
        ))}
      </div>

      {/* KPI cards */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 stagger-children">
        {[
          { label: 'Total Crowd',     value: '4,250', icon: <Users size={18} />,         color: '#3B82F6' },
          { label: 'High-Risk Zones', value: '2',     icon: <AlertTriangle size={18} />, color: '#FF6B6B' },
          { label: 'Avg Wait Time',   value: '9 min', icon: <Clock size={18} />,         color: '#F59E0B' },
          { label: 'Active Alerts',   value: '2',     icon: <Bell size={18} />,           color: '#8B5CF6' },
        ].map(card => (
          <div key={card.label} className="surface-card p-4 hover-glow">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${card.color}18`, color: card.color }}>
              {card.icon}
            </div>
            <p className="font-display text-3xl" style={{ color: 'var(--text-primary)' }}>{card.value}</p>
            <p className="text-xs mt-1 font-body" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Main two-column */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Chart with interactive tooltips */}
        <div className="lg:col-span-3 surface-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} style={{ color: '#F59E0B' }} />
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Zone Occupancy % Trend</p>
          </div>

          {/* Tooltip display */}
          {tooltip && (
            <div className="mb-3 flex items-center gap-3 px-3 py-2 rounded-xl text-sm"
              style={{ background: `${tooltip.color}14`, border: `1px solid ${tooltip.color}40` }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tooltip.color }} />
              <span className="font-semibold" style={{ color: tooltip.color }}>{tooltip.label}</span>
              <span style={{ color: 'var(--text-muted)' }}>at {tooltip.time}</span>
              <span className="ml-auto font-display text-xl" style={{ color: tooltip.color }}>{tooltip.value}%</span>
            </div>
          )}

          <div className="overflow-x-auto relative">
            <svg
              viewBox={`-20 0 ${W + 30} ${H + 40}`}
              className="w-full min-w-[320px]"
              onMouseLeave={() => setTooltip(null)}
            >
              <defs>
                {SERIES.map(s => (
                  <linearGradient key={s.gradId} id={s.gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={s.color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>

              {/* Y-axis grid + labels */}
              {[0, 25, 50, 75, 100].map(pct => {
                const y = H - (pct / 100) * H
                return (
                  <g key={pct}>
                    <line x1="0" y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
                    <text x="-4" y={y} textAnchor="end" dominantBaseline="middle"
                      fontSize="8" fontFamily="DM Sans" fill="rgba(148,163,184,0.5)">{pct}%</text>
                  </g>
                )
              })}

              {/* Area fills */}
              {SERIES.map(s => (
                <path key={`area-${s.key}`}
                  d={buildArea(TREND_DATA[s.key], W, H)}
                  fill={`url(#${s.gradId})`} />
              ))}

              {/* Lines */}
              {SERIES.map((s, si) => (
                <path key={`line-${s.key}`}
                  d={buildPath(TREND_DATA[s.key], W, H)}
                  fill="none" stroke={s.color}
                  strokeWidth={si === 2 ? 1.5 : 2}
                  strokeLinecap="round"
                  strokeDasharray={si === 2 ? '6,4' : undefined}
                  style={{ filter: `drop-shadow(0 0 3px ${s.color}55)` }}
                />
              ))}

              {/* Interactive data points */}
              {SERIES.map(s =>
                TREND_DATA[s.key].map((val, idx) => {
                  const { x, y } = getPointCoords(s.key, idx)
                  const isClicked = clickedPoint?.seriesKey === s.key && clickedPoint?.idx === idx
                  return (
                    <g key={`pt-${s.key}-${idx}`}>
                      {/* Invisible hit area */}
                      <circle
                        cx={x} cy={y} r={12}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setTooltip({ x, y, value: val, label: s.label, color: s.color, time: X_LABELS[idx] })}
                        onClick={() => setClickedPoint(isClicked ? null : { seriesKey: s.key, idx })}
                      />
                      {/* Visible dot — shows on hover or click */}
                      {(tooltip?.label === s.label && Math.round(tooltip?.x ?? -1) === Math.round(x)) || isClicked ? (
                        <g>
                          {isClicked && (
                            <circle cx={x} cy={y} r="10" fill="none" stroke={s.color} strokeWidth="1.5" strokeOpacity="0.4"
                              style={{ animation: 'pulseRing 1.5s ease-out infinite' }} />
                          )}
                          <circle cx={x} cy={y} r={isClicked ? 6 : 4}
                            fill={s.color}
                            style={{ filter: `drop-shadow(0 0 6px ${s.color})` }}
                          />
                          {/* Value label */}
                          <rect x={x - 14} y={y - 22} width="28" height="14" rx="4"
                            fill="rgba(0,0,0,0.75)" stroke={s.color} strokeWidth="0.8" strokeOpacity="0.6" />
                          <text x={x} y={y - 14} textAnchor="middle" dominantBaseline="middle"
                            fontSize="8" fontFamily="DM Sans" fontWeight="700" fill={s.color}>
                            {val}%
                          </text>
                        </g>
                      ) : null}
                    </g>
                  )
                })
              )}

              {/* X-axis labels */}
              {X_LABELS.filter((_, i) => i % 2 === 0).map((t, i) => (
                <text key={t} x={i * 2 * xStep} y={H + 16}
                  fontSize="8" fontFamily="DM Sans" fill="rgba(148,163,184,0.5)" textAnchor="middle">
                  {t}
                </text>
              ))}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-2">
            {SERIES.map(s => (
              <div key={s.key} className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 rounded-full" style={{ background: s.color }} />
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
              </div>
            ))}
            <span className="text-[10px] ml-auto" style={{ color: 'var(--text-muted)' }}>
              Hover/click data points
            </span>
          </div>
        </div>

        {/* Right: Live Alerts + Broadcast */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="surface-card p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <LiveDot color="#FF6B6B" size={5} />
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Live Alerts</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-emerald-400"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
                LIVE · Firestore
              </span>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
              {alertLog.map((alert, i) => (
                <div key={i} className="p-3 rounded-xl"
                  style={{ background: alert.bg, border: `1px solid ${alert.border}` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase" style={{ color: alert.color }}>{alert.severity}</span>
                    <span className="text-[10px] font-mono ml-auto" style={{ color: 'var(--text-muted)' }}>{alert.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-4">
            <p className="font-semibold text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Broadcast Platform-Wide Alert</p>
            <div className="flex gap-2">
              <input
                value={broadcastMsg}
                onChange={e => setBroadcastMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type emergency message…"
                className="flex-1 px-3 py-2.5 rounded-xl text-sm font-body outline-none"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
              />
              <button
                onClick={handleSend}
                className="px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-1.5 hover-glow-coral active:scale-95"
                style={{ background: '#FF6B6B', color: '#fff' }}
              >
                <Send size={13} />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Service wait times */}
      <div className="mt-5 surface-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} style={{ color: '#F59E0B' }} />
          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Service Wait Times (min)</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { name: 'Spice Route',  wait: 12, level: 'high'   },
            { name: 'Burger Blvd', wait: 6,  level: 'medium' },
            { name: 'Chai Corner', wait: 2,  level: 'low'    },
            { name: 'Mega Bites',  wait: 15, level: 'high'   },
            { name: 'Green Bowl',  wait: 4,  level: 'low'    },
          ].map(counter => {
            const color = counter.level === 'low' ? '#10B981' : counter.level === 'medium' ? '#F59E0B' : '#FF6B6B'
            return (
              <div key={counter.name} className="surface-card-2 p-3 text-center hover-glow">
                <p className="font-display text-3xl" style={{ color }}>{counter.wait}</p>
                <p className="text-[11px] mt-1 leading-tight" style={{ color: 'var(--text-secondary)' }}>{counter.name}</p>
                <div className="w-full h-1.5 rounded-full mt-2" style={{ background: 'var(--surface-3)' }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, counter.wait * 5)}%`, background: color }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </PageWrapper>
  )
}
