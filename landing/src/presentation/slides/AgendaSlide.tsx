import { motion } from 'framer-motion'
import {
  Building2, Lightbulb, Cpu, Target, BarChart3, TrendingUp,
  CheckCircle, BookOpen, Users, LayoutGrid, PawPrint, Sparkles,
} from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const sections = [
  { icon: BarChart3, label: 'Contexto de Mercado' },
  { icon: Target, label: 'Problema' },
  { icon: Building2, label: 'A Empresa' },
  { icon: Lightbulb, label: 'Solução' },
  { icon: Sparkles, label: 'Proposta de Valor' },
  { icon: PawPrint, label: 'MVP' },
  { icon: LayoutGrid, label: 'Lean Canvas & Modelo' },
  { icon: Users, label: 'Segmento & Métricas' },
  { icon: TrendingUp, label: 'Resultados & Impacto' },
  { icon: CheckCircle, label: 'Validação' },
  { icon: Cpu, label: 'Design Thinking & IA' },
  { icon: BookOpen, label: 'Referências' },
]

export function AgendaSlide() {
  return (
    <SlideWrapper>
      <div className="flex flex-col items-center gap-8 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Agenda
        </motion.span>

        <motion.h2
          className="font-display font-bold text-3xl md:text-4xl text-[#2A2140] text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          O que vamos <span className="text-[#7B5EA7]">apresentar</span>
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-3xl">
          {sections.map((section, i) => (
            <motion.div
              key={section.label}
              className="glass-card p-4 flex flex-col items-center gap-2 text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <div
                className="w-9 h-9 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(123,94,167,0.10)' }}
              >
                <section.icon size={16} className="text-[#7B5EA7]" />
              </div>
              <span className="text-xs font-medium text-[#2A2140] leading-tight">{section.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  )
}
