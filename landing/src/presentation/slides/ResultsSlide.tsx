import { motion } from 'framer-motion'
import { TrendingUp, Building2, Heart, DollarSign, Users, Clock } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const roiMetrics = [
  { icon: DollarSign, value: '35%', label: 'Redução de no-shows', desc: 'Lembretes automáticos por email' },
  { icon: Users, value: '2x', label: 'Retenção de clientes', desc: 'Engajamento contínuo via plataforma' },
  { icon: Clock, value: '60%', label: 'Menos tempo administrativo', desc: 'Agendamento e cadastro automatizados' },
]

const benefits = {
  empresa: [
    'Receita recorrente via assinaturas digitais',
    'Base de dados para decisões estratégicas',
    'Diferenciação competitiva com IA',
    'Operação escalável sem aumento proporcional de custo',
  ],
  sociedade: [
    'Saúde preventiva acessível para pets',
    'Redução de abandono por custos veterinários inesperados',
    'Educação dos tutores sobre cuidados essenciais',
    'Modelo replicável para outras clínicas',
  ],
}

export function ResultsSlide() {
  return (
    <SlideWrapper bg="lavanda">
      <div className="flex flex-col items-center gap-8 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TrendingUp size={12} />
          Resultados Esperados
        </motion.span>

        <motion.h2
          className="font-display font-bold text-3xl md:text-4xl text-[#2A2140] text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Impacto <span className="text-[#7B5EA7]">projetado</span>
        </motion.h2>

        {/* ROI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl">
          {roiMetrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              className="glass-card p-5 text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: 'rgba(123,94,167,0.10)' }}
              >
                <metric.icon size={18} className="text-[#7B5EA7]" />
              </div>
              <p className="font-display font-bold text-2xl text-[#7B5EA7]">{metric.value}</p>
              <p className="text-sm font-semibold text-[#2A2140] mt-1">{metric.label}</p>
              <p className="text-xs text-[#7A7090] mt-0.5">{metric.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Benefits: empresa + sociedade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl">
          <motion.div
            className="glass-card p-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Building2 size={16} className="text-[#7B5EA7]" />
              <h3 className="font-semibold text-sm text-[#2A2140]">Para a Empresa</h3>
            </div>
            <ul className="flex flex-col gap-2">
              {benefits.empresa.map((b, i) => (
                <li key={i} className="text-xs text-[#7A7090] flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#7B5EA7] mt-1.5 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="glass-card p-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Heart size={16} className="text-[#5BBFB8]" />
              <h3 className="font-semibold text-sm text-[#2A2140]">Para a Sociedade</h3>
            </div>
            <ul className="flex flex-col gap-2">
              {benefits.sociedade.map((b, i) => (
                <li key={i} className="text-xs text-[#7A7090] flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#5BBFB8] mt-1.5 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </SlideWrapper>
  )
}
