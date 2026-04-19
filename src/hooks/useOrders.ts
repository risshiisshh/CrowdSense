// ─── useOrders — Firestore real-time with mock fallback ───
import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, where, orderBy, addDoc, doc, updateDoc } from 'firebase/firestore'
import { db, isFirebaseEnabled } from '../lib/firebase'
import { traceAsync } from '../lib/analytics'
import { useAppStore } from '../store/useAppStore'
import { MOCK_ORDER } from '../data/mockData'
import { logger } from '../lib/logger'
import type { FoodOrder, CartItem } from '../types'

export function useOrders() {
  const user = useAppStore(s => s.user)
  const showToast = useAppStore(s => s.showToast)
  const [orders, setOrders] = useState<FoodOrder[]>([MOCK_ORDER])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isFirebaseEnabled || !db || !user) return

    setIsLoading(true)
    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'))

    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FoodOrder)))
      }
      setIsLoading(false)
    }, (err) => {
      logger.warn('Firestore orders error', err)
      setIsLoading(false)
    })

    return () => unsub()
  }, [user?.uid])

  const activeOrder = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled')

  // Place a new order
  async function placeOrder(items: CartItem[], deliveryMethod: FoodOrder['deliveryMethod']) {
    if (!user) return null

    const totalAmount = items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0)
    const orderData = {
      userId: user.uid,
      items: items.map(i => ({
        menuItem: { id: i.menuItem.id, name: i.menuItem.name, price: i.menuItem.price, emoji: i.menuItem.emoji },
        quantity: i.quantity,
      })),
      totalAmount,
      deliveryMethod,
      status: 'placed' as const,
      estimatedMinutes: Math.max(...items.map(i => i.menuItem.preparationTime)) + 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (!isFirebaseEnabled || !db) {
      // Demo mode — simulate
      setOrders(prev => [{ id: `order_${Date.now()}`, ...orderData } as FoodOrder, ...prev])
      showToast('🍔 Order placed! (demo mode)', 'success')
      return orderData
    }

    try {
      const docRef = await traceAsync('place_order', () => addDoc(collection(db!, 'orders'), orderData))
      showToast('🍔 Order placed successfully!', 'success')
      return { id: docRef.id, ...orderData }
    } catch (err) {
      logger.error('Order placement failed', err)
      showToast('Order failed — please try again', 'error')
      return null
    }
  }

  return { orders, activeOrder, isLoading, placeOrder }
}
