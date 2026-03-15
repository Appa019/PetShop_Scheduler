import { motion } from 'framer-motion'
import { SlideWrapper } from '../components/SlideWrapper'

const canvas = [
  { title: 'Problema', content: 'Tutores não acompanham saúde preventiva; pet shops perdem clientes por falta de vínculo' },
  { title: 'Solução', content: 'Plataforma com IA que identifica raça, gera perfil de saúde e cronograma de 5 anos' },
  { title: 'Proposta de Valor', content: 'Saúde preventiva personalizada com IA, sem esforço para o tutor' },
  { title: 'Vantagem Injusta', content: 'Integração direta com pet shop físico + dados de saúde acumulados' },
  { title: 'Segmento', content: 'Tutores de pets 25-45 anos, classes B/C, regiões urbanas de SP' },
  { title: 'Métricas-Chave', content: 'Assinantes ativos, taxa de retenção, MRR, consultas via IA' },
  { title: 'Canais', content: 'Pet shop físico, Instagram, Google Ads, indicação de veterinários' },
  { title: 'Estrutura de Custos', content: 'API OpenAI, Supabase, Vercel, marketing digital, equipe dev' },
  { title: 'Fontes de Receita', content: 'Assinatura mensal (3 planos), comissão sobre consultas agendadas' },
]

export function LeanCanvasSlide() {
  return (
    <SlideWrapper>
      <div className="flex flex-col items-center gap-8 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Lean Canvas
        </motion.span>

        <motion.h2
          className="font-display font-bold text-3xl md:text-4xl text-[#2A2140] text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Modelo <span className="text-[#7B5EA7]">Lean Canvas</span>
        </motion.h2>

        <div className="lean-canvas-grid w-full max-w-5xl">
          {canvas.map((cell, i) => (
            <motion.div
              key={cell.title}
              className="glass-card p-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
            >
              <h3 className="font-semibold text-xs uppercase tracking-wider text-[#7B5EA7] mb-2">{cell.title}</h3>
              <p className="text-xs text-[#2A2140] leading-relaxed">{cell.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  )
}
