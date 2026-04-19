import React from 'react'
import { CheckCircle, Clock, Package, Bike } from 'lucide-react'
import type { OrderStatus } from '../../types'

const STEPS: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'placed',      label: 'Order Placed',  icon: <CheckCircle size={16} /> },
  { status: 'preparing',   label: 'Preparing',     icon: <Clock size={16} /> },
  { status: 'on_the_way',  label: 'On the Way',    icon: <Bike size={16} /> },
  { status: 'delivered',   label: 'Delivered',     icon: <Package size={16} /> },
]

const STATUS_ORDER: OrderStatus[] = ['placed', 'preparing', 'on_the_way', 'delivered']

interface OrderTrackerProps {
  status: OrderStatus
  estimatedMinutes: number
}

export default function OrderTracker({ status, estimatedMinutes }: OrderTrackerProps) {
  const currentIdx = STATUS_ORDER.indexOf(status)

  return (
    <div className="surface-card-2 p-4 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <p className="font-body font-semibold text-sm text-text-primary">Order Status</p>
        {status !== 'delivered' && (
          <p className="text-xs text-amber-400 font-semibold">~{estimatedMinutes} min</p>
        )}
      </div>

      {/* Stepper */}
      <div className="flex items-start justify-between relative">
        {/* Track line */}
        <div
          className="absolute top-4 left-4 right-4 h-0.5"
          style={{ background: 'var(--surface-3)' }}
        />
        {/* Progress line */}
        <div
          className="absolute top-4 left-4 h-0.5 transition-all duration-700"
          style={{
            background: '#F59E0B',
            width: currentIdx === 0 ? '0%' : `${(currentIdx / (STEPS.length - 1)) * (100 - 14)}%`,
            boxShadow: '0 0 8px rgba(245,158,11,0.5)',
          }}
        />

        {STEPS.map((step, idx) => {
          const done    = idx < currentIdx
          const active  = idx === currentIdx
          const pending = idx > currentIdx

          return (
            <div key={step.status} className="flex flex-col items-center gap-1.5 z-10" style={{ flex: 1 }}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: done || active ? '#F59E0B' : 'var(--surface-3)',
                  color: done || active ? '#08090D' : 'var(--text-muted)',
                  boxShadow: active ? '0 0 12px rgba(245,158,11,0.5)' : undefined,
                  opacity: pending ? 0.5 : 1,
                }}
              >
                {step.icon}
              </div>
              <span
                className="text-[10px] font-body text-center leading-tight"
                style={{ color: active ? '#F59E0B' : done ? 'var(--text-secondary)' : 'var(--text-muted)' }}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
