import React, { useEffect, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import type { ToastMessage } from '../../types'

const ICONS: Record<ToastMessage['type'], React.ReactNode> = {
  success: <CheckCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  error:   <XCircle size={16} />,
  info:    <Info size={16} />,
}

const COLORS: Record<ToastMessage['type'], { bg: string; border: string; color: string }> = {
  success: { bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.4)',  color: '#10B981' },
  warning: { bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.4)',  color: '#F59E0B' },
  error:   { bg: 'rgba(255,107,107,0.15)', border: 'rgba(255,107,107,0.4)', color: '#FF6B6B' },
  info:    { bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.4)',  color: '#3B82F6' },
}

function ToastItem({ toast }: { toast: ToastMessage }) {
  const dismiss = useAppStore(s => s.dismissToast)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const { bg, border, color } = COLORS[toast.type]

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="flex items-start gap-3 rounded-lg px-4 py-3 shadow-modal border font-body text-sm cursor-pointer"
      style={{
        background: bg,
        borderColor: border,
        color: 'var(--text-primary)',
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        minWidth: 260,
        maxWidth: 340,
      }}
      onClick={() => dismiss(toast.id)}
    >
      <span style={{ color, marginTop: 1 }} aria-hidden="true">{ICONS[toast.type]}</span>
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button onClick={() => dismiss(toast.id)} aria-label="Dismiss notification" className="opacity-50 hover:opacity-100 mt-0.5 flex-shrink-0 bg-transparent border-none p-0"><X size={14} /></button>
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useAppStore(s => s.toasts)

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none"
      style={{ pointerEvents: toasts.length ? 'auto' : 'none' }}
    >
      {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
    </div>
  )
}
