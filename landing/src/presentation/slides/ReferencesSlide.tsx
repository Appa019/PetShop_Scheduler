import { motion } from 'framer-motion'
import { ExternalLink, GraduationCap, Heart } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'
import { AccentShapes } from '../components/AccentShapes'

const references = [
  'ABINPET – Panorama do mercado pet brasileiro',
  'Instituto Pet Brasil – Dados sobre população de pets no Brasil',
  'Mintel Group Ltd – Brazil pets grooming & healthcare market report (2023)',
  'TGM Research – Pet care survey – Brazil',
  'OECD – Oslo Manual (2018)',
  'Oito Patas Pet Shop – Site oficial da empresa',
]

const fgvReferences = [
  'DORNELAS, J. Empreendedorismo Corporativo. Rio de Janeiro: Elsevier, 2015',
  'HASHIMOTO, M. Espírito Empreendedor nas Organizações. São Paulo: Saraiva, 2013',
  'PINCHOT, G. Intrapreneuring. Berrett-Koehler, 2000',
  'BLANK, S. The Four Steps to the Epiphany. K&S Ranch, 2013',
  'CHRISTENSEN, C. The Innovator\'s Dilemma. HBR Press, 2016',
  'Material eClass FGV - Módulos de Intraempreendedorismo (2025)',
]

export function ReferencesSlide() {
  return (
    <SlideWrapper bg="lavanda" maxWidth="wide" padding="compact">
      <AccentShapes variant="circles" />

      <div className="flex flex-col items-center gap-6 w-full">
        {/* Thank you hero section */}
        <motion.div
          className="text-center mb-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-[#7B5EA7]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Heart size={28} className="text-white" />
          </motion.div>

          <h2
            className="font-display font-bold text-[#7B5EA7]"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          >
            Obrigado!
          </h2>
          <p className="text-sm text-[#7A7090] mt-1">
            8Patas  - Plataforma Veterinária com Inteligência Artificial
          </p>
        </motion.div>

        {/* References in two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          <motion.div
            className="p-4 bg-white border border-[#EDE8F5]"
            style={{ boxShadow: '0 2px 10px rgba(42,33,64,0.04)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <ExternalLink size={13} className="text-[#7B5EA7]" />
              <h3 className="font-semibold text-xs uppercase tracking-wider text-[#7B5EA7]">Bibliografia & Dados</h3>
            </div>
            <ul className="flex flex-col gap-1.5">
              {references.map((ref, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-2 text-[11px] text-[#7A7090] leading-relaxed"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.03 }}
                >
                  <span className="w-1 h-1 bg-[#7B5EA7] flex-shrink-0 mt-1.5" style={{ opacity: 0.4 }} />
                  {ref}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="p-4 bg-white border border-[#EDE8F5]"
            style={{ boxShadow: '0 2px 10px rgba(42,33,64,0.04)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap size={13} className="text-[#5BBFB8]" />
              <h3 className="font-semibold text-xs uppercase tracking-wider text-[#5BBFB8]">Referências FGV</h3>
            </div>
            <ul className="flex flex-col gap-1.5">
              {fgvReferences.map((ref, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-2 text-[11px] text-[#7A7090] leading-relaxed"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.03 }}
                >
                  <span className="w-1 h-1 bg-[#5BBFB8] flex-shrink-0 mt-1.5" style={{ opacity: 0.4 }} />
                  {ref}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </SlideWrapper>
  )
}
