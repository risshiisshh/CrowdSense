// ─── Remote Config Tests ──────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest'
import { getConfigValue, initRemoteConfig } from '../../lib/remoteConfig'

describe('remoteConfig module', () => {
  it('getConfigValue is a function', () => {
    expect(typeof getConfigValue).toBe('function')
  })

  it('initRemoteConfig is a function', () => {
    expect(typeof initRemoteConfig).toBe('function')
  })

  it('initRemoteConfig resolves without throwing in demo mode', async () => {
    await expect(initRemoteConfig()).resolves.not.toThrow()
  })

  it('returns correct default for enable_ai_chat', () => {
    const val = getConfigValue('enable_ai_chat')
    expect(typeof val).toBe('boolean')
    expect(val).toBe(true)
  })

  it('returns correct default for max_cart_items', () => {
    const val = getConfigValue('max_cart_items')
    expect(typeof val).toBe('number')
    expect(val).toBe(10)
  })

  it('returns correct default for crowd_refresh_interval_ms', () => {
    const val = getConfigValue('crowd_refresh_interval_ms')
    expect(typeof val).toBe('number')
    expect(val).toBe(30_000)
  })

  it('returns correct default for enable_ar_features', () => {
    const val = getConfigValue('enable_ar_features')
    expect(typeof val).toBe('boolean')
    expect(val).toBe(true)
  })

  it('returns correct default for home_promo_banner', () => {
    const val = getConfigValue('home_promo_banner')
    expect(typeof val).toBe('string')
    expect(val).toBe('')
  })

  it('returns correct default for min_app_version', () => {
    const val = getConfigValue('min_app_version')
    expect(typeof val).toBe('string')
    expect(val).toBe('0.1.0')
  })
})
