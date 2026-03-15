import { motion } from 'framer-motion'
import { MapPin, Heart, Award, Shield, Rocket, Building2 } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const highlights = [
  { icon: MapPin, title: 'Localização', desc: 'Água Branca, São Paulo  - alta densidade de tutores', color: '#7B5EA7' },
  { icon: Heart, title: 'Fear Free', desc: 'Atendimento livre de medo e estresse para pets', color: '#5BBFB8' },
  { icon: Award, title: 'Tradição', desc: 'Operação estabelecida com base de clientes recorrente', color: '#7B5EA7' },
  { icon: Shield, title: 'Confiança', desc: 'Equipe veterinária qualificada', color: '#5BBFB8' },
]

const ventureItems = [
  { icon: Building2, label: 'Venture Building', text: 'Equipe interna desenvolve produto digital dentro da operação existente' },
  { icon: Rocket, label: 'Lean Startup', text: 'MVP validado com clientes reais antes de escalar' },
  { icon: Heart, label: 'Sinergias', text: 'Plataforma digital alavanca base de clientes e expertise da clínica' },
]

export function CompanySlide() {
  return (
    <SlideWrapper maxWidth="wide">
      <div className="slide-split">
        {/* Left: company info */}
        <div className="slide-split-content">
          <motion.span
            className="section-badge self-start"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            A Empresa
          </motion.span>

          <motion.h2
            className="font-display font-bold text-[#2A2140]"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-[#7B5EA7]">8Patas</span> Pet Shop
          </motion.h2>

          <motion.p
            className="text-base text-[#7A7090] max-w-md"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Fundada em 2022, pet shop com clínica veterinária integrada, focado em saúde preventiva
            e experiência humanizada para pets e tutores.
          </motion.p>

          {/* Highlights as horizontal pills */}
          <div className="flex flex-wrap gap-3 mt-2">
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-[#EDE8F5]"
                style={{ boxShadow: '0 2px 8px rgba(42,33,64,0.04)' }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
              >
                <item.icon size={14} style={{ color: item.color }} />
                <div>
                  <span className="text-xs font-semibold text-[#2A2140]">{item.title}</span>
                  <span className="text-[10px] text-[#7A7090] ml-1">{item.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Intraempreendedorismo model */}
        <div className="slide-split-visual">
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Rocket size={18} className="text-[#5BBFB8]" />
              <h3 className="font-display font-bold text-base text-[#2A2140]">Intraempreendedorismo</h3>
            </div>

            <div className="flex flex-col gap-4">
              {ventureItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="flex items-start gap-3 p-4 bg-white border border-[#EDE8F5]"
                  style={{ boxShadow: '0 2px 12px rgba(42,33,64,0.05)' }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div
                    className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(91,191,184,0.10)' }}
                  >
                    <item.icon size={16} className="text-[#5BBFB8]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2A2140]">{item.label}</span>
                    <p className="text-[11px] text-[#7A7090] mt-0.5 leading-relaxed">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SlideWrapper>
  )
}
