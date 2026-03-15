import { motion } from 'framer-motion'
import { Check, Star, Megaphone, Wallet } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'
import { PerspectiveCard } from '../components/PerspectiveCard'

const plans = [
  {
    name: 'Básico',
    price: 'R$ 29,90',
    period: '/mês',
    features: ['1 pet cadastrado', 'Identificação de raça por IA', 'Cronograma de vacinas', 'Lembretes por email'],
    highlighted: false,
  },
  {
    name: 'Família',
    price: 'R$ 49,90',
    period: '/mês',
    features: ['Até 3 pets', 'Tudo do Básico', 'Perfil de saúde completo', 'Suporte prioritário', 'Descontos na clínica'],
    highlighted: true,
  },
  {
    name: 'Premium',
    price: 'R$ 79,90',
    period: '/mês',
    features: ['Pets ilimitados', 'Tudo do Família', 'Consultas IA ilimitadas', 'Teleconsulta veterinária', 'Check-up semestral grátis'],
    highlighted: false,
  },
]

const channels = [
  { label: 'Clínica física', desc: 'Clientes existentes da 8Patas - conversão direta' },
  { label: 'Instagram & WhatsApp', desc: 'Conteúdo educativo + atendimento direto' },
  { label: 'Google Ads local', desc: 'Tutores buscando veterinários na região' },
  { label: 'Parcerias', desc: 'Pet shops e ONGs parceiras para indicação' },
]

const costs = [
  { label: 'Infraestrutura cloud', value: 'R$ 200/mês', desc: 'Supabase Pro + Vercel' },
  { label: 'API OpenAI', value: 'R$ 150/mês', desc: 'Análises de IA por consulta' },
  { label: 'Domínio + Email', value: 'R$ 30/mês', desc: 'Domínio .com.br + SMTP' },
  { label: 'Marketing digital', value: 'R$ 500/mês', desc: 'Google Ads + conteúdo social' },
]

export function BusinessModelSlide() {
  return (
    <SlideWrapper>
      <div className="flex flex-col items-center gap-8 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Modelo de Negócio
        </motion.span>

        <motion.h2
          className="font-display font-bold text-3xl md:text-4xl text-[#2A2140] text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Planos, <span className="text-[#7B5EA7]">Canais</span> & Custos
        </motion.h2>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl items-stretch">
          {plans.map((plan, i) => (
            <PerspectiveCard key={plan.name} delay={0.2 + i * 0.08}>
              <div className={`p-5 flex flex-col gap-3 h-full ${plan.highlighted ? 'ring-2 ring-[#7B5EA7]' : ''}`}>
                {plan.highlighted && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#7B5EA7]">
                    <Star size={10} /> Mais popular
                  </span>
                )}
                <h3 className="font-display font-bold text-lg text-[#2A2140]">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-2xl text-[#2A2140]">{plan.price}</span>
                  <span className="text-xs text-[#7A7090]">{plan.period}</span>
                </div>
                <ul className="flex flex-col gap-1.5 mt-1">
                  {plan.features.map(feat => (
                    <li key={feat} className="flex items-center gap-2 text-xs text-[#2A2140]">
                      <Check size={12} className="text-[#5BBFB8] flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </PerspectiveCard>
          ))}
        </div>

        {/* Channels + Costs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-4xl">
          {/* Channels */}
          <motion.div
            className="glass-card p-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Megaphone size={15} className="text-[#7B5EA7]" />
              <h3 className="font-semibold text-sm text-[#2A2140]">Canais de Aquisição</h3>
            </div>
            <div className="flex flex-col gap-2">
              {channels.map((ch, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#7B5EA7] mt-1.5 flex-shrink-0" />
                  <p className="text-xs text-[#7A7090]">
                    <span className="font-semibold text-[#2A2140]">{ch.label}</span> - {ch.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Costs */}
          <motion.div
            className="glass-card p-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Wallet size={15} className="text-[#5BBFB8]" />
              <h3 className="font-semibold text-sm text-[#2A2140]">Estrutura de Custos</h3>
            </div>
            <div className="flex flex-col gap-2">
              {costs.map((cost, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="w-1 h-1 rounded-full bg-[#5BBFB8] mt-1.5 flex-shrink-0" />
                    <p className="text-xs text-[#7A7090]">
                      <span className="font-semibold text-[#2A2140]">{cost.label}</span> - {cost.desc}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#2A2140] whitespace-nowrap">{cost.value}</span>
                </div>
              ))}
              <div className="border-t border-[#EDE8F5] pt-2 mt-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#2A2140]">Total estimado</span>
                <span className="text-xs font-bold text-[#7B5EA7]">~R$ 880/mês</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </SlideWrapper>
  )
}
