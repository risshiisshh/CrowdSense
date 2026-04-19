import React, { useState } from 'react'
import { CheckCheck } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import { useNotifications } from '../hooks/useNotifications'
import { Alert } from '../types'

const TYPE_CONFIG: Record<Alert['type'], { emoji: string; color: string; bg: string; border: string }> = {
  warning:   { emoji: '⚠️', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
  info:      { emoji: 'ℹ️', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)'  },
  emergency: { emoji: '🚨', color: '#EF4444', bg: 'rgba(239,68,68,0.10)',   border: 'rgba(239,68,68,0.3)'   },
  promo:     { emoji: '🎉', color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)'  },
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60)    return 'just now'
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

type FilterType = 'all' | Alert['type']

export default function NotificationsPage() {
  const { alerts, unreadCount, markAlertRead, markAllRead } = useNotifications()
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = alerts.filter(a => filter === 'all' || a.type === filter)

  return (
    <PageWrapper>
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-gradient-amber tracking-wide">ALERTS</h1>
          {unreadCount > 0 && (
            <p className="text-xs text-text-muted font-body mt-0.5">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-pill transition-all"
            style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}
          >
            <CheckCheck size={12} />
            Mark all read
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
        {(['all', 'warning', 'emergency', 'promo', 'info'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="flex-shrink-0 px-3 py-1 rounded-pill text-[11px] font-semibold capitalize transition-all"
            style={filter === f
              ? { background: '#F59E0B', color: '#08090D' }
              : { background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }
            }
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {/* Alert cards */}
      <div className="space-y-2 px-3 pb-4">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔔</p>
            <p className="text-text-muted text-sm">No alerts in this category</p>
          </div>
        )}
        {filtered.map(alert => {
          const cfg = TYPE_CONFIG[alert.type]
          return (
            <button
              key={alert.id}
              className="w-full text-left flex items-start gap-3 p-4 rounded-xl transition-all"
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                opacity: alert.isRead ? 0.65 : 1,
              }}
              onClick={() => markAlertRead(alert.id)}
            >
              <span className="text-xl flex-shrink-0 mt-0.5">{cfg.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-body font-semibold text-sm" style={{ color: cfg.color }}>
                    {alert.title}
                  </p>
                  {!alert.isRead && (
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                  )}
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">{alert.message}</p>
                <p className="text-[10px] text-text-muted mt-1.5">{timeAgo(alert.createdAt)}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Preferences section */}
      <div className="mx-3 mt-2 mb-4 surface-card p-4">
        <p className="font-body font-semibold text-sm text-text-primary mb-3">Notification Preferences</p>
        {[
          { label: 'Crowd warnings', sub: 'When zones get crowded' },
          { label: 'Food promotions', sub: 'Deals and happy hours' },
          { label: 'Event alerts', sub: 'Match updates & announcements' },
          { label: 'Emergency alerts', sub: 'Safety and venue closures' },
        ].map(({ label, sub }, i) => (
          <div key={label} className="flex items-center justify-between py-2.5"
            style={{ borderBottom: i < 3 ? '1px solid var(--border-subtle)' : undefined }}>
            <div>
              <p className="font-body text-sm text-text-primary">{label}</p>
              <p className="text-[11px] text-text-muted">{sub}</p>
            </div>
            <div className="w-10 h-5 rounded-full relative cursor-pointer"
              style={{ background: '#F59E0B' }}>
              <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
