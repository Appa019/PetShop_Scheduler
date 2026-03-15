import { motion } from 'framer-motion'
import { SlideWrapper } from '../components/SlideWrapper'
import { HeroIllustration } from '../components/HeroIllustration'
import { AccentShapes } from '../components/AccentShapes'

const participants = [
  'Henry Felberg',
  'Jacqueline Zarzur',
  'Lucas Maia',
  'Mila Cardoso',
  'Pedro Pestana',
  'Sofia Travain',
  'Victoria Oliveira',
]

export function TitleSlide() {
  return (
    <SlideWrapper>
      <AccentShapes variant="circles" />

      <div className="slide-split">
        {/* Left: text content */}
        <div className="slide-split-content text-center lg:text-left">
          <motion.div
            className="section-badge self-center lg:self-start"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Projeto de Intraempreendedorismo  - FGV
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            8Patas
            <br />
            <span className="text-[#7B5EA7]">Plataforma Veterinária</span>
            <br />
            <span className="text-[#5BBFB8]" style={{ fontSize: '0.6em' }}>com Inteligência Artificial</span>
          </motion.h1>

          <motion.div
            className="flex flex-wrap gap-2 mt-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            {participants.map((name, i) => (
              <motion.span
                key={name}
                className="px-3 py-1.5 text-xs font-medium text-[#2A2140] border border-[#EDE8F5] bg-white/60"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.55 + i * 0.06 }}
              >
                {name}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Right: hero illustration */}
        <div className="slide-split-visual">
          <HeroIllustration className="w-full max-w-[380px]" />
        </div>
      </div>
    </SlideWrapper>
  )
}
