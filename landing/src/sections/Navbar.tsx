import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Funcionalidades', href: '#features' },
  { label: 'Como Funciona', href: '#how-it-works' },
  { label: 'Screenshots', href: '#screenshots' },
  { label: 'Tecnologias', href: '#tech-stack' },
]

// Navegação principal com sticky top, blur e menu mobile
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-[#EDE8F5] shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className="flex items-center gap-2 font-display font-bold text-xl text-[#7B5EA7] hover:text-[#5A3E7A] transition-colors"
        >
          <span className="text-2xl" aria-hidden="true">🐾</span>
          <span>8Patas</span>
        </a>

        {/* Links desktop */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <li key={link.href}>
              <button
                onClick={() => handleNav(link.href)}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-[#7A7090] hover:text-[#2A2140] hover:bg-[#F5F1FB] transition-all duration-200"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA desktop */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/Appa019/PetShop_Scheduler"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#7A7090] hover:text-[#2A2140] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://github.com/Appa019/PetShop_Scheduler"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-teal text-sm px-4 py-2"
          >
            Acessar App →
          </a>
        </div>

        {/* Hambúrguer mobile */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="md:hidden p-2 rounded-lg text-[#7A7090] hover:text-[#2A2140] hover:bg-[#F5F1FB] transition-colors"
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-[#EDE8F5] px-4 py-4 flex flex-col gap-1">
          {links.map(link => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#7A7090] hover:text-[#2A2140] hover:bg-[#F5F1FB] transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="mt-3 pt-3 border-t border-[#EDE8F5]">
            <a
              href="https://github.com/Appa019/PetShop_Scheduler"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-teal w-full justify-center"
            >
              Acessar App →
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
