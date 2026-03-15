import { type ReactNode, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface PerspectiveCardProps {
  children: ReactNode
  className?: string
  delay?: number
}

// Card with CSS 3D tilt on hover + dynamic shadow
export function PerspectiveCard({ children, className = '', delay = 0 }: PerspectiveCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('perspective(1200px) rotateX(0deg) rotateY(0deg)')
  const [shadow, setShadow] = useState('0 4px 24px rgba(42,33,64,0.07)')

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -5
    const rotateY = ((x - centerX) / centerX) * 5

    // Dynamic shadow follows light position (opposite of tilt)
    const shadowX = -rotateY * 2
    const shadowY = rotateX * 2

    setTransform(`perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`)
    setShadow(`${shadowX}px ${shadowY}px 32px rgba(42,33,64,0.12), 0 2px 8px rgba(42,33,64,0.06)`)
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1200px) rotateX(0deg) rotateY(0deg)')
    setShadow('0 4px 24px rgba(42,33,64,0.07)')
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`perspective-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="tilt-card glass-card"
        style={{ transform, boxShadow: shadow }}
      >
        {children}
      </div>
    </motion.div>
  )
}
