/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          skyLight: '#F0F9FF',
          sky: '#BAE6FD',
          skyDeep: '#38BDF8',
          pinkLight: '#FDF2F8',
          pink: '#F472B6',
          pinkDeep: '#DB2777',
          yellowLight: '#FEFCE8',
          yellow: '#FDE047',
          yellowDeep: '#EAB308',
        }
      },
      fontFamily: {
        script: ['"Dancing Script"', 'cursive'],
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Outfit"', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'float-fast': 'float 2.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'sparkle-spin': 'sparkleSpin 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': {
            textShadow: '0 0 20px rgba(244, 114, 182, 0.8), 0 0 40px rgba(56, 189, 248, 0.7), 0 0 60px rgba(250, 204, 21, 0.6)',
            filter: 'drop-shadow(0 0 15px rgba(244, 114, 182, 0.6))'
          },
          '50%': {
            textShadow: '0 0 35px rgba(250, 204, 21, 0.9), 0 0 60px rgba(244, 114, 182, 0.8), 0 0 90px rgba(56, 189, 248, 0.7)',
            filter: 'drop-shadow(0 0 25px rgba(250, 204, 21, 0.8))'
          },
        },
        sparkleSpin: {
          '0%': { transform: 'rotate(0deg) scale(0.9)', opacity: '0.7' },
          '50%': { transform: 'rotate(180deg) scale(1.2)', opacity: '1' },
          '100%': { transform: 'rotate(360deg) scale(0.9)', opacity: '0.7' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
