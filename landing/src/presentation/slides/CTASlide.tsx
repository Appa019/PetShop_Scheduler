import { motion } from 'framer-motion'
import { LogIn, QrCode, Smartphone } from 'lucide-react'
import { SlideWrapper } from '../components/SlideWrapper'
import { AccentShapes } from '../components/AccentShapes'

const APP_URL = 'https://projetointraempreendedorismo.vercel.app/app/login'

// QR Code as inline SVG generated for the APP_URL
function QRCode() {
  return (
    <div className="relative">
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(APP_URL)}&bgcolor=FFFFFF&color=2A2140&margin=8`}
        alt="QR Code para acessar o 8Patas"
        width={200}
        height={200}
        style={{ imageRendering: 'pixelated' }}
        className="rounded-lg"
      />
    </div>
  )
}

export function CTASlide() {
  return (
    <SlideWrapper bg="lavanda" maxWidth="wide" padding="compact">
      <AccentShapes variant="dots" />

      <div className="flex flex-col items-center gap-8 w-full">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            className="section-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Smartphone size={12} />
            Demo ao Vivo
          </motion.span>

          <h2
            className="font-display font-bold text-[#2A2140] mt-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          >
            Experimente o{' '}
            <span className="text-[#7B5EA7]" style={{ textDecoration: 'underline', textDecorationColor: '#7B5EA740', textUnderlineOffset: '6px' }}>
              8Patas
            </span>
          </h2>
          <p className="text-[#7A7090] mt-2 text-sm max-w-lg mx-auto">
            Escaneie o QR code ou clique no botão para acessar a plataforma com a conta demo.
          </p>
        </motion.div>

        {/* Content: QR + Credentials */}
        <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-3xl justify-center">
          {/* QR Code */}
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="p-4 bg-white rounded-xl border border-[#EDE8F5]" style={{ boxShadow: '0 4px 20px rgba(42,33,64,0.08)' }}>
              <QRCode />
            </div>
            <div className="flex items-center gap-1.5 text-[#7A7090] text-xs">
              <QrCode size={12} />
              Escaneie com a câmera
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="hidden md:block w-px h-48 bg-[#7B5EA7]"
            style={{ opacity: 0.15 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 0.4 }}
          />
          <motion.div
            className="block md:hidden h-px w-32 bg-[#7B5EA7]"
            style={{ opacity: 0.15 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 0.4 }}
          />

          {/* Credentials + Button */}
          <motion.div
            className="flex flex-col items-center gap-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Login credentials card */}
            <div
              className="p-5 bg-white rounded-xl border border-[#EDE8F5] w-full max-w-xs"
              style={{ boxShadow: '0 4px 20px rgba(42,33,64,0.08)' }}
            >
              <h3 className="font-semibold text-xs uppercase tracking-wider text-[#7B5EA7] mb-3 flex items-center gap-2">
                <LogIn size={13} />
                Credenciais de Acesso
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between py-2 px-3 bg-[#FAF8F5] rounded-lg">
                  <span className="text-xs text-[#7A7090]">Email</span>
                  <span className="text-sm font-semibold text-[#2A2140] font-mono">demo@8patas.com</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-[#FAF8F5] rounded-lg">
                  <span className="text-xs text-[#7A7090]">Senha</span>
                  <span className="text-sm font-semibold text-[#2A2140] font-mono">demo123</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg text-white font-semibold text-sm transition-all hover:scale-105"
              style={{
                backgroundColor: '#7B5EA7',
                boxShadow: '0 4px 16px rgba(123,94,167,0.3)',
              }}
            >
              <LogIn size={18} />
              Acessar o 8Patas
            </a>
          </motion.div>
        </div>
      </div>
    </SlideWrapper>
  )
}
