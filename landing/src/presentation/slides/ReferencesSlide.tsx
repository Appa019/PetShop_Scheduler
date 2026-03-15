import { motion } from 'framer-motion'
import { BookOpen, ExternalLink, GraduationCap } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const references = [
  'ABINPET - Associação Brasileira da Indústria de Produtos para Animais de Estimação (2024)',
  'IPB - Instituto Pet Brasil: Censo Pet 2024',
  'RIES, Eric. The Lean Startup. Crown Business, 2011',
  'OSTERWALDER, A. Business Model Generation. Wiley, 2010',
  'BROWN, Tim. Design Thinking. Harvard Business Review, 2008',
  'OpenAI API Documentation - Responses API (2025)',
  'Supabase Documentation - Edge Functions & Auth (2025)',
]

const fgvReferences = [
  'DORNELAS, J. Empreendedorismo Corporativo. Rio de Janeiro: Elsevier, 2015',
  'HASHIMOTO, M. Espírito Empreendedor nas Organizações. São Paulo: Saraiva, 2013',
  'PINCHOT, G. Intrapreneuring: Why You Don\'t Have to Leave the Corporation to Become an Entrepreneur. Berrett-Koehler, 2000',
  'BLANK, S. The Four Steps to the Epiphany. K&S Ranch, 2013',
  'CHRISTENSEN, C. The Innovator\'s Dilemma. Harvard Business Review Press, 2016',
  'Material eClass FGV - Módulos de Intraempreendedorismo e Inovação Corporativa (2025)',
]

export function ReferencesSlide() {
  return (
    <SlideWrapper bg="lavanda">
      <div className="flex flex-col items-center gap-8 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BookOpen size={12} />
          Referências
        </motion.span>

        <motion.h2
          className="font-display font-bold text-3xl md:text-4xl text-[#2A2140] text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Referências
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-4xl">
          {/* General references */}
          <motion.div
            className="glass-card p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <ExternalLink size={14} className="text-[#7B5EA7]" />
              <h3 className="font-semibold text-sm text-[#2A2140]">Bibliografia & Dados</h3>
            </div>
            <ul className="flex flex-col gap-2">
              {references.map((ref, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-2 text-xs text-[#7A7090]"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                >
                  <span className="w-1 h-1 rounded-full bg-[#7B5EA7] mt-1.5 flex-shrink-0" />
                  {ref}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* FGV / discipline references */}
          <motion.div
            className="glass-card p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap size={14} className="text-[#5BBFB8]" />
              <h3 className="font-semibold text-sm text-[#2A2140]">Referências da Disciplina (FGV)</h3>
            </div>
            <ul className="flex flex-col gap-2">
              {fgvReferences.map((ref, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-2 text-xs text-[#7A7090]"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.04 }}
                >
                  <span className="w-1 h-1 rounded-full bg-[#5BBFB8] mt-1.5 flex-shrink-0" />
                  {ref}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Thank you */}
        <motion.div
          className="text-center mt-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="font-display font-bold text-2xl text-[#7B5EA7] mb-2">Obrigado!</h3>
          <p className="text-sm text-[#7A7090]">
            8Patas - Plataforma Veterinária com Inteligência Artificial
          </p>
        </motion.div>
      </div>
    </SlideWrapper>
  )
}
