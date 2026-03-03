import ScrollReveal from '../components/ScrollReveal'
import SectionHeading from '../components/SectionHeading'
import StepCard from '../components/StepCard'

const steps = [
  {
    number: '01',
    title: 'Cadastre seu Pet',
    description: 'Crie um perfil com foto, nome, idade e informações básicas do seu pet em menos de dois minutos.',
  },
  {
    number: '02',
    title: 'IA Analisa a Foto',
    description: 'Nossa IA baseada em GPT-5.2 identifica a raça automaticamente e gera um perfil completo de saúde.',
  },
  {
    number: '03',
    title: 'Confirme e Revise',
    description: 'Revise as informações geradas pela IA, ajuste o que precisar e confirme o perfil do seu pet.',
  },
  {
    number: '04',
    title: 'Agenda Inteligente',
    description: 'Receba um cronograma completo de cuidados para os próximos 5 anos e agende consultas com facilidade.',
  },
]

// Seção "Como Funciona" com 4 passos numerados
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex justify-center">
            <SectionHeading
              badge="Como Funciona"
              title="4 passos simples para começar."
              subtitle="Do cadastro ao plano de saúde completo — é rápido, intuitivo e personalizado para o seu pet."
            />
          </div>
        </ScrollReveal>

        {/* Linha conectora decorativa (apenas desktop) */}
        <div className="relative mt-12">
          <div
            className="hidden lg:block absolute top-8 left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #EDE8F5 20%, #EDE8F5 80%, transparent)' }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 0.1}>
                <StepCard {...step} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
