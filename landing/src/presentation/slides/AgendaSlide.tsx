import { motion } from 'framer-motion'
import {
  Building2, Lightbulb, Cpu, Target, BarChart3, TrendingUp,
  CheckCircle, BookOpen, Users, LayoutGrid, PawPrint, Sparkles,
} from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const sections = [
  { icon: BarChart3, label: 'Contexto', num: '01' },
  { icon: Target, label: 'Problema', num: '02' },
  { icon: Building2, label: 'Empresa', num: '03' },
  { icon: Lightbulb, label: 'Solução', num: '04' },
  { icon: Sparkles, label: 'Proposta', num: '05' },
  { icon: PawPrint, label: 'MVP', num: '06' },
  { icon: LayoutGrid, label: 'Canvas & Modelo', num: '07' },
  { icon: Users, label: 'Segmento & KPIs', num: '08' },
  { icon: TrendingUp, label: 'Resultados', num: '09' },
  { icon: CheckCircle, label: 'Validação', num: '10' },
  { icon: Cpu, label: 'Design & IA', num: '11' },
  { icon: BookOpen, label: 'Referências', num: '12' },
]

export function AgendaSlide() {
  return (
    <SlideWrapper maxWidth="full" padding="compact">
      <div className="flex flex-col items-center gap-6 w-full">
        <motion.h2
          className="font-display font-bold text-[#2A2140] text-center"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          O que vamos <span className="accent-underline text-[#7B5EA7]">apresentar</span>
        </motion.h2>

        {/* Grid layout - 6 columns x 2 rows */}
        <div className="grid grid-cols-6 gap-x-4 gap-y-8 w-full max-w-5xl">
          {sections.map((section, i) => (
            <motion.div
              key={section.label}
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.04 }}
            >
              {/* Number + icon circle */}
              <div className="relative">
                <div
                  className="w-14 h-14 flex items-center justify-center"
                  style={{
                    backgroundColor: i % 2 === 0 ? 'rgba(123,94,167,0.10)' : 'rgba(91,191,184,0.10)',
                  }}
                >
                  <section.icon
                    size={22}
                    style={{ color: i % 2 === 0 ? '#7B5EA7' : '#5BBFB8' }}
                  />
                </div>
                <span
                  className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ backgroundColor: i % 2 === 0 ? '#7B5EA7' : '#5BBFB8' }}
                >
                  {section.num}
                </span>
              </div>

              <span className="text-xs font-medium text-[#2A2140] text-center leading-tight">
                {section.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  )
}
