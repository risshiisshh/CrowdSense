/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        amber: {
          DEFAULT: '#F59E0B',
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          light: '#FDE68A',
          dark:  '#B45309',
        },
        coral:    '#FF6B6B',
        emerald:  '#10B981',
        violet:   '#8B5CF6',
        sapphire: '#3B82F6',
        // CSS-variable–backed tokens (adapt to theme)
        'bg-root':    'var(--bg-root)',
        surface:      'var(--surface)',
        'surface-2':  'var(--surface-2)',
        'surface-3':  'var(--surface-3)',
        border:       'var(--border)',
        'text-primary':   'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted':     'var(--text-muted)',
      },
      borderRadius: {
        sm:   '6px',
        md:   '10px',
        lg:   '14px',
        xl:   '18px',
        '2xl': '24px',
        pill: '9999px',
        card: '16px',
      },
      boxShadow: {
        glow:        '0 0 24px rgba(245,158,11,0.25)',
        'glow-coral': '0 0 24px rgba(255,107,107,0.25)',
        'glow-emerald': '0 0 24px rgba(16,185,129,0.25)',
        'glow-violet': '0 0 24px rgba(139,92,246,0.25)',
        card:        'var(--shadow-card)',
        modal:       'var(--shadow-modal)',
      },
      backdropBlur: {
        xs: '4px',
      },
      animation: {
        'pulse-dot':  'pulseDot 1.4s ease-in-out infinite',
        'pulse-ring': 'pulseRing 1.5s ease-out infinite',
        'slide-up':   'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.25s ease-out',
        'fade-in':    'fadeIn 0.2s ease-out',
        'scale-in':   'scaleIn 0.25s cubic-bezier(0.22,1,0.36,1)',
        'page-enter': 'pageEnter 0.35s cubic-bezier(0.22,1,0.36,1)',
        'spin-slow':  'spin 3s linear infinite',
        shimmer:      'shimmer 1.8s infinite',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
        'fill-bar':   'fillBar 0.8s ease-out',
        'count-up':   'countUp 0.5s ease-out',
        'draw-line':  'drawLine 1.2s ease-out 0.3s forwards',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)',   opacity: '1' },
          '50%':       { transform: 'scale(1.5)', opacity: '0.5' },
        },
        pulseRing: {
          '0%':   { transform: 'scale(1)',   opacity: '0.6' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to:   { transform: 'translateY(0)',     opacity: '1' },
        },
        slideDown: {
          from: { transform: 'translateY(-10px)', opacity: '0' },
          to:   { transform: 'translateY(0)',      opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        pageEnter: {
          from: { opacity: '0', transform: 'translateY(18px) scale(0.994)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(245,158,11,0.15)' },
          '50%':       { boxShadow: '0 0 28px rgba(245,158,11,0.35)' },
        },
        fillBar: {
          from: { width: '0' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        drawLine: {
          from: { strokeDashoffset: '1000' },
          to:   { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
}
