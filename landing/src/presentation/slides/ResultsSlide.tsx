import { motion } from 'framer-motion'
import { TrendingUp, Building2, Heart, DollarSign, Users, Clock } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { AccentShapes } from '../components/AccentShapes'

const roiMetrics = [
  { icon: DollarSign, value: '35%', label: 'Redução de no-shows', desc: 'Lembretes automáticos por email', color: '#7B5EA7' },
  { icon: Users, value: '2x', label: 'Retenção de clientes', desc: 'Engajamento contínuo via plataforma', color: '#5BBFB8' },
  { icon: Clock, value: '60%', label: 'Menos tempo admin', desc: 'Agendamento automatizado', color: '#7B5EA7' },
]

const benefits = {
  empresa: [
    'Receita recorrente via assinaturas digitais',
    'Base de dados para decisões estratégicas',
    'Diferenciação competitiva com IA',
    'Operação escalável',
  ],
  sociedade: [
    'Saúde preventiva acessível para pets',
    'Redução de abandono por custos inesperados',
    'Educação dos tutores',
    'Modelo replicável para outras clínicas',
  ],
}

export function ResultsSlide() {
  return (
    <SlideWrapper bg="lavanda" maxWidth="wide" padding="compact">
      <AccentShapes variant="dots" />

      <div className="flex flex-col items-center gap-6 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TrendingUp size={12} />
          Resultados Esperados
        </motion.span>

        <motion.h2
          className="font-display font-bold text-[#2A2140] text-center"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Impacto <span className="accent-underline text-[#7B5EA7]">projetado</span>
        </motion.h2>

        {/* Big ROI numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {roiMetrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              className="relative p-6 bg-white border border-[#EDE8F5] text-center overflow-hidden"
              style={{ boxShadow: '0 4px 20px rgba(42,33,64,0.06)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ backgroundColor: metric.color }}
              />

              <div
                className="w-12 h-12 flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${metric.color}12` }}
              >
                <metric.icon size={20} style={{ color: metric.color }} />
              </div>

              <AnimatedNumber
                value={metric.value}
                className="big-number block"
                style={{ color: metric.color }}
              />
              <p className="text-sm font-semibold text-[#2A2140] mt-2">{metric.label}</p>
              <p className="text-xs text-[#7A7090] mt-0.5">{metric.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          <motion.div
            className="p-4 bg-white border border-[#EDE8F5]"
            style={{ boxShadow: '0 2px 10px rgba(42,33,64,0.04)' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Building2 size={14} className="text-[#7B5EA7]" />
              <h3 className="font-semibold text-xs uppercase tracking-wider text-[#7B5EA7]">Para a Empresa</h3>
            </div>
            <ul className="flex flex-col gap-1.5">
              {benefits.empresa.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#2A2140]">
                  <span className="w-1.5 h-1.5 bg-[#7B5EA7] flex-shrink-0 mt-1.5" style={{ opacity: 0.4 }} />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="p-4 bg-white border border-[#EDE8F5]"
            style={{ boxShadow: '0 2px 10px rgba(42,33,64,0.04)' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Heart size={14} className="text-[#5BBFB8]" />
              <h3 className="font-semibold text-xs uppercase tracking-wider text-[#5BBFB8]">Para a Sociedade</h3>
            </div>
            <ul className="flex flex-col gap-1.5">
              {benefits.sociedade.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#2A2140]">
                  <span className="w-1.5 h-1.5 bg-[#5BBFB8] flex-shrink-0 mt-1.5" style={{ opacity: 0.4 }} />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </SlideWrapper>
  )
}
