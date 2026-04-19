import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline' | 'success'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const base = `
    inline-flex items-center justify-center gap-2 font-body font-semibold
    cursor-pointer select-none
    border rounded-pill disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
  `

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  }

  const variants = {
    primary: `
      bg-amber text-[#08090D] border-transparent
      hover:brightness-110 shadow-glow hover:shadow-[0_0_32px_rgba(245,158,11,0.45)]
      active:scale-[0.97]
    `,
    ghost: `
      bg-transparent border-[var(--border)]
      hover:border-amber hover:bg-[rgba(245,158,11,0.08)]
      active:scale-[0.97]
    `,
    danger: `
      bg-[rgba(255,107,107,0.12)] text-coral border-[rgba(255,107,107,0.3)]
      hover:bg-[rgba(255,107,107,0.2)] hover:shadow-[0_0_16px_rgba(255,107,107,0.2)]
      active:scale-[0.97]
    `,
    outline: `
      bg-transparent text-amber border-amber
      hover:bg-[rgba(245,158,11,0.1)] hover:shadow-glow
      active:scale-[0.97]
    `,
    success: `
      bg-[rgba(16,185,129,0.15)] text-emerald border-[rgba(16,185,129,0.35)]
      hover:bg-[rgba(16,185,129,0.25)] hover:shadow-[0_0_16px_rgba(16,185,129,0.2)]
      active:scale-[0.97]
    `,
  }

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : leftIcon}
      {children}
    </button>
  )
}
