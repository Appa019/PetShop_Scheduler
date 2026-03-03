import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import Features from './sections/Features'
import HowItWorks from './sections/HowItWorks'
import AIShowcase from './sections/AIShowcase'
import Screenshots from './sections/Screenshots'
import TechStack from './sections/TechStack'
import CTA from './sections/CTA'
import Footer from './sections/Footer'

// Aplicação principal — composição de todas as seções da landing page
export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <AIShowcase />
        <Screenshots />
        <TechStack />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
