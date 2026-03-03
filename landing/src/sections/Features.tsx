import { Camera, Heart, Sparkles, Calendar, Shield, CalendarClock } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import SectionHeading from '../components/SectionHeading'
import FeatureCard from '../components/FeatureCard'

const features = [
  {
    icon: Camera,
    title: 'Identificação de Raça por IA',
    description: 'Tire uma foto do pet e a IA identifica a raça automaticamente com alta precisão, usando visão computacional avançada.',
    iconBg: 'rgba(123, 94, 167, 0.10)',
    iconColor: '#7B5EA7',
  },
  {
    icon: Heart,
    title: 'Perfil de Saúde da Raça',
    description: 'Conheça predisposições genéticas, expectativa de vida e os cuidados específicos que a raça do seu pet precisa.',
    iconBg: 'rgba(239, 68, 68, 0.10)',
    iconColor: '#EF4444',
  },
  {
    icon: Sparkles,
    title: 'Cuidados Personalizados',
    description: 'Recomendações de alimentação, exercícios e higiene adaptadas ao perfil único do seu pet, geradas pela IA.',
    iconBg: 'rgba(91, 191, 184, 0.10)',
    iconColor: '#3A9E97',
  },
  {
    icon: Calendar,
    title: 'Cronograma de 5 Anos',
    description: 'Plano completo de vacinas, consultas e marcos de saúde para os próximos 5 anos, personalizado para cada raça.',
    iconBg: 'rgba(245, 158, 11, 0.10)',
    iconColor: '#F59E0B',
  },
  {
    icon: Shield,
    title: 'Alertas de Saúde',
    description: 'Notificações inteligentes sobre vacinas vencendo, consultas pendentes e cuidados preventivos importantes.',
    iconBg: 'rgba(16, 185, 129, 0.10)',
    iconColor: '#10B981',
  },
  {
    icon: CalendarClock,
    title: 'Agendamento Inteligente',
    description: 'Agende consultas e procedimentos com base no plano de saúde do pet — nunca mais perca um cuidado essencial.',
    iconBg: 'rgba(123, 94, 167, 0.10)',
    iconColor: '#5A3E7A',
  },
]

// Seção de funcionalidades em grade 3×2
export default function Features() {
  return (
    <section id="features" className="py-24 lg:py-32" style={{ background: '#FAF8FC' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex justify-center">
            <SectionHeading
              badge="Funcionalidades"
              title="Tudo que seu pet precisa, em um só lugar."
              subtitle="Da identificação por foto ao plano de saúde completo — nossa plataforma cobre cada etapa do bem-estar do seu animal."
            />
          </div>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, i) => (
            <ScrollReveal key={feat.title} delay={i * 0.08}>
              <FeatureCard {...feat} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
