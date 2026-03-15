import { motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { slideConfigs } from '../data/slideConfig'

interface SlideNavProps {
  current: number
  total: number
  onPrev: () => void
  onNext: () => void
  onClose: () => void
}

export function SlideNav({ current, total, onPrev, onNext, onClose }: SlideNavProps) {
  const currentTitle = slideConfigs[current]?.title || ''

  return (
    <>
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-5 right-5 z-[60] p-2 text-[#7A7090] hover:text-[#2A2140] hover:bg-white/80 transition-all"
        aria-label="Fechar apresentação"
      >
        <X size={24} />
      </button>

      {/* Navigation */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3">
        <button
          onClick={onPrev}
          disabled={current === 0}
          className="p-2 text-[#7A7090] hover:text-[#2A2140] hover:bg-white/60 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          aria-label="Slide anterior"
        >
          <ChevronLeft size={20} />
        </button>

        <motion.div
          className="flex items-center gap-2.5 px-3 py-1.5"
          style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
          layout
        >
          <span className="text-xs font-bold text-[#7B5EA7] tabular-nums">
            {String(current + 1).padStart(2, '0')}
          </span>
          <span className="w-4 h-[1px] bg-[#C4BFD0]" />
          <span className="text-xs text-[#7A7090] tabular-nums">
            {String(total).padStart(2, '0')}
          </span>
          <span className="text-[10px] text-[#7A7090] hidden sm:inline ml-1 font-medium">
            {currentTitle}
          </span>
        </motion.div>

        <button
          onClick={onNext}
          disabled={current === total - 1}
          className="p-2 text-[#7A7090] hover:text-[#2A2140] hover:bg-white/60 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          aria-label="Próximo slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </>
  )
}
