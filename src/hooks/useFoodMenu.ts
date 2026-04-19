// useFoodMenu — Mission 1: returns mock menu
// Mission 3B: replace with Supabase query
import { useState, useMemo } from 'react'
import { MOCK_MENU_ITEMS, MOCK_FOOD_COUNTERS } from '../data/mockData'
import type { MenuItem, FoodCounter } from '../types'

export function useFoodMenu() {
  const [selectedCounter, setSelectedCounter] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const counters: FoodCounter[] = MOCK_FOOD_COUNTERS

  const categories = useMemo(() => {
    const cats = new Set(MOCK_MENU_ITEMS.map(i => i.category))
    return ['all', ...Array.from(cats)]
  }, [])

  const filteredItems = useMemo((): MenuItem[] => {
    return MOCK_MENU_ITEMS.filter(item => {
      const counterMatch = selectedCounter === 'all' || item.counterId === selectedCounter
      const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory
      return counterMatch && categoryMatch && item.isAvailable
    })
  }, [selectedCounter, selectedCategory])

  return {
    items: filteredItems,
    counters,
    categories,
    selectedCounter,
    selectedCategory,
    setSelectedCounter,
    setSelectedCategory,
    isLoading: false,
  }
}
