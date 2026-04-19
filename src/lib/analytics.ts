// ─── CrowdSense — Google Analytics Event Tracking ───
// Provides a lightweight wrapper around Firebase Analytics.
// All events are no-ops when Firebase is disabled (demo mode).
import { getAnalytics, logEvent, setUserId, setUserProperties, type Analytics } from 'firebase/analytics'
import { firebaseApp, isFirebaseEnabled } from './firebase'

let analytics: Analytics | null = null

// Initialize analytics only when Firebase is enabled
if (isFirebaseEnabled && firebaseApp) {
  try {
    analytics = getAnalytics(firebaseApp)
    console.log('📊 Google Analytics initialized')
  } catch (err) {
    console.warn('Analytics initialization skipped:', err)
  }
}

// ─── Page View Tracking ───
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (!analytics) return
  logEvent(analytics, 'page_view', {
    page_path: pagePath,
    page_title: pageTitle || pagePath,
  })
}

// ─── Custom Event Tracking ───
export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (!analytics) return
  logEvent(analytics, eventName, params)
}

// ─── User Identity ───
export function setAnalyticsUser(uid: string, tier?: string) {
  if (!analytics) return
  setUserId(analytics, uid)
  if (tier) {
    setUserProperties(analytics, { user_tier: tier })
  }
}

// ─── Pre-defined CrowdSense Events ───
export const CrowdSenseEvents = {
  // Auth
  signIn: (method: string) => trackEvent('login', { method }),
  signUp: (method: string) => trackEvent('sign_up', { method }),
  signOut: () => trackEvent('logout'),

  // Map interaction
  zoneSelected: (zoneId: string, level: string) =>
    trackEvent('zone_selected', { zone_id: zoneId, crowd_level: level }),
  mapModeChanged: (mode: string) =>
    trackEvent('map_mode_changed', { mode }),

  // Food & orders
  addToCart: (itemName: string, price: number) =>
    trackEvent('add_to_cart', { item_name: itemName, value: price / 100 }),
  orderPlaced: (totalAmount: number, itemCount: number) =>
    trackEvent('purchase', { value: totalAmount / 100, items: itemCount }),

  // Gamification
  badgeUnlocked: (badgeId: string, badgeName: string) =>
    trackEvent('badge_unlocked', { badge_id: badgeId, badge_name: badgeName }),
  rewardRedeemed: (rewardId: string, pointsCost: number) =>
    trackEvent('reward_redeemed', { reward_id: rewardId, points_cost: pointsCost }),

  // Settings
  themeChanged: (theme: string) => trackEvent('theme_changed', { theme }),
  settingToggled: (setting: string, enabled: boolean) =>
    trackEvent('setting_toggled', { setting, enabled }),

  // AI Assistant
  chatMessageSent: () => trackEvent('chat_message_sent'),

  // Admin
  alertBroadcast: (alertType: string) =>
    trackEvent('alert_broadcast', { alert_type: alertType }),
  eventSimulated: (simulation: string) =>
    trackEvent('event_simulated', { simulation }),
}
