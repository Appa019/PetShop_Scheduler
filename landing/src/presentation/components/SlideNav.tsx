import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface SlideNavProps {
  current: number
  total: number
  onPrev: () => void
  onNext: () => void
  onClose: () => void
}

export function SlideNav({ current, total, onPrev, onNext, onClose }: SlideNavProps) {
  return (
    <>
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-5 right-5 z-[60] p-2  text-[#7A7090] hover:text-[#2A2140] hover:bg-white/80 transition-all"
        aria-label="Fechar apresentação"
      >
        <X size={24} />
      </button>

      {/* Navigation arrows */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-4">
        <button
          onClick={onPrev}
          disabled={current === 0}
          className="p-2  text-[#7A7090] hover:text-[#2A2140] hover:bg-white/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Slide anterior"
        >
          <ChevronLeft size={20} />
        </button>

        <span className="text-sm font-medium text-[#7A7090] tabular-nums select-none min-w-[4rem] text-center">
          {current + 1} / {total}
        </span>

        <button
          onClick={onNext}
          disabled={current === total - 1}
          className="p-2  text-[#7A7090] hover:text-[#2A2140] hover:bg-white/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Próximo slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </>
  )
}
