import React, { useState } from 'react'
import { ShoppingBag, Search } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import FoodCard from '../components/food/FoodCard'
import CartDrawer from '../components/food/CartDrawer'
import { useFoodMenu } from '../hooks/useFoodMenu'
import { useCart } from '../hooks/useCart'

export default function FoodPage() {
  const { items, counters, categories, selectedCounter, selectedCategory, setSelectedCounter, setSelectedCategory } = useFoodMenu()
  const { items: cartItems, getQuantity, addItem, removeItem } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [search, setSearch] = useState('')

  const cartCount = cartItems.reduce((s, ci) => s + ci.quantity, 0)
  const cartTotal = cartItems.reduce((s, ci) => s + ci.menuItem.price * ci.quantity, 0)

  const filtered = items.filter(item =>
    !search || item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.counterName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageWrapper>
      {/* Header */}
      <div className="pt-5 pb-2 page-header">
        <h1 className="font-display text-4xl text-gradient-amber tracking-wide">FOOD & DRINKS</h1>
        <p className="text-xs font-body mt-1" style={{ color: 'var(--text-muted)' }}>
          Order from your seat or pick up at the counter
        </p>
      </div>

      {/* Search */}
      <div className="relative mt-3 mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search items, counters…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-body outline-none"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Counter selector pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          key="all-counters"
          onClick={() => setSelectedCounter('all')}
          className="flex-shrink-0 px-3 py-1.5 rounded-pill text-xs font-semibold transition-all"
          style={selectedCounter === 'all'
            ? { background: '#F59E0B', color: '#08090D' }
            : { background: 'var(--surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }
          }
        >
          All Counters
        </button>
        {counters.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCounter(c.id)}
            className="flex-shrink-0 px-3 py-1.5 rounded-pill text-xs font-semibold transition-all whitespace-nowrap"
            style={selectedCounter === c.id
              ? { background: '#F59E0B', color: '#08090D' }
              : { background: 'var(--surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }
            }
          >
            {c.name}
            <span className="ml-1 text-[10px] opacity-70">~{c.waitMinutes}m</span>
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mt-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="flex-shrink-0 px-3 py-1 rounded-pill text-[11px] font-semibold transition-all capitalize"
            style={selectedCategory === cat
              ? { background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.35)' }
              : { color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food grid — 2 cols mobile, 3 cols md, 4 cols lg */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-24 stagger-children">
        {filtered.map(item => (
          <FoodCard
            key={item.id}
            item={item}
            quantity={getQuantity(item.id)}
            onAdd={() => addItem(item)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-sm font-body" style={{ color: 'var(--text-muted)' }}>
              {search ? `No results for "${search}"` : 'No items in this category'}
            </p>
          </div>
        )}
      </div>

      {/* Floating cart bar */}
      {cartCount > 0 && (
        <div
          className="fixed bottom-4 z-30"
          style={{
            left: 'calc(var(--sidebar-collapsed) + 12px)',
            right: '12px',
            animation: 'slideUp 0.3s ease-out',
          }}
        >
          <button
            id="cart-floating-btn"
            onClick={() => setCartOpen(true)}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl"
            style={{
              background: '#F59E0B',
              boxShadow: '0 0 32px rgba(245,158,11,0.45)',
            }}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} color="#08090D" />
              <span className="font-body font-bold text-sm text-[#08090D]">
                {cartCount} item{cartCount !== 1 ? 's' : ''} in cart
              </span>
            </div>
            <span className="font-display text-lg text-[#08090D]">
              ₹{(cartTotal / 100).toFixed(0)}
            </span>
          </button>
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <CartDrawer
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onAdd={(id) => {
            const item = cartItems.find(ci => ci.menuItem.id === id)?.menuItem
            if (item) addItem(item)
          }}
          onRemove={removeItem}
        />
      )}
    </PageWrapper>
  )
}
