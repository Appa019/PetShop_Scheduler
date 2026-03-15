export interface EntryAnimation {
  type: 'zoom-in' | 'fly-in' | 'scale-up' | 'drop' | 'orbit' | 'fade-in'
  from: [number, number, number]
  duration: number
}

export interface IdleAnimation {
  type: 'float' | 'pulse' | 'wobble' | 'orbit' | 'rotate'
  amplitude: number
  speed?: number
}

export interface ExitAnimation {
  type: 'fly-right' | 'fly-left' | 'fade-scale' | 'zoom-out' | 'drop-down'
  duration: number
}

export interface MaterialConfig {
  color: string
  roughness: number
  metalness: number
}

export interface Transition3D {
  model: string
  entry: EntryAnimation
  idle: IdleAnimation
  rest: {
    position: [number, number, number]
    scale: number
    rotation: [number, number, number]
  }
  material: MaterialConfig
  exit: ExitAnimation
}

export const transitionConfig: Partial<Record<number, Transition3D>> = {
  0: {
    model: 'paw',
    entry: { type: 'zoom-in', from: [0, 0, 8], duration: 0.8 },
    idle: { type: 'float', amplitude: 0.2, speed: 0.5 },
    rest: { position: [3.5, 2, 0], scale: 2.5, rotation: [0.1, -0.3, 0.05] },
    material: { color: '#7B5EA7', roughness: 0.35, metalness: 0.1 },
    exit: { type: 'fly-right', duration: 0.5 },
  },
  3: {
    model: 'syringe',
    entry: { type: 'fly-in', from: [-8, 0, 0], duration: 0.9 },
    idle: { type: 'wobble', amplitude: 0.12, speed: 0.8 },
    rest: { position: [-3.5, -1.8, 0], scale: 2.2, rotation: [0, 0.4, -0.15] },
    material: { color: '#5BBFB8', roughness: 0.4, metalness: 0.1 },
    exit: { type: 'fade-scale', duration: 0.4 },
  },
  5: {
    model: 'heart',
    entry: { type: 'scale-up', from: [0, -3, 0], duration: 1.0 },
    idle: { type: 'pulse', amplitude: 0.1, speed: 1.2 },
    rest: { position: [-3.5, -1.8, 0], scale: 2.5, rotation: [0, 0.2, -0.1] },
    material: { color: '#E8A0BF', roughness: 0.4, metalness: 0.05 },
    exit: { type: 'zoom-out', duration: 0.4 },
  },
  7: {
    model: 'bone',
    entry: { type: 'fly-in', from: [6, 4, 2], duration: 0.85 },
    idle: { type: 'rotate', amplitude: 0.3, speed: 0.4 },
    rest: { position: [-3.5, 2, 0], scale: 2.2, rotation: [0.2, -0.1, 0.3] },
    material: { color: '#EDE8F5', roughness: 0.3, metalness: 0.15 },
    exit: { type: 'fly-left', duration: 0.5 },
  },
  12: {
    model: 'trophy',
    entry: { type: 'drop', from: [3.5, 6, 0], duration: 0.9 },
    idle: { type: 'float', amplitude: 0.15, speed: 0.6 },
    rest: { position: [3.8, -0.5, 0], scale: 2.5, rotation: [0, -0.2, 0] },
    material: { color: '#D4A853', roughness: 0.3, metalness: 0.15 },
    exit: { type: 'drop-down', duration: 0.5 },
  },
  13: {
    model: 'stethoscope',
    entry: { type: 'orbit', from: [4, 0, 4], duration: 1.0 },
    idle: { type: 'orbit', amplitude: 0.25, speed: 0.3 },
    rest: { position: [3.5, -1.8, 0], scale: 2.2, rotation: [-0.1, 0.3, 0.05] },
    material: { color: '#2A2140', roughness: 0.35, metalness: 0.12 },
    exit: { type: 'fade-scale', duration: 0.4 },
  },
  16: {
    model: 'brain',
    entry: { type: 'fade-in', from: [3.5, 2, 3], duration: 0.8 },
    idle: { type: 'pulse', amplitude: 0.12, speed: 0.8 },
    rest: { position: [3.5, 2, 0], scale: 2.5, rotation: [0.1, -0.2, 0] },
    material: { color: '#7B5EA7', roughness: 0.4, metalness: 0.08 },
    exit: { type: 'zoom-out', duration: 0.4 },
  },
}
