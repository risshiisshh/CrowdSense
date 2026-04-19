import React, { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import { useAppStore } from '../store/useAppStore'
import LiveDot from '../components/ui/LiveDot'
import { Activity, MapPin, Clock, Zap, ShoppingBag, Bell, ChevronRight } from 'lucide-react'

type StatsTab = "today" | "achievements" | "vs_avg"

const TIMELINE_EVENTS = [
  {
    time: '19:42', icon: <ChevronRight size={14} />, color: '#10B981',
    title: 'Entered via Gate B',
    sub: 'AI recommended — saved 10 min vs Gate A',
    bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)',
  },
  {
    time: '19:58', icon: <ShoppingBag size={14} />, color: '#F59E0B',
    title: 'Ordered from Burger Blvd',
    sub: 'Classic Smash Burger · ₹240 · Ready in 8 min',
    bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.25)',
  },
  {
    time: '20:15', icon: <MapPin size={14} />, color: '#3B82F6',
    title: 'Rerouted via West Concourse',
    sub: 'Avoided Restrooms North congestion surge',
    bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.25)',
  },
  {
    time: '20:31', icon: <Bell size={14} />, color: '#FF6B6B',
    title: 'Alert received',
    sub: 'Halftime — AI pre-routed to Food Court West',
    bg: 'rgba(255,107,107,0.10)', border: 'rgba(255,107,107,0.25)',
  },
  {
    time: '20:44', icon: <ShoppingBag size={14} />, color: '#8B5CF6',
    title: 'Ordered from Gelato Garden',
    sub: 'Double Scoop · ₹159 · Skipped queue via app',
    bg: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.25)',
  },
  {
    time: '21:02', icon: <ChevronRight size={14} />, color: '#10B981',
    title: 'Exit via Gate B',
    sub: 'Left 12 min before match end — zero queue',
    bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)',
  },
]

const ACHIEVEMENTS = [
  { emoji: '🚪', name: 'Smart Entry',   desc: 'Used AI gate recommendation 3× in a row', earned: true },
  { emoji: '⚡', name: 'Queue Skipper', desc: 'Avoided 5+ queues with AI routing',         earned: true },
  { emoji: '🍔', name: 'Food Explorer', desc: 'Ordered from 3 different counters',          earned: false },
  { emoji: '🏃', name: 'Speed Runner',  desc: 'Exit stadium in under 5 minutes',            earned: false },
  { emoji: '📊', name: 'Data Analyst',  desc: 'Check crowd stats 10 times in one event',   earned: true },
  { emoji: '🎯', name: 'Perfect Route', desc: '100% AI gate selection accuracy',             earned: true },
]

// Route path nodes with Bezier control points
const ROUTE_NODES = [
  { x: 62,  y: 170, n: 1, label: 'Gate B Entry',    color: '#10B981' },
  { x: 200, y: 82,  n: 2, label: 'Burger Blvd',     color: '#F59E0B' },
  { x: 148, y: 242, n: 3, label: 'West Concourse',  color: '#3B82F6' },
  { x: 200, y: 318, n: 4, label: 'Gelato Garden',   color: '#8B5CF6' },
  { x: 62,  y: 318, n: 5, label: 'Gate B Exit',     color: '#10B981' },
]

// Bezier curve path through all nodes
const ROUTE_PATH = `
  M 62 170
  C 100 140, 160 100, 200 82
  C 200 140, 160 200, 148 242
  C 148 280, 170 300, 200 318
  C 160 318, 100 318, 62 318
`

export default function ActivityTimelinePage() {
  const user = useAppStore(s => s.user)
  const [activeTab, setActiveTab] = useState<StatsTab>('today')
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)

  const tabs: { id: StatsTab; label: string; emoji: string }[] = [
    { id: 'today',        label: "Today's Journey", emoji: '⚡' },
    { id: 'achievements', label: 'Achievements',    emoji: '🏆' },
    { id: 'vs_avg',       label: 'vs Average',      emoji: '📊' },
  ]

  const topStats = [
    { label: 'Time Saved',      value: '28',    unit: 'min', color: '#10B981', icon: <Clock size={16} /> },
    { label: 'Queues Avoided',  value: '7',     unit: '',    color: '#F59E0B', icon: <Zap size={16} /> },
    { label: 'AI Routes Used',  value: '14',    unit: '',    color: '#8B5CF6', icon: <Activity size={16} /> },
    { label: 'Orders Placed',   value: '3',     unit: '',    color: '#3B82F6', icon: <ShoppingBag size={16} /> },
    { label: 'Steps Saved',     value: '1.2k',  unit: '',    color: '#FF6B6B', icon: <MapPin size={16} /> },
    { label: 'Alerts Received', value: '5',     unit: '',    color: '#F59E0B', icon: <Bell size={16} /> },
  ]

  return (
    <PageWrapper>
      {/* Header */}
      <div className="pt-5 pb-2 flex items-center gap-3 page-header">
        <div className="flex-1">
          <h1 className="font-display text-4xl text-gradient-amber tracking-wide">MY STATS</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <LiveDot color="#10B981" size={5} />
            <span className="text-[11px] font-body" style={{ color: 'var(--text-muted)' }}>
              Match Day · CrowdSense Active
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <span className="w-2 h-2 rounded-full bg-emerald-500" style={{ animation: 'pulseDot 1.4s ease-in-out infinite' }} />
          <span className="text-[11px] font-semibold text-emerald-400">Live · {user ? '4,250' : '--'} here</span>
        </div>
      </div>

      {/* Top stats strip */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-3 stagger-children">
        {topStats.map(stat => (
          <div key={stat.label} className="surface-card p-3 text-center hover-glow">
            <div className="flex justify-center mb-1.5" style={{ color: stat.color }}>{stat.icon}</div>
            <p className="font-display text-xl leading-none" style={{ color: stat.color }}>
              {stat.value}<span className="text-sm">{stat.unit}</span>
            </p>
            <p className="text-[10px] mt-1 leading-tight" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex mt-5 surface-card-2 rounded-xl p-1 gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-2.5 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5"
            style={activeTab === tab.id
              ? { background: '#F59E0B', color: '#08090D' }
              : { color: 'var(--text-muted)' }
            }
          >
            <span>{tab.emoji}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'today' && (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Activity Timeline */}
          <div className="surface-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} style={{ color: '#F59E0B' }} />
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Activity Timeline</p>
            </div>
            <div className="relative">
              <div className="absolute left-[22px] top-0 bottom-0 w-px" style={{ background: 'var(--border-subtle)' }} />
              <div className="space-y-4">
                {TIMELINE_EVENTS.map((ev, i) => (
                  <div key={i} className="flex gap-3 items-start group">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 z-10 transition-all duration-200 group-hover:scale-110"
                      style={{ background: ev.bg, border: `1px solid ${ev.border}`, color: ev.color,
                               boxShadow: `0 0 0 0 ${ev.color}00`,
                             }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 12px ${ev.color}44`)}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 0 0 ${ev.color}00`)}
                    >
                      {ev.icon}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{ev.title}</p>
                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{ev.time}</span>
                      </div>
                      <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{ev.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Polished Route Map */}
            <div className="surface-card p-4">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={16} style={{ color: '#F59E0B' }} />
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Your Route Today</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)' }}>
                  5 stops
                </span>
              </div>
              <div className="rounded-xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a0d 100%)', height: 270 }}>
                {/* Background grid */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 270" preserveAspectRatio="none">
                  {[0,1,2,3,4,5,6].map(i => (
                    <line key={`h${i}`} x1="0" y1={i * 45} x2="280" y2={i * 45}
                      stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  ))}
                  {[0,1,2,3,4,5].map(i => (
                    <line key={`v${i}`} x1={i * 56} y1="0" x2={i * 56} y2="270"
                      stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  ))}
                </svg>

                <svg viewBox="0 0 280 400" className="w-full h-full" style={{ padding: '10px' }}>
                  {/* Event area silhouette */}
                  <rect x="100" y="110" width="140" height="90" rx="6"
                    fill="rgba(245,158,11,0.04)" stroke="rgba(245,158,11,0.12)" strokeWidth="1" />
                  <text x="170" y="157" textAnchor="middle" fontSize="7" fontFamily="DM Sans"
                    fill="rgba(245,158,11,0.3)" letterSpacing="2">EVENT AREA</text>

                  {/* Animated route with gradient stroke */}
                  <defs>
                    <linearGradient id="routeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#10B981" />
                      <stop offset="50%"  stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                    <filter id="routeGlow">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>

                  {/* Glow copy of path */}
                  <path d={ROUTE_PATH.trim()}
                    fill="none" stroke="rgba(245,158,11,0.2)" strokeWidth="8"
                    strokeLinecap="round" strokeLinejoin="round" />

                  {/* Main animated dashed path */}
                  <path d={ROUTE_PATH.trim()}
                    fill="none" stroke="url(#routeGrad)" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="8 4"
                    style={{
                      animation: 'dashMove 2s linear infinite',
                      filter: 'drop-shadow(0 0 3px rgba(245,158,11,0.6))',
                    }}
                  />

                  {/* Direction arrows */}
                  {[
                    { x: 145, y: 118, rotate: -55 },
                    { x: 165, y: 168, rotate: 110 },
                    { x: 175, y: 290, rotate: -15 },
                    { x: 130, y: 318, rotate: 200 },
                  ].map((arrow, i) => (
                    <polygon key={i}
                      points="-4,3 0,-5 4,3"
                      fill="rgba(245,158,11,0.6)"
                      transform={`translate(${arrow.x},${arrow.y}) rotate(${arrow.rotate})`}
                    />
                  ))}

                  {/* Route nodes */}
                  {ROUTE_NODES.map(node => {
                    const isHov = hoveredNode === node.n
                    return (
                      <g key={node.n}
                        onMouseEnter={() => setHoveredNode(node.n)}
                        onMouseLeave={() => setHoveredNode(null)}
                        className="cursor-pointer"
                      >
                        {/* Outer ring */}
                        <circle cx={node.x} cy={node.y} r={isHov ? 16 : 13}
                          fill="none" stroke={node.color} strokeWidth="1.5" strokeOpacity="0.4"
                          style={{ transition: 'r 0.2s ease' }} />
                        {/* Fill */}
                        <circle cx={node.x} cy={node.y} r={isHov ? 10 : 8}
                          fill={node.color}
                          style={{
                            filter: isHov ? `drop-shadow(0 0 8px ${node.color})` : `drop-shadow(0 0 4px ${node.color}88)`,
                            transition: 'r 0.2s ease',
                          }} />
                        <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="middle"
                          fontSize="7" fontFamily="DM Sans" fontWeight="800" fill="#08090D">
                          {node.n}
                        </text>
                        {/* Label pill */}
                        {(isHov || node.n === 1 || node.n === 5) && (
                          <g>
                            <rect
                              x={node.x < 100 ? node.x + 14 : node.x - 14 - node.label.length * 4.8}
                              y={node.y - 9}
                              width={node.label.length * 4.8 + 8}
                              height={18} rx="5"
                              fill="rgba(0,0,0,0.75)" stroke={node.color} strokeWidth="0.8" strokeOpacity="0.5"
                            />
                            <text
                              x={node.x < 100 ? node.x + 18 : node.x - 10}
                              y={node.y}
                              textAnchor={node.x < 100 ? 'start' : 'end'}
                              dominantBaseline="middle"
                              fontSize="7" fontFamily="DM Sans" fill={node.color}
                            >
                              {node.label}
                            </text>
                          </g>
                        )}
                      </g>
                    )
                  })}
                </svg>
              </div>
              {/* Route legend */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Entry / Exit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0" />
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Food / Activity</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-0.5 block rounded-full bg-amber-500 opacity-60" style={{ borderTop: '1px dashed #F59E0B' }} />
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>AI Route</span>
                </div>
              </div>
            </div>

            {/* AI Impact */}
            <div className="surface-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} style={{ color: '#F59E0B' }} />
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>AI Impact Today</p>
              </div>
              {[
                { label: 'Time recovered by AI routing', value: '28 min',   color: '#10B981' },
                { label: 'Peak congestion dodged',        value: '3 events', color: '#F59E0B' },
                { label: 'Optimal gate selection rate',   value: '100%',     color: '#8B5CF6' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2.5 border-b last:border-0"
                  style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="text-sm font-body" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span className="font-display text-xl" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 stagger-children">
          {ACHIEVEMENTS.map(a => (
            <div key={a.name} className={`surface-card p-4 flex gap-3 items-start hover-glow ${a.earned ? '' : 'opacity-50'}`}>
              <span className="text-3xl flex-shrink-0">{a.emoji}</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{a.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{a.desc}</p>
                <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full`}
                  style={a.earned
                    ? { background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)' }
                    : { background: 'var(--surface-3)', color: 'var(--text-muted)' }}>
                  {a.earned ? '✓ Earned' : 'Locked'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'vs_avg' && (
        <div className="mt-4 surface-card p-5">
          <p className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Your stats vs. average attendee</p>
          <div className="space-y-4">
            {[
              { label: 'Time in queue',       you: 3,   avg: 18,  unit: 'min', better: true },
              { label: 'Distance walked',     you: 1.2, avg: 2.1, unit: 'km',  better: true },
              { label: 'Food order wait',     you: 7,   avg: 14,  unit: 'min', better: true },
              { label: 'AI recommendations', you: 14,  avg: 0,   unit: '',    better: true },
            ].map(stat => (
              <div key={stat.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stat.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-emerald-400">You: {stat.you}{stat.unit}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Avg: {stat.avg}{stat.unit}</span>
                  </div>
                </div>
                <div className="relative h-2 rounded-full" style={{ background: 'var(--surface-3)' }}>
                  <div className="absolute left-0 top-0 h-full rounded-full"
                    style={{ width: `${Math.min(100, (stat.you / Math.max(stat.you, stat.avg)) * 100)}%`, background: '#10B981' }} />
                  <div className="absolute left-0 top-0 h-full rounded-full opacity-30"
                    style={{ width: `${Math.min(100, (stat.avg / Math.max(stat.you, stat.avg)) * 100)}%`, background: '#FF6B6B' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
