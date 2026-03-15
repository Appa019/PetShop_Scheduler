import { motion } from 'framer-motion'
import { AlertTriangle, Clock, FileQuestion, HeartCrack } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const tutorPains = [
  { icon: FileQuestion, text: 'Não sabe quais vacinas o pet precisa' },
  { icon: Clock, text: 'Esquece datas de vermífugos e retornos' },
  { icon: HeartCrack, text: 'Descobre doenças de raça tarde demais' },
]

const shopPains = [
  { icon: AlertTriangle, text: 'Perde clientes por falta de acompanhamento' },
  { icon: Clock, text: 'Agendamento manual e desorganizado' },
  { icon: FileQuestion, text: 'Sem dados para fidelizar tutores' },
]

export function ProblemSlide() {
  return (
    <SlideWrapper>
      <div className="flex flex-col items-center gap-10 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertTriangle size={12} />
          O Problema
        </motion.span>

        <motion.h2
          className="font-display font-bold text-3xl md:text-4xl text-[#2A2140] text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Duas dores, <span className="text-[#7B5EA7]">uma oportunidade</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Tutor */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h3 className="font-display font-bold text-lg text-[#2A2140] mb-4">Dor do Tutor</h3>
            <div className="flex flex-col gap-3">
              {tutorPains.map((pain, i) => (
                <motion.div
                  key={pain.text}
                  className="flex items-center gap-3 p-3"
                  style={{ backgroundColor: 'rgba(123,94,167,0.05)' }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  <pain.icon size={18} className="text-[#7B5EA7] flex-shrink-0" />
                  <span className="text-sm text-[#2A2140]">{pain.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pet Shop */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h3 className="font-display font-bold text-lg text-[#2A2140] mb-4">Dor do Pet Shop</h3>
            <div className="flex flex-col gap-3">
              {shopPains.map((pain, i) => (
                <motion.div
                  key={pain.text}
                  className="flex items-center gap-3 p-3"
                  style={{ backgroundColor: 'rgba(91,191,184,0.05)' }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  <pain.icon size={18} className="text-[#5BBFB8] flex-shrink-0" />
                  <span className="text-sm text-[#2A2140]">{pain.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SlideWrapper>
  )
}
