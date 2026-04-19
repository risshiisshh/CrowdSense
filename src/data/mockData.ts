// ============================================================
// CrowdSense — Mock Data for Mission 1
// All pages use this data until Mission 2 (live backend)
// ============================================================
import type {
  User, CrowdZone, Gate, FoodCounter, MenuItem,
  StadiumEvent, Badge, PointsEntry, Alert, FoodOrder
} from '../types'

export const MOCK_USER: User = {
  uid: 'mock_uid_001',
  email: 'rishabh@crowdsense.app',
  displayName: 'Rishabh Shevde',
  photoURL: '',
  tier: 'gold',
  points: 2340,
  xp: 1850,
  seatSection: 'D',
  seatRow: '12',
  seatNumber: '07',
  eventId: 'ipl_2025_match_42',
  referralCode: 'RISHABH2025',
  createdAt: '2025-09-01T00:00:00Z',
  preferences: {
    liveUpdates: true,
    foodAlerts: true,
    eventAlerts: true,
    haptics: true,
    arFeatures: true,
    language: 'en',
    dataSharing: false,
  },
}

export const MOCK_EVENT: StadiumEvent = {
  id: 'ipl_2025_match_42',
  name: 'IPL 2025 — Match 42',
  sport: 'Cricket',
  homeTeam: 'Mumbai Indians',
  awayTeam: 'Chennai Super Kings',
  homeScore: 168,
  awayScore: 142,
  venue: 'Wankhede Stadium',
  date: '2025-04-18',
  startTime: '19:30',
  status: 'live',
  round: 'League Stage',
  attendance: 32480,
}

export const MOCK_ZONES: CrowdZone[] = [
  { id: 'z1', name: 'North Stand',   section: 'A', level: 'high',   occupancy: 420, capacity: 500, waitMinutes: 18, trend: 'rising',  updatedAt: new Date().toISOString() },
  { id: 'z2', name: 'South Stand',   section: 'B', level: 'medium', occupancy: 310, capacity: 500, waitMinutes: 8,  trend: 'stable',  updatedAt: new Date().toISOString() },
  { id: 'z3', name: 'East Pavilion', section: 'C', level: 'low',    occupancy: 180, capacity: 400, waitMinutes: 2,  trend: 'falling', updatedAt: new Date().toISOString() },
  { id: 'z4', name: 'West Wing',     section: 'D', level: 'medium', occupancy: 290, capacity: 450, waitMinutes: 10, trend: 'rising',  updatedAt: new Date().toISOString() },
  { id: 'z5', name: 'VIP Lounge',    section: 'V', level: 'low',    occupancy: 95,  capacity: 200, waitMinutes: 0,  trend: 'stable',  updatedAt: new Date().toISOString() },
  { id: 'z6', name: 'Press Box',     section: 'P', level: 'low',    occupancy: 60,  capacity: 150, waitMinutes: 0,  trend: 'stable',  updatedAt: new Date().toISOString() },
  { id: 'z7', name: 'Family Zone',   section: 'F', level: 'medium', occupancy: 340, capacity: 500, waitMinutes: 12, trend: 'stable',  updatedAt: new Date().toISOString() },
  { id: 'z8', name: 'Upper Deck',    section: 'U', level: 'full',   occupancy: 490, capacity: 500, waitMinutes: 25, trend: 'rising',  updatedAt: new Date().toISOString() },
]

export const MOCK_GATES: Gate[] = [
  { id: 'g1', name: 'Gate 1 (Main)',  level: 'high',   waitMinutes: 22, status: 'open',    updatedAt: new Date().toISOString() },
  { id: 'g2', name: 'Gate 2 (East)',  level: 'medium', waitMinutes: 10, status: 'open',    updatedAt: new Date().toISOString() },
  { id: 'g3', name: 'Gate 3 (West)',  level: 'low',    waitMinutes: 3,  status: 'open',    updatedAt: new Date().toISOString() },
  { id: 'g4', name: 'Gate 4 (VIP)',   level: 'low',    waitMinutes: 0,  status: 'limited', updatedAt: new Date().toISOString() },
]

export const MOCK_FOOD_COUNTERS: FoodCounter[] = [
  { id: 'fc1', name: 'Spice Route',    zone: 'North Stand',   cuisine: 'Indian',      waitMinutes: 12, level: 'high',   isOpen: true,  updatedAt: new Date().toISOString() },
  { id: 'fc2', name: 'Burger Boulevard',zone: 'South Stand',  cuisine: 'Fast Food',   waitMinutes: 6,  level: 'medium', isOpen: true,  updatedAt: new Date().toISOString() },
  { id: 'fc3', name: 'Chai Corner',    zone: 'East Pavilion', cuisine: 'Beverages',   waitMinutes: 2,  level: 'low',    isOpen: true,  updatedAt: new Date().toISOString() },
  { id: 'fc4', name: 'Mega Bites',     zone: 'West Wing',     cuisine: 'Multi-cuisine',waitMinutes: 15, level: 'high',  isOpen: true,  updatedAt: new Date().toISOString() },
  { id: 'fc5', name: 'Green Bowl',     zone: 'Family Zone',   cuisine: 'Healthy',     waitMinutes: 4,  level: 'low',    isOpen: true,  updatedAt: new Date().toISOString() },
]

export const MOCK_MENU_ITEMS: MenuItem[] = [
  // Spice Route
  { id: 'm1', counterId: 'fc1', counterName: 'Spice Route', name: 'Butter Chicken Roll', description: 'Creamy butter chicken wrapped in tandoori roti', price: 18000, emoji: '🌯', category: 'Mains', isVeg: false, isAvailable: true, preparationTime: 12, rating: 4.7, tags: ['bestseller', 'spicy'] },
  { id: 'm2', counterId: 'fc1', counterName: 'Spice Route', name: 'Paneer Tikka', description: 'Chargrilled paneer with mint chutney', price: 15000, emoji: '🧀', category: 'Starters', isVeg: true, isAvailable: true, preparationTime: 8, rating: 4.5, tags: ['veg', 'popular'] },
  { id: 'm3', counterId: 'fc1', counterName: 'Spice Route', name: 'Samosa (2pcs)', description: 'Crispy spiced potato samosas with tamarind sauce', price: 6000, emoji: '🥟', category: 'Snacks', isVeg: true, isAvailable: true, preparationTime: 3, rating: 4.3, tags: ['veg', 'quick'] },
  // Burger Boulevard
  { id: 'm4', counterId: 'fc2', counterName: 'Burger Boulevard', name: 'Stadium Double Burger', description: 'Double patty with stadium sauce, cheddar & jalapeños', price: 24000, emoji: '🍔', category: 'Mains', isVeg: false, isAvailable: true, preparationTime: 7, rating: 4.8, tags: ['bestseller'] },
  { id: 'm5', counterId: 'fc2', counterName: 'Burger Boulevard', name: 'Loaded Fries', description: 'Crispy fries with cheese sauce & sriracha drizzle', price: 12000, emoji: '🍟', category: 'Sides', isVeg: true, isAvailable: true, preparationTime: 5, rating: 4.6, tags: ['veg', 'popular'] },
  { id: 'm6', counterId: 'fc2', counterName: 'Burger Boulevard', name: 'Craft Cola', description: 'Ice cold craft cola with lemon zest', price: 8000, emoji: '🥤', category: 'Beverages', isVeg: true, isAvailable: true, preparationTime: 1, rating: 4.2, tags: ['cold', 'quick'] },
  // Chai Corner
  { id: 'm7', counterId: 'fc3', counterName: 'Chai Corner', name: 'Masala Chai', description: 'Authentic spiced tea with ginger & cardamom', price: 4000, emoji: '☕', category: 'Hot', isVeg: true, isAvailable: true, preparationTime: 3, rating: 4.9, tags: ['veg', 'hot', 'popular'] },
  { id: 'm8', counterId: 'fc3', counterName: 'Chai Corner', name: 'Cold Coffee', description: 'Rich cold brew with vanilla ice cream float', price: 9000, emoji: '🧋', category: 'Cold', isVeg: true, isAvailable: true, preparationTime: 2, rating: 4.6, tags: ['veg', 'cold'] },
  // Green Bowl
  { id: 'm9', counterId: 'fc5', counterName: 'Green Bowl', name: 'Protein Bowl', description: 'Grilled chicken, quinoa, avocado & greens', price: 22000, emoji: '🥗', category: 'Mains', isVeg: false, isAvailable: true, preparationTime: 6, rating: 4.5, tags: ['healthy', 'protein'] },
  { id: 'm10', counterId: 'fc5', counterName: 'Green Bowl', name: 'Acai Smoothie', description: 'Acai, banana, almond milk & honey', price: 14000, emoji: '🍓', category: 'Beverages', isVeg: true, isAvailable: true, preparationTime: 4, rating: 4.7, tags: ['veg', 'healthy'] },
]

export const MOCK_BADGES: Badge[] = [
  { id: 'first_order',     name: 'First Bite',       description: 'Place your first food order',               emoji: '🍔', rarity: 'common',    isEarned: true,  earnedAt: '2025-03-10T14:00:00Z' },
  { id: 'early_bird',      name: 'Early Arrival',    description: 'Check in 60+ minutes before the match',     emoji: '🐦', rarity: 'common',    isEarned: true,  earnedAt: '2025-02-22T17:30:00Z' },
  { id: 'crowd_master',    name: 'Crowd Master',     description: 'Navigate 5 high-density zones',             emoji: '🏟️', rarity: 'rare',      isEarned: true,  earnedAt: '2025-04-01T20:00:00Z' },
  { id: 'food_explorer',   name: 'Food Explorer',    description: 'Order from 3 different food counters',      emoji: '🍽️', rarity: 'rare',      isEarned: false, earnedAt: null },
  { id: 'social_butterfly',name: 'Social Butterfly', description: 'Refer 3 friends to CrowdSense',            emoji: '🦋', rarity: 'epic',      isEarned: false, earnedAt: null },
  { id: 'season_warrior',  name: 'Season Warrior',   description: 'Attend 10+ events with CrowdSense',        emoji: '⚔️', rarity: 'epic',      isEarned: false, earnedAt: null },
  { id: 'platinum_fan',    name: 'Platinum Fan',     description: 'Reach Platinum tier',                      emoji: '💎', rarity: 'legendary', isEarned: false, earnedAt: null },
  { id: 'legend_status',   name: 'Legend Status',    description: 'Reach Legend tier — you are royalty',      emoji: '👑', rarity: 'legendary', isEarned: false, earnedAt: null },
]

export const MOCK_POINTS_HISTORY: PointsEntry[] = [
  { id: 'pe1', userId: 'mock_uid_001', points: 120, action: 'FIRST_EVENT_LOGIN', description: 'Welcome bonus — first event!', createdAt: '2025-04-18T19:30:00Z' },
  { id: 'pe2', userId: 'mock_uid_001', points: 50,  action: 'FOOD_ORDER',        description: 'Ordered Butter Chicken Roll',  createdAt: '2025-04-18T20:05:00Z' },
  { id: 'pe3', userId: 'mock_uid_001', points: 75,  action: 'BADGE_UNLOCK',      description: 'Unlocked Crowd Master badge',  createdAt: '2025-04-01T20:00:00Z' },
  { id: 'pe4', userId: 'mock_uid_001', points: 25,  action: 'CHECK_IN',          description: 'Stadium check-in',             createdAt: '2025-03-15T17:30:00Z' },
  { id: 'pe5', userId: 'mock_uid_001', points: 200, action: 'REFERRAL',          description: 'Referred @priya_fan',          createdAt: '2025-03-08T10:00:00Z' },
  { id: 'pe6', userId: 'mock_uid_001', points: 50,  action: 'FOOD_ORDER',        description: 'Ordered Masala Chai × 2',      createdAt: '2025-02-22T18:15:00Z' },
]

export const MOCK_ALERTS: Alert[] = [
  { id: 'a1', type: 'warning',   title: 'North Stand Crowded', message: 'Heavy crowd at North Stand. Try East Pavilion for a shorter route.', isRead: false, createdAt: new Date(Date.now() - 3 * 60000).toISOString() },
  { id: 'a2', type: 'promo',     title: '🎉 Happy Hours!',     message: 'Buy any two items at Burger Boulevard and get 15% off. Valid until 9 PM.', isRead: false, createdAt: new Date(Date.now() - 8 * 60000).toISOString() },
  { id: 'a3', type: 'info',      title: 'Gate 3 Now Open',    message: 'Gate 3 (West entrance) is now open with minimal waiting time.', isRead: true,  createdAt: new Date(Date.now() - 20 * 60000).toISOString() },
  { id: 'a4', type: 'emergency', title: '⚠️ Sector Closure',  message: 'Temporary closure in Upper Deck sector UE-4 for safety checks. Please move to adjacent zones.', isRead: true, createdAt: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 'a5', type: 'info',      title: 'Your Order is Ready', message: 'Your Paneer Tikka from Spice Route is ready for pickup at Counter 3.', isRead: true, createdAt: new Date(Date.now() - 60 * 60000).toISOString() },
]

export const MOCK_ORDER: FoodOrder = {
  id: 'order_001',
  userId: 'mock_uid_001',
  items: [
    { menuItem: MOCK_MENU_ITEMS[0], quantity: 1 },
    { menuItem: MOCK_MENU_ITEMS[6], quantity: 2 },
  ],
  totalAmount: 26000,
  deliveryMethod: 'seat_delivery',
  status: 'preparing',
  estimatedMinutes: 14,
  createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  updatedAt: new Date().toISOString(),
}

export const UPCOMING_EVENTS: (StadiumEvent & { emoji: string; category: string; hasTicket: boolean })[] = [
  { id: 'ipl_2025_43',  name: 'IPL 2025 — Match 43', sport: 'Cricket',  homeTeam: 'RCB',      awayTeam: 'KKR',        homeScore: 0, awayScore: 0, venue: 'M. Chinnaswamy Stadium', date: '2025-04-22', startTime: '19:30', status: 'upcoming', round: 'League Stage', attendance: 0, emoji: '🏏', category: 'Cricket',  hasTicket: true  },
  { id: 'coldplay_2025', name: 'Coldplay Music of the Spheres', sport: 'Concert',  homeTeam: 'Coldplay',  awayTeam: '',           homeScore: 0, awayScore: 0, venue: 'DY Patil Stadium, Mumbai',  date: '2025-05-03', startTime: '20:00', status: 'upcoming', round: '',            attendance: 0, emoji: '🎵', category: 'Concert',  hasTicket: true  },
  { id: 'f1_2025_bahrain', name: 'Formula 1 — Bahrain GP', sport: 'F1',       homeTeam: 'Race Day',  awayTeam: '',           homeScore: 0, awayScore: 0, venue: 'Bahrain Int. Circuit',      date: '2025-05-15', startTime: '17:00', status: 'upcoming', round: 'Round 5',     attendance: 0, emoji: '🏎️', category: 'F1 Race', hasTicket: false },
  { id: 'isl_final_2025', name: 'ISL Final 2025',           sport: 'Football', homeTeam: 'Mumbai CF', awayTeam: 'Bengaluru FC', homeScore: 0, awayScore: 0, venue: 'Salt Lake Stadium, Kolkata', date: '2025-05-25', startTime: '19:00', status: 'upcoming', round: 'Final',       attendance: 0, emoji: '⚽', category: 'Football', hasTicket: false },
  { id: 'comedy_2025',    name: 'The Stand-Up Spectacular', sport: 'Comedy',   homeTeam: 'Zakir Khan', awayTeam: '',           homeScore: 0, awayScore: 0, venue: 'NESCO, Mumbai',             date: '2025-06-01', startTime: '20:30', status: 'upcoming', round: '',            attendance: 0, emoji: '🎤', category: 'Comedy',   hasTicket: true  },
  { id: 'ipl_2025_44',  name: 'IPL 2025 — Match 44', sport: 'Cricket',  homeTeam: 'SRH',      awayTeam: 'DC',         homeScore: 0, awayScore: 0, venue: 'Rajiv Gandhi Int. Stadium', date: '2025-06-10', startTime: '15:30', status: 'upcoming', round: 'League Stage', attendance: 0, emoji: '🏏', category: 'Cricket',  hasTicket: false },
]

