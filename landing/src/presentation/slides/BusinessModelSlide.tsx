import { motion } from 'framer-motion'
import { Check, Star, Megaphone, Wallet } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const plans = [
  {
    name: 'Básico',
    price: 'R$ 29,90',
    period: '/mês',
    features: ['1 pet cadastrado', 'Identificação de raça por IA', 'Cronograma de vacinas', 'Lembretes por email'],
    highlighted: false,
    color: '#7A7090',
  },
  {
    name: 'Família',
    price: 'R$ 49,90',
    period: '/mês',
    features: ['Até 3 pets', 'Tudo do Básico', 'Perfil de saúde completo', 'Suporte prioritário', 'Descontos na clínica'],
    highlighted: true,
    color: '#7B5EA7',
  },
  {
    name: 'Premium',
    price: 'R$ 79,90',
    period: '/mês',
    features: ['Pets ilimitados', 'Tudo do Família', 'Consultas IA ilimitadas', 'Teleconsulta veterinária', 'Check-up semestral grátis'],
    highlighted: false,
    color: '#5BBFB8',
  },
]

const channels = [
  { label: 'App/plataforma 8Patas', desc: 'Canal principal de engajamento' },
  { label: 'Site da clínica', desc: 'Captação e informação institucional' },
  { label: 'Instagram', desc: 'Conteúdo educativo e aquisição orgânica' },
  { label: 'Base de clientes atual', desc: 'Conversão direta de clientes existentes' },
]

const costs = [
  { label: 'Desenvolvimento da plataforma', value: 'R$ 300/mês' },
  { label: 'Infraestrutura tecnológica', value: 'R$ 200/mês' },
  { label: 'Equipe veterinária', value: 'R$ 400/mês' },
  { label: 'Marketing e aquisição', value: 'R$ 500/mês' },
]

export function BusinessModelSlide() {
  return (
    <SlideWrapper maxWidth="wide" padding="compact">
      <div className="flex flex-col items-center gap-6 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Modelo de Negócio
        </motion.span>

        <motion.h2
          className="font-display font-bold text-[#2A2140] text-center"
          style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Planos, <span className="accent-underline text-[#7B5EA7]">Canais</span> & Custos
        </motion.h2>

        {/* Pricing cards - premium redesign */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative p-5 flex flex-col gap-3 bg-white ${
                plan.highlighted ? 'border-2 border-[#7B5EA7] shadow-lg' : 'border border-[#EDE8F5]'
              }`}
              style={{
                boxShadow: plan.highlighted
                  ? '0 8px 32px rgba(123,94,167,0.15)'
                  : '0 2px 12px rgba(42,33,64,0.05)',
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-[#7B5EA7]">
                    <Star size={10} /> Mais popular
                  </span>
                </div>
              )}

              <h3 className="font-display font-bold text-lg" style={{ color: plan.color }}>{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-bold text-3xl text-[#2A2140]">{plan.price}</span>
                <span className="text-xs text-[#7A7090]">{plan.period}</span>
              </div>

              <div className="w-full h-[1px] bg-[#EDE8F5]" />

              <ul className="flex flex-col gap-2 mt-1 flex-1">
                {plan.features.map(feat => (
                  <li key={feat} className="flex items-center gap-2 text-xs text-[#2A2140]">
                    <Check size={13} className="text-[#5BBFB8] flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Channels + Costs - compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          <motion.div
            className="p-4 bg-white border border-[#EDE8F5]"
            style={{ boxShadow: '0 2px 10px rgba(42,33,64,0.04)' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Megaphone size={14} className="text-[#7B5EA7]" />
              <h3 className="font-semibold text-xs uppercase tracking-wider text-[#7B5EA7]">Canais de Aquisição</h3>
            </div>
            <div className="flex flex-col gap-1.5">
              {channels.map((ch, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-[#7B5EA7] flex-shrink-0 mt-1.5" style={{ opacity: 0.4 }} />
                  <p className="text-xs text-[#7A7090]">
                    <span className="font-semibold text-[#2A2140]">{ch.label}</span>  - {ch.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="p-4 bg-white border border-[#EDE8F5]"
            style={{ boxShadow: '0 2px 10px rgba(42,33,64,0.04)' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Wallet size={14} className="text-[#5BBFB8]" />
              <h3 className="font-semibold text-xs uppercase tracking-wider text-[#5BBFB8]">Estrutura de Custos</h3>
            </div>
            <div className="flex flex-col gap-1.5">
              {costs.map((cost, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#5BBFB8] flex-shrink-0" style={{ opacity: 0.4 }} />
                    <span className="text-xs text-[#2A2140]">{cost.label}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#2A2140] tabular-nums">{cost.value}</span>
                </div>
              ))}
              <div className="border-t border-[#EDE8F5] pt-1.5 mt-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#2A2140]">Total estimado</span>
                <span className="text-xs font-bold text-[#7B5EA7]">~R$ 1.400/mês</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </SlideWrapper>
  )
}
