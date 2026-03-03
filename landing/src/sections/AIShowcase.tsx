import { Brain, Eye, CalendarCheck, CheckCircle2 } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import SectionHeading from '../components/SectionHeading'

const capabilities = [
  {
    icon: Eye,
    title: 'Vision API',
    description: 'Analisa a foto do pet com precisão, identifica a raça e retorna confiança percentual em tempo real.',
    color: '#7B5EA7',
    bg: 'rgba(123, 94, 167, 0.08)',
  },
  {
    icon: Brain,
    title: 'Análise de Saúde',
    description: 'Gera um perfil completo baseado na raça: predisposições genéticas, expectativa de vida e cuidados específicos.',
    color: '#5BBFB8',
    bg: 'rgba(91, 191, 184, 0.08)',
  },
  {
    icon: CalendarCheck,
    title: 'Agenda Inteligente',
    description: 'Cria um cronograma personalizado de 5 anos com vacinas, consultas e cuidados preventivos na ordem certa.',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.08)',
  },
]

// Linha de resultado da IA com ícone e texto
function AIResultRow({ icon, text, highlight }: { icon: string; text: string; highlight?: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-[#EDE8F5] last:border-0">
      <span className="text-base flex-shrink-0 w-5 text-center">{icon}</span>
      <p className="text-sm text-[#7A7090] leading-relaxed">
        {text}
        {highlight && (
          <strong className="text-[#2A2140] font-semibold"> {highlight}</strong>
        )}
      </p>
    </div>
  )
}

// Seção "Inteligência Artificial" — duas colunas com capacidades e card de exemplo
export default function AIShowcase() {
  return (
    <section className="py-24 lg:py-32" style={{ background: '#FAF8FC' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex justify-center">
            <SectionHeading
              badge="Inteligência Artificial"
              title="Três camadas de IA trabalhando pelo seu pet."
              subtitle="O GPT-5.2 analisa, interpreta e planeja — para que você só precise cuidar."
            />
          </div>
        </ScrollReveal>

        <div className="mt-14 grid lg:grid-cols-2 gap-12 items-center">

          {/* Coluna esquerda — capacidades */}
          <div className="flex flex-col gap-5">
            {capabilities.map((cap, i) => (
              <ScrollReveal key={cap.title} delay={i * 0.1}>
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-[#EDE8F5] bg-white hover:-translate-y-0.5 transition-transform duration-300"
                  style={{ boxShadow: '0 2px 12px rgba(123,94,167,0.06)' }}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: cap.bg }}
                  >
                    <cap.icon size={18} style={{ color: cap.color }} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-[#2A2140] text-sm mb-1">{cap.title}</p>
                    <p className="text-sm text-[#7A7090] leading-relaxed">{cap.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Coluna direita — card de output da IA */}
          <ScrollReveal delay={0.25}>
            <div
              className="glass-card p-7 relative overflow-hidden"
              style={{
                borderLeft: '3px solid #7B5EA7',
                boxShadow: '0 8px 40px rgba(123, 94, 167, 0.14), 0 2px 8px rgba(123, 94, 167, 0.08)',
              }}
            >
              {/* Blur decorativo */}
              <div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(123,94,167,0.08) 0%, transparent 70%)' }}
                aria-hidden="true"
              />

              {/* Header do card */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #7B5EA7, #5A3E7A)' }}>
                  <Brain size={14} className="text-white" />
                </div>
                <div>
                  <p className="font-display font-bold text-[#2A2140] text-sm">Análise da IA</p>
                  <p className="text-[10px] text-[#7A7090] font-mono">GPT-5.2 · Vision API</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <CheckCircle2 size={13} style={{ color: '#10B981' }} />
                  <span className="text-[10px] text-[#10B981] font-semibold">Concluído</span>
                </div>
              </div>

              {/* Resultados */}
              <div className="flex flex-col">
                <AIResultRow icon="🔍" text="Raça identificada:" highlight="Golden Retriever" />
                <AIResultRow icon="📊" text="Confiança da análise:" highlight="94,2%" />
                <AIResultRow icon="❤️" text="Expectativa de vida:" highlight="10 a 12 anos" />
                <AIResultRow icon="⚠️" text="Predisposições detectadas:" highlight="Displasia coxofemoral, Obesidade" />
                <AIResultRow icon="📅" text="Próxima vacina:" highlight="V10 em 15 dias" />
                <AIResultRow icon="🦷" text="Próxima limpeza dental:" highlight="20 de janeiro" />
                <AIResultRow icon="🥗" text="Dieta recomendada:" highlight="Ração premium — 380g/dia" />
              </div>

              {/* Rodapé do card */}
              <div className="mt-4 pt-4 border-t border-[#EDE8F5] flex items-center justify-between">
                <p className="text-[11px] text-[#7A7090]">Cronograma de 5 anos gerado</p>
                <span className="text-[10px] px-2 py-1 rounded-full font-semibold"
                  style={{ background: 'rgba(123, 94, 167, 0.10)', color: '#7B5EA7' }}>
                  57 eventos programados
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
