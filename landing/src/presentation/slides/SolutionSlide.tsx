import { motion } from 'framer-motion'
import { Brain, CalendarCheck, CreditCard, Sparkles } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const pillars = [
  {
    icon: Brain,
    title: 'IA Veterinária',
    desc: 'Identificação de raça por foto, perfil de saúde e predisposições genéticas gerados automaticamente.',
  },
  {
    icon: CalendarCheck,
    title: 'Cronograma Inteligente',
    desc: 'Agenda personalizada de vacinas, vermífugos e cuidados para 5 anos - com lembretes por email.',
  },
  {
    icon: CreditCard,
    title: 'Assinatura Recorrente',
    desc: 'Planos mensais que fidelizam tutores e geram receita previsível para o pet shop.',
  },
]

export function SolutionSlide() {
  return (
    <SlideWrapper bg="lavanda">
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
          className="font-display font-bold text-3xl md:text-4xl text-[#2A2140] text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Plataforma + IA + <span className="text-[#7B5EA7]">Assinatura</span>
        </motion.h2>

        <motion.p
          className="text-lg text-[#7A7090] text-center max-w-xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Uma plataforma web que transforma o pet shop em um hub de saúde
          preventiva, usando IA para personalizar o cuidado de cada pet.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              className="glass-card p-6 flex flex-col items-center text-center gap-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            >
              <div
                className="w-14 h-14 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(123,94,167,0.10)' }}
              >
                <pillar.icon size={24} className="text-[#7B5EA7]" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#2A2140]">{pillar.title}</h3>
              <p className="text-sm text-[#7A7090] leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  )
}
