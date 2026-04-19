// useCart — Mission 1: sessionStorage-backed cart
import { useReducer, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import type { CartItem, MenuItem } from '../types'

type CartAction =
  | { type: 'ADD';    item: MenuItem }
  | { type: 'REMOVE'; itemId: string }
  | { type: 'CLEAR' }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const exists = state.find(ci => ci.menuItem.id === action.item.id)
      if (exists) return state.map(ci =>
        ci.menuItem.id === action.item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
      )
      return [...state, { menuItem: action.item, quantity: 1 }]
    }
    case 'REMOVE': {
      return state
        .map(ci => ci.menuItem.id === action.itemId ? { ...ci, quantity: ci.quantity - 1 } : ci)
        .filter(ci => ci.quantity > 0)
    }
    case 'CLEAR':
      return []
  }
}

function loadCart(): CartItem[] {
  try {
    const raw = sessionStorage.getItem('cs_cart')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function useCart() {
  const setCartCount = useAppStore(s => s.setCartCount)
  const [items, dispatch] = useReducer(cartReducer, undefined, loadCart)

  useEffect(() => {
    sessionStorage.setItem('cs_cart', JSON.stringify(items))
    setCartCount(items.reduce((sum, ci) => sum + ci.quantity, 0))
  }, [items])

  const total = items.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0)
  const count = items.reduce((sum, ci) => sum + ci.quantity, 0)

  function getQuantity(itemId: string): number {
    return items.find(ci => ci.menuItem.id === itemId)?.quantity ?? 0
  }

  return {
    items,
    total,
    count,
    getQuantity,
    addItem:    (item: MenuItem) => dispatch({ type: 'ADD', item }),
    removeItem: (itemId: string) => dispatch({ type: 'REMOVE', itemId }),
    clearCart:  () => dispatch({ type: 'CLEAR' }),
  }
}
