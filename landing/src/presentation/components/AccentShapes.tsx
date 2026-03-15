import { motion } from 'framer-motion'

interface AccentShapesProps {
  variant?: 'circles' | 'lines' | 'dots'
}

// Subtle animated decorative shapes for visual interest
export function AccentShapes({ variant = 'circles' }: AccentShapesProps) {
  if (variant === 'lines') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute top-[15%] -left-20 w-[200px] h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, #7B5EA7, transparent)' }}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 0.2, x: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-[20%] -right-20 w-[180px] h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, #5BBFB8, transparent)' }}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 0.2, x: 0 }}
          transition={{ duration: 1.2, delay: 0.7 }}
        />
        <motion.div
          className="absolute top-[60%] left-[5%] w-[1px] h-[120px]"
          style={{ background: 'linear-gradient(180deg, transparent, #7B5EA7, transparent)' }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 0.15, scaleY: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        />
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[
          { top: '10%', right: '8%', size: 6, color: '#7B5EA7', delay: 0.4 },
          { top: '15%', right: '12%', size: 4, color: '#5BBFB8', delay: 0.6 },
          { bottom: '18%', left: '6%', size: 5, color: '#7B5EA7', delay: 0.8 },
          { bottom: '25%', left: '10%', size: 3, color: '#5BBFB8', delay: 1.0 },
          { top: '45%', right: '5%', size: 4, color: '#7B5EA7', delay: 0.5 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              top: dot.top,
              right: dot.right,
              bottom: dot.bottom,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              backgroundColor: dot.color,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 0.6, delay: dot.delay }}
          />
        ))}
      </div>
    )
  }

  // Default: circles
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full"
        style={{ border: '1px solid rgba(123,94,167,0.08)' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />
      <motion.div
        className="absolute -bottom-16 -left-16 w-[220px] h-[220px] rounded-full"
        style={{ border: '1px solid rgba(91,191,184,0.08)' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      <motion.div
        className="absolute top-[30%] right-[10%] w-[80px] h-[80px] rounded-full"
        style={{ backgroundColor: 'rgba(123,94,167,0.03)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
      />
    </div>
  )
}
