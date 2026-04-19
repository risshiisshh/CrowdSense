// ─── CrowdSense — Firebase Remote Config ─────────────────────────────────────
// Provides feature flags and dynamic configuration without an app release.
// Falls back to DEFAULT_CONFIG values when Firebase is disabled (demo mode).
// ─────────────────────────────────────────────────────────────────────────────
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
  type RemoteConfig,
} from 'firebase/remote-config'
import { firebaseApp, isFirebaseEnabled } from './firebase'
import { logger } from './logger'

// ─── Typed defaults for all Remote Config keys ───────────────────────────────
export interface AppRemoteConfig {
  /** Enable the AI-powered chatbot */
  enable_ai_chat: boolean
  /** Maximum items allowed in cart at once */
  max_cart_items: number
  /** Crowd zone data refresh interval in milliseconds */
  crowd_refresh_interval_ms: number
  /** Enable the AR camera overlay feature */
  enable_ar_features: boolean
  /** Promotional banner text shown on the home screen (empty = hidden) */
  home_promo_banner: string
  /** Minimum supported app version (for update prompts) */
  min_app_version: string
}

const DEFAULT_CONFIG: AppRemoteConfig = {
  enable_ai_chat:             true,
  max_cart_items:             10,
  crowd_refresh_interval_ms:  30_000,
  enable_ar_features:         true,
  home_promo_banner:          '',
  min_app_version:            '0.1.0',
}

let remoteConfig: RemoteConfig | null = null

/** Initializes and fetches Remote Config. Safe to call multiple times. */
export async function initRemoteConfig(): Promise<void> {
  if (!isFirebaseEnabled || !firebaseApp) {
    logger.info('Remote Config: running with defaults (demo mode)')
    return
  }

  try {
    remoteConfig = getRemoteConfig(firebaseApp)

    // Cache duration: 1 hour in production, 0 in development
    remoteConfig.settings = {
      minimumFetchIntervalMillis: import.meta.env.DEV ? 0 : 3_600_000,
      fetchTimeoutMillis: 10_000,
    }

    // Set defaults so they are available immediately before fetch completes
    remoteConfig.defaultConfig = DEFAULT_CONFIG as unknown as Record<string, string | number | boolean>

    await fetchAndActivate(remoteConfig)
    logger.info('✅ Firebase Remote Config activated')
  } catch (err) {
    logger.warn('Remote Config fetch failed — using defaults', err)
  }
}

/**
 * Reads a typed Remote Config value.
 * Returns the DEFAULT_CONFIG value when Remote Config is unavailable.
 *
 * @param key - The Remote Config parameter key
 */
export function getConfigValue<K extends keyof AppRemoteConfig>(key: K): AppRemoteConfig[K] {
  if (!remoteConfig) return DEFAULT_CONFIG[key]

  const raw = getValue(remoteConfig, key as string)
  const defaultVal = DEFAULT_CONFIG[key]

  if (typeof defaultVal === 'boolean') {
    return raw.asBoolean() as AppRemoteConfig[K]
  }
  if (typeof defaultVal === 'number') {
    return raw.asNumber() as AppRemoteConfig[K]
  }
  return raw.asString() as AppRemoteConfig[K]
}
