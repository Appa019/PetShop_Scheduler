import { motion } from 'framer-motion'
import { ArrowRight, Github, Sparkles, Brain, CalendarCheck, Syringe, Droplets, Stethoscope, Presentation } from 'lucide-react'

const stats = [
  { value: '4 Passos', label: 'com IA' },
  { value: '5 Anos', label: 'de cronograma' },
  { value: 'IA de Ponta', label: 'integrada' },
]

// Floating AI card - static position, animated entrance
function FloatingAICard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
      className="glass-card p-5 w-72 absolute -bottom-6 -left-8 hidden lg:block"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#7B5EA7' }}>
          <Brain size={14} className="text-white" />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold text-[#2A2140]">IA identificou a raça</p>
          <p className="text-xs text-[#7A7090]">Golden Retriever · 94% de confiança</p>
          <div className="flex gap-1.5 mt-1">
            <span className="text-[10px] px-2 py-0.5 bg-[#F5F1FB] text-[#7B5EA7] font-medium">
              Displasia
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-[#EDFAFA] text-[#3A9E97] font-medium">
              10–12 anos
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ScheduleCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.7, ease: 'easeOut' }}
      className="glass-card p-4 w-56 absolute -top-4 -right-6 hidden lg:block"
    >
      <div className="flex items-center gap-2 mb-2">
        <CalendarCheck size={14} style={{ color: '#5BBFB8' }} />
        <p className="text-xs font-semibold text-[#2A2140]">Próximo cuidado</p>
      </div>
      <p className="text-xs text-[#7A7090]">Vacina V10 em <strong className="text-[#5A3E7A]">15 dias</strong></p>
      <p className="text-xs text-[#7A7090] mt-1">Banho preventivo agendado</p>
    </motion.div>
  )
}

interface HeroProps {
  onOpenPresentation?: () => void
}

export default function Hero({ onOpenPresentation }: HeroProps) {
  return (
    <section
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      style={{
        backgroundColor: '#FAF8F5',
      }}
    >
      {/* Dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(123,94,167,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left content */}
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="section-badge">
                <Sparkles size={12} />
                Plataforma Veterinária Inteligente
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-bold text-[#2A2140] leading-tight"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 3.75rem)', letterSpacing: '-0.02em' }}
            >
              Cuide do seu pet com{' '}
              <span className="text-[#7B5EA7]">
                inteligência artificial.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-[#7A7090] leading-relaxed max-w-lg"
            >
              Identifique a raça do seu pet por foto, gere um perfil completo de saúde
              e receba um cronograma personalizado de vacinação e cuidados para os
              próximos 5 anos - tudo em 4 passos simples.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <a
                href="/app/login"
                className="btn-primary"
              >
                Começar Agora
                <ArrowRight size={16} />
              </a>
              <a
                href="https://github.com/Appa019/PetShop_Scheduler"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <Github size={16} />
                Ver no GitHub
              </a>
              {onOpenPresentation && (
                <button
                  onClick={onOpenPresentation}
                  className="btn-outline"
                >
                  <Presentation size={16} />
                  Ver Apresentação
                </button>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex gap-8 pt-2"
            >
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <span className="font-display font-bold text-xl text-[#2A2140]">{stat.value}</span>
                  <span className="text-xs text-[#7A7090]">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - mockup with floating cards */}
          <div className="relative flex items-center justify-center h-[420px] lg:h-[480px]">
            {/* Central card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="glass-card p-7 w-full max-w-sm mx-auto relative"
              style={{
                backgroundColor: '#FAF8F5',
                boxShadow: '0 16px 48px rgba(42, 33, 64, 0.10), 0 4px 12px rgba(42, 33, 64, 0.05)',
              }}
            >
              {/* Card header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(123,94,167,0.10)' }}>
                  <img src="/logo_pata.avif" alt="" className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-display font-bold text-[#2A2140] text-sm">Bolinha</p>
                  <p className="text-xs text-[#7A7090]">Golden Retriever · 3 anos</p>
                </div>
                <span className="ml-auto text-[10px] px-2 py-1 font-semibold"
                  style={{ background: 'rgba(16,185,129,0.10)', color: '#10B981' }}>
                  Saudável
                </span>
              </div>

              {/* Health progress bar */}
              <div className="flex flex-col gap-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-[#7A7090]">Score de saúde</span>
                  <span className="font-semibold text-[#2A2140]">87/100</span>
                </div>
                <div className="h-2" style={{ background: '#EDE8F5' }}>
                  <div className="h-2 w-[87%] transition-all"
                    style={{ backgroundColor: '#7B5EA7' }} />
                </div>
              </div>

              {/* Care items */}
              <div className="flex flex-col gap-2">
                {[
                  { Icon: Syringe, text: 'Vacina V10 em 15 dias', tag: 'Urgente', tagColor: '#EF4444' },
                  { Icon: Droplets, text: 'Banho agendado - 5/jan', tag: 'Agendado', tagColor: '#5BBFB8' },
                  { Icon: Stethoscope, text: 'Limpeza dental - 20/jan', tag: 'Próximo', tagColor: '#F59E0B' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5"
                    style={{ background: '#FAF8F5' }}>
                    <item.Icon size={16} style={{ color: item.tagColor }} strokeWidth={1.75} />
                    <p className="text-xs text-[#2A2140] flex-1">{item.text}</p>
                    <span className="text-[10px] px-1.5 py-0.5 font-medium"
                      style={{ background: `${item.tagColor}18`, color: item.tagColor }}>
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <FloatingAICard />
            <ScheduleCard />
          </div>
        </div>
      </div>
    </section>
  )
}
