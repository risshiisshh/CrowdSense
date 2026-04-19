import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Package } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import OrderTracker from '../components/food/OrderTracker'
import { useCart } from '../hooks/useCart'
import { useOrders } from '../hooks/useOrders'
import { useAppStore } from '../store/useAppStore'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, total, getQuantity, addItem, removeItem, clearCart } = useCart()
  const { activeOrder } = useOrders()
  const showToast = useAppStore(s => s.showToast)
  const user = useAppStore(s => s.user)
  const [deliveryMethod, setDeliveryMethod] = useState<'seat_delivery' | 'counter_pickup'>('seat_delivery')
  const [placing, setPlacing] = useState(false)

  const gst = Math.round(total * 0.05)
  const deliveryFee = deliveryMethod === 'seat_delivery' ? 2900 : 0
  const grandTotal = total + gst + deliveryFee

  function handlePlaceOrder() {
    if (items.length === 0) return
    setPlacing(true)
    setTimeout(() => {
      clearCart()
      showToast('🍔 Order placed! Preparing your food...', 'success')
      setPlacing(false)
      navigate('/home')
    }, 1500)
  }

  return (
    <PageWrapper>
      <div className="px-4 pt-4 pb-2">
        <h1 className="font-display text-3xl text-gradient-amber tracking-wide">YOUR ORDER</h1>
      </div>

      {/* Active order tracker */}
      {activeOrder && (
        <div className="mx-3 mb-3">
          <p className="text-xs text-text-secondary font-body font-semibold mb-2 uppercase tracking-wider">Active Order</p>
          <OrderTracker status={activeOrder.status} estimatedMinutes={activeOrder.estimatedMinutes} />
        </div>
      )}

      {/* Cart items */}
      <div className="mx-3 space-y-2">
        <p className="text-xs text-text-secondary font-body font-semibold mb-2 uppercase tracking-wider">Cart Items</p>
        {items.length === 0 ? (
          <div className="surface-card p-8 text-center">
            <p className="text-4xl mb-3">🛒</p>
            <p className="font-body text-text-muted text-sm">Your cart is empty</p>
            <button
              className="mt-4 px-4 py-2 rounded-pill text-sm font-semibold"
              style={{ background: '#F59E0B', color: '#08090D' }}
              onClick={() => navigate('/food')}
            >
              Browse Food
            </button>
          </div>
        ) : items.map(ci => (
          <div key={ci.menuItem.id} className="surface-card p-3 flex items-center gap-3">
            <span className="text-2xl">{ci.menuItem.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-body font-semibold text-sm text-text-primary truncate">{ci.menuItem.name}</p>
              <p className="text-xs text-text-muted">{ci.menuItem.counterName}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => removeItem(ci.menuItem.id)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-amber-400 font-bold"
                style={{ background: 'var(--surface-3)', border: '1px solid rgba(245,158,11,0.3)' }}
              >−</button>
              <span className="font-display text-base text-amber-400 w-5 text-center">{ci.quantity}</span>
              <button
                onClick={() => addItem(ci.menuItem)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#08090D] font-bold"
                style={{ background: '#F59E0B' }}
              >+</button>
            </div>
            <span className="font-body font-semibold text-sm text-text-primary min-w-[44px] text-right">
              ₹{((ci.menuItem.price * ci.quantity) / 100).toFixed(0)}
            </span>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <>
          {/* Delivery method */}
          <div className="mx-3 mt-4">
            <p className="text-xs text-text-secondary font-body font-semibold mb-2 uppercase tracking-wider">Delivery Method</p>
            <div className="grid grid-cols-2 gap-3">
              {([
                { id: 'seat_delivery', label: 'Seat Delivery', sub: `Section ${user?.seatSection} Row ${user?.seatRow}`, fee: '₹29', icon: <MapPin size={18} /> },
                { id: 'counter_pickup', label: 'Counter Pickup', sub: 'Collect yourself · Faster', fee: 'Free', icon: <Package size={18} /> },
              ] as const).map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setDeliveryMethod(opt.id)}
                  className="surface-card p-3 text-left transition-all"
                  style={deliveryMethod === opt.id ? { borderColor: '#F59E0B', boxShadow: 'var(--shadow-glow)' } : {}}
                >
                  <div className="mb-2" style={{ color: deliveryMethod === opt.id ? '#F59E0B' : 'var(--text-muted)' }}>
                    {opt.icon}
                  </div>
                  <p className="font-body font-semibold text-sm text-text-primary">{opt.label}</p>
                  <p className="text-[11px] text-text-muted mt-0.5">{opt.sub}</p>
                  <p className="text-xs font-semibold mt-1" style={{ color: '#F59E0B' }}>{opt.fee}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="mx-3 mt-4 surface-card p-4">
            <p className="font-body font-semibold text-sm text-text-primary mb-3">Order Summary</p>
            {[
              { label: 'Subtotal', value: `₹${(total / 100).toFixed(0)}` },
              { label: 'GST (5%)', value: `₹${(gst / 100).toFixed(0)}` },
              { label: 'Delivery', value: deliveryFee === 0 ? 'Free' : `₹${(deliveryFee / 100).toFixed(0)}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between mb-2">
                <span className="text-xs text-text-muted font-body">{label}</span>
                <span className="text-xs text-text-secondary font-semibold">{value}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="font-body font-semibold text-text-primary">Total</span>
              <span className="font-display text-2xl text-amber-400">₹{(grandTotal / 100).toFixed(0)}</span>
            </div>
          </div>

          {/* Place order button */}
          <div className="mx-3 mt-4 mb-4">
            <button
              id="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full py-4 rounded-2xl font-body font-semibold text-sm transition-all active:scale-98 disabled:opacity-60"
              style={{ background: '#F59E0B', color: '#08090D', boxShadow: '0 0 24px rgba(245,158,11,0.3)' }}
            >
              {placing ? 'Placing Order...' : `Place Order · ₹${(grandTotal / 100).toFixed(0)}`}
            </button>
          </div>
        </>
      )}
    </PageWrapper>
  )
}
