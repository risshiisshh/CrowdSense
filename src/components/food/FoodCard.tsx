import React from 'react'
import { Plus, Minus, Star } from 'lucide-react'
import type { MenuItem } from '../../types'
import { getWaitBadgeColor } from '../../lib/crowd'
import Badge from '../ui/Badge'

interface FoodCardProps {
  item: MenuItem
  quantity: number
  onAdd: () => void
  onRemove: () => void
}

export default function FoodCard({ item, quantity, onAdd, onRemove }: FoodCardProps) {
  const priceRupees = (item.price / 100).toFixed(0)
  const waitColor = getWaitBadgeColor(item.preparationTime)

  return (
    <div className="surface-card p-3 flex flex-col gap-2 hover-glow transition-all duration-200">
      {/* Emoji + badges */}
      <div className="flex items-start justify-between">
        <span className="text-3xl leading-none">{item.emoji}</span>
        <div className="flex flex-col items-end gap-1">
          {item.isVeg && (
            <span className="w-3.5 h-3.5 border-2 border-emerald-500 rounded-sm flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </span>
          )}
          <Badge
            label={`${item.preparationTime}m`}
            variant={item.preparationTime <= 5 ? 'low' : item.preparationTime <= 15 ? 'medium' : 'high'}
            size="sm"
          />
        </div>
      </div>

      {/* Details */}
      <div>
        <p className="font-body font-semibold text-sm text-text-primary leading-snug">{item.name}</p>
        <p className="text-[11px] text-text-muted mt-0.5 leading-tight line-clamp-2">{item.description}</p>
      </div>

      {/* Counter tag */}
      <p className="text-[10px] text-text-muted opacity-70">{item.counterName}</p>

      {/* Rating */}
      <div className="flex items-center gap-1">
        <Star size={10} fill="#F59E0B" stroke="none" />
        <span className="text-[11px] font-body font-semibold text-amber-500">{item.rating}</span>
      </div>

      {/* Price + Add/Remove */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="font-display text-lg text-text-primary">₹{priceRupees}</span>

        {quantity === 0 ? (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 px-3 py-1.5 rounded-pill text-xs font-semibold transition-all active:scale-95"
            style={{ background: '#F59E0B', color: '#08090D' }}
          >
            <Plus size={12} />
            Add
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-pill px-2 py-1"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <button onClick={onRemove} className="text-amber-500 hover:text-amber-300 active:scale-90 transition-all">
              <Minus size={13} />
            </button>
            <span className="font-display text-sm text-amber-500 min-w-[16px] text-center">{quantity}</span>
            <button onClick={onAdd} className="text-amber-500 hover:text-amber-300 active:scale-90 transition-all">
              <Plus size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
