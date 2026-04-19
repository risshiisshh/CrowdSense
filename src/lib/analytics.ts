// ─── CrowdSense — Google Analytics Event Tracking ────────────────────────────
// Lightweight wrapper around Firebase Analytics + Firebase Performance.
// All functions are no-ops when Firebase is disabled (demo mode).
// ─────────────────────────────────────────────────────────────────────────────
import {
  logEvent, setUserId, setUserProperties,
} from 'firebase/analytics'
import { trace, type PerformanceTrace } from 'firebase/performance'
import { analytics, performance, isFirebaseEnabled } from './firebase'
import { logger } from './logger'

// ─── Page View Tracking ───────────────────────────────────────────────────────
/**
 * Tracks a page view in Google Analytics.
 * @param pagePath  - Route path (e.g. `/home`)
 * @param pageTitle - Optional human-readable page title
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (!analytics) return
  logEvent(analytics, 'page_view', {
    page_path:  pagePath,
    page_title: pageTitle || pagePath,
  })
}

// ─── Custom Event Tracking ────────────────────────────────────────────────────
/**
 * Tracks a custom named event in Google Analytics.
 * @param eventName - GA4 event name (snake_case)
 * @param params    - Optional key-value properties
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (!analytics) return
  logEvent(analytics, eventName, params)
}

// ─── User Identity ────────────────────────────────────────────────────────────
/**
 * Associates subsequent events with a specific authenticated user.
 * @param uid  - Firebase Auth UID
 * @param tier - Optional loyalty tier (bronze | silver | gold | platinum | legend)
 */
export function setAnalyticsUser(uid: string, tier?: string): void {
  if (!analytics) return
  setUserId(analytics, uid)
  if (tier) {
    setUserProperties(analytics, { user_tier: tier })
  }
}

// ─── Performance Monitoring ───────────────────────────────────────────────────
/**
 * Wraps an async operation with a Firebase Performance custom trace.
 * The trace appears in the Firebase Console under Performance → Custom Traces.
 *
 * @param traceName - Name of the trace (≤100 chars, no leading/trailing whitespace)
 * @param fn        - Async function to measure
 * @returns         - The result of `fn`
 *
 * @example
 * const zones = await traceAsync('fetch_crowd_zones', () => fetchZones())
 */
export async function traceAsync<T>(traceName: string, fn: () => Promise<T>): Promise<T> {
  if (!isFirebaseEnabled || !performance) return fn()

  let t: PerformanceTrace | null = null
  try {
    t = trace(performance, traceName)
    t.start()
  } catch {
    // Performance not available in this environment
  }

  try {
    const result = await fn()
    t?.stop()
    return result
  } catch (err) {
    logger.warn(`Performance trace "${traceName}" interrupted by error`, err)
    t?.stop()
    throw err
  }
}

// ─── Pre-defined CrowdSense Events ───────────────────────────────────────────
/** Type-safe event catalog for all CrowdSense GA4 events */
export const CrowdSenseEvents = {
  // ── Auth ──
  signIn:   (method: string)             => trackEvent('login',   { method }),
  signUp:   (method: string)             => trackEvent('sign_up', { method }),
  signOut:  ()                           => trackEvent('logout'),

  // ── Map interaction ──
  zoneSelected:    (zoneId: string, level: string) =>
    trackEvent('zone_selected', { zone_id: zoneId, crowd_level: level }),
  mapModeChanged:  (mode: string)        =>
    trackEvent('map_mode_changed', { mode }),

  // ── Food & orders ──
  addToCart:   (itemName: string, price: number) =>
    trackEvent('add_to_cart', { item_name: itemName, value: price / 100 }),
  orderPlaced: (totalAmount: number, itemCount: number) =>
    trackEvent('purchase', { value: totalAmount / 100, items: itemCount }),

  // ── Gamification ──
  badgeUnlocked:   (badgeId: string, badgeName: string) =>
    trackEvent('badge_unlocked', { badge_id: badgeId, badge_name: badgeName }),
  rewardRedeemed:  (rewardId: string, pointsCost: number) =>
    trackEvent('reward_redeemed', { reward_id: rewardId, points_cost: pointsCost }),

  // ── Settings ──
  themeChanged:    (theme: string)                    => trackEvent('theme_changed',    { theme }),
  settingToggled:  (setting: string, enabled: boolean) => trackEvent('setting_toggled', { setting, enabled }),

  // ── AI Assistant ──
  chatMessageSent: (mode: 'ai' | 'mock') => trackEvent('chat_message_sent', { mode }),
  chatOpened:      ()                    => trackEvent('chat_opened'),

  // ── Admin ──
  alertBroadcast:  (alertType: string)   => trackEvent('alert_broadcast',  { alert_type: alertType }),
  eventSimulated:  (simulation: string)  => trackEvent('event_simulated',  { simulation }),
} as const
