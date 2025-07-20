/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // AssisText brand colors - enhanced for dark mode
        brand: {
          // Light mode colors
          text: 'rgb(var(--color-text) / <alpha-value>)',
          bg: 'rgb(var(--color-bg) / <alpha-value>)',
          primary: 'rgb(var(--color-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
          accent: 'rgb(var(--color-accent) / <alpha-value>)',
          
          // Dark mode colors (using CSS variables)
          'text-dark': 'rgb(var(--color-text) / <alpha-value>)',
          'bg-dark': 'rgb(var(--color-bg) / <alpha-value>)',
          'primary-dark': 'rgb(var(--color-primary) / <alpha-value>)',
          'secondary-dark': 'rgb(var(--color-secondary) / <alpha-value>)',
          'accent-dark': 'rgb(var(--color-accent) / <alpha-value>)',
        },
        
        // Primary color scale based on your brand (#0b5775)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0b5775', // Your primary color
          600: '#075985',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        
        // Secondary color scale based on your brand (#be5cf0)
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
          950: '#581c87',
        },
        
        // Accent color scale based on your brand (#d214c2)
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f4d1f4',
          300: '#eab0ea',
          400: '#dc84dc',
          500: '#d214c2', // Your accent color
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        
        // Surface colors for UI elements
        surface: {
          50: 'rgb(var(--color-surface) / <alpha-value>)',
          100: '#f1f5f9',
          200: 'rgb(var(--color-border) / <alpha-value>)',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: 'rgb(var(--color-muted) / <alpha-value>)',
          600: '#475569',
          700: '#334155',
          800: 'rgb(var(--color-card) / <alpha-value>)',
          900: '#0f172a',
          950: '#020617',
        },
        
        // Success colors
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
          950: '#052e16',
        },
        
        // Warning colors
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
          950: '#451a03',
        },
        
        // Error colors
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
          950: '#450a0a',
        },
        
        // Info colors
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      
      fontFamily: {
        sans: ['Fira', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1.1' }],
        '9xl': ['8rem', { lineHeight: '1.1' }],
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'brand': '0 4px 14px 0 rgba(11, 87, 117, 0.2)',
        'secondary': '0 4px 14px 0 rgba(190, 92, 240, 0.2)',
        'accent': '0 4px 14px 0 rgba(210, 20, 194, 0.2)',
        'glow': '0 0 20px rgba(11, 87, 117, 0.15)',
        'glow-dark': '0 0 20px rgba(136, 213, 244, 0.15)',
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      },
      
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      
      backdropBlur: {
        'xs': '2px',
      },
      
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'width': 'width',
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
      
      scale: {
        '102': '1.02',
        '103': '1.03',
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
      
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
        '20': 'repeat(20, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    
    // Custom plugin for AssisText utilities
    function({ addUtilities, addComponents, theme }) {
      const newUtilities = {
        // Text shadows
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
        
        // Dark mode text shadows
        '.dark .text-shadow': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        },
        '.dark .text-shadow-md': {
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.2)',
        },
        '.dark .text-shadow-lg': {
          textShadow: '0 15px 35px rgba(0, 0, 0, 0.3), 0 5px 15px rgba(0, 0, 0, 0.2)',
        },
        
        // Gradient text
        '.gradient-text-brand': {
          background: 'linear-gradient(135deg, #0b5775, #d214c2)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        },

        '.dark .gradient-text-secondary':{
          background: 'linear-gradient(135deg, #d214c2, #88d5f4, #590981ff)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',

        },
        '.dark .gradient-text-brand': {
          background: 'linear-gradient(135deg, #88d5f4, #ec2fdb)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        },
        
        // Glass morphism effects
        '.glass-morphism': {
          background: 'rgba(238, 247, 251, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(238, 247, 251, 0.2)',
        },
        '.dark .glass-morphism': {
          background: 'rgba(4, 13, 18, 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(30, 41, 59, 0.3)',
        },
        
        // Glass card effect
        '.glass-card': {
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.dark .glass-card': {
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(51, 65, 85, 0.3)',
        },
        
        // Scrollbar styling
        '.custom-scrollbar::-webkit-scrollbar': {
          width: '6px',
        },
        '.custom-scrollbar::-webkit-scrollbar-track': {
          background: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '3px',
        },
        '.custom-scrollbar::-webkit-scrollbar-thumb': {
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '3px',
        },
        '.custom-scrollbar::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(0, 0, 0, 0.3)',
        },
        '.dark .custom-scrollbar::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.05)',
        },
        '.dark .custom-scrollbar::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.2)',
        },
        '.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(255, 255, 255, 0.3)',
        },
        
        // Focus styles
        '.focus-brand': {
          '&:focus': {
            outline: 'none',
            boxShadow: '0 0 0 3px rgba(11, 87, 117, 0.1)',
            borderColor: '#0b5775',
          },
        },
        '.dark .focus-brand': {
          '&:focus': {
            boxShadow: '0 0 0 3px rgba(136, 213, 244, 0.2)',
            borderColor: '#88d5f4',
          },
        },
      };
      
      const newComponents = {
        // Button components
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          borderRadius: '0.75rem',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textDecoration: 'none',
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        
        '.btn-primary': {
          backgroundColor: '#0b5775',
          color: '#ffffff',
          boxShadow: '0 4px 14px 0 rgba(11, 87, 117, 0.2)',
          '&:hover:not(:disabled)': {
            backgroundColor: '#075985',
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 20px 0 rgba(11, 87, 117, 0.3)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        
        '.btn-secondary': {
          backgroundColor: '#be5cf0',
          color: '#ffffff',
          boxShadow: '0 4px 14px 0 rgba(190, 92, 240, 0.2)',
          '&:hover:not(:disabled)': {
            backgroundColor: '#a855f7',
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 20px 0 rgba(190, 92, 240, 0.3)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        
        '.btn-outline': {
          backgroundColor: 'transparent',
          color: '#0b5775',
          border: '1px solid #0b5775',
          '&:hover:not(:disabled)': {
            backgroundColor: '#0b5775',
            color: '#ffffff',
            transform: 'translateY(-1px)',
          },
        },
        
        '.btn-ghost': {
          backgroundColor: 'transparent',
          color: '#64748b',
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgba(100, 116, 139, 0.1)',
            color: '#0b5775',
          },
        },
        
        // Dark mode button styles
        '.dark .btn-outline': {
          color: '#88d5f4',
          borderColor: '#88d5f4',
          '&:hover:not(:disabled)': {
            backgroundColor: '#88d5f4',
            color: '#040d12',
          },
        },
        
        '.dark .btn-ghost': {
          color: '#94a3b8',
          '&:hover:not(:disabled)': {
            backgroundColor: 'rgba(148, 163, 184, 0.1)',
            color: '#88d5f4',
          },
        },
        
        // Card components
        '.card': {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(226, 232, 240, 0.5)',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
        
        '.dark .card': {
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          borderColor: 'rgba(51, 65, 85, 0.5)',
        },
        
        // Form components
        '.form-input': {
          width: '100%',
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          transition: 'all 0.2s ease',
          '&:focus': {
            outline: 'none',
            borderColor: '#0b5775',
            boxShadow: '0 0 0 3px rgba(11, 87, 117, 0.1)',
          },
          '&::placeholder': {
            color: '#94a3b8',
          },
        },
        
        '.dark .form-input': {
          backgroundColor: '#0f172a',
          borderColor: '#334155',
          color: '#f1f5f9',
          '&:focus': {
            borderColor: '#88d5f4',
            boxShadow: '0 0 0 3px rgba(136, 213, 244, 0.2)',
          },
          '&::placeholder': {
            color: '#64748b',
          },
        },
      };
      
      addUtilities(newUtilities);
      addComponents(newComponents);
    },
  ],
};