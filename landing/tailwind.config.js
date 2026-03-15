/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#F5F1FB',
          100: '#EAE3F7',
          200: '#D4C6EF',
          300: '#BFA9E7',
          400: '#A68FCC',
          500: '#8E72BB',
          600: '#7B5EA7',
          700: '#644989',
          800: '#5A3E7A',
          900: '#3D2855',
        },
        teal: {
          50:  '#EDFAFA',
          100: '#D5F5F3',
          200: '#ABEAE6',
          300: '#7DDFD9',
          400: '#5BBFB8',
          500: '#46AAA3',
          600: '#3A9E97',
          700: '#2D8078',
          800: '#1F605A',
          900: '#11403C',
        },
        surface: '#FAF8F5',
        border: '#EDE8F5',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        glow:   '0 0 24px rgba(42, 33, 64, 0.10)',
        card:   '0 4px 24px rgba(42, 33, 64, 0.07), 0 1px 4px rgba(42, 33, 64, 0.04)',
        'card-hover': '0 8px 32px rgba(42, 33, 64, 0.10), 0 2px 8px rgba(42, 33, 64, 0.06)',
        sm:     '0 1px 3px rgba(42, 33, 64, 0.05), 0 1px 2px rgba(42, 33, 64, 0.03)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':    'fadeIn 0.5s ease-out forwards',
        'slide-up':   'slideUp 0.5s ease-out forwards',
        'clip-reveal': 'clipReveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'mask-up':     'maskUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        clipReveal: {
          '0%':   { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
        maskUp: {
          '0%':   { clipPath: 'inset(100% 0 0 0)' },
          '100%': { clipPath: 'inset(0)' },
        },
      },
    },
  },
  plugins: [],
}
