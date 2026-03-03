import { ArrowRight, Github } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'

// Seção de chamada para ação com fundo roxo sólido e botão teal
export default function CTA() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" style={{ backgroundColor: '#7B5EA7' }}>
      {/* Pontos decorativos */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <div className="flex flex-col items-center gap-7">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.20)' }}>
              🐾 Comece hoje mesmo
            </span>

            <h2
              className="font-display font-bold text-white leading-tight"
              style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', letterSpacing: '-0.02em' }}
            >
              Pronto para cuidar melhor do seu pet?
            </h2>

            <p className="text-lg leading-relaxed max-w-xl" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Cadastre seu animal agora e deixe a IA gerar o plano de saúde completo —
              gratuito, sem necessidade de cartão de crédito.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <a
                href="/app/login"
                className="btn-teal text-base px-8 py-3.5"
              >
                Começar Agora
                <ArrowRight size={18} />
              </a>
              <a
                href="https://github.com/Appa019/PetShop_Scheduler"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-base transition-all duration-200 hover:scale-102"
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  border: '1.5px solid rgba(255,255,255,0.30)',
                  background: 'rgba(255,255,255,0.08)',
                }}
              >
                <Github size={18} />
                Ver no GitHub
              </a>
            </div>

            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.50)' }}>
              Código aberto · Sem dependências ocultas · Feito com cuidado
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
