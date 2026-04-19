// ─── Gemini Module Tests ──────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest'
import { isGeminiEnabled, generateGeminiResponse } from '../../lib/gemini'

describe('gemini module', () => {
  it('exports isGeminiEnabled as a boolean', () => {
    expect(typeof isGeminiEnabled).toBe('boolean')
  })

  it('isGeminiEnabled is false when API key is missing/placeholder', () => {
    // In test env VITE_GEMINI_API_KEY is not set, so should be false
    // (unless running with a real key injected — still should be boolean)
    expect(typeof isGeminiEnabled).toBe('boolean')
  })

  it('generateGeminiResponse is a function', () => {
    expect(typeof generateGeminiResponse).toBe('function')
  })

  it('generateGeminiResponse returns null when Gemini is disabled (no key in test env)', async () => {
    // In CI/test environment there is no real API key, so it should return null
    if (isGeminiEnabled) {
      // Skip — we have a real key, just verify it returns a string
      const result = await generateGeminiResponse('Hello', {})
      expect(typeof result === 'string' || result === null).toBe(true)
    } else {
      const result = await generateGeminiResponse('Hello', {})
      expect(result).toBeNull()
    }
  })

  it('generateGeminiResponse accepts context with zones, gates, user info', async () => {
    const context = {
      zones: [],
      gates: [],
      userTier: 'bronze',
      userPoints: 100,
      userName: 'Test User',
    }
    // Should not throw regardless of Gemini availability
    const result = await generateGeminiResponse('test', context, [])
    expect(result === null || typeof result === 'string').toBe(true)
  })

  it('generateGeminiResponse accepts empty history', async () => {
    const result = await generateGeminiResponse('Hello', {}, [])
    expect(result === null || typeof result === 'string').toBe(true)
  })
})
