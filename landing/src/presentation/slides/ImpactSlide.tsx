import { motion } from 'framer-motion'
import { Heart, Leaf, GraduationCap, HandHeart } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'
import { AccentShapes } from '../components/AccentShapes'

const impacts = [
  {
    icon: Heart,
    title: 'Saúde Animal',
    desc: 'Redução de doenças evitáveis através de vacinação e cuidados preventivos acompanhados por IA.',
    color: '#7B5EA7',
    stat: '70%',
    statLabel: 'das doenças são evitáveis',
  },
  {
    icon: HandHeart,
    title: 'Bem-Estar do Tutor',
    desc: 'Menos ansiedade e incerteza  - o tutor sabe exatamente o que fazer e quando.',
    color: '#5BBFB8',
    stat: '24/7',
    statLabel: 'orientação disponível',
  },
  {
    icon: GraduationCap,
    title: 'Educação',
    desc: 'Informações veterinárias confiáveis acessíveis a todos, combatendo desinformação.',
    color: '#7B5EA7',
    stat: '100%',
    statLabel: 'validado por veterinários',
  },
  {
    icon: Leaf,
    title: 'Sustentabilidade',
    desc: 'Menos deslocamentos desnecessários ao vet, menos desperdício de medicamentos.',
    color: '#5BBFB8',
    stat: '-40%',
    statLabel: 'consultas emergenciais',
  },
]

export function ImpactSlide() {
  return (
    <SlideWrapper bg="lavanda" maxWidth="wide">
      <AccentShapes variant="circles" />

      <div className="flex flex-col items-center gap-10 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Heart size={12} />
          Impacto Social
        </motion.span>

        <motion.h2
          className="font-display font-bold text-[#2A2140] text-center"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Impacto além do <span className="accent-underline text-[#7B5EA7]">negócio</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
          {impacts.map((impact, i) => (
            <motion.div
              key={impact.title}
              className="relative bg-white p-6 border border-[#EDE8F5] overflow-hidden"
              style={{ boxShadow: '0 4px 20px rgba(42,33,64,0.06)' }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              {/* Side accent */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{ backgroundColor: impact.color }}
              />

              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${impact.color}12` }}
                >
                  <impact.icon size={22} style={{ color: impact.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display font-bold text-base text-[#2A2140]">{impact.title}</h3>
                    <span className="font-display font-bold text-lg" style={{ color: impact.color }}>
                      {impact.stat}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A7090]" style={{ opacity: 0.6 }}>{impact.statLabel}</p>
                  <p className="text-sm text-[#7A7090] mt-2 leading-relaxed">{impact.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  )
}
