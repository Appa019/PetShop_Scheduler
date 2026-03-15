import { motion } from 'framer-motion'
import { Users, Zap, MapPin, Calendar, Smartphone, Heart } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const segments = [
  { icon: Heart, label: 'Público', value: 'Donos de cães e gatos' },
  { icon: MapPin, label: 'Base', value: 'Clientes da clínica 8Patas' },
  { icon: Calendar, label: 'Foco', value: 'Tutores focados em prevenção' },
  { icon: Smartphone, label: 'Especial', value: 'Pets com predisposição genética' },
]

const earlyAdopters = [
  'Clientes atuais do 8Patas Pet Shop',
  'Tutores que já vacinam regularmente',
  'Donos de raças com predisposições (Golden, Bulldog, Pug)',
  'Tutores ativos em comunidades pet no Instagram',
]

export function SegmentSlide() {
  return (
    <SlideWrapper maxWidth="wide">
      <div className="slide-split">
        {/* Left: Persona visual */}
        <div className="slide-split-content">
          <motion.span
            className="section-badge self-start"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Users size={12} />
            Segmento de Clientes
          </motion.span>

          <motion.h2
            className="font-display font-bold text-[#2A2140]"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Quem são nossos <span className="accent-underline text-[#7B5EA7]">clientes</span>
          </motion.h2>

          {/* Persona avatar illustration */}
          <motion.div
            className="flex items-center gap-4 p-4 bg-white border border-[#EDE8F5]"
            style={{ boxShadow: '0 4px 16px rgba(42,33,64,0.06)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 flex items-center justify-center bg-[#EDE8F5] flex-shrink-0">
              <Users size={28} className="text-[#7B5EA7]" />
            </div>
            <div>
              <p className="font-display font-bold text-base text-[#2A2140]">Marina, 32 anos</p>
              <p className="text-xs text-[#7A7090]">Tutora de 2 pets, classe B, zona oeste de SP</p>
              <p className="text-xs text-[#7A7090] mt-1 italic">"Quero o melhor pro meu pet mas não sei por onde começar"</p>
            </div>
          </motion.div>

          {/* Segment attributes */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            {segments.map((seg, i) => (
              <motion.div
                key={seg.label}
                className="flex items-center gap-2.5 p-2.5 bg-white border border-[#EDE8F5]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
              >
                <seg.icon size={14} className="text-[#7B5EA7] flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-[#7A7090] uppercase tracking-wider">{seg.label}</span>
                  <p className="text-xs font-semibold text-[#2A2140]">{seg.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Early adopters */}
        <div className="slide-split-visual">
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 flex items-center justify-center bg-[#5BBFB8]">
                <Zap size={18} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-base text-[#2A2140]">Early Adopters</h3>
            </div>

            <div className="flex flex-col gap-3">
              {earlyAdopters.map((adopter, i) => (
                <motion.div
                  key={adopter}
                  className="flex items-start gap-3 p-3 bg-white border border-[#EDE8F5]"
                  style={{ boxShadow: '0 2px 8px rgba(42,33,64,0.04)' }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                >
                  <span className="font-display font-bold text-lg text-[#5BBFB8] leading-none mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-[#2A2140]">{adopter}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SlideWrapper>
  )
}
