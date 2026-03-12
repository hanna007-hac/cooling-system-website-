/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#22c55e',
          greenDark: '#16a34a',
          red: '#ef4444',
          dark: '#0d1117',
          card: '#161b27',
          border: '#1f2937',
        },
      },
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        toastIn: { from: { opacity: '0', transform: 'translateX(100%)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.35s ease forwards',
        toastIn: 'toastIn 0.3s ease forwards',
      },
    },
  },
  plugins: [],
}
