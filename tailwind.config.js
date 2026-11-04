/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9', 100: '#dbe5f1', 200: '#bccfe5',
          300: '#8fb0d3', 400: '#5b8abc', 500: '#3a6ba5',
          600: '#2d5489', 700: '#274470', 800: '#243b5e',
          900: '#0f172a', 950: '#080f1e',
        },
        brand: {
          50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe',
          300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1',
          600: '#4f46e5', 700: '#4338ca', 800: '#3730a3',
          900: '#312e81',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
        'card-hover': '0 10px 25px -5px rgba(15,23,42,0.1)',
      },
    },
  },
  plugins: [],
}