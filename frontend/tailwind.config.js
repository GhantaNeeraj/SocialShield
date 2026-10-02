/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#0a3651',
          950: '#031f31'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'clean': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'clean-hover': '0 20px 30px -10px rgba(2, 132, 199, 0.12), 0 10px 15px -5px rgba(15, 23, 42, 0.04)',
        'glow-sky': '0 0 25px rgba(2, 132, 199, 0.25)',
        'glow-red': '0 0 25px rgba(225, 29, 72, 0.25)',
        'glow-emerald': '0 0 25px rgba(5, 150, 105, 0.25)',
      }
    },
  },
  plugins: [],
}
