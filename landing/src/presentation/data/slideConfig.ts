export type TransitionType = 'scale-in' | 'fade-up' | 'slide-left' | 'slide-right' | 'zoom-fade'

export type SlideBg = 'creme' | 'lavanda'

export interface SlideConfig {
  title: string
  transition: TransitionType
  bg: SlideBg
}

export const slideConfigs: SlideConfig[] = [
  { title: 'Título', transition: 'scale-in', bg: 'creme' },
  { title: 'Agenda', transition: 'fade-up', bg: 'creme' },
  { title: 'Contexto', transition: 'slide-left', bg: 'creme' },
  { title: 'Problema', transition: 'fade-up', bg: 'creme' },
  { title: 'Empresa', transition: 'scale-in', bg: 'creme' },
  { title: 'Solução', transition: 'slide-left', bg: 'lavanda' },
  { title: 'Proposta de Valor', transition: 'fade-up', bg: 'creme' },
  { title: 'MVP', transition: 'scale-in', bg: 'creme' },
  { title: 'Lean Canvas', transition: 'slide-left', bg: 'creme' },
  { title: 'Modelo de Negócio', transition: 'fade-up', bg: 'creme' },
  { title: 'Segmento', transition: 'slide-left', bg: 'creme' },
  { title: 'Métricas', transition: 'scale-in', bg: 'creme' },
  { title: 'Resultados', transition: 'fade-up', bg: 'lavanda' },
  { title: 'Impacto', transition: 'scale-in', bg: 'lavanda' },
  { title: 'Validação', transition: 'slide-left', bg: 'creme' },
  { title: 'Design Thinking', transition: 'fade-up', bg: 'creme' },
  { title: 'IA', transition: 'scale-in', bg: 'creme' },
  { title: 'Referências', transition: 'fade-up', bg: 'lavanda' },
]

export const bgColors: Record<SlideBg, string> = {
  creme: '#FAF8F5',
  lavanda: '#EDE8F5',
}
