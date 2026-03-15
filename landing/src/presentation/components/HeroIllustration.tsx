import { motion } from 'framer-motion'

// Stylized hero SVG illustration - pet + tech/AI elements
export function HeroIllustration({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        {/* Background circle */}
        <motion.circle
          cx="200" cy="160" r="140"
          fill="#7B5EA7" fillOpacity="0.04"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />
        <motion.circle
          cx="200" cy="160" r="110"
          fill="#7B5EA7" fillOpacity="0.04"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Stylized paw print - center */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* Main pad */}
          <ellipse cx="200" cy="190" rx="30" ry="25" fill="#7B5EA7" fillOpacity="0.15" />
          {/* Toe pads */}
          <circle cx="175" cy="155" r="12" fill="#7B5EA7" fillOpacity="0.12" />
          <circle cx="200" cy="145" r="13" fill="#7B5EA7" fillOpacity="0.14" />
          <circle cx="225" cy="155" r="12" fill="#7B5EA7" fillOpacity="0.12" />
          <circle cx="245" cy="170" r="10" fill="#7B5EA7" fillOpacity="0.10" />
        </motion.g>

        {/* AI/Tech orbital rings */}
        <motion.ellipse
          cx="200" cy="160" rx="160" ry="50"
          stroke="#5BBFB8" strokeWidth="1" strokeDasharray="8 6"
          fill="none" opacity="0.3"
          style={{ transform: 'rotate(-20deg)', transformOrigin: '200px 160px' }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.8 }}
        />
        <motion.ellipse
          cx="200" cy="160" rx="130" ry="40"
          stroke="#7B5EA7" strokeWidth="1" strokeDasharray="6 8"
          fill="none" opacity="0.2"
          style={{ transform: 'rotate(15deg)', transformOrigin: '200px 160px' }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1 }}
        />

        {/* Data nodes on orbits */}
        <motion.circle
          cx="340" cy="130" r="6" fill="#5BBFB8"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 0.4, delay: 1.2 }}
        />
        <motion.circle
          cx="60" cy="180" r="5" fill="#7B5EA7"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 0.4, delay: 1.4 }}
        />
        <motion.circle
          cx="280" cy="230" r="4" fill="#7B5EA7"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 0.4, delay: 1.6 }}
        />

        {/* Heart icon */}
        <motion.path
          d="M195 100 C195 92, 185 88, 185 96 C185 104, 195 112, 195 112 C195 112, 205 104, 205 96 C205 88, 195 92, 195 100Z"
          fill="#7B5EA7" fillOpacity="0.3"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
        />

        {/* Small + signs for tech feel */}
        <motion.g stroke="#5BBFB8" strokeWidth="1.5" opacity="0.3"
          initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 1.5 }}>
          <line x1="310" y1="80" x2="310" y2="92" />
          <line x1="304" y1="86" x2="316" y2="86" />
        </motion.g>
        <motion.g stroke="#7B5EA7" strokeWidth="1.5" opacity="0.25"
          initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} transition={{ delay: 1.7 }}>
          <line x1="90" y1="100" x2="90" y2="110" />
          <line x1="85" y1="105" x2="95" y2="105" />
        </motion.g>
      </svg>
    </motion.div>
  )
}
