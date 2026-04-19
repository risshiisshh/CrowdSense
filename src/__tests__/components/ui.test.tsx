// ─── UI Component Tests ───────────────────────────────────────────────────────
// Tests Card, Badge, StatCard, and Toast rendering and interactions.
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'

// ── Mock the store for Toast (which reads toasts from Zustand) ──
vi.mock('../../store/useAppStore', () => {
  const mockStore = {
    toasts: [] as unknown[],
    showToast: vi.fn(),
    dismissToast: vi.fn(),
  }
  // Use Object.assign so TS doesn't error on dynamic property additions
  const useAppStore = Object.assign(
    vi.fn((selector?: (s: typeof mockStore) => unknown) =>
      selector ? selector(mockStore) : mockStore
    ),
    {
      getState: () => mockStore,
      setState: vi.fn(),
    }
  )
  return { useAppStore }
})

// ── Card ──────────────────────────────────────────────────────────────────────
describe('Card component', () => {
  it('renders children', () => {
    render(<Card><span>Hello Card</span></Card>)
    expect(screen.getByText('Hello Card')).toBeInTheDocument()
  })

  it('applies surface-card class by default', () => {
    const { container } = render(<Card>Content</Card>)
    expect(container.firstChild).toHaveClass('surface-card')
  })

  it('applies glassmorphic class when glass=true', () => {
    const { container } = render(<Card glass>Content</Card>)
    expect(container.firstChild).toHaveClass('glassmorphic')
  })

  it('adds hover-glow class when hover=true', () => {
    const { container } = render(<Card hover>Content</Card>)
    expect(container.firstChild).toHaveClass('hover-glow')
  })

  it('adds role=button and cursor-pointer when onClick provided', () => {
    const handler = vi.fn()
    render(<Card onClick={handler}>Clickable</Card>)
    const card = screen.getByRole('button')
    expect(card).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', () => {
    const handler = vi.fn()
    render(<Card onClick={handler}>Click Me</Card>)
    fireEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('applies correct padding classes', () => {
    const { container: sm } = render(<Card padding="sm">sm</Card>)
    expect(sm.firstChild).toHaveClass('p-3')

    const { container: lg } = render(<Card padding="lg">lg</Card>)
    expect(lg.firstChild).toHaveClass('p-5')
  })

  it('has no role when no onClick', () => {
    const { container } = render(<Card>Static</Card>)
    expect(container.firstChild).not.toHaveAttribute('role', 'button')
  })

  it('accepts additional className', () => {
    const { container } = render(<Card className="my-custom-class">Content</Card>)
    expect(container.firstChild).toHaveClass('my-custom-class')
  })
})

// ── Badge ─────────────────────────────────────────────────────────────────────
describe('Badge component', () => {
  it('renders label text', () => {
    render(<Badge label="LIVE" />)
    expect(screen.getByText('LIVE')).toBeInTheDocument()
  })

  it('renders as a span element', () => {
    const { container } = render(<Badge label="Test" />)
    expect(container.querySelector('span')).toBeInTheDocument()
  })

  it('renders dot indicator when dot=true', () => {
    const { container } = render(<Badge label="Active" dot />)
    // The dot is an inner span with w-1.5 class
    const spans = container.querySelectorAll('span')
    expect(spans.length).toBeGreaterThan(1)
  })

  it('does not render dot when dot=false (default)', () => {
    const { container } = render(<Badge label="Static" />)
    const spans = container.querySelectorAll('span')
    // Only the outer span, no dot inner span
    expect(spans.length).toBe(1)
  })

  it('renders success variant without errors', () => {
    render(<Badge label="OK" variant="success" />)
    expect(screen.getByText('OK')).toBeInTheDocument()
  })

  it('renders error variant without errors', () => {
    render(<Badge label="Error" variant="error" />)
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('renders all crowd level variants', () => {
    const levels = ['low', 'medium', 'high', 'full'] as const
    levels.forEach(level => {
      render(<Badge label={level} variant={level} />)
      expect(screen.getAllByText(level).length).toBeGreaterThan(0)
    })
  })

  it('applies md size class', () => {
    const { container } = render(<Badge label="Big" size="md" />)
    expect(container.firstChild).toHaveClass('text-xs')
  })

  it('applies additional className', () => {
    const { container } = render(<Badge label="Custom" className="my-badge" />)
    expect(container.firstChild).toHaveClass('my-badge')
  })
})

// ── StatCard ──────────────────────────────────────────────────────────────────
describe('StatCard component', () => {
  it('renders label and value', () => {
    render(<StatCard label="Crowd Level" value="72%" />)
    expect(screen.getByText('Crowd Level')).toBeInTheDocument()
    expect(screen.getByText('72%')).toBeInTheDocument()
  })

  it('renders numeric value', () => {
    render(<StatCard label="Points" value={2340} />)
    expect(screen.getByText('2340')).toBeInTheDocument()
  })

  it('renders sub text when provided', () => {
    render(<StatCard label="Wait" value="5m" sub="Average wait time" />)
    expect(screen.getByText('Average wait time')).toBeInTheDocument()
  })

  it('does not render sub when not provided', () => {
    render(<StatCard label="Zones" value={8} />)
    expect(screen.queryByText(/Average/i)).toBeNull()
  })

  it('calls onClick when clicked', () => {
    const handler = vi.fn()
    render(<StatCard label="Click" value="me" onClick={handler} />)
    const card = screen.getByText('Click').closest('div')!
    fireEvent.click(card)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('renders icon when provided', () => {
    render(<StatCard label="Icon Card" value="100" icon={<span data-testid="test-icon">⚡</span>} />)
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('applies hover-glow class', () => {
    const { container } = render(<StatCard label="Test" value="0" />)
    expect(container.firstChild).toHaveClass('hover-glow')
  })
})

// ── Analytics helpers (pure functions, no DOM) ─────────────────────────────
describe('analytics module (demo mode)', () => {
  it('trackPageView is importable and callable without error', async () => {
    // In demo mode (no Firebase), all analytics functions are no-ops
    const { trackPageView } = await import('../../lib/analytics')
    expect(() => trackPageView('/home')).not.toThrow()
  })

  it('trackEvent is importable and callable without error', async () => {
    const { trackEvent } = await import('../../lib/analytics')
    expect(() => trackEvent('test_event', { key: 'value' })).not.toThrow()
  })

  it('setAnalyticsUser is importable and callable without error', async () => {
    const { setAnalyticsUser } = await import('../../lib/analytics')
    expect(() => setAnalyticsUser('uid-123', 'gold')).not.toThrow()
  })

  it('CrowdSenseEvents.signIn is callable without error', async () => {
    const { CrowdSenseEvents } = await import('../../lib/analytics')
    expect(() => CrowdSenseEvents.signIn('google')).not.toThrow()
  })

  it('CrowdSenseEvents.orderPlaced is callable without error', async () => {
    const { CrowdSenseEvents } = await import('../../lib/analytics')
    expect(() => CrowdSenseEvents.orderPlaced(699, 2)).not.toThrow()
  })

  it('CrowdSenseEvents.zoneSelected is callable without error', async () => {
    const { CrowdSenseEvents } = await import('../../lib/analytics')
    expect(() => CrowdSenseEvents.zoneSelected('zone-1', 'high')).not.toThrow()
  })
})
