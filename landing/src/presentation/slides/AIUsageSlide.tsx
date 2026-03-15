import { motion } from 'framer-motion'
import { Brain, Server, Database, Eye, Cpu, FileSearch, Layers, ArrowRight } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'
import { AccentShapes } from '../components/AccentShapes'

const architecture = [
  {
    icon: Server,
    title: 'VPS Dedicado',
    desc: 'Modelo local quantizado (GGUF 4-bit) rodando em VPS próprio com GPU dedicada, garantindo baixa latência e controle total sobre inferência.',
    color: '#7B5EA7',
    tag: 'Infraestrutura',
  },
  {
    icon: Database,
    title: 'Dataset Veterinário  - 5 TB',
    desc: 'Fine-tuning com 5 TB de dados obtidos via scraping de artigos científicos, protocolos clínicos, bulas veterinárias e bases de saúde animal.',
    color: '#5BBFB8',
    tag: 'Treinamento',
  },
  {
    icon: Eye,
    title: 'GPT-5.4  - Vision API',
    desc: 'Implementação híbrida com GPT-5.4 para reconhecimento de imagem (identificação de raça por foto) via Vision API com confiança percentual.',
    color: '#7B5EA7',
    tag: 'Multimodal',
  },
  {
    icon: Layers,
    title: 'Pipeline Híbrido',
    desc: 'Modelo local processa análise de saúde e cronograma veterinário; GPT-5.4 processa visão computacional. Orquestração via Edge Functions.',
    color: '#5BBFB8',
    tag: 'Arquitetura',
  },
]

const specs = [
  { icon: Cpu, label: 'Quantização', value: 'GGUF Q4_K_M' },
  { icon: Database, label: 'Dataset', value: '5 TB scraping' },
  { icon: FileSearch, label: 'Fontes', value: 'PubMed, CRMV, WSAVA' },
  { icon: Layers, label: 'Integração', value: 'Híbrida local + GPT-5.4' },
]

export function AIUsageSlide() {
  return (
    <SlideWrapper maxWidth="wide" padding="compact">
      <AccentShapes variant="lines" />

      <div className="flex flex-col items-center gap-6 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Brain size={12} />
          Arquitetura de IA
        </motion.span>

        <motion.h2
          className="font-display font-bold text-[#2A2140] text-center"
          style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Modelo quantizado com <span className="text-[#7B5EA7]">fine-tuning veterinário</span>
        </motion.h2>

        <motion.p
          className="text-sm text-[#7A7090] text-center max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          IA própria treinada com 5 TB de documentos científicos veterinários,
          rodando em VPS dedicado com implementação híbrida GPT-5.4 para visão computacional.
        </motion.p>

        {/* Specs bar */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 w-full max-w-4xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-[#EDE8F5]"
              style={{ boxShadow: '0 2px 8px rgba(42,33,64,0.04)' }}
            >
              <spec.icon size={14} className="text-[#7B5EA7] flex-shrink-0" />
              <span className="text-[10px] font-semibold text-[#7A7090] uppercase tracking-wider">{spec.label}</span>
              <span className="text-xs font-semibold text-[#2A2140]">{spec.value}</span>
            </div>
          ))}
        </motion.div>

        {/* Architecture cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl">
          {architecture.map((item, i) => (
            <motion.div
              key={item.title}
              className="relative p-5 bg-white border border-[#EDE8F5] overflow-hidden"
              style={{ boxShadow: '0 4px 16px rgba(42,33,64,0.05)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{ backgroundColor: item.color }}
              />

              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${item.color}12` }}
                >
                  <item.icon size={20} style={{ color: item.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm text-[#2A2140]">{item.title}</h3>
                    <span
                      className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A7090] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.div
          className="p-3 max-w-xl text-center border border-[#EDE8F5] bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-xs text-[#7A7090] flex items-center justify-center gap-2">
            <ArrowRight size={12} className="text-[#7B5EA7]" />
            Toda informação veterinária gerada por IA é validada por equipe veterinária antes de ser apresentada ao tutor.
          </p>
        </motion.div>
      </div>
    </SlideWrapper>
  )
}
