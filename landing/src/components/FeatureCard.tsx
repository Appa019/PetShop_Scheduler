import type { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  iconBg?: string
  iconColor?: string
}

// Card de funcionalidade com ícone colorido, título e descrição
export default function FeatureCard({
  icon: Icon,
  title,
  description,
  iconBg = 'rgba(123, 94, 167, 0.10)',
  iconColor = '#7B5EA7',
}: FeatureCardProps) {
  return (
    <div className="glass-card p-6 flex flex-col gap-4 group cursor-default hover:-translate-y-0.5 transition-transform duration-300">
      {/* Ícone em círculo colorido */}
      <div
        className="w-11 h-11 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={20} style={{ color: iconColor }} strokeWidth={1.75} />
      </div>

      {/* Conteúdo textual */}
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display font-semibold text-[#2A2140] text-base leading-snug">
          {title}
        </h3>
        <p className="text-sm text-[#7A7090] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}
