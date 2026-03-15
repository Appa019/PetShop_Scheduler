import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = ((current + 1) / total) * 100

  return (
    <div className="fixed bottom-0 left-0 right-0 h-1 z-[60]" style={{ backgroundColor: 'rgba(123,94,167,0.1)' }}>
      <motion.div
        className="h-full"
        style={{ backgroundColor: '#7B5EA7' }}
        initial={false}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  )
}
