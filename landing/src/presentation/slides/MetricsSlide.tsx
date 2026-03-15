import { motion } from 'framer-motion'
import { BarChart3, Users, Repeat, DollarSign, Brain } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'
import { PerspectiveCard } from '../components/PerspectiveCard'

const kpis = [
  { icon: Users, label: 'Assinantes ativos', target: '500', period: '12 meses', color: '#7B5EA7' },
  { icon: Repeat, label: 'Taxa de retenção', target: '85%', period: 'mensal', color: '#5BBFB8' },
  { icon: DollarSign, label: 'MRR', target: 'R$ 20k', period: '12 meses', color: '#7B5EA7' },
  { icon: Brain, label: 'Consultas IA', target: '2.000', period: 'mensal', color: '#5BBFB8' },
]

export function MetricsSlide() {
  return (
    <SlideWrapper>
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
          className="font-display font-bold text-3xl md:text-4xl text-[#2A2140] text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          KPIs de <span className="text-[#7B5EA7]">sucesso</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
          {kpis.map((kpi, i) => (
            <PerspectiveCard key={kpi.label} delay={0.2 + i * 0.1}>
              <div className="p-6 flex items-start gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${kpi.color}15` }}
                >
                  <kpi.icon size={22} style={{ color: kpi.color }} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-[#7A7090] uppercase tracking-wider">{kpi.label}</span>
                  <span className="font-display font-bold text-2xl text-[#2A2140]">{kpi.target}</span>
                  <span className="text-xs text-[#7A7090]">Meta: {kpi.period}</span>
                </div>
              </div>
            </PerspectiveCard>
          ))}
        </div>

        <motion.p
          className="text-sm text-[#7A7090] text-center max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Métricas baseadas em benchmarks do mercado SaaS pet-tech e na base atual de clientes do 8Patas.
        </motion.p>
      </div>
    </SlideWrapper>
  )
}
