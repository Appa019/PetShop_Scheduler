import { motion } from 'framer-motion'
import { Brain, Code, FileText, MessageSquare, ArrowRight } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const usages = [
  {
    icon: Code,
    title: 'Desenvolvimento',
    desc: 'Claude Code para implementação do frontend React, Edge Functions e integrações Supabase.',
  },
  {
    icon: Brain,
    title: 'IA no Produto',
    desc: 'OpenAI para identificação de raça por foto, perfil de saúde e geração de cronograma veterinário.',
  },
  {
    icon: FileText,
    title: 'Documentação',
    desc: 'Geração de specs técnicos, migrations SQL e documentação de API com assistência de IA.',
  },
  {
    icon: MessageSquare,
    title: 'Pesquisa',
    desc: 'Validação de informações veterinárias e benchmarks de mercado com fontes verificadas.',
  },
]

export function AIUsageSlide() {
  return (
    <SlideWrapper>
      <div className="flex flex-col items-center gap-10 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Brain size={12} />
          Uso de IA
        </motion.span>

        <motion.h2
          className="font-display font-bold text-3xl md:text-4xl text-[#2A2140] text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Como usamos <span className="text-[#7B5EA7]">IA</span> neste projeto
        </motion.h2>

        <motion.p
          className="text-base text-[#7A7090] text-center max-w-xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Declaração transparente: utilizamos ferramentas de IA como aceleradores,
          com revisão humana em todas as etapas.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-3xl">
          {usages.map((usage, i) => (
            <motion.div
              key={usage.title}
              className="glass-card p-5 flex items-start gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(123,94,167,0.10)' }}
              >
                <usage.icon size={18} className="text-[#7B5EA7]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#2A2140]">{usage.title}</h3>
                <p className="text-xs text-[#7A7090] mt-1 leading-relaxed">{usage.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="glass-card p-4 max-w-xl text-center"
          style={{ backgroundColor: 'rgba(123,94,167,0.04)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-xs text-[#7A7090] flex items-center justify-center gap-2">
            <ArrowRight size={12} className="text-[#7B5EA7]" />
            Toda informação veterinária gerada por IA é sinalizada ao tutor e deve ser validada por um profissional.
          </p>
        </motion.div>
      </div>
    </SlideWrapper>
  )
}
