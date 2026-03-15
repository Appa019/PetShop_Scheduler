import { motion } from 'framer-motion'
import { TrendingUp, Users, PieChart } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { AccentShapes } from '../components/AccentShapes'

const stats = [
  {
    icon: TrendingUp,
    value: 'R$ 75,4 bi',
    numericValue: '75,4',
    prefix: 'R$ ',
    suffix: ' bi',
    label: 'Faturamento do setor pet em 2024',
    color: '#7B5EA7',
  },
  {
    icon: Users,
    value: '160 milhões',
    numericValue: '160',
    prefix: '',
    suffix: ' milhões',
    label: 'Pets no Brasil  - mais que crianças',
    color: '#5BBFB8',
  },
  {
    icon: PieChart,
    value: '9,6%',
    numericValue: '9,6',
    prefix: '',
    suffix: '%',
    label: 'Crescimento anual do mercado',
    color: '#7B5EA7',
  },
]

export function ContextSlide() {
  return (
    <SlideWrapper maxWidth="wide">
      <AccentShapes variant="dots" />

      <div className="flex flex-col items-center text-center gap-8 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Contexto de Mercado
        </motion.span>

        <motion.h2
          className="font-display font-bold text-[#2A2140] text-center"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          O Brasil é o <span className="accent-underline text-[#7B5EA7]">3º maior mercado pet</span> do mundo
        </motion.h2>

        {/* Big numbers - full width */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full max-w-5xl mt-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.12, duration: 0.5 }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}12` }}
              >
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>

              {/* Animated big number */}
              <AnimatedNumber
                value={stat.value}
                className="big-number"
                style={{ color: stat.color }}
              />

              {/* Label */}
              <span className="text-sm text-[#7A7090] max-w-[200px] leading-snug">{stat.label}</span>

              {/* Decorative line */}
              <motion.div
                className="w-12 h-[2px]"
                style={{ backgroundColor: stat.color, opacity: 0.2 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              />
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-xs text-[#7A7090] max-w-md mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Fonte: ABINPET / IPB 2024  - O mercado pet brasileiro cresceu mesmo durante a recessão,
          impulsionado pela humanização dos animais de estimação.
        </motion.p>
      </div>
    </SlideWrapper>
  )
}
