import { motion } from 'framer-motion'
import { Camera, Brain, CalendarCheck, Bell, Shield, BarChart3 } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'
import { PhoneMockup } from '../components/PhoneMockup'

const features = [
  { icon: Camera, title: 'Upload de Foto', desc: 'Envia foto do pet para análise', color: '#7B5EA7' },
  { icon: Brain, title: 'IA Veterinária', desc: 'Identificação de raça e saúde', color: '#5BBFB8' },
  { icon: CalendarCheck, title: 'Cronograma 5 Anos', desc: 'Vacinas, vermífugos e cuidados', color: '#7B5EA7' },
  { icon: Bell, title: 'Lembretes', desc: 'Notificações por email', color: '#5BBFB8' },
  { icon: Shield, title: 'Auth Seguro', desc: 'Login com verificação', color: '#7B5EA7' },
  { icon: BarChart3, title: 'Dashboard', desc: 'Visão geral dos pets', color: '#5BBFB8' },
]

export function MVPSlide() {
  return (
    <SlideWrapper maxWidth="wide">
      <div className="flex flex-col items-center gap-8 w-full">
        <motion.span
          className="section-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          MVP
        </motion.span>

        <motion.h2
          className="font-display font-bold text-[#2A2140] text-center"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Funcionalidades do <span className="accent-underline text-[#7B5EA7]">MVP</span>
        </motion.h2>

        {/* Phone mockup center + features around */}
        <div className="flex flex-col lg:flex-row items-center gap-8 w-full max-w-5xl mt-2">
          {/* Left features */}
          <div className="flex flex-col gap-4 flex-1">
            {features.slice(0, 3).map((feat, i) => (
              <motion.div
                key={feat.title}
                className="flex items-center gap-3 p-3 bg-white border border-[#EDE8F5]"
                style={{ boxShadow: '0 2px 10px rgba(42,33,64,0.04)' }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${feat.color}12` }}
                >
                  <feat.icon size={18} style={{ color: feat.color }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#2A2140]">{feat.title}</h3>
                  <p className="text-[11px] text-[#7A7090]">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Phone mockup */}
          <PhoneMockup className="flex-shrink-0">
            {/* Simulated app screen */}
            <div className="flex flex-col gap-2.5 pt-2">
              <div className="flex items-center gap-2 px-2">
                <div className="w-8 h-8 rounded-full bg-[#EDE8F5] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-[#7B5EA7]">8P</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#2A2140]">8Patas</p>
                  <p className="text-[8px] text-[#7A7090]">Olá, Pedro!</p>
                </div>
              </div>

              {/* Pet card */}
              <div className="mx-2 p-2.5 bg-[#EDE8F5]/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#7B5EA7]/10 flex items-center justify-center">
                    <Camera size={12} className="text-[#7B5EA7]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#2A2140]">Luna</p>
                    <p className="text-[8px] text-[#7A7090]">Golden Retriever</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <div className="flex-1 p-1.5 bg-white rounded text-center">
                    <p className="text-[7px] text-[#7A7090]">Próxima</p>
                    <p className="text-[9px] font-bold text-[#7B5EA7]">V8 - 15/04</p>
                  </div>
                  <div className="flex-1 p-1.5 bg-white rounded text-center">
                    <p className="text-[7px] text-[#7A7090]">Saúde</p>
                    <p className="text-[9px] font-bold text-[#5BBFB8]">Ótima</p>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex gap-2 px-2">
                <div className="flex-1 p-2 bg-[#7B5EA7] rounded text-center">
                  <Brain size={12} className="text-white mx-auto mb-1" />
                  <p className="text-[8px] text-white font-medium">Análise IA</p>
                </div>
                <div className="flex-1 p-2 bg-[#5BBFB8] rounded text-center">
                  <CalendarCheck size={12} className="text-white mx-auto mb-1" />
                  <p className="text-[8px] text-white font-medium">Agendar</p>
                </div>
              </div>

              {/* Schedule preview */}
              <div className="mx-2 p-2 bg-white border border-[#EDE8F5] rounded">
                <p className="text-[8px] font-bold text-[#2A2140] mb-1.5">Cronograma</p>
                {['Vermífugo - 20/03', 'Antipulgas - 05/04', 'Vacina V8 - 15/04'].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 py-0.5">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: i === 0 ? '#5BBFB8' : '#EDE8F5' }} />
                    <span className="text-[8px] text-[#7A7090]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </PhoneMockup>

          {/* Right features */}
          <div className="flex flex-col gap-4 flex-1">
            {features.slice(3).map((feat, i) => (
              <motion.div
                key={feat.title}
                className="flex items-center gap-3 p-3 bg-white border border-[#EDE8F5]"
                style={{ boxShadow: '0 2px 10px rgba(42,33,64,0.04)' }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${feat.color}12` }}
                >
                  <feat.icon size={18} style={{ color: feat.color }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#2A2140]">{feat.title}</h3>
                  <p className="text-[11px] text-[#7A7090]">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SlideWrapper>
  )
}
