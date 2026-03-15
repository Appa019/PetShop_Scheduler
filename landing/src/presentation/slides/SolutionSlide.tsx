import { motion } from 'framer-motion'
import { Brain, CalendarCheck, CreditCard, Sparkles, ArrowDown } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const pillars = [
  {
    icon: Brain,
    title: 'IA Veterinária',
    desc: 'Identificação de raça por foto, perfil de saúde e predisposições genéticas gerados automaticamente.',
    color: '#7B5EA7',
  },
  {
    icon: CalendarCheck,
    title: 'Cronograma Inteligente',
    desc: 'Agenda personalizada de vacinas, vermífugos e cuidados para 5 anos  - com lembretes por email.',
    color: '#5BBFB8',
  },
  {
    icon: CreditCard,
    title: 'Assinatura Recorrente',
    desc: 'Planos mensais que fidelizam tutores e geram receita previsível para o pet shop.',
    color: '#7B5EA7',
  },
]

export function SolutionSlide() {
  return (
    <SlideWrapper bg="lavanda" maxWidth="wide">
      <div className="flex flex-col items-center gap-10 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles size={12} />
          A Solução
        </motion.span>

        <motion.h2
          className="font-display font-bold text-[#2A2140] text-center"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Plataforma + IA + <span className="accent-underline text-[#7B5EA7]">Assinatura</span>
        </motion.h2>

        <motion.p
          className="text-base text-[#7A7090] text-center max-w-xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Uma plataforma web que transforma o pet shop em um hub de saúde
          preventiva, usando IA para personalizar o cuidado de cada pet.
        </motion.p>

        {/* Connected diagram - horizontal flow */}
        <div className="flex flex-col md:flex-row items-center gap-0 w-full max-w-4xl mt-4">
          {pillars.map((pillar, i) => (
            <div key={pillar.title} className="flex flex-col md:flex-row items-center">
              <motion.div
                className="bg-white p-6 flex flex-col items-center text-center gap-4 w-full md:w-[280px]"
                style={{
                  border: `2px solid ${pillar.color}20`,
                  boxShadow: '0 4px 20px rgba(42,33,64,0.06)',
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
              >
                <div
                  className="w-16 h-16 flex items-center justify-center"
                  style={{ backgroundColor: `${pillar.color}12` }}
                >
                  <pillar.icon size={28} style={{ color: pillar.color }} />
                </div>
                <h3 className="font-display font-bold text-lg text-[#2A2140]">{pillar.title}</h3>
                <p className="text-xs text-[#7A7090] leading-relaxed">{pillar.desc}</p>
              </motion.div>

              {/* Connector arrow */}
              {i < pillars.length - 1 && (
                <motion.div
                  className="flex items-center justify-center p-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <ArrowDown size={20} className="text-[#7B5EA7] rotate-0 md:-rotate-90" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  )
}
