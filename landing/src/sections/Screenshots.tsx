import { useState } from 'react'
import ScrollReveal from '../components/ScrollReveal'
import SectionHeading from '../components/SectionHeading'

interface ScreenshotItem {
  file: string
  title: string
  description: string
  gradient: string
  emoji: string
}

const screenshots: ScreenshotItem[] = [
  {
    file: 'login.png',
    title: 'Tela de Login',
    description: 'Acesso seguro com autenticação JWT',
    gradient: 'linear-gradient(135deg, #7B5EA7 0%, #5A3E7A 100%)',
    emoji: '🔐',
  },
  {
    file: 'dashboard.png',
    title: 'Dashboard Principal',
    description: 'Visão geral de todos os pets cadastrados',
    gradient: 'linear-gradient(135deg, #5BBFB8 0%, #3A9E97 100%)',
    emoji: '📊',
  },
  {
    file: 'pets-list.png',
    title: 'Lista de Pets',
    description: 'Todos os animais com status de saúde',
    gradient: 'linear-gradient(135deg, #A68FCC 0%, #7B5EA7 100%)',
    emoji: '🐾',
  },
  {
    file: 'pet-registration.png',
    title: 'Cadastro com IA',
    description: 'Identificação automática da raça por foto',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    emoji: '📸',
  },
  {
    file: 'scheduling.png',
    title: 'Agendamento',
    description: 'Cronograma inteligente de 5 anos',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    emoji: '📅',
  },
  {
    file: 'profile.png',
    title: 'Perfil do Pet',
    description: 'Histórico completo e recomendações de saúde',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    emoji: '💊',
  },
]

interface ScreenshotCardProps {
  item: ScreenshotItem
  index: number
}

// Card de screenshot com fallback em gradiente colorido
function ScreenshotCard({ item, index }: ScreenshotCardProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="glass-card overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-default">
      {/* Área da imagem */}
      <div className="relative h-44 overflow-hidden rounded-t-[20px]">
        {!imgError ? (
          <img
            src={`/screenshots/${item.file}`}
            alt={item.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Placeholder quando a imagem ainda não existe */
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-3"
            style={{ background: item.gradient }}
          >
            <span className="text-4xl" aria-hidden="true">{item.emoji}</span>
            <span className="text-white/80 text-xs font-medium font-mono">screenshot em breve</span>
          </div>
        )}

        {/* Overlay de índice no canto */}
        <div className="absolute top-3 left-3 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
          {index + 1}
        </div>
      </div>

      {/* Legenda */}
      <div className="p-4">
        <p className="font-display font-semibold text-[#2A2140] text-sm leading-snug">{item.title}</p>
        <p className="text-xs text-[#7A7090] mt-0.5">{item.description}</p>
      </div>
    </div>
  )
}

// Seção de screenshots da interface
export default function Screenshots() {
  return (
    <section id="screenshots" className="py-24 lg:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex justify-center">
            <SectionHeading
              badge="Interface"
              title="Design pensado para tutores de pets."
              subtitle="Navegação intuitiva, informações claras e uma experiência que coloca o bem-estar do seu animal em primeiro lugar."
            />
          </div>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {screenshots.map((item, i) => (
            <ScrollReveal key={item.file} delay={i * 0.07}>
              <ScreenshotCard item={item} index={i} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
