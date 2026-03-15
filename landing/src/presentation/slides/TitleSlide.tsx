import { motion } from 'framer-motion'
import { SlideWrapper } from '../components/SlideWrapper'

const participants = [
  'Guilherme Oliveira',
  'Arthur Sampaio',
  'Pedro Pestana',
  'Lucas Maia',
  'Gustavo Carvalho',
]

export function TitleSlide() {
  return (
    <SlideWrapper>
      <div className="flex flex-col items-center text-center gap-8">
        <motion.img
          src="/logo.png"
          alt="8Patas"
          className="h-24 w-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />

        <motion.h1
          className="font-display font-bold text-[#2A2140] leading-tight"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          8Patas - Plataforma Veterinária
          <br />
          <span className="text-[#7B5EA7]">com Inteligência Artificial</span>
        </motion.h1>

        <motion.p
          className="text-lg text-[#7A7090]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Projeto de Intraempreendedorismo - FGV
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-3 mt-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          {participants.map((name, i) => (
            <motion.span
              key={name}
              className="glass-card px-4 py-2 text-sm font-medium text-[#2A2140]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
            >
              {name}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </SlideWrapper>
  )
}
