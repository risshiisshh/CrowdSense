// ============================================================
// CrowdSense — All TypeScript Interfaces
// ============================================================

export type CrowdLevel = 'low' | 'medium' | 'high' | 'full';
export type OrderStatus = 'placed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
export type AlertType = 'info' | 'warning' | 'emergency' | 'promo';
export type TierName = 'bronze' | 'silver' | 'gold' | 'platinum' | 'legend';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  tier: TierName;
  points: number;
  xp: number;
  seatSection: string;
  seatRow: string;
  seatNumber: string;
  eventId: string;
  referralCode: string;
  preferences: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  liveUpdates: boolean;
  foodAlerts: boolean;
  eventAlerts: boolean;
  haptics: boolean;
  arFeatures: boolean;
  language: string;
  dataSharing: boolean;
}

export interface CrowdZone {
  id: string;
  name: string;
  section: string;
  level: CrowdLevel;
  occupancy: number;  // 0–100
  capacity: number;
  waitMinutes: number;
  trend: 'rising' | 'falling' | 'stable';
  updatedAt: string;
}

export interface Gate {
  id: string;
  name: string;
  level: CrowdLevel;
  waitMinutes: number;
  status: 'open' | 'limited' | 'closed';
  updatedAt: string;
}

export interface FoodCounter {
  id: string;
  name: string;
  zone: string;
  cuisine: string;
  waitMinutes: number;
  level: CrowdLevel;
  isOpen: boolean;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  counterId: string;
  counterName: string;
  name: string;
  description: string;
  price: number; // in paise (₹ = price/100)
  emoji: string;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  preparationTime: number; // minutes
  rating: number;
  tags: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface FoodOrder {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  deliveryMethod: 'seat_delivery' | 'counter_pickup';
  status: OrderStatus;
  estimatedMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface StadiumEvent {
  id: string;
  name: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  venue: string;
  date: string;
  startTime: string;
  status: 'upcoming' | 'live' | 'completed';
  round: string;
  attendance: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: string | null;
  isEarned: boolean;
}

export interface PointsEntry {
  id: string;
  userId: string;
  points: number;
  action: string;
  description: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Tier {
  name: TierName;
  minXp: number;
  maxXp: number;
  color: string;
  emoji: string;
}

export interface TierConfig {
  [key: string]: Tier;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
