import { motion } from 'framer-motion'
import { TrendingUp, Users, PieChart } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'
import { PerspectiveCard } from '../components/PerspectiveCard'

const stats = [
  { icon: TrendingUp, value: 'R$ 75,4 bi', label: 'Faturamento do setor pet em 2024', color: '#7B5EA7' },
  { icon: Users, value: '160 milhões', label: 'Pets no Brasil - mais que crianças', color: '#5BBFB8' },
  { icon: PieChart, value: '9,6%', label: 'Crescimento anual do mercado', color: '#7B5EA7' },
]

export function ContextSlide() {
  return (
    <SlideWrapper>
      <div className="flex flex-col items-center text-center gap-10 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Contexto de Mercado
        </motion.span>

        <motion.h2
          className="font-display font-bold text-3xl md:text-4xl text-[#2A2140]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          O Brasil é o <span className="text-[#7B5EA7]">3º maior mercado pet</span> do mundo
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          {stats.map((stat, i) => (
            <PerspectiveCard key={stat.label} delay={0.2 + i * 0.08}>
              <div className="p-6 flex flex-col items-center gap-3 text-center">
                <div
                  className="w-12 h-12 flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon size={22} style={{ color: stat.color }} />
                </div>
                <span className="font-display font-bold text-2xl text-[#2A2140]">{stat.value}</span>
                <span className="text-sm text-[#7A7090]">{stat.label}</span>
              </div>
            </PerspectiveCard>
          ))}
        </div>

        <motion.p
          className="text-sm text-[#7A7090] max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Fonte: ABINPET / IPB 2024 - O mercado pet brasileiro cresceu mesmo durante a recessão,
          impulsionado pela humanização dos animais de estimação.
        </motion.p>
      </div>
    </SlideWrapper>
  )
}
