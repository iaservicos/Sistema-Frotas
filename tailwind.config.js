/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // accent2
          600: '#0284c7',
          700: '#0369a1', // accent (EnerFine Blue)
          800: '#075985',
          900: '#0c4a6e',
        },
        sidebar: {
          bg: '#0f172a',
          darkBg: '#070c12',
          border: 'rgba(255,255,255,0.07)',
          text: '#cbd5e1',
          muted: '#64748b',
          activeBg: 'rgba(14,165,233,0.15)',
          activeText: '#38bdf8',
        },
        app: {
          bg: '#f0f4f8',
          surface: '#ffffff',
          surface2: '#f5f7fa',
          surface3: '#eaeef3',
          darkBg: '#080d14',
          darkSurface: '#0e1620',
          darkSurface2: '#141e2d',
          darkSurface3: '#1a2638',
        }
      },
      boxShadow: {
        'card': '0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05)',
        'glow': '0 0 24px rgba(14,165,233,0.35)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        fadeUp: 'fadeUp 0.25s ease-out forwards',
      }
    },
  },
  plugins: [],
}
