import { motion } from 'framer-motion'
import { MapPin, Heart, Award, Shield, Rocket, Building2 } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const highlights = [
  { icon: MapPin, title: 'Localização', desc: 'Água Branca, São Paulo - bairro com alta densidade de tutores' },
  { icon: Heart, title: 'Fear Free', desc: 'Certificação em atendimento livre de medo e estresse para pets' },
  { icon: Award, title: 'Tradição', desc: 'Operação estabelecida com base de clientes recorrente' },
  { icon: Shield, title: 'Confiança', desc: 'Equipe veterinária qualificada e ambiente preparado' },
]

export function CompanySlide() {
  return (
    <SlideWrapper>
      <div className="flex flex-col items-center gap-8 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          A Empresa
        </motion.span>

        <motion.h2
          className="font-display font-bold text-3xl md:text-4xl text-[#2A2140] text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-[#7B5EA7]">8Patas</span> Pet Shop
        </motion.h2>

        <motion.p
          className="text-lg text-[#7A7090] text-center max-w-xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Pet shop com clínica veterinária integrada, focado em saúde preventiva
          e experiência humanizada para pets e tutores.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              className="glass-card p-4 flex items-start gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              <div
                className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(123,94,167,0.10)' }}
              >
                <item.icon size={16} className="text-[#7B5EA7]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#2A2140]">{item.title}</h3>
                <p className="text-xs text-[#7A7090] mt-0.5">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modelo de Intraempreendedorismo */}
        <motion.div
          className="glass-card p-5 w-full max-w-3xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(91,191,184,0.10)' }}
            >
              <Rocket size={16} className="text-[#5BBFB8]" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#2A2140]">Modelo de Intraempreendedorismo</h3>
              <p className="text-xs text-[#7A7090]">Corporate Venturing Interno</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-start gap-2">
              <Building2 size={13} className="text-[#7B5EA7] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#7A7090]">
                <span className="font-semibold text-[#2A2140]">Venture Building</span> - equipe interna desenvolve produto digital dentro da operação existente
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Rocket size={13} className="text-[#7B5EA7] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#7A7090]">
                <span className="font-semibold text-[#2A2140]">Lean Startup</span> - MVP validado com clientes reais antes de escalar
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Heart size={13} className="text-[#7B5EA7] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#7A7090]">
                <span className="font-semibold text-[#2A2140]">Sinergias</span> - plataforma digital alavanca base de clientes e expertise da clínica física
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </SlideWrapper>
  )
}
