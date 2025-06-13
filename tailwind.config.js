/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // AssisText brand colors
        brand: {
          // Light mode colors
          text: '#03131c',
          bg: '#eef7fb', 
          primary: '#0b5775',
          secondary: '#be5cf0',
          accent: '#d214c2',
          // Dark mode colors (can be accessed via CSS variables)
          'text-dark': '#e3f3fc',
          'bg-dark': '#040d12',
          'primary-dark': '#88d5f4',
          'secondary-dark': '#720fa3',
          'accent-dark': '#ec2fdb',
        },
        // Extended palette for surfaces and states
        surface: {
          50: '#f8fbfd',
          100: '#eef7fb',
          200: '#d6ebf4',
          300: '#b8dae9',
          400: '#94c5db',
          500: '#6eadca',
          600: '#4c8fb1',
          700: '#3a7090',
          800: '#2d5670',
          900: '#1f3a4d',
        },
        accent: {
          50: '#fdf4fd',
          100: '#fae8fa',
          200: '#f4d1f4',
          300: '#eab0ea',
          400: '#dc84dc',
          500: '#d214c2',
          600: '#be12ae',
          700: '#9e0f8f',
          800: '#7a0c6f',
          900: '#5c0954',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-gentle': 'bounce 1s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #0b5775, 0 0 10px #0b5775, 0 0 15px #0b5775' },
          '100%': { boxShadow: '0 0 10px #88d5f4, 0 0 20px #88d5f4, 0 0 30px #88d5f4' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(11, 87, 117, 0.07), 0 10px 20px -2px rgba(11, 87, 117, 0.04)',
        'medium': '0 4px 25px -5px rgba(11, 87, 117, 0.1), 0 10px 10px -5px rgba(11, 87, 117, 0.04)',
        'hard': '0 10px 40px -10px rgba(11, 87, 117, 0.15), 0 4px 6px -2px rgba(11, 87, 117, 0.05)',
        'brand': '0 4px 14px 0 rgba(11, 87, 117, 0.2)',
        'accent': '0 4px 14px 0 rgba(210, 20, 194, 0.2)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Add custom plugin for additional utilities
    function({ addUtilities, addComponents, theme }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(3, 19, 28, 0.10)',
        },
        '.text-shadow-md': {
          textShadow: '0 4px 8px rgba(3, 19, 28, 0.12), 0 2px 4px rgba(3, 19, 28, 0.08)',
        },
        '.text-shadow-lg': {
          textShadow: '0 15px 35px rgba(3, 19, 28, 0.1), 0 5px 15px rgba(3, 19, 28, 0.07)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
        '.gradient-text-brand': {
          background: 'linear-gradient(135deg, #0b5775, #d214c2)',
          backgroundClip: 'text',
          color: 'transparent',
        },
        '.glass-morphism': {
          background: 'rgba(238, 247, 251, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(238, 247, 251, 0.2)',
        }
      }

      const newComponents = {
        '.btn': {
          padding: theme('spacing.3') + ' ' + theme('spacing.6'),
          borderRadius: theme('borderRadius.xl'),
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.sm'),
          lineHeight: theme('lineHeight.5'),
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:focus': {
            outline: 'none',
            boxShadow: '0 0 0 3px rgba(11, 87, 117, 0.1)',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          }
        }
      }

      addUtilities(newUtilities)
      addComponents(newComponents)
    }
  ],
}