/ @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src//*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          900: '#0f0e0c',
          800: '#1a1916',
          700: '#242220',
          600: '#2e2b28',
          500: '#3a3733',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        saffron: '#ff9933',
        cream: '#fdf6e3',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'pulse-mic': 'pulseMic 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
      },
      keyframes: {
        pulseMic: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 153, 51, 0.7)' },
          '50%': { boxShadow: '0 0 0 20px rgba(255, 153, 51, 0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Orderly