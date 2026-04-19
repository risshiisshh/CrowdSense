// ─── CrowdSense — Error Boundary ──────────────────────────────────────────────
// Catches unhandled React render errors, reports them to analytics, and shows
// a styled fallback UI consistent with the Kinetic HUD design system.
// ─────────────────────────────────────────────────────────────────────────────
import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { trackEvent } from '../../lib/analytics'
import { logger } from '../../lib/logger'

interface Props {
  children: ReactNode
  /** Optional custom fallback UI. Receives error and a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * React Error Boundary — catches render-phase errors in its subtree.
 * Reports errors to Google Analytics and renders a styled fallback UI.
 *
 * @example
 * <ErrorBoundary>
 *   <MyPage />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    logger.error('Unhandled render error caught by ErrorBoundary', error, info.componentStack)
    trackEvent('app_error', {
      error_message: error.message.slice(0, 100),
      component_stack: info.componentStack?.slice(0, 200) ?? '',
    })
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  override render(): ReactNode {
    if (!this.state.hasError || !this.state.error) {
      return this.props.children
    }

    // Custom fallback
    if (this.props.fallback) {
      return this.props.fallback(this.state.error, this.handleReset)
    }

    // Default fallback — Kinetic HUD styled
    return (
      <div
        className="min-h-dvh flex flex-col items-center justify-center p-6"
        style={{ background: 'var(--bg-root)' }}
        role="alert"
        aria-live="assertive"
      >
        <div
          className="w-full max-w-sm surface-card rounded-2xl p-8 flex flex-col items-center gap-5 text-center"
          style={{ border: '1px solid rgba(255,107,107,0.25)' }}
        >
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.3)' }}
          >
            <AlertTriangle size={28} style={{ color: '#FF6B6B' }} aria-hidden="true" />
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h2 className="font-display text-xl tracking-wide" style={{ color: 'var(--text-primary)' }}>
              Something went wrong
            </h2>
            <p className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
              An unexpected error occurred. Our team has been notified.
            </p>
            {import.meta.env.DEV && (
              <p
                className="font-body text-xs mt-3 p-3 rounded-xl text-left break-all"
                style={{ background: 'rgba(255,107,107,0.08)', color: '#FF6B6B' }}
              >
                {this.state.error.message}
              </p>
            )}
          </div>

          {/* Retry */}
          <button
            id="error-boundary-retry-btn"
            onClick={this.handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-body font-semibold text-sm transition-all active:scale-95"
            style={{ background: '#F59E0B', color: '#08090D' }}
          >
            <RefreshCw size={15} aria-hidden="true" />
            Try again
          </button>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
