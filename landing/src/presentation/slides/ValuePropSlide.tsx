import { motion } from 'framer-motion'
import { Target, Check, ArrowRight } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const forTutor = [
  'Saber exatamente o que seu pet precisa e quando',
  'Não esquecer nunca de vacinas ou consultas',
  'Entender os riscos de saúde da raça do pet',
  'Ter tudo organizado em um só lugar',
]

const forShop = [
  'Fidelizar clientes com acompanhamento contínuo',
  'Receita recorrente e previsível via assinatura',
  'Menos no-shows com lembretes automáticos',
  'Diferencial competitivo com tecnologia e IA',
]

export function ValuePropSlide() {
  return (
    <SlideWrapper maxWidth="wide">
      <div className="flex flex-col items-center gap-8 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Target size={12} />
          Proposta de Valor
        </motion.span>

        <motion.h2
          className="font-display font-bold text-[#2A2140] text-center"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Valor para <span className="accent-underline text-[#7B5EA7]">cada lado</span>
        </motion.h2>

        {/* Two-column comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mt-2">
          {/* Tutor column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 flex items-center justify-center bg-[#7B5EA7]">
                <Target size={18} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#7B5EA7]">Para o Tutor</h3>
            </div>

            <div className="flex flex-col gap-3">
              {forTutor.map((item, i) => (
                <motion.div
                  key={item}
                  className="flex items-start gap-3 p-3 bg-white border border-[#EDE8F5]"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  <Check size={16} className="text-[#7B5EA7] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#2A2140]">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pet Shop column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 flex items-center justify-center bg-[#5BBFB8]">
                <ArrowRight size={18} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#5BBFB8]">Para o Pet Shop</h3>
            </div>

            <div className="flex flex-col gap-3">
              {forShop.map((item, i) => (
                <motion.div
                  key={item}
                  className="flex items-start gap-3 p-3 bg-white border border-[#EDE8F5]"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  <Check size={16} className="text-[#5BBFB8] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#2A2140]">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SlideWrapper>
  )
}
