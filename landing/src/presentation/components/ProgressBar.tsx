import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = ((current + 1) / total) * 100

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[3px] z-[60]" style={{ backgroundColor: 'rgba(123,94,167,0.06)' }}>
      <motion.div
        className="h-full relative"
        style={{
          background: 'linear-gradient(90deg, #7B5EA7, #5BBFB8)',
        }}
        initial={false}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Glow effect at the tip */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
          style={{
            background: '#5BBFB8',
            boxShadow: '0 0 8px rgba(91,191,184,0.5)',
            opacity: 0.6,
          }}
        />
      </motion.div>
    </div>
  )
}
