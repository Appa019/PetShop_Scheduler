import type { ReactNode } from 'react'
import { bgColors } from '../data/slideConfig'
import type { SlideBg } from '../data/slideConfig'
import { FloatingPaws } from './FloatingPaws'

interface SlideWrapperProps {
  children: ReactNode
  bg?: SlideBg
}

// Layout base for each slide - logo, centered content, background
export function SlideWrapper({ children, bg = 'creme' }: SlideWrapperProps) {
  const bgColor = bgColors[bg]

  return (
    <div
      className="slide-container"
      style={{ backgroundColor: bgColor }}
    >
      {/* Dot pattern background */}
      {bg === 'creme' && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(123,94,167,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      )}

      <FloatingPaws />

      {/* Logo top-left */}
      <div className="absolute top-6 left-8 z-10">
        <img src="/logo.png" alt="8Patas" className="h-10 w-auto" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-8 w-full flex flex-col items-center justify-center min-h-screen py-20">
        {children}
      </div>
    </div>
  )
}
