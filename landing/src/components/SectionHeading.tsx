interface SectionHeadingProps {
  badge: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
}

// Cabeçalho padronizado de seção com badge, título e subtítulo
export default function SectionHeading({ badge, title, subtitle, align = 'center' }: SectionHeadingProps) {
  const isCenter = align === 'center'

  return (
    <div className={`flex flex-col gap-4 ${isCenter ? 'items-center text-center' : 'items-start text-left'}`}>
      <span className="section-badge">{badge}</span>
      <h2
        className="font-display font-bold text-[#2A2140] leading-tight"
        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg text-[#7A7090] leading-relaxed ${isCenter ? 'max-w-2xl' : 'max-w-xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
