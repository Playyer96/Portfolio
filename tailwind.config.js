/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3e8ff',
          100: '#e9d5ff',
          200: '#d8b4fe',
          300: '#c084fc',
          400: '#a855f7',
          500: '#9333ea',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.1)',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(147, 51, 234, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(147, 51, 234, 0.8)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'glow-sm': '0 0 10px rgba(147, 51, 234, 0.3)',
        'glow-md': '0 0 20px rgba(147, 51, 234, 0.4)',
        'glow-lg': '0 0 30px rgba(147, 51, 234, 0.5)',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.glass-effect': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        '.glass-card': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        '.text-gradient': {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          backgroundClip: 'text',
        },
        '.btn-primary': {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          border: 'none',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 25px rgba(147, 51, 234, 0.3)',
          },
        },
        '.dark .glass-effect': {
          background: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.dark .glass-card': {
          background: 'rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}