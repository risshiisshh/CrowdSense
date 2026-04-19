// ─── CrowdSense — Centralized Logger ─────────────────────────────────────────
// Single source for all logging. In production only warn/error are emitted.
// In development, all levels are printed with timestamps and caller context.
// Usage:  logger.info('Firebase initialized')
//         logger.warn('Firestore read failed', err)
//         logger.error('Order placement error', err, { orderId })
// ─────────────────────────────────────────────────────────────────────────────

const IS_DEV = import.meta.env.DEV

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  data?: unknown[]
  timestamp: string
}

function formatEntry(level: LogLevel, message: string): string {
  const ts = new Date().toISOString().slice(11, 23) // HH:mm:ss.mmm
  const prefix: Record<LogLevel, string> = {
    debug: '🔍 [DEBUG]',
    info:  'ℹ️  [INFO ]',
    warn:  '⚠️  [WARN ]',
    error: '🔴 [ERROR]',
  }
  return `${prefix[level]} ${ts} CrowdSense — ${message}`
}

function log(level: LogLevel, message: string, ...data: unknown[]): void {
  // In production, only emit warn and error
  if (!IS_DEV && (level === 'debug' || level === 'info')) return

  const formatted = formatEntry(level, message)

  switch (level) {
    case 'debug': console.debug(formatted, ...data); break
    case 'info':  console.info(formatted, ...data);  break
    case 'warn':  console.warn(formatted, ...data);  break
    case 'error': console.error(formatted, ...data); break
  }
}

/** Structured application logger. Debug and info are suppressed in production. */
export const logger = {
  /** Fine-grained debug output — development only */
  debug: (message: string, ...data: unknown[]) => log('debug', message, ...data),
  /** General informational messages — development only */
  info:  (message: string, ...data: unknown[]) => log('info', message, ...data),
  /** Recoverable issues that deserve attention (emitted in production) */
  warn:  (message: string, ...data: unknown[]) => log('warn', message, ...data),
  /** Unrecoverable errors that need immediate attention (emitted in production) */
  error: (message: string, ...data: unknown[]) => log('error', message, ...data),
} as const

/** Lightweight dev guard — returns true only in development builds */
export const isDev = IS_DEV

/** Helper type for structured log entries (useful for tests) */
export type { LogEntry }
