import { motion } from 'framer-motion'
import { ArrowRight, Github, Sparkles, Brain, CalendarCheck } from 'lucide-react'

const stats = [
  { value: '4 Passos', label: 'com IA' },
  { value: '5 Anos', label: 'de cronograma' },
  { value: 'IA de Ponta', label: 'integrada' },
]

// Cartão flutuante que simula output da IA
function FloatingAICard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
      className="glass-card p-5 w-72 absolute -bottom-6 -left-8 hidden lg:block"
      style={{ animation: 'float 6s ease-in-out infinite' }}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#7B5EA7' }}>
          <Brain size={14} className="text-white" />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold text-[#2A2140]">IA identificou a raça</p>
          <p className="text-xs text-[#7A7090]">Golden Retriever · 94% de confiança</p>
          <div className="flex gap-1.5 mt-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F1FB] text-[#7B5EA7] font-medium">
              Displasia
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDFAFA] text-[#3A9E97] font-medium">
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
      style={{ animationDelay: '1.5s', animation: 'float 6s ease-in-out 1s infinite' }}
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

// Seção hero da landing — gradiente roxo, badge, H1 e CTAs
export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      style={{
        backgroundColor: '#ffffff',
      }}
    >
      {/* Pontos decorativos de fundo */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(123,94,167,0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Conteúdo esquerdo */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
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

            {/* Título */}
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

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-[#7A7090] leading-relaxed max-w-lg"
            >
              Identifique a raça do seu pet por foto, gere um perfil completo de saúde
              e receba um cronograma personalizado de vacinação e cuidados para os
              próximos 5 anos — tudo em 4 passos simples.
            </motion.p>

            {/* CTAs */}
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
            </motion.div>

            {/* Stats */}
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

          {/* Ilustração direita — mockup com cards flutuantes */}
          <div className="relative flex items-center justify-center h-[420px] lg:h-[480px]">
            {/* Card central */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="glass-card p-7 w-full max-w-sm mx-auto relative"
              style={{
                backgroundColor: '#FAF8FC',
                boxShadow: '0 16px 48px rgba(123, 94, 167, 0.18), 0 4px 12px rgba(123, 94, 167, 0.08)',
              }}
            >
              {/* Header do card */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: 'rgba(123,94,167,0.10)' }}>
                  🐕
                </div>
                <div>
                  <p className="font-display font-bold text-[#2A2140] text-sm">Bolinha</p>
                  <p className="text-xs text-[#7A7090]">Golden Retriever · 3 anos</p>
                </div>
                <span className="ml-auto text-[10px] px-2 py-1 rounded-full font-semibold"
                  style={{ background: 'rgba(16,185,129,0.10)', color: '#10B981' }}>
                  Saudável
                </span>
              </div>

              {/* Barra de progresso de saúde */}
              <div className="flex flex-col gap-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-[#7A7090]">Score de saúde</span>
                  <span className="font-semibold text-[#2A2140]">87/100</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: '#EDE8F5' }}>
                  <div className="h-2 rounded-full w-[87%] transition-all"
                    style={{ backgroundColor: '#7B5EA7' }} />
                </div>
              </div>

              {/* Lista de cuidados */}
              <div className="flex flex-col gap-2">
                {[
                  { icon: '💉', text: 'Vacina V10 em 15 dias', tag: 'Urgente', tagColor: '#EF4444' },
                  { icon: '🛁', text: 'Banho agendado — 5/jan', tag: 'Agendado', tagColor: '#5BBFB8' },
                  { icon: '🦷', text: 'Limpeza dental — 20/jan', tag: 'Próximo', tagColor: '#F59E0B' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl"
                    style={{ background: '#FAF8FC' }}>
                    <span className="text-base">{item.icon}</span>
                    <p className="text-xs text-[#2A2140] flex-1">{item.text}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                      style={{ background: `${item.tagColor}18`, color: item.tagColor }}>
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Cards flutuantes */}
            <FloatingAICard />
            <ScheduleCard />
          </div>
        </div>
      </div>
    </section>
  )
}
