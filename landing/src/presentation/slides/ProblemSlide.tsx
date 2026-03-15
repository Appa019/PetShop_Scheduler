import { motion } from 'framer-motion'
import { AlertTriangle, Clock, FileQuestion, HeartCrack } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'
import { AccentShapes } from '../components/AccentShapes'

const tutorPains = [
  { icon: FileQuestion, text: 'Não sabe quais vacinas o pet precisa' },
  { icon: Clock, text: 'Esquece datas de vermífugos e retornos' },
  { icon: HeartCrack, text: 'Descobre doenças de raça tarde demais' },
  { icon: AlertTriangle, text: 'Custos veterinários imprevisíveis' },
]

const shopPains = [
  { icon: AlertTriangle, text: 'Perde clientes por falta de acompanhamento' },
  { icon: Clock, text: 'Agendamento manual e desorganizado' },
  { icon: FileQuestion, text: 'Receita irregular do petshop' },
]

export function ProblemSlide() {
  return (
    <SlideWrapper maxWidth="wide">
      <AccentShapes variant="lines" />

      <div className="flex flex-col items-center gap-8 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertTriangle size={12} />
          O Problema
        </motion.span>

        <motion.h2
          className="font-display font-bold text-[#2A2140] text-center"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Duas dores, <span className="accent-underline text-[#7B5EA7]">uma oportunidade</span>
        </motion.h2>

        {/* Split layout with large icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl mt-2">
          {/* Tutor side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 flex items-center justify-center bg-[#7B5EA7]">
                <HeartCrack size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-[#2A2140]">Dor do Tutor</h3>
                <p className="text-xs text-[#7A7090]">Falta de orientação veterinária</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {tutorPains.map((pain, i) => (
                <motion.div
                  key={pain.text}
                  className="flex items-center gap-4 p-4 bg-white border-l-[3px] border-[#7B5EA7]"
                  style={{ boxShadow: '0 2px 12px rgba(42,33,64,0.05)' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.1 }}
                >
                  <pain.icon size={20} className="text-[#7B5EA7] flex-shrink-0" />
                  <span className="text-sm text-[#2A2140] font-medium">{pain.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pet Shop side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 flex items-center justify-center bg-[#5BBFB8]">
                <AlertTriangle size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-[#2A2140]">Dor do Pet Shop</h3>
                <p className="text-xs text-[#7A7090]">Perda de receita recorrente</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {shopPains.map((pain, i) => (
                <motion.div
                  key={pain.text}
                  className="flex items-center gap-4 p-4 bg-white border-l-[3px] border-[#5BBFB8]"
                  style={{ boxShadow: '0 2px 12px rgba(42,33,64,0.05)' }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.1 }}
                >
                  <pain.icon size={20} className="text-[#5BBFB8] flex-shrink-0" />
                  <span className="text-sm text-[#2A2140] font-medium">{pain.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SlideWrapper>
  )
}
