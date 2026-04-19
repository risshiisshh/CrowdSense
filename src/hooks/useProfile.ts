// useProfile — Mission 1: returns mock profile data
// Mission 3C: replace with parallel Supabase fetches
import { useAppStore } from '../store/useAppStore'
import { MOCK_BADGES, MOCK_POINTS_HISTORY } from '../data/mockData'
import type { Badge, PointsEntry } from '../types'

const MOCK_REWARDS = [
  { id: 'r1', name: '10% Off Next Order', description: 'Enjoy 10% off at any food counter', emoji: '🎁', pointsCost: 500,  isLocked: false, tag: 'Popular' },
  { id: 'r2', name: 'Priority Entry',     description: 'Skip the queue at Gate 1',         emoji: '⚡', pointsCost: 1000, isLocked: false },
  { id: 'r3', name: 'VIP Upgrade',        description: 'One-match VIP lounge access',      emoji: '💎', pointsCost: 3000, isLocked: false, tag: 'Premium' },
  { id: 'r4', name: 'Season Pass Discount',description: '₹500 off next season pass',       emoji: '🏟️', pointsCost: 5000, isLocked: false },
]

export function useProfile() {
  const user = useAppStore(s => s.user)

  const badges: Badge[] = MOCK_BADGES
  const pointsHistory: PointsEntry[] = MOCK_POINTS_HISTORY
  const rewards = MOCK_REWARDS

  return {
    user,
    badges,
    pointsHistory,
    rewards,
    isLoading: false,
  }
}
