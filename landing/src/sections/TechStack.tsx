import { Monitor, Server, Cpu, Cloud } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import SectionHeading from '../components/SectionHeading'
import TechBadge from '../components/TechBadge'

const stacks = [
  {
    icon: Monitor,
    title: 'Frontend',
    color: '#7B5EA7',
    bg: 'rgba(123, 94, 167, 0.08)',
    techs: ['React 19', 'Vite 7', 'React Router 7', 'Framer Motion', 'Lucide Icons'],
  },
  {
    icon: Server,
    title: 'Backend',
    color: '#5BBFB8',
    bg: 'rgba(91, 191, 184, 0.08)',
    techs: ['Supabase Edge Functions', 'Deno / TypeScript', 'PostgreSQL', 'RLS Policies', 'Gmail SMTP'],
  },
  {
    icon: Cpu,
    title: 'Inteligência Artificial',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.08)',
    techs: ['OpenAI API', 'Responses API', 'Vision API', 'Web Search Tool'],
  },
  {
    icon: Cloud,
    title: 'Infraestrutura',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.08)',
    techs: ['Supabase', 'Vercel', 'pg_cron', 'Supabase Auth'],
  },
]

// Seção de stack tecnológica em grade 2×2
export default function TechStack() {
  return (
    <section id="tech-stack" className="py-24 lg:py-32" style={{ background: '#FAF8F5' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex justify-center">
            <SectionHeading
              badge="Tecnologias"
              title="Stack moderna para um produto robusto."
              subtitle="Cada tecnologia escolhida com propósito - da IA de ponta à infraestrutura confiável na nuvem."
            />
          </div>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stacks.map((stack, i) => (
            <ScrollReveal key={stack.title} delay={i * 0.1}>
              <div className="glass-card p-6 flex flex-col gap-4 hover:-translate-y-0.5 transition-transform duration-300">
                {/* Cabeçalho da categoria */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: stack.bg }}
                  >
                    <stack.icon size={16} style={{ color: stack.color }} strokeWidth={1.75} />
                  </div>
                  <p className="font-display font-semibold text-[#2A2140] text-sm">{stack.title}</p>
                </div>

                {/* Pílulas de tecnologia */}
                <div className="flex flex-wrap gap-2">
                  {stack.techs.map(tech => (
                    <TechBadge key={tech} label={tech} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
