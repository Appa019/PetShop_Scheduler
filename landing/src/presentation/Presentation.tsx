import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { slideConfigs } from './data/slideConfig'
import { SlideTransition } from './components/SlideTransition'
import { ProgressBar } from './components/ProgressBar'
import { SlideNav } from './components/SlideNav'
import {
  TitleSlide,
  AgendaSlide,
  ContextSlide,
  ProblemSlide,
  CompanySlide,
  SolutionSlide,
  ValuePropSlide,
  MVPSlide,
  LeanCanvasSlide,
  BusinessModelSlide,
  SegmentSlide,
  MetricsSlide,
  ResultsSlide,
  ImpactSlide,
  ValidationSlide,
  DesignThinkingSlide,
  AIUsageSlide,
  ReferencesSlide,
} from './slides'

const slideComponents = [
  TitleSlide,
  AgendaSlide,
  ContextSlide,
  ProblemSlide,
  CompanySlide,
  SolutionSlide,
  ValuePropSlide,
  MVPSlide,
  LeanCanvasSlide,
  BusinessModelSlide,
  SegmentSlide,
  MetricsSlide,
  ResultsSlide,
  ImpactSlide,
  ValidationSlide,
  DesignThinkingSlide,
  AIUsageSlide,
  ReferencesSlide,
]

interface PresentationProps {
  onClose: () => void
}

export function Presentation({ onClose }: PresentationProps) {
  const [current, setCurrent] = useState(0)
  const total = slideConfigs.length

  const goNext = useCallback(() => {
    setCurrent(prev => Math.min(prev + 1, total - 1))
  }, [total])

  const goPrev = useCallback(() => {
    setCurrent(prev => Math.max(prev - 1, 0))
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev, onClose])

  // Lock scroll
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  const SlideComponent = slideComponents[current]
  const config = slideConfigs[current]

  return createPortal(
    <div
      className="fixed inset-0 z-[100]"
      style={{ backgroundColor: '#FAF8F5' }}
      role="dialog"
      aria-modal="true"
      aria-label="Apresentação 8Patas"
    >
      <SlideTransition slideKey={current} transition={config.transition}>
        <SlideComponent />
      </SlideTransition>

      <SlideNav
        current={current}
        total={total}
        onPrev={goPrev}
        onNext={goNext}
        onClose={onClose}
      />

      <ProgressBar current={current} total={total} />
    </div>,
    document.body
  )
}
