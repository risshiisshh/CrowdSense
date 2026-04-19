// useOrders — Mission 1: returns mock order
// Mission 3B: replace with Supabase realtime subscription
import { useState } from 'react'
import { MOCK_ORDER } from '../data/mockData'
import type { FoodOrder } from '../types'

export function useOrders() {
  const [orders] = useState<FoodOrder[]>([MOCK_ORDER])
  const [isLoading] = useState(false)

  const activeOrder = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled')

  return { orders, activeOrder, isLoading }
}
