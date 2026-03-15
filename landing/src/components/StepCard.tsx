interface StepCardProps {
  number: string
  title: string
  description: string
}

// Card de passo numerado para a seção "Como Funciona"
export default function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-300">
      {/* Número grande decorativo ao fundo */}
      <span
        className="absolute -top-2 -right-1 font-display font-bold text-7xl leading-none select-none pointer-events-none"
        style={{ color: 'rgba(123, 94, 167, 0.06)' }}
        aria-hidden="true"
      >
        {number}
      </span>

      {/* Círculo numerado */}
      <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: '#7B5EA7' }}>
        <span className="text-white font-display font-bold text-sm">{number}</span>
      </div>

      {/* Conteúdo */}
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
