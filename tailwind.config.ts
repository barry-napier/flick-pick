import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // Core theme colors
        background: 'hsl(0 0% 4%)',
        'background-secondary': 'hsl(0 0% 6%)',
        card: 'hsl(0 0% 10%)',
        'card-hover': 'hsl(0 0% 16%)',
        'card-border': 'hsl(0 0% 20%)',
        'text-primary': 'hsl(0 0% 100%)',
        'text-secondary': 'hsl(220 9% 46%)',
        'text-tertiary': 'hsl(220 9% 32%)',
        
        // Component-specific colors
        'pill-bg': 'hsla(0 0% 100% / 0.12)',
        'pill-border': 'hsla(0 0% 100% / 0.2)',
        'nav-tab-active': 'hsl(0 0% 100%)',
        'nav-tab-inactive': 'hsl(220 9% 46%)',
        
        // Gradient stops
        'gradient-start': 'hsla(0 0% 0% / 0)',
        'gradient-mid': 'hsla(0 0% 0% / 0.6)',
        'gradient-end': 'hsla(0 0% 0% / 0.9)',
        
        // Swipe feedback colors
        'swipe-like': {
          DEFAULT: 'hsl(158 64% 52%)',
          light: 'hsl(160 60% 65%)',
          bg: 'hsla(158 64% 52% / 0.15)',
        },
        'swipe-skip': {
          DEFAULT: 'hsl(0 84% 60%)',
          light: 'hsl(0 77% 70%)',
          bg: 'hsla(0 84% 60% / 0.15)',
        },
        'swipe-unseen': {
          DEFAULT: 'hsl(217 91% 60%)',
          light: 'hsl(213 93% 73%)',
          bg: 'hsla(217 91% 60% / 0.15)',
        },
        
        // Genre colors for pills
        genre: {
          action: 'hsl(14 100% 57%)',
          comedy: 'hsl(45 100% 51%)',
          drama: 'hsl(262 83% 58%)',
          horror: 'hsl(0 84% 60%)',
          romance: 'hsl(330 81% 60%)',
          scifi: 'hsl(196 93% 59%)',
          thriller: 'hsl(25 95% 53%)',
          default: 'hsl(220 9% 46%)',
        },
        // Standard colors for Shadcn compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },
      animation: {
        // Swipe animations (optimized for 60fps)
        'swipe-right': 'swipeRight 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        'swipe-left': 'swipeLeft 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        'swipe-up': 'swipeUp 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        'swipe-down': 'swipeDown 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        
        // Card animations
        'card-enter': 'cardEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'card-exit': 'cardExit 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        'card-stack-shift': 'cardStackShift 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'card-rotate-left': 'cardRotateLeft 0.2s ease-out',
        'card-rotate-right': 'cardRotateRight 0.2s ease-out',
        'card-scale-up': 'cardScaleUp 0.2s ease-out',
        
        // UI animations
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-left': 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right': 'slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        
        // Loading and interactive states
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
        'shimmer': 'shimmer 2s linear infinite',
        'heartbeat': 'heartbeat 1s ease-in-out infinite',
        'wiggle': 'wiggle 0.3s ease-in-out',
        
        // Navigation animations
        'tab-slide': 'tabSlide 0.2s ease-out',
        'nav-fade': 'navFade 0.3s ease-in-out',
        
        // Overlay animations
        'overlay-fade-in': 'overlayFadeIn 0.2s ease-out',
        'overlay-scale-in': 'overlayScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        // Optimized swipe animations for hardware acceleration
        swipeRight: {
          '0%': { 
            transform: 'translateX(0) rotate(0deg) translateZ(0)', 
            opacity: '1' 
          },
          '100%': { 
            transform: 'translateX(150vw) rotate(25deg) translateZ(0)', 
            opacity: '0' 
          },
        },
        swipeLeft: {
          '0%': { 
            transform: 'translateX(0) rotate(0deg) translateZ(0)', 
            opacity: '1' 
          },
          '100%': { 
            transform: 'translateX(-150vw) rotate(-25deg) translateZ(0)', 
            opacity: '0' 
          },
        },
        swipeUp: {
          '0%': { 
            transform: 'translateY(0) scale(1) translateZ(0)', 
            opacity: '1' 
          },
          '100%': { 
            transform: 'translateY(-120vh) scale(0.7) translateZ(0)', 
            opacity: '0' 
          },
        },
        swipeDown: {
          '0%': { 
            transform: 'translateY(0) scale(1) translateZ(0)', 
            opacity: '1' 
          },
          '100%': { 
            transform: 'translateY(120vh) scale(0.7) translateZ(0)', 
            opacity: '0' 
          },
        },
        
        // Enhanced card animations
        cardEnter: {
          '0%': { 
            transform: 'scale(0.85) translateY(40px) translateZ(0)', 
            opacity: '0' 
          },
          '50%': {
            transform: 'scale(0.95) translateY(20px) translateZ(0)',
            opacity: '0.7'
          },
          '100%': { 
            transform: 'scale(1) translateY(0) translateZ(0)', 
            opacity: '1' 
          },
        },
        cardExit: {
          '0%': { 
            transform: 'scale(1) translateZ(0)', 
            opacity: '1' 
          },
          '100%': { 
            transform: 'scale(0.9) translateZ(0)', 
            opacity: '0' 
          },
        },
        cardStackShift: {
          '0%': { 
            transform: 'var(--card-initial-transform)' 
          },
          '100%': { 
            transform: 'var(--card-final-transform)' 
          },
        },
        cardRotateLeft: {
          '0%': { transform: 'rotate(0deg) translateZ(0)' },
          '100%': { transform: 'rotate(-15deg) translateZ(0)' },
        },
        cardRotateRight: {
          '0%': { transform: 'rotate(0deg) translateZ(0)' },
          '100%': { transform: 'rotate(15deg) translateZ(0)' },
        },
        cardScaleUp: {
          '0%': { transform: 'scale(1) translateZ(0)' },
          '100%': { transform: 'scale(1.05) translateZ(0)' },
        },
        
        // UI animations
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px) translateZ(0)', opacity: '0' },
          '100%': { transform: 'translateY(0) translateZ(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px) translateZ(0)', opacity: '0' },
          '100%': { transform: 'translateY(0) translateZ(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px) translateZ(0)', opacity: '0' },
          '100%': { transform: 'translateX(0) translateZ(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px) translateZ(0)', opacity: '0' },
          '100%': { transform: 'translateX(0) translateZ(0)', opacity: '1' },
        },
        
        // Loading and interaction animations
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0) translateZ(0)' },
          '50%': { transform: 'translateY(-5px) translateZ(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1) translateZ(0)' },
          '50%': { transform: 'scale(1.1) translateZ(0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg) translateZ(0)' },
          '25%': { transform: 'rotate(-3deg) translateZ(0)' },
          '75%': { transform: 'rotate(3deg) translateZ(0)' },
        },
        
        // Navigation animations
        tabSlide: {
          '0%': { transform: 'translateX(var(--tab-start)) translateZ(0)' },
          '100%': { transform: 'translateX(var(--tab-end)) translateZ(0)' },
        },
        navFade: {
          '0%': { opacity: '0', transform: 'translateY(-10px) translateZ(0)' },
          '100%': { opacity: '1', transform: 'translateY(0) translateZ(0)' },
        },
        
        // Overlay animations
        overlayFadeIn: {
          '0%': { 
            opacity: '0',
            backdropFilter: 'blur(0px)'
          },
          '100%': { 
            opacity: '1',
            backdropFilter: 'blur(4px)'
          },
        },
        overlayScaleIn: {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.95) translateZ(0)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1) translateZ(0)' 
          },
        },
      },
      borderRadius: {
        'card': '16px',
        'card-small': '12px',
        'pill': '20px',
        'pill-small': '16px',
        'button': '12px',
        'overlay': '8px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        // Movie card specific spacing
        'card-gap': '1rem',
        'card-stack': '0.5rem',
        'pill-gap': '0.5rem',
        // Safe area spacing
        'safe-top': 'env(safe-area-inset-top, 0)',
        'safe-bottom': 'env(safe-area-inset-bottom, 0)',
        'safe-left': 'env(safe-area-inset-left, 0)',
        'safe-right': 'env(safe-area-inset-right, 0)',
      },
      
      // Enhanced box shadow system
      boxShadow: {
        'card': '0 4px 16px -4px rgba(0, 0, 0, 0.4), 0 2px 8px -2px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 32px -8px rgba(0, 0, 0, 0.5), 0 4px 16px -4px rgba(0, 0, 0, 0.4)',
        'card-stack': '0 2px 8px -2px rgba(0, 0, 0, 0.3)',
        'pill': '0 1px 3px rgba(0, 0, 0, 0.2)',
        'overlay': '0 0 32px rgba(0, 0, 0, 0.5)',
        'glow-like': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-skip': '0 0 20px rgba(239, 68, 68, 0.3)',
        'glow-unseen': '0 0 20px rgba(59, 130, 246, 0.3)',
      },
      
      // Typography scale
      fontSize: {
        'card-title': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
        'card-subtitle': ['1rem', { lineHeight: '1.4', fontWeight: '500' }],
        'card-meta': ['0.875rem', { lineHeight: '1.4', fontWeight: '400' }],
        'pill': ['0.75rem', { lineHeight: '1', fontWeight: '600' }],
        'nav-tab': ['0.875rem', { lineHeight: '1.2', fontWeight: '600' }],
      },
      
      // Z-index scale
      zIndex: {
        'card-stack-4': '10',
        'card-stack-3': '20',
        'card-stack-2': '30',
        'card-stack-1': '40',
        'overlay': '50',
        'nav': '100',
        'modal': '1000',
      },
      
      // Backdrop blur
      backdropBlur: {
        'card': '8px',
        'nav': '12px',
        'overlay': '16px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;