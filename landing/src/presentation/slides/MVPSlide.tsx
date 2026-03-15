import { motion } from 'framer-motion'
import { Camera, Brain, CalendarCheck, Bell, Shield, BarChart3 } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'
import { PerspectiveCard } from '../components/PerspectiveCard'

const features = [
  { icon: Camera, title: 'Upload de Foto', desc: 'Tutor envia foto do pet para análise' },
  { icon: Brain, title: 'IA Veterinária', desc: 'Identificação de raça e perfil de saúde' },
  { icon: CalendarCheck, title: 'Cronograma 5 Anos', desc: 'Vacinas, vermífugos e cuidados' },
  { icon: Bell, title: 'Lembretes', desc: 'Notificações por email automáticas' },
  { icon: Shield, title: 'Auth Seguro', desc: 'Login com verificação de email' },
  { icon: BarChart3, title: 'Dashboard', desc: 'Visão geral de todos os pets' },
]

export function MVPSlide() {
  return (
    <SlideWrapper>
      <div className="flex flex-col items-center gap-10 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          MVP
        </motion.span>

        <motion.h2
          className="font-display font-bold text-3xl md:text-4xl text-[#2A2140] text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Funcionalidades do <span className="text-[#7B5EA7]">MVP</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-4xl">
          {features.map((feat, i) => (
            <PerspectiveCard key={feat.title} delay={0.2 + i * 0.08}>
              <div className="p-5 flex flex-col items-center text-center gap-3">
                <div
                  className="w-12 h-12 flex items-center justify-center"
                  style={{ backgroundColor: i % 2 === 0 ? 'rgba(123,94,167,0.10)' : 'rgba(91,191,184,0.10)' }}
                >
                  <feat.icon size={20} style={{ color: i % 2 === 0 ? '#7B5EA7' : '#5BBFB8' }} />
                </div>
                <h3 className="font-semibold text-sm text-[#2A2140]">{feat.title}</h3>
                <p className="text-xs text-[#7A7090]">{feat.desc}</p>
              </div>
            </PerspectiveCard>
          ))}
        </div>
      </div>
    </SlideWrapper>
  )
}
