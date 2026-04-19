import React from 'react'

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
  noBottomPad?: boolean
  /** Use fullBleed to remove horizontal padding (for pages with custom layouts) */
  fullBleed?: boolean
}

export default function PageWrapper({ children, className = '', noBottomPad = false, fullBleed = false }: PageWrapperProps) {
  return (
    <div
      className={`w-full max-w-7xl mx-auto ${fullBleed ? '' : 'px-4 md:px-6 lg:px-8'} ${noBottomPad ? '' : 'pb-8'} ${className}`}
    >
      {children}
    </div>
  )
}
