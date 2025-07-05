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
        // AssisText brand colors - these match your CSS variables
        brand: {
          // Light mode colors
          text: '#03131c',
          bg: '#eef7fb', 
          primary: '#0b5775',
          secondary: '#be5cf0',
          accent: '#d214c2',
          // Dark mode colors
          'text-dark': '#e3f3fc',
          'bg-dark': '#040d12',
          'primary-dark': '#88d5f4',
          'secondary-dark': '#720fa3',
          'accent-dark': '#ec2fdb',
        },
        // Primary color scale based on your brand
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0b5775', // Your primary color
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Secondary color scale
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#be5cf0', // Your secondary color
          600: '#a855f7',
          700: '#9333ea',
          800: '#7c3aed',
          900: '#6b21a8',
        },
        // Accent color scale
        accent: {
          50: '#fdf4fd',
          100: '#fae8fa',
          200: '#f4d1f4',
          300: '#eab0ea',
          400: '#dc84dc',
          500: '#d214c2', // Your accent color
          600: '#be12ae',
          700: '#9e0f8f',
          800: '#7a0c6f',
          900: '#5c0954',
        },
        // Surface colors for better theming
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Success, warning, error colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      fontFamily: {
        sans: ['Fira', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
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
        'scale-in': 'scaleIn 0.2s ease-out',
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
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
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
        'glow': '0 0 20px rgba(11, 87, 117, 0.15)',
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
        'modal': '1000',
        'popover': '1010',
        'tooltip': '1020',
        'notification': '1030',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Custom plugin for AssisText utilities
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
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        },
        '.glass-morphism': {
          background: 'rgba(238, 247, 251, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(238, 247, 251, 0.2)',
        },
        '.debug-grid': {
          backgroundImage: 'linear-gradient(rgba(255, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 0, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
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
        },
        '.input': {
          padding: theme('spacing.3') + ' ' + theme('spacing.4'),
          borderRadius: theme('borderRadius.xl'),
          border: '2px solid ' + theme('colors.surface.200'),
          fontSize: theme('fontSize.sm'),
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.brand.primary'),
            boxShadow: '0 0 0 3px rgba(11, 87, 117, 0.1)',
          }
        },
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.xl'),
          boxShadow: theme('boxShadow.sm'),
          border: '1px solid ' + theme('colors.surface.200'),
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: theme('boxShadow.md'),
          }
        }
      }

      addUtilities(newUtilities)
      addComponents(newComponents)
    }
  ],
}