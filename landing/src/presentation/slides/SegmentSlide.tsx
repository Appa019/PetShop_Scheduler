import { motion } from 'framer-motion'
import { Users, Zap } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const segments = [
  { label: 'Idade', value: '25–45 anos' },
  { label: 'Classe', value: 'B e C' },
  { label: 'Região', value: 'São Paulo - zona oeste' },
  { label: 'Perfil', value: 'Tutores que tratam pets como família' },
  { label: 'Digital', value: 'Usam apps e redes sociais diariamente' },
]

const earlyAdopters = [
  'Clientes atuais do 8Patas Pet Shop',
  'Tutores que já vacinam regularmente',
  'Donos de raças com predisposições conhecidas (Golden, Bulldog, Pug)',
  'Tutores ativos em comunidades pet no Instagram',
]

export function SegmentSlide() {
  return (
    <SlideWrapper>
      <div className="flex flex-col items-center gap-10 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Users size={12} />
          Segmento de Clientes
        </motion.span>

        <motion.h2
          className="font-display font-bold text-3xl md:text-4xl text-[#2A2140] text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Quem são nossos <span className="text-[#7B5EA7]">clientes</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Segment profile */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-display font-bold text-lg text-[#2A2140] mb-4 flex items-center gap-2">
              <Users size={18} className="text-[#7B5EA7]" />
              Perfil do Segmento
            </h3>
            <div className="flex flex-col gap-3">
              {segments.map((seg, i) => (
                <motion.div
                  key={seg.label}
                  className="flex items-center justify-between p-2.5"
                  style={{ backgroundColor: 'rgba(123,94,167,0.04)' }}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                >
                  <span className="text-xs font-medium text-[#7A7090]">{seg.label}</span>
                  <span className="text-sm font-semibold text-[#2A2140]">{seg.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Early adopters */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-display font-bold text-lg text-[#2A2140] mb-4 flex items-center gap-2">
              <Zap size={18} className="text-[#5BBFB8]" />
              Early Adopters
            </h3>
            <div className="flex flex-col gap-3">
              {earlyAdopters.map((adopter, i) => (
                <motion.div
                  key={adopter}
                  className="flex items-start gap-2.5 text-sm text-[#2A2140]"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5BBFB8] flex-shrink-0 mt-1.5" />
                  {adopter}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SlideWrapper>
  )
}
