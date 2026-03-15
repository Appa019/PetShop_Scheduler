import { motion } from 'framer-motion'
import { Lightbulb, Search, PenTool, Layers, TestTube } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const stages = [
  { icon: Search, title: 'Empatizar', desc: 'Entrevistas com tutores e veterinários do 8Patas para entender dores reais', color: '#7B5EA7' },
  { icon: Lightbulb, title: 'Definir', desc: 'Mapeamento das dores: falta de acompanhamento preventivo e perda de clientes', color: '#5BBFB8' },
  { icon: PenTool, title: 'Idear', desc: 'Brainstorm de soluções - plataforma com IA emergiu como mais viável', color: '#7B5EA7' },
  { icon: Layers, title: 'Prototipar', desc: 'MVP funcional com React, Supabase e OpenAI - testável por tutores reais', color: '#5BBFB8' },
  { icon: TestTube, title: 'Testar', desc: 'Validação com usuários da base do pet shop - iteração contínua no produto', color: '#7B5EA7' },
]

export function DesignThinkingSlide() {
  return (
    <SlideWrapper>
      <div className="flex flex-col items-center gap-10 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Metodologia
        </motion.span>

        <motion.h2
          className="font-display font-bold text-3xl md:text-4xl text-[#2A2140] text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-[#7B5EA7]">Design Thinking</span> aplicado
        </motion.h2>

        <div className="flex flex-col gap-0 w-full max-w-2xl">
          {stages.map((stage, i) => (
            <div key={stage.title} className="relative">
              {/* Connector line */}
              {i < stages.length - 1 && (
                <div className="timeline-connector" />
              )}

              <motion.div
                className="flex items-start gap-5 py-4 relative z-10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div
                  className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${stage.color}15` }}
                >
                  <stage.icon size={20} style={{ color: stage.color }} />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#7A7090] uppercase tracking-wider">Etapa {i + 1}</span>
                    <span className="font-display font-bold text-base text-[#2A2140]">{stage.title}</span>
                  </div>
                  <p className="text-sm text-[#7A7090] leading-relaxed">{stage.desc}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  )
}
