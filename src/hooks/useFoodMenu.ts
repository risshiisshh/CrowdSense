// ─── useFoodMenu — Firestore with mock fallback ───
import { useState, useMemo, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db, isFirebaseEnabled } from '../lib/firebase'
import { MOCK_MENU_ITEMS, MOCK_FOOD_COUNTERS } from '../data/mockData'
import type { MenuItem, FoodCounter } from '../types'

export function useFoodMenu() {
  const [selectedCounter, setSelectedCounter] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS)
  const [counters, setCounters] = useState<FoodCounter[]>(MOCK_FOOD_COUNTERS)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isFirebaseEnabled || !db) return

    // Load menu from Firestore
    setIsLoading(true)
    Promise.all([
      getDocs(collection(db, 'menuItems')),
      getDocs(collection(db, 'foodCounters')),
    ]).then(([menuSnap, counterSnap]) => {
      if (!menuSnap.empty) {
        setMenuItems(menuSnap.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem)))
      }
      if (!counterSnap.empty) {
        setCounters(counterSnap.docs.map(d => ({ id: d.id, ...d.data() } as FoodCounter)))
      }
    }).catch(err => {
      console.warn('Firestore menu load failed, using mock:', err)
    }).finally(() => setIsLoading(false))
  }, [])

  const categories = useMemo(() => {
    const cats = new Set(menuItems.map(i => i.category))
    return ['all', ...Array.from(cats)]
  }, [menuItems])

  const filteredItems = useMemo((): MenuItem[] => {
    return menuItems.filter(item => {
      const counterMatch = selectedCounter === 'all' || item.counterId === selectedCounter
      const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory
      return counterMatch && categoryMatch && item.isAvailable
    })
  }, [selectedCounter, selectedCategory, menuItems])

  return {
    items: filteredItems,
    counters,
    categories,
    selectedCounter,
    selectedCategory,
    setSelectedCounter,
    setSelectedCategory,
    isLoading,
  }
}
