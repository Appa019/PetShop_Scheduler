import { motion } from 'framer-motion'

interface PhoneMockupProps {
  children: React.ReactNode
  className?: string
}

// Stylized phone frame for MVP demonstration
export function PhoneMockup({ children, className = '' }: PhoneMockupProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
    >
      {/* Phone frame */}
      <div
        className="relative w-[260px] mx-auto"
        style={{
          background: '#1a1a2e',
          borderRadius: '32px',
          padding: '12px',
          boxShadow: '0 20px 60px rgba(42, 33, 64, 0.15), 0 8px 24px rgba(42, 33, 64, 0.08)',
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[26px] rounded-b-2xl z-10"
          style={{ background: '#1a1a2e' }}
        />

        {/* Screen */}
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: '22px',
            background: '#FAF8F5',
            minHeight: '460px',
          }}
        >
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-1">
            <span className="text-[10px] font-semibold text-[#2A2140]">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-2 rounded-sm border border-[#2A2140]" style={{ borderWidth: '1px' }}>
                <div className="w-[70%] h-full bg-[#2A2140] rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* App content */}
          <div className="px-3 pb-3">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
