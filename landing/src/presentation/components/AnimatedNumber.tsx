import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface AnimatedNumberProps {
  value: string
  className?: string
  duration?: number
  style?: React.CSSProperties
}

// Extract numeric part and prefix/suffix for counting animation
function parseValue(value: string): { prefix: string; number: number; suffix: string; decimals: number } {
  const match = value.match(/^([^\d]*?)([\d.,]+)(.*)$/)
  if (!match) return { prefix: '', number: 0, suffix: value, decimals: 0 }

  const prefix = match[1]
  const numStr = match[2].replace(/\./g, '').replace(',', '.')
  const number = parseFloat(numStr)
  const decimals = match[2].includes(',') ? match[2].split(',')[1]?.length || 0 : 0
  const suffix = match[3]

  return { prefix, number, suffix, decimals }
}

function formatNumber(n: number, decimals: number, originalValue: string): string {
  if (originalValue.includes('.') && !originalValue.includes(',')) {
    // Brazilian thousands separator format (e.g., "2.000")
    return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
  if (decimals > 0) {
    return n.toFixed(decimals).replace('.', ',')
  }
  return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function AnimatedNumber({ value, className = '', duration = 1.5, style }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [display, setDisplay] = useState('0')
  const { prefix, number, suffix, decimals } = parseValue(value)

  useEffect(() => {
    if (!isInView) return
    const start = performance.now()
    const durationMs = duration * 1000

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / durationMs, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * number
      setDisplay(formatNumber(current, decimals, value))

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [isInView, number, decimals, duration, value])

  return (
    <motion.span
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
    >
      {prefix}{display}{suffix}
    </motion.span>
  )
}
