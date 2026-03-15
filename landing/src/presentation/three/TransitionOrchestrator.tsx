import { useRef, useEffect, useState, Suspense, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import type { Group } from 'three'
import { VetModel } from './VetModel'
import { transitionConfig } from './transitionConfig'
import type { Transition3D } from './transitionConfig'

type Phase = 'entering' | 'idle' | 'exiting' | 'hidden'

function getExitTarget(
  exit: Transition3D['exit'],
  rest: [number, number, number]
): [number, number, number] {
  switch (exit.type) {
    case 'fly-right': return [8, rest[1], 0]
    case 'fly-left': return [-8, rest[1], 0]
    case 'drop-down': return [rest[0], -6, 0]
    case 'zoom-out': return [rest[0], rest[1], 8]
    case 'fade-scale': return rest
  }
}

// Scale rest positions based on viewport aspect ratio
function useViewportScale(): number {
  const { viewport } = useThree()
  const refAspect = 1.78 // 16:9 reference
  const currentAspect = viewport.width / viewport.height
  return Math.min(currentAspect / refAspect, 1)
}

function AnimatedModel({ config, phase, onPhaseComplete }: {
  config: Transition3D
  phase: Phase
  onPhaseComplete: (completedPhase: Phase) => void
}) {
  const groupRef = useRef<Group>(null)
  const timeRef = useRef(0)
  const vpScale = useViewportScale()

  // Scale positions by viewport
  const scaledRest: [number, number, number] = [
    config.rest.position[0] * vpScale,
    config.rest.position[1] * vpScale,
    config.rest.position[2],
  ]
  const scaledFrom: [number, number, number] = [
    config.entry.from[0] * vpScale,
    config.entry.from[1] * vpScale,
    config.entry.from[2],
  ]
  const exitTarget = getExitTarget(config.exit, scaledRest)

  // Reset idle timer when entering idle
  useEffect(() => {
    if (phase === 'idle') {
      timeRef.current = 0
    }
  }, [phase])

  // Compute spring target based on phase
  const targetPosition = phase === 'exiting'
    ? exitTarget
    : phase === 'entering'
      ? scaledFrom
      : scaledRest

  const targetScale = phase === 'exiting' && config.exit.type === 'fade-scale'
    ? 0
    : config.rest.scale

  const { position, scale, rotation } = useSpring({
    position: targetPosition,
    scale: targetScale,
    rotation: config.rest.rotation,
    config: {
      tension: phase === 'entering' ? 80 : 120,
      friction: phase === 'entering' ? 22 : 20,
    },
    immediate: phase === 'entering',
    onRest: () => {
      if (phase === 'exiting') {
        onPhaseComplete('exiting')
      }
    },
  })

  // Idle animation via useFrame
  useFrame((_, delta) => {
    if (phase !== 'idle' || !groupRef.current) return
    timeRef.current += delta

    const t = timeRef.current
    const { type, amplitude, speed = 1 } = config.idle
    const g = groupRef.current

    switch (type) {
      case 'float':
        g.position.y = scaledRest[1] + Math.sin(t * speed) * amplitude
        g.position.x = scaledRest[0] + Math.sin(t * speed * 0.7) * amplitude * 0.3
        break
      case 'pulse': {
        const s = config.rest.scale + Math.sin(t * speed * 2) * amplitude
        g.scale.setScalar(s)
        break
      }
      case 'wobble':
        g.rotation.z = config.rest.rotation[2] + Math.sin(t * speed) * amplitude
        g.rotation.x = config.rest.rotation[0] + Math.cos(t * speed * 0.8) * amplitude * 0.5
        break
      case 'orbit':
        g.position.x = scaledRest[0] + Math.cos(t * speed) * amplitude
        g.position.z = scaledRest[2] + Math.sin(t * speed) * amplitude
        break
      case 'rotate':
        g.rotation.y = config.rest.rotation[1] + t * speed
        break
    }
  })

  return (
    <animated.group
      ref={groupRef}
      position={phase === 'idle' ? undefined : (position as unknown as [number, number, number])}
      scale={phase === 'idle' ? config.rest.scale : (scale as unknown as number)}
      rotation={phase === 'idle' ? undefined : (rotation as unknown as [number, number, number])}
    >
      <Suspense fallback={null}>
        <VetModel
          modelPath={`/models/${config.model}.glb`}
          material={config.material}
          scale={1}
        />
      </Suspense>
    </animated.group>
  )
}

interface OrchestratorProps {
  currentSlide: number
}

export function TransitionOrchestrator({ currentSlide }: OrchestratorProps) {
  const [activeConfig, setActiveConfig] = useState<Transition3D | null>(null)
  const [phase, setPhase] = useState<Phase>('hidden')
  const prevSlideRef = useRef(currentSlide)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Called by AnimatedModel when exit animation completes (spring onRest)
  const handlePhaseComplete = useCallback((completedPhase: Phase) => {
    if (completedPhase === 'exiting') {
      const newConfig = transitionConfig[prevSlideRef.current] ?? null
      if (newConfig) {
        setActiveConfig(newConfig)
        setPhase('entering')
        timerRef.current = setTimeout(() => setPhase('idle'), 50)
      } else {
        setActiveConfig(null)
        setPhase('hidden')
      }
    }
  }, [])

  useEffect(() => {
    clearTimers()
    const newConfig = transitionConfig[currentSlide] ?? null
    const hadPrev3D = transitionConfig[prevSlideRef.current] !== undefined
    const isSlideChange = prevSlideRef.current !== currentSlide

    prevSlideRef.current = currentSlide

    if (!isSlideChange) {
      if (newConfig) {
        setActiveConfig(newConfig)
        setPhase('entering')
        timerRef.current = setTimeout(() => setPhase('idle'), 50)
      }
      return
    }

    if (hadPrev3D && phase !== 'hidden') {
      setPhase('exiting')
      return
    }

    if (newConfig) {
      setActiveConfig(newConfig)
      setPhase('entering')
      timerRef.current = setTimeout(() => setPhase('idle'), 50)
    } else {
      setActiveConfig(null)
      setPhase('hidden')
    }

    return () => clearTimers()
  }, [currentSlide, clearTimers])

  useEffect(() => () => clearTimers(), [clearTimers])

  if (!activeConfig || phase === 'hidden') return null

  return (
    <AnimatedModel
      key={activeConfig.model}
      config={activeConfig}
      phase={phase}
      onPhaseComplete={handlePhaseComplete}
    />
  )
}
