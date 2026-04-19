// ─── Logger Tests ─────────────────────────────────────────────────────────────
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logger, isDev } from '../../lib/logger'

describe('logger module', () => {
  beforeEach(() => {
    vi.spyOn(console, 'debug').mockImplementation(() => {})
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exports a logger object', () => {
    expect(logger).toBeDefined()
    expect(typeof logger.debug).toBe('function')
    expect(typeof logger.info).toBe('function')
    expect(typeof logger.warn).toBe('function')
    expect(typeof logger.error).toBe('function')
  })

  it('logger.warn calls console.warn', () => {
    logger.warn('test warning')
    expect(console.warn).toHaveBeenCalled()
  })

  it('logger.error calls console.error', () => {
    logger.error('test error')
    expect(console.error).toHaveBeenCalled()
  })

  it('logger.warn passes additional data arguments', () => {
    const err = new Error('oops')
    logger.warn('something failed', err)
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('something failed'),
      err,
    )
  })

  it('logger.error passes additional data arguments', () => {
    logger.error('fatal error', { code: 500 })
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('fatal error'),
      { code: 500 },
    )
  })

  it('isDev is a boolean', () => {
    expect(typeof isDev).toBe('boolean')
  })

  it('logger output includes the message text', () => {
    logger.warn('unique-warn-message-xyz')
    const calls = (console.warn as ReturnType<typeof vi.fn>).mock.calls
    const found = calls.some((args: unknown[]) =>
      String(args[0]).includes('unique-warn-message-xyz'),
    )
    expect(found).toBe(true)
  })

  it('logger.warn includes CrowdSense prefix', () => {
    logger.warn('prefix check')
    const firstArg = (console.warn as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(firstArg).toContain('CrowdSense')
  })
})
