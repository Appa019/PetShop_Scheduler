import { motion } from 'framer-motion'
import { AlertTriangle, Lightbulb, Gem, Shield, Users, BarChart3, Share2, Wallet, DollarSign, Briefcase } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'

const canvas = [
  { icon: AlertTriangle, title: 'Problema', content: 'Custos veterinários imprevisíveis para tutores; receita irregular do petshop; falta de acompanhamento preventivo', color: '#E74C3C' },
  { icon: Lightbulb, title: 'Solução', content: 'Plataforma com IA que identifica raça, gera perfil de saúde e cronograma preventivo de 5 anos', color: '#7B5EA7' },
  { icon: Gem, title: 'Proposta de Valor', content: 'Transformar cuidado reativo em preventivo  - saúde personalizada com IA, sem esforço para o tutor', color: '#5BBFB8' },
  { icon: Shield, title: 'Vantagem Competitiva', content: 'IA + dados veterinários, histórico digital do pet, integração clínica + plataforma, personalização dos cuidados', color: '#7B5EA7' },
  { icon: Users, title: 'Segmento', content: 'Donos de cães e gatos, clientes da clínica 8Patas, tutores focados em prevenção, pets com predisposição genética', color: '#5BBFB8' },
  { icon: BarChart3, title: 'Métricas-Chave', content: 'Assinantes ativos, taxa de retenção, MRR, consultas preventivas', color: '#7B5EA7' },
  { icon: Share2, title: 'Canais', content: 'App/plataforma 8Patas, site da clínica, Instagram, base de clientes atual', color: '#5BBFB8' },
  { icon: Wallet, title: 'Estrutura de Custos', content: 'Desenvolvimento da plataforma, infraestrutura tecnológica, equipe veterinária, marketing e aquisição de clientes', color: '#E74C3C' },
  { icon: DollarSign, title: 'Fontes de Receita', content: 'Assinaturas mensais (básico/intermediário/premium), serviços extras, exames e produtos recomendados', color: '#5BBFB8' },
  { icon: Briefcase, title: 'Jobs do Cliente', content: 'Funcional: manter pet saudável · Operacional: organizar rotina de cuidados · Emocional: tranquilidade · Social: ser visto como tutor responsável', color: '#7B5EA7' },
]

export function LeanCanvasSlide() {
  return (
    <SlideWrapper maxWidth="wide" padding="compact">
      <div className="flex flex-col items-center gap-6 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Lean Canvas
        </motion.span>

        <motion.h2
          className="font-display font-bold text-[#2A2140] text-center"
          style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Modelo <span className="accent-underline text-[#7B5EA7]">Lean Canvas</span>
        </motion.h2>

        <div className="lean-canvas-grid w-full max-w-5xl">
          {canvas.map((cell, i) => (
            <motion.div
              key={cell.title}
              className="relative p-4 bg-white border border-[#EDE8F5] overflow-hidden"
              style={{ boxShadow: '0 2px 10px rgba(42,33,64,0.04)' }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              {/* Color accent top bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ backgroundColor: cell.color }}
              />

              <div className="flex items-center gap-2 mb-2 mt-1">
                <cell.icon size={14} style={{ color: cell.color }} />
                <h3 className="font-semibold text-xs uppercase tracking-wider" style={{ color: cell.color }}>
                  {cell.title}
                </h3>
              </div>
              <p className="text-xs text-[#2A2140] leading-relaxed">{cell.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  )
}
