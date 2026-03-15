import { useState } from 'react'
import { Lock, LayoutDashboard, PawPrint, Camera, CalendarDays, Pill } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import SectionHeading from '../components/SectionHeading'

interface ScreenshotItem {
  file: string
  title: string
  description: string
  solidColor: string
  Icon: LucideIcon
}

const screenshots: ScreenshotItem[] = [
  {
    file: 'login.png',
    title: 'Tela de Login',
    description: 'Acesso seguro com autenticação Supabase',
    solidColor: '#7B5EA7',
    Icon: Lock,
  },
  {
    file: 'dashboard.png',
    title: 'Dashboard Principal',
    description: 'Visão geral de todos os pets cadastrados',
    solidColor: '#5BBFB8',
    Icon: LayoutDashboard,
  },
  {
    file: 'pets-list.png',
    title: 'Lista de Pets',
    description: 'Todos os animais com status de saúde',
    solidColor: '#A68FCC',
    Icon: PawPrint,
  },
  {
    file: 'pet-registration.png',
    title: 'Cadastro com IA',
    description: 'Identificação automática da raça por foto',
    solidColor: '#F59E0B',
    Icon: Camera,
  },
  {
    file: 'scheduling.png',
    title: 'Agendamento',
    description: 'Cronograma inteligente de 5 anos',
    solidColor: '#EF4444',
    Icon: CalendarDays,
  },
  {
    file: 'profile.png',
    title: 'Perfil do Pet',
    description: 'Histórico completo e recomendações de saúde',
    solidColor: '#10B981',
    Icon: Pill,
  },
]

interface ScreenshotCardProps {
  item: ScreenshotItem
  index: number
}

function ScreenshotCard({ item, index }: ScreenshotCardProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="glass-card overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-default">
      {/* Image area - sharp corners */}
      <div className="relative h-44 overflow-hidden">
        {!imgError ? (
          <img
            src={`/screenshots/${item.file}`}
            alt={item.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Placeholder - solid color, no gradient */
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-3"
            style={{ background: item.solidColor }}
          >
            <item.Icon size={36} className="text-white/90" strokeWidth={1.5} />
            <span className="text-white/80 text-xs font-medium font-mono">screenshot em breve</span>
          </div>
        )}

        {/* Index overlay - sharp corners, no blur */}
        <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center text-[10px] font-bold text-white"
          style={{ background: 'rgba(0,0,0,0.45)' }}>
          {index + 1}
        </div>
      </div>

      {/* Caption */}
      <div className="p-4">
        <p className="font-display font-semibold text-[#2A2140] text-sm leading-snug">{item.title}</p>
        <p className="text-xs text-[#7A7090] mt-0.5">{item.description}</p>
      </div>
    </div>
  )
}

export default function Screenshots() {
  return (
    <section id="screenshots" className="py-24 lg:py-32" style={{ background: '#FAF8F5' }}>
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
