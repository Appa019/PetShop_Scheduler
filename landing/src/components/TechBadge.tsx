interface TechBadgeProps {
  label: string
}

// Pílula de tecnologia com estilo monoespaçado
export default function TechBadge({ label }: TechBadgeProps) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#F5F1FB] border border-[#EDE8F5] text-[#5A3E7A] text-xs font-mono font-medium transition-colors duration-200 hover:bg-[#EAE3F7]">
      {label}
    </span>
  )
}
