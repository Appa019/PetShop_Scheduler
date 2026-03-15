import { motion } from 'framer-motion'

// Decorative paw prints - animated with subtle float
export function FloatingPaws() {
  const paws = [
    { top: '8%', left: '5%', size: 28, rotate: -15, delay: 0 },
    { top: '72%', right: '8%', size: 24, rotate: 20, delay: 0.3 },
    { top: '25%', right: '12%', size: 20, rotate: -30, delay: 0.6 },
    { bottom: '15%', left: '10%', size: 22, rotate: 10, delay: 0.9 },
    { top: '50%', left: '3%', size: 16, rotate: -45, delay: 1.2 },
    { bottom: '35%', right: '5%', size: 18, rotate: 35, delay: 0.5 },
  ]

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {paws.map((paw, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: paw.top,
            left: paw.left,
            right: paw.right,
            bottom: paw.bottom,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.03 + (i * 0.004),
            y: [0, -6, 0],
          }}
          transition={{
            opacity: { duration: 0.8, delay: paw.delay },
            y: { duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: paw.delay },
          }}
        >
          <img
            src="/logo_pata.avif"
            alt=""
            style={{
              width: paw.size,
              height: paw.size,
              transform: `rotate(${paw.rotate}deg)`,
              filter: 'grayscale(0.5)',
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}
