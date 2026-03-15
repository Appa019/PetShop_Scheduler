import { motion } from 'framer-motion'
import { Lightbulb, Search, PenTool, Layers, TestTube } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const stages = [
  { icon: Search, title: 'Empatizar', desc: 'Entrevistas com tutores e veterinários do 8Patas para entender dores reais', color: '#7B5EA7' },
  { icon: Lightbulb, title: 'Definir', desc: 'Mapeamento das dores: falta de acompanhamento preventivo e perda de clientes', color: '#5BBFB8' },
  { icon: PenTool, title: 'Idear', desc: 'Brainstorm de soluções  - plataforma com IA emergiu como mais viável', color: '#7B5EA7' },
  { icon: Layers, title: 'Prototipar', desc: 'MVP funcional com React, Supabase e OpenAI  - testável por tutores reais', color: '#5BBFB8' },
  { icon: TestTube, title: 'Testar', desc: 'Validação com usuários da base do pet shop  - iteração contínua', color: '#7B5EA7' },
]

export function DesignThinkingSlide() {
  return (
    <SlideWrapper maxWidth="wide">
      <div className="flex flex-col items-center gap-10 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Metodologia
        </motion.span>

        <motion.h2
          className="font-display font-bold text-[#2A2140] text-center"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="accent-underline text-[#7B5EA7]">Design Thinking</span> aplicado
        </motion.h2>

        {/* Diamond/hexagon flow - horizontal on desktop */}
        <div className="flex flex-col md:flex-row items-stretch gap-0 w-full max-w-5xl">
          {stages.map((stage, i) => (
            <div key={stage.title} className="flex flex-col md:flex-row items-center flex-1">
              <motion.div
                className="relative flex flex-col items-center text-center p-5 bg-white border border-[#EDE8F5] w-full"
                style={{
                  boxShadow: '0 4px 16px rgba(42,33,64,0.05)',
                  borderLeft: `3px solid ${stage.color}`,
                }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.12 }}
              >
                {/* Step number */}
                <span
                  className="absolute top-2 right-3 text-[10px] font-bold"
                  style={{ color: stage.color, opacity: 0.4 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div
                  className="w-12 h-12 flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${stage.color}12` }}
                >
                  <stage.icon size={22} style={{ color: stage.color }} />
                </div>

                <h3 className="font-display font-bold text-sm text-[#2A2140] mb-1">{stage.title}</h3>
                <p className="text-xs text-[#7A7090] leading-relaxed">{stage.desc}</p>
              </motion.div>

              {/* Arrow connector */}
              {i < stages.length - 1 && (
                <motion.div
                  className="flex items-center justify-center p-1 flex-shrink-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.25 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <div
                    className="w-[2px] h-6 md:w-6 md:h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, ${stage.color}, ${stages[i + 1].color})`,
                    }}
                  />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  )
}
