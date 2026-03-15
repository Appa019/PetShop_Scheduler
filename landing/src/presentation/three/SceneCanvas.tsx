import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, useGLTF } from '@react-three/drei'
import { SceneLighting } from './SceneLighting'
import { TransitionOrchestrator } from './TransitionOrchestrator'
import { transitionConfig } from './transitionConfig'

interface SceneCanvasProps {
  currentSlide: number
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('webgl2'))
  } catch {
    return false
  }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function SceneCanvas({ currentSlide }: SceneCanvasProps) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(supportsWebGL() && !prefersReducedMotion())
  }, [])

  if (!enabled) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        frameloop="always"
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneLighting />
        <TransitionOrchestrator currentSlide={currentSlide} />
        <Preload all />
      </Canvas>
    </div>
  )
}

// Preload all models when this module loads
const modelNames = [...new Set(
  Object.values(transitionConfig)
    .filter((c): c is NonNullable<typeof c> => c !== undefined)
    .map(c => c.model)
)]
modelNames.forEach(name => useGLTF.preload(`/models/${name}.glb`))
