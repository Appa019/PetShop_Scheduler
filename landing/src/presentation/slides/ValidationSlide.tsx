import { motion } from 'framer-motion'
import { FlaskConical, Users, BarChart3, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const validationMethods = [
  {
    icon: Users,
    title: 'Testes com Usuários',
    desc: 'Protótipo funcional testado com tutores reais da clínica 8Patas',
    details: ['5 tutores beta-testers', 'Tarefas: cadastro, agendamento, IA', 'Feedback qualitativo coletado'],
    color: '#7B5EA7',
  },
  {
    icon: BarChart3,
    title: 'Métricas de Sucesso',
    desc: 'KPIs definidos para validar product-market fit',
    details: ['Conclusão de tarefas > 80%', 'NPS > 50 nos primeiros 30 dias', 'Retenção semanal > 60%'],
    color: '#5BBFB8',
  },
  {
    icon: MessageSquare,
    title: 'Feedback Loop',
    desc: 'Ciclo contínuo de coleta e aplicação de melhorias',
    details: ['Formulário in-app pós-tarefa', 'Entrevistas quinzenais', 'Sprints de 2 semanas'],
    color: '#7B5EA7',
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
    <SlideWrapper maxWidth="wide">
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
          className="font-display font-bold text-[#2A2140] text-center"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Como <span className="accent-underline text-[#7B5EA7]">validamos</span>
        </motion.h2>

        {/* Validation flow - interactive visual */}
        <motion.div
          className="flex items-center gap-0 flex-wrap justify-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {validationSteps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-0">
              <motion.div
                className="flex items-center gap-2 px-4 py-2"
                style={{
                  backgroundColor: step.color,
                  boxShadow: `0 4px 12px ${step.color}30`,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.08 }}
              >
                <span className="text-[10px] font-bold text-white/50">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-xs font-semibold text-white">{step.label}</span>
              </motion.div>
              {i < validationSteps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  <ArrowRight size={16} className="text-[#C4BFD0] mx-1" />
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Methods cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl">
          {validationMethods.map((method, i) => (
            <motion.div
              key={method.title}
              className="relative p-5 bg-white border border-[#EDE8F5] overflow-hidden"
              style={{ boxShadow: '0 4px 16px rgba(42,33,64,0.05)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ backgroundColor: method.color }}
              />

              <div
                className="w-10 h-10 flex items-center justify-center mb-3"
                style={{ backgroundColor: `${method.color}12` }}
              >
                <method.icon size={18} style={{ color: method.color }} />
              </div>
              <h3 className="font-semibold text-sm text-[#2A2140] mb-1">{method.title}</h3>
              <p className="text-xs text-[#7A7090] mb-3">{method.desc}</p>
              <ul className="flex flex-col gap-1.5">
                {method.details.map((detail, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-[#2A2140]">
                    <CheckCircle size={12} className="text-[#5BBFB8] flex-shrink-0" />
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
