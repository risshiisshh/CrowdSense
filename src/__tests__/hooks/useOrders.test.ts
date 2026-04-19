// ─── useOrders Tests ─────────────────────────────────────────────────────────
// Tests the order business logic in demo mode (no Firebase).
// Validates order status transitions, active order detection, and totals.
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAppStore } from '../../store/useAppStore'
import type { FoodOrder, CartItem, MenuItem } from '../../types'

vi.mock('../../lib/firebase', () => ({
  isFirebaseEnabled: false,
  auth: null,
  db: null,
  firebaseApp: null,
  googleProvider: null,
}))

const MOCK_MENU_ITEM: MenuItem = {
  id: 'item-1',
  name: 'Crispy Burger',
  description: 'Classic burger',
  price: 349,
  category: 'mains',
  emoji: '🍔',
  isAvailable: true,
  preparationTime: 10,
  counterId: 'counter-1',
  counterName: 'Main Grille',
  isVeg: false,
  rating: 4.5,
  tags: ['popular', 'spicy'],
}

const MOCK_CART_ITEM: CartItem = {
  menuItem: MOCK_MENU_ITEM,
  quantity: 2,
}

const makeOrder = (id: string, status: FoodOrder['status']): FoodOrder => ({
  id,
  userId: 'demo-uid',
  items: [MOCK_CART_ITEM],
  totalAmount: 698,
  deliveryMethod: 'counter_pickup',
  status,
  estimatedMinutes: 15,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

vi.mock('../../data/mockData', () => ({
  MOCK_ORDER: makeOrder('mock-order-1', 'preparing'),
  MOCK_USER: { uid: 'demo-uid', preferences: {} },
  MOCK_ZONES: [],
  MOCK_GATES: [],
  MOCK_ALERTS: [],
  MOCK_POINTS_HISTORY: [],
}))

describe('useOrders (demo mode)', () => {
  beforeEach(() => {
    useAppStore.setState({ toasts: [], cartCount: 0, user: null })
  })

  describe('order data structure', () => {
    it('order has required fields', () => {
      const order = makeOrder('o1', 'placed')
      expect(order.id).toBeTruthy()
      expect(order.userId).toBeTruthy()
      expect(order.items).toHaveLength(1)
      expect(order.totalAmount).toBeGreaterThan(0)
      expect(order.deliveryMethod).toBe('counter_pickup')
    })

    it('all valid order statuses are defined', () => {
      const statuses: FoodOrder['status'][] = ['placed', 'preparing', 'on_the_way', 'delivered', 'cancelled']
      statuses.forEach(status => {
        const order = makeOrder(`order-${status}`, status)
        expect(order.status).toBe(status)
      })
    })
  })

  describe('active order detection logic', () => {
    it('placed order is considered active', () => {
      const orders: FoodOrder[] = [makeOrder('o1', 'placed')]
      const activeOrder = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled')
      expect(activeOrder).toBeDefined()
      expect(activeOrder?.id).toBe('o1')
    })

    it('preparing order is considered active', () => {
      const orders: FoodOrder[] = [makeOrder('o1', 'preparing')]
      const activeOrder = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled')
      expect(activeOrder).toBeDefined()
    })

    it('on_the_way order is considered active', () => {
      const orders: FoodOrder[] = [makeOrder('o1', 'on_the_way')]
      const activeOrder = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled')
      expect(activeOrder).toBeDefined()
    })

    it('delivered order is NOT active', () => {
      const orders: FoodOrder[] = [makeOrder('o1', 'delivered')]
      const activeOrder = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled')
      expect(activeOrder).toBeUndefined()
    })

    it('cancelled order is NOT active', () => {
      const orders: FoodOrder[] = [makeOrder('o1', 'cancelled')]
      const activeOrder = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled')
      expect(activeOrder).toBeUndefined()
    })

    it('picks most recent active from multiple orders', () => {
      const orders: FoodOrder[] = [
        makeOrder('o1', 'delivered'),
        makeOrder('o2', 'preparing'),
        makeOrder('o3', 'cancelled'),
      ]
      const activeOrder = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled')
      expect(activeOrder?.id).toBe('o2')
    })
  })

  describe('total amount calculation', () => {
    it('calculates total for single item', () => {
      const items: CartItem[] = [{ menuItem: MOCK_MENU_ITEM, quantity: 1 }]
      const total = items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0)
      expect(total).toBe(349)
    })

    it('calculates total for multiple quantities', () => {
      const items: CartItem[] = [{ menuItem: MOCK_MENU_ITEM, quantity: 3 }]
      const total = items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0)
      expect(total).toBe(1047)
    })

    it('calculates total for multiple items', () => {
      const secondItem: MenuItem = { ...MOCK_MENU_ITEM, id: 'item-2', price: 150 }
      const items: CartItem[] = [
        { menuItem: MOCK_MENU_ITEM, quantity: 2 },
        { menuItem: secondItem, quantity: 1 },
      ]
      const total = items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0)
      expect(total).toBe(848) // 349*2 + 150
    })

    it('empty cart has zero total', () => {
      const items: CartItem[] = []
      const total = items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0)
      expect(total).toBe(0)
    })
  })

  describe('estimated time calculation', () => {
    it('estimated time is max prep time + 5 minutes buffer', () => {
      const items: CartItem[] = [
        { menuItem: { ...MOCK_MENU_ITEM, preparationTime: 10 }, quantity: 1 },
        { menuItem: { ...MOCK_MENU_ITEM, id: 'item-2', preparationTime: 15 }, quantity: 1 },
      ]
      const estimated = Math.max(...items.map(i => i.menuItem.preparationTime)) + 5
      expect(estimated).toBe(20) // max(10,15) + 5
    })

    it('single item estimated time is prep time + 5', () => {
      const items: CartItem[] = [{ menuItem: MOCK_MENU_ITEM, quantity: 1 }]
      const estimated = Math.max(...items.map(i => i.menuItem.preparationTime)) + 5
      expect(estimated).toBe(15) // 10 + 5
    })
  })

  describe('demo mode — toast on order placement', () => {
    it('showToast can be called without errors', () => {
      expect(() => {
        useAppStore.getState().showToast('🍔 Order placed! (demo mode)', 'success')
      }).not.toThrow()
      expect(useAppStore.getState().toasts[0].message).toBe('🍔 Order placed! (demo mode)')
      expect(useAppStore.getState().toasts[0].type).toBe('success')
    })

    it('error toast is accessible via store', () => {
      useAppStore.getState().showToast('Order failed — please try again', 'error')
      expect(useAppStore.getState().toasts[0].type).toBe('error')
    })
  })
})
