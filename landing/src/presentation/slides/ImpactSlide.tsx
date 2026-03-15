import { motion } from 'framer-motion'
import { Heart, Leaf, GraduationCap, HandHeart } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const impacts = [
  {
    icon: Heart,
    title: 'Saúde Animal',
    desc: 'Redução de doenças evitáveis através de vacinação e cuidados preventivos acompanhados por IA.',
  },
  {
    icon: HandHeart,
    title: 'Bem-Estar do Tutor',
    desc: 'Menos ansiedade e incerteza - o tutor sabe exatamente o que fazer e quando.',
  },
  {
    icon: GraduationCap,
    title: 'Educação',
    desc: 'Informações veterinárias confiáveis acessíveis a todos, combatendo desinformação.',
  },
  {
    icon: Leaf,
    title: 'Sustentabilidade',
    desc: 'Menos deslocamentos desnecessários ao vet, menos desperdício de medicamentos.',
  },
]

export function ImpactSlide() {
  return (
    <SlideWrapper bg="lavanda">
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
          className="font-display font-bold text-3xl md:text-4xl text-[#2A2140] text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Impacto além do <span className="text-[#7B5EA7]">negócio</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
          {impacts.map((impact, i) => (
            <motion.div
              key={impact.title}
              className="glass-card p-6 flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <div
                className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(123,94,167,0.10)' }}
              >
                <impact.icon size={20} className="text-[#7B5EA7]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#2A2140]">{impact.title}</h3>
                <p className="text-sm text-[#7A7090] mt-1 leading-relaxed">{impact.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  )
}
