import React from 'react'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { CartItem } from '../../types'

interface CartDrawerProps {
  items: CartItem[]
  onClose: () => void
  onAdd: (itemId: string) => void
  onRemove: (itemId: string) => void
}

export default function CartDrawer({ items, onClose, onAdd, onRemove }: CartDrawerProps) {
  const navigate = useNavigate()
  const total = items.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0)
  const totalRupees = (total / 100).toFixed(0)

  return (
    <div
      className="fixed inset-0 z-40 flex items-end"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg mx-auto surface-card rounded-t-2xl px-4 pt-4 pb-8"
        style={{ animation: 'slideUp 0.3s ease-out', maxHeight: '70dvh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-3" style={{ background: 'var(--border)' }} />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} color="#F59E0B" />
            <h3 className="font-display text-xl text-text-primary tracking-wide">YOUR CART</h3>
          </div>
          <button onClick={onClose}><X size={18} className="text-text-muted" /></button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {items.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-8">Your cart is empty</p>
          ) : items.map(ci => (
            <div key={ci.menuItem.id} className="flex items-center gap-3 surface-card-2 p-3 rounded-lg">
              <span className="text-2xl">{ci.menuItem.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-body font-semibold text-sm text-text-primary truncate">{ci.menuItem.name}</p>
                <p className="text-xs text-text-muted">₹{(ci.menuItem.price / 100).toFixed(0)} each</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onRemove(ci.menuItem.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--surface-3)', color: '#F59E0B' }}
                >
                  <Minus size={11} />
                </button>
                <span className="font-display text-sm text-amber-400 w-5 text-center">{ci.quantity}</span>
                <button
                  onClick={() => onAdd(ci.menuItem.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: '#F59E0B', color: '#08090D' }}
                >
                  <Plus size={11} />
                </button>
              </div>
              <span className="font-body font-semibold text-sm text-text-primary min-w-[40px] text-right">
                ₹{((ci.menuItem.price * ci.quantity) / 100).toFixed(0)}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t pt-4" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex justify-between mb-4">
              <span className="font-body text-text-secondary">Total</span>
              <span className="font-display text-2xl text-amber-400">₹{totalRupees}</span>
            </div>
            <button
              className="w-full py-3 rounded-xl font-body font-semibold text-sm transition-all active:scale-98"
              style={{ background: '#F59E0B', color: '#08090D' }}
              onClick={() => { onClose(); navigate('/cart') }}
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
