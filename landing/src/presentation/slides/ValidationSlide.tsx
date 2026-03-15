import { motion } from 'framer-motion'
import { FlaskConical, Users, BarChart3, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const validationMethods = [
  {
    icon: Users,
    title: 'Testes com Usuários',
    desc: 'Protótipo funcional testado com tutores reais da clínica 8Patas',
    details: ['5 tutores beta-testers', 'Tarefas: cadastro, agendamento, IA', 'Feedback qualitativo coletado'],
  },
  {
    icon: BarChart3,
    title: 'Métricas de Sucesso',
    desc: 'KPIs definidos para validar product-market fit',
    details: ['Taxa de conclusão de tarefas > 80%', 'NPS > 50 nos primeiros 30 dias', 'Retenção semanal > 60%'],
  },
  {
    icon: MessageSquare,
    title: 'Feedback Loop',
    desc: 'Ciclo contínuo de coleta e aplicação de melhorias',
    details: ['Formulário in-app pós-tarefa', 'Entrevistas quinzenais', 'Iteração em sprints de 2 semanas'],
  },
]

const validationSteps = [
  { label: 'Hipótese', color: '#7B5EA7' },
  { label: 'Protótipo', color: '#7B5EA7' },
  { label: 'Teste', color: '#5BBFB8' },
  { label: 'Métricas', color: '#5BBFB8' },
  { label: 'Iteração', color: '#7B5EA7' },
]

export function ValidationSlide() {
  return (
    <SlideWrapper>
      <div className="flex flex-col items-center gap-8 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FlaskConical size={12} />
          Validação
        </motion.span>

        <motion.h2
          className="font-display font-bold text-3xl md:text-4xl text-[#2A2140] text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Como <span className="text-[#7B5EA7]">validamos</span>
        </motion.h2>

        {/* Validation flow */}
        <motion.div
          className="flex items-center gap-2 flex-wrap justify-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {validationSteps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <span
                className="px-3 py-1.5 text-xs font-semibold text-white"
                style={{ backgroundColor: step.color }}
              >
                {step.label}
              </span>
              {i < validationSteps.length - 1 && (
                <ArrowRight size={14} className="text-[#C4BFD0]" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl">
          {validationMethods.map((method, i) => (
            <motion.div
              key={method.title}
              className="glass-card p-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.08 }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center mb-3"
                style={{ backgroundColor: 'rgba(123,94,167,0.10)' }}
              >
                <method.icon size={18} className="text-[#7B5EA7]" />
              </div>
              <h3 className="font-semibold text-sm text-[#2A2140] mb-1">{method.title}</h3>
              <p className="text-xs text-[#7A7090] mb-3">{method.desc}</p>
              <ul className="flex flex-col gap-1.5">
                {method.details.map((detail, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-[#2A2140]">
                    <CheckCircle size={11} className="text-[#5BBFB8] flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  )
}
