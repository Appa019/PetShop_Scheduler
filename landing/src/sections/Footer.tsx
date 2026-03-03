import { Github, Heart } from 'lucide-react'

const footerLinks = [
  { label: 'GitHub', href: 'https://github.com/Appa019/PetShop_Scheduler', external: true },
  { label: 'Funcionalidades', href: '#features', external: false },
  { label: 'Como Funciona', href: '#how-it-works', external: false },
  { label: 'Tecnologias', href: '#tech-stack', external: false },
]

// Rodapé minimalista com logo, links e copyright
export default function Footer() {
  const handleNav = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-[#EDE8F5]" style={{ background: '#FAF8FC' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

          {/* Logo e tagline */}
          <div className="flex flex-col gap-1">
            <a
              href="#"
              onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="flex items-center gap-2 font-display font-bold text-lg text-[#7B5EA7] hover:text-[#5A3E7A] transition-colors w-fit"
            >
              <span className="text-xl" aria-hidden="true">🐾</span>
              <span>8Patas</span>
            </a>
            <p className="text-xs text-[#7A7090] pl-8">Gestão veterinária com inteligência artificial</p>
          </div>

          {/* Links */}
          <nav>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {footerLinks.map(link => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-[#7A7090] hover:text-[#2A2140] transition-colors"
                    >
                      <Github size={13} />
                      {link.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => handleNav(link.href)}
                      className="text-sm text-[#7A7090] hover:text-[#2A2140] transition-colors"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Divisor e copyright */}
        <div className="mt-8 pt-6 border-t border-[#EDE8F5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#7A7090]">
            © 2026 8Patas Petshop. Todos os direitos reservados.
          </p>
          <p className="text-xs text-[#7A7090] flex items-center gap-1.5">
            Feito com <Heart size={11} style={{ color: '#EF4444' }} aria-label="carinho" /> para tutores e pets
          </p>
        </div>
      </div>
    </footer>
  )
}
