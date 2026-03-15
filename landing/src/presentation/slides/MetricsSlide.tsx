import { motion } from 'framer-motion'
import { BarChart3, Users, Repeat, DollarSign, Brain } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'
import { AnimatedNumber } from '../components/AnimatedNumber'

const kpis = [
  { icon: Users, label: 'Assinantes ativos', target: '500', period: '12 meses', color: '#7B5EA7' },
  { icon: Repeat, label: 'Taxa de retenção', target: '85%', period: 'mensal', color: '#5BBFB8' },
  { icon: DollarSign, label: 'MRR', target: 'R$ 20k', period: '12 meses', color: '#7B5EA7' },
  { icon: Brain, label: 'Consultas preventivas', target: '2.000', period: 'mensal', color: '#5BBFB8' },
]

export function MetricsSlide() {
  return (
    <SlideWrapper maxWidth="wide">
      <div className="flex flex-col items-center gap-10 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BarChart3 size={12} />
          Métricas-Chave
        </motion.span>

        <motion.h2
          className="font-display font-bold text-[#2A2140] text-center"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          KPIs de <span className="accent-underline text-[#7B5EA7]">sucesso</span>
        </motion.h2>

        {/* Dashboard-style metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              className="relative p-6 bg-white border border-[#EDE8F5] overflow-hidden"
              style={{ boxShadow: '0 4px 20px rgba(42,33,64,0.06)' }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            >
              {/* Accent top bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ backgroundColor: kpi.color }}
              />

              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-semibold text-[#7A7090] uppercase tracking-wider">
                    {kpi.label}
                  </span>
                  <AnimatedNumber
                    value={kpi.target}
                    className="display-number"
                    style={{ color: kpi.color }}
                  />
                  <span className="text-xs text-[#7A7090]">Meta: {kpi.period}</span>
                </div>

                <div
                  className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${kpi.color}10` }}
                >
                  <kpi.icon size={22} style={{ color: kpi.color }} />
                </div>
              </div>

              {/* Fake mini chart bar */}
              <div className="flex items-end gap-1 mt-4 h-6">
                {[0.3, 0.5, 0.4, 0.7, 0.6, 0.8, 0.9, 1].map((h, j) => (
                  <motion.div
                    key={j}
                    className="flex-1"
                    style={{
                      height: `${h * 100}%`,
                      backgroundColor: kpi.color,
                      opacity: 0.08 + j * 0.03,
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 + j * 0.03, duration: 0.3 }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-xs text-[#7A7090] text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Métricas baseadas em benchmarks do mercado SaaS pet-tech e na base atual de clientes do 8Patas.
        </motion.p>
      </div>
    </SlideWrapper>
  )
}
