import { useState } from 'react'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import Features from './sections/Features'
import HowItWorks from './sections/HowItWorks'
import AIShowcase from './sections/AIShowcase'
import Screenshots from './sections/Screenshots'
import TechStack from './sections/TechStack'
import CTA from './sections/CTA'
import Footer from './sections/Footer'
import { Presentation } from './presentation/Presentation'

// Aplicação principal - composição de todas as seções da landing page
export default function App() {
  const [showPresentation, setShowPresentation] = useState(false)

  const openPresentation = () => setShowPresentation(true)
  const closePresentation = () => setShowPresentation(false)

  return (
    <div className="min-h-screen bg-white">
      <Navbar onOpenPresentation={openPresentation} />
      <main>
        <Hero onOpenPresentation={openPresentation} />
        <Features />
        <HowItWorks />
        <AIShowcase />
        <Screenshots />
        <TechStack />
        <CTA />
      </main>
      <Footer />

      {showPresentation && <Presentation onClose={closePresentation} />}
    </div>
  )
}
