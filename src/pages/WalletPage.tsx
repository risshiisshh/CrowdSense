import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Ticket, ChevronRight } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import { useAppStore } from '../store/useAppStore'
import { MOCK_EVENT, UPCOMING_EVENTS } from '../data/mockData'
import Badge from '../components/ui/Badge'

const CATEGORY_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  Cricket:  { color: '#10B981', bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.25)'  },
  Concert:  { color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.25)'  },
  'F1 Race':{ color: '#FF6B6B', bg: 'rgba(255,107,107,0.10)',border: 'rgba(255,107,107,0.25)'  },
  Football: { color: '#3B82F6', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.25)'  },
  Comedy:   { color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.25)'   },
}

export default function WalletPage() {
  const user = useAppStore(s => s.user)
  const showToast = useAppStore(s => s.showToast)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const qrData = JSON.stringify({
    uid:   user?.uid,
    event: MOCK_EVENT.id,
    seat:  `${user?.seatSection}${user?.seatRow}-${user?.seatNumber}`,
    ts:    Date.now(),
  })

  const heatmapData = Array.from({ length: 12 }, () =>
    Array.from({ length: 7 }, () => {
      const attended = Math.random() > 0.7
      return attended ? Math.floor(Math.random() * 3) + 1 : 0
    })
  )
  const heatColors = ['transparent', 'rgba(245,158,11,0.2)', 'rgba(245,158,11,0.5)', 'rgba(245,158,11,0.9)']

  return (
    <PageWrapper>
      <div className="pt-5 pb-2 page-header">
        <h1 className="font-display text-4xl text-gradient-amber tracking-wide">MY WALLET</h1>
        <p className="text-xs font-body mt-1" style={{ color: 'var(--text-muted)' }}>
          Tickets, upcoming events & attendance history
        </p>
      </div>

      {/* Active ticket card */}
      <div className="mt-3 rounded-2xl overflow-hidden relative hover-glow"
        style={{
          background: 'linear-gradient(135deg, #1a1200 0%, #0f1117 50%, #120a26 100%)',
          border: '1px solid rgba(245,158,11,0.25)',
          boxShadow: '0 8px 40px rgba(245,158,11,0.15)',
        }}
      >
        {/* Decorative rings */}
        <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
          {[80, 60, 40].map(r => (
            <div key={r} className="absolute rounded-full border border-amber-500"
              style={{ width: r, height: r, top: -(r / 2), right: -(r / 2) }} />
          ))}
        </div>

        <div className="p-5 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-md flex items-center justify-center font-display text-sm"
                  style={{ background: '#F59E0B', color: '#08090D' }}>CS</div>
                <span className="font-display text-lg tracking-widest text-amber-400">CROWDSENSE</span>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {MOCK_EVENT.venue} · {MOCK_EVENT.date}
              </p>
            </div>
            <Badge label="LIVE" variant="success" dot />
          </div>

          {/* Match info */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-display text-2xl" style={{ color: 'var(--text-primary)' }}>{MOCK_EVENT.homeTeam.split(' ').pop()}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{MOCK_EVENT.homeTeam}</p>
            </div>
            <span className="font-display text-3xl text-amber-400">
              {MOCK_EVENT.homeScore} — {MOCK_EVENT.awayScore}
            </span>
            <div className="text-right">
              <p className="font-display text-2xl" style={{ color: 'var(--text-primary)' }}>{MOCK_EVENT.awayTeam.split(' ').pop()}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{MOCK_EVENT.awayTeam}</p>
            </div>
          </div>

          <div className="border-t border-dashed mb-4" style={{ borderColor: 'rgba(245,158,11,0.2)' }} />

          {/* Seat + QR */}
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              {[
                { label: 'Holder',  value: user?.displayName ?? '-' },
                { label: 'Section', value: user?.seatSection ?? '-' },
                { label: 'Row',     value: user?.seatRow ?? '-' },
                { label: 'Seat',    value: user?.seatNumber ?? '-' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  <p className="font-body font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{value}</p>
                </div>
              ))}
            </div>
            <div className="p-2 rounded-xl" style={{ background: '#fff' }}>
              <QRCodeSVG value={qrData} size={100} fgColor="#08090D" bgColor="#ffffff" level="M" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming events */}
      <div className="mt-5">
        <p className="text-xs font-body font-semibold uppercase tracking-wider mb-3"
          style={{ color: 'var(--text-secondary)' }}>
          Upcoming Events
        </p>
        <div className="space-y-2.5">
          {UPCOMING_EVENTS.map(ev => {
            const style = CATEGORY_COLORS[ev.category] ?? { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' }
            const isExpanded = expandedId === ev.id
            const vs = ev.awayTeam ? `${ev.homeTeam} vs ${ev.awayTeam}` : ev.homeTeam

            return (
              <div key={ev.id}
                className="surface-card overflow-hidden hover-glow transition-all duration-300 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : ev.id)}
              >
                <div className="p-3.5 flex items-center gap-3">
                  {/* Category emoji */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                    style={{ background: style.bg, border: `1px solid ${style.border}` }}>
                    {ev.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                        {ev.category}
                      </span>
                      {ev.hasTicket && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)' }}>
                          ✓ Ticket
                        </span>
                      )}
                    </div>
                    <p className="font-body font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{ev.name}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {ev.date} · {ev.startTime} · {ev.venue}
                    </p>
                  </div>

                  <ChevronRight size={14} className="flex-shrink-0 transition-transform duration-200"
                    style={{ color: 'var(--text-muted)', transform: isExpanded ? 'rotate(90deg)' : undefined }} />
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-0 border-t"
                    style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-body" style={{ color: 'var(--text-muted)' }}>{vs}</p>
                        {ev.round && (
                          <p className="text-[11px] mt-0.5" style={{ color: style.color }}>{ev.round}</p>
                        )}
                      </div>
                      {ev.hasTicket ? (
                        <button
                          onClick={e => { e.stopPropagation(); showToast('Ticket details coming soon!', 'info') }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-semibold transition-all hover:brightness-110 active:scale-95"
                          style={{ background: style.color, color: '#08090D' }}
                        >
                          <Ticket size={11} />
                          View Ticket
                        </button>
                      ) : (
                        <button
                          onClick={e => { e.stopPropagation(); showToast('Redirecting to ticket purchase…', 'info') }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-semibold transition-all hover:brightness-110 active:scale-95"
                          style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}
                        >
                          <Ticket size={11} />
                          Buy Ticket
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Season heatmap */}
      <div className="mt-5 surface-card p-4 mb-2">
        <p className="text-xs font-body font-semibold uppercase tracking-wider mb-3"
          style={{ color: 'var(--text-secondary)' }}>Season Attendance</p>
        <div className="flex gap-1 overflow-x-auto">
          {heatmapData.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1 flex-shrink-0">
              {week.map((val, di) => (
                <div key={di} className="w-3 h-3 rounded-sm"
                  style={{
                    background: heatColors[val] || 'var(--surface-3)',
                    border: val > 0 ? '1px solid rgba(245,158,11,0.2)' : '1px solid var(--border-subtle)',
                  }} />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Less</span>
          {[0, 1, 2, 3].map(v => (
            <div key={v} className="w-3 h-3 rounded-sm"
              style={{ background: heatColors[v] || 'var(--surface-3)', border: '1px solid rgba(245,158,11,0.15)' }} />
          ))}
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>More</span>
        </div>
      </div>
    </PageWrapper>
  )
}
