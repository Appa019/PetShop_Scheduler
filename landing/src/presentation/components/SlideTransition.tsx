import { type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TransitionType } from '../data/slideConfig'

const springConfig = { type: 'spring' as const, stiffness: 120, damping: 25 }

const variants: Record<TransitionType, {
  initial: Record<string, number | string>
  animate: Record<string, number | string>
  exit: Record<string, number | string>
}> = {
  'fade-up': {
    initial: { opacity: 0, y: 60, clipPath: 'inset(100% 0 0 0)' },
    animate: { opacity: 1, y: 0, clipPath: 'inset(0)' },
    exit: { opacity: 0, y: -60, clipPath: 'inset(0 0 100% 0)' },
  },
  'slide-left': {
    initial: { opacity: 0, clipPath: 'inset(0 100% 0 0)', scale: 0.97 },
    animate: { opacity: 1, clipPath: 'inset(0)', scale: 1 },
    exit: { opacity: 0, clipPath: 'inset(0 0 0 100%)', scale: 0.97 },
  },
  'slide-right': {
    initial: { opacity: 0, clipPath: 'inset(0 0 0 100%)', scale: 0.97 },
    animate: { opacity: 1, clipPath: 'inset(0)', scale: 1 },
    exit: { opacity: 0, clipPath: 'inset(0 100% 0 0)', scale: 0.97 },
  },
  'scale-in': {
    initial: { opacity: 0, scale: 0.85, clipPath: 'circle(0% at 50% 50%)' },
    animate: { opacity: 1, scale: 1, clipPath: 'circle(75% at 50% 50%)' },
    exit: { opacity: 0, scale: 1.05, clipPath: 'circle(0% at 50% 50%)' },
  },
  'zoom-fade': {
    initial: { opacity: 0, clipPath: 'inset(0 50% 0 50%)' },
    animate: { opacity: 1, clipPath: 'inset(0 0 0 0)' },
    exit: { opacity: 0, clipPath: 'inset(50% 0 50% 0)' },
  },
}

interface SlideTransitionProps {
  children: ReactNode
  slideKey: number
  transition: TransitionType
}

export function SlideTransition({ children, slideKey, transition }: SlideTransitionProps) {
  const v = variants[transition]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slideKey}
        initial={v.initial}
        animate={v.animate}
        exit={v.exit}
        transition={springConfig}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
