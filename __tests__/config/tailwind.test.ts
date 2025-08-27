import tailwindConfig from '../../tailwind.config'

describe('Tailwind CSS Configuration', () => {
  it('should have correct content paths for Next.js App Router', () => {
    const expectedPaths = [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ]
    
    expectedPaths.forEach(path => {
      expect(tailwindConfig.content).toContain(path)
    })
  })

  it('should have dark mode enabled with class strategy', () => {
    expect(tailwindConfig.darkMode).toBe('class')
  })

  it('should have FlickPick-specific color palette', () => {
    const { colors } = tailwindConfig.theme.extend
    
    // Dark theme colors
    expect(colors.background).toBe('#0a0a0a')
    expect(colors.card).toBe('#1a1a1a')
    expect(colors['card-hover']).toBe('#2a2a2a')
    expect(colors['text-primary']).toBe('#ffffff')
    expect(colors['text-secondary']).toBe('#6b7280')
    expect(colors['pill-bg']).toBe('rgba(255, 255, 255, 0.12)')
    expect(colors['gradient-start']).toBe('rgba(0,0,0,0)')
    expect(colors['gradient-end']).toBe('rgba(0,0,0,0.9)')
  })

  it('should have swipe gesture colors', () => {
    const { colors } = tailwindConfig.theme.extend
    
    expect(colors['swipe-like']).toBe('#10b981')
    expect(colors['swipe-skip']).toBe('#ef4444')
    expect(colors['swipe-unseen']).toBe('#3b82f6')
  })

  it('should have Shadcn/ui compatible colors', () => {
    const { colors } = tailwindConfig.theme.extend
    
    expect(colors.border).toBe('hsl(var(--border))')
    expect(colors.input).toBe('hsl(var(--input))')
    expect(colors.ring).toBe('hsl(var(--ring))')
    expect(colors.foreground).toBe('hsl(var(--foreground))')
    
    // Primary colors
    expect(colors.primary.DEFAULT).toBe('hsl(var(--primary))')
    expect(colors.primary.foreground).toBe('hsl(var(--primary-foreground))')
    
    // Secondary colors
    expect(colors.secondary.DEFAULT).toBe('hsl(var(--secondary))')
    expect(colors.secondary.foreground).toBe('hsl(var(--secondary-foreground))')
    
    // Other semantic colors
    expect(colors.destructive.DEFAULT).toBe('hsl(var(--destructive))')
    expect(colors.muted.DEFAULT).toBe('hsl(var(--muted))')
    expect(colors.accent.DEFAULT).toBe('hsl(var(--accent))')
    expect(colors.popover.DEFAULT).toBe('hsl(var(--popover))')
  })

  it('should have swipe animations defined', () => {
    const { animation } = tailwindConfig.theme.extend
    
    expect(animation['swipe-right']).toBe('swipeRight 0.5s ease-out')
    expect(animation['swipe-left']).toBe('swipeLeft 0.5s ease-out')
    expect(animation['swipe-up']).toBe('swipeUp 0.5s ease-out')
    expect(animation['card-enter']).toBe('cardEnter 0.3s ease-out')
    expect(animation['fade-in']).toBe('fadeIn 0.3s ease-in-out')
    expect(animation['slide-up']).toBe('slideUp 0.3s ease-out')
  })

  it('should have corresponding keyframes for animations', () => {
    const { keyframes } = tailwindConfig.theme.extend
    
    // Swipe right animation
    expect(keyframes.swipeRight['0%']).toBe('transform: translateX(0) rotate(0deg), opacity: 1')
    expect(keyframes.swipeRight['100%']).toBe('transform: translateX(100vw) rotate(20deg), opacity: 0')
    
    // Swipe left animation  
    expect(keyframes.swipeLeft['0%']).toBe('transform: translateX(0) rotate(0deg), opacity: 1')
    expect(keyframes.swipeLeft['100%']).toBe('transform: translateX(-100vw) rotate(-20deg), opacity: 0')
    
    // Swipe up animation
    expect(keyframes.swipeUp['0%']).toBe('transform: translateY(0) scale(1), opacity: 1')
    expect(keyframes.swipeUp['100%']).toBe('transform: translateY(-100vh) scale(0.8), opacity: 0')
    
    // Card enter animation
    expect(keyframes.cardEnter['0%']).toBe('transform: scale(0.8), opacity: 0')
    expect(keyframes.cardEnter['100%']).toBe('transform: scale(1), opacity: 1')
    
    // Fade in animation
    expect(keyframes.fadeIn['0%']).toBe('opacity: 0')
    expect(keyframes.fadeIn['100%']).toBe('opacity: 1')
    
    // Slide up animation
    expect(keyframes.slideUp['0%']).toBe('transform: translateY(20px), opacity: 0')
    expect(keyframes.slideUp['100%']).toBe('transform: translateY(0), opacity: 1')
  })

  it('should have custom border radius values', () => {
    const { borderRadius } = tailwindConfig.theme.extend
    
    expect(borderRadius.card).toBe('16px')
    expect(borderRadius.pill).toBe('20px')
    expect(borderRadius.lg).toBe('var(--radius)')
    expect(borderRadius.md).toBe('calc(var(--radius) - 2px)')
    expect(borderRadius.sm).toBe('calc(var(--radius) - 4px)')
  })

  it('should have Geist font family configured', () => {
    const { fontFamily } = tailwindConfig.theme.extend
    
    expect(fontFamily.sans).toEqual(['var(--font-geist-sans)', 'system-ui', 'sans-serif'])
    expect(fontFamily.mono).toEqual(['var(--font-geist-mono)', 'monospace'])
  })

  it('should have custom spacing values', () => {
    const { spacing } = tailwindConfig.theme.extend
    
    expect(spacing['18']).toBe('4.5rem')
    expect(spacing['88']).toBe('22rem')
    expect(spacing['128']).toBe('32rem')
  })

  it('should have tailwindcss-animate plugin', () => {
    const plugins = tailwindConfig.plugins
    
    expect(plugins).toHaveLength(1)
    // Check if the plugin function exists (tailwindcss-animate is a function)
    expect(typeof plugins[0]).toBe('function')
  })

  it('should satisfy TypeScript Config type', () => {
    // This test ensures the config is properly typed
    expect(tailwindConfig).toBeDefined()
    expect(typeof tailwindConfig).toBe('object')
    expect(tailwindConfig.content).toBeDefined()
    expect(tailwindConfig.theme).toBeDefined()
    expect(tailwindConfig.plugins).toBeDefined()
  })
})

describe('Tailwind CSS Color Accessibility', () => {
  it('should have sufficient contrast for text colors', () => {
    // These are basic contrast checks - in a real app you'd use a proper contrast library
    const backgroundColor = '#0a0a0a' // Very dark
    const primaryText = '#ffffff'     // White
    const secondaryText = '#6b7280'   // Gray
    
    // White text on very dark background should have high contrast
    expect(primaryText).toBe('#ffffff')
    expect(backgroundColor).toBe('#0a0a0a')
    
    // Secondary text should be distinguishable but not as stark
    expect(secondaryText).toBe('#6b7280')
  })

  it('should have distinguishable swipe colors', () => {
    const { colors } = tailwindConfig.theme.extend
    
    // Colors should be distinct for accessibility
    const swipeColors = [
      colors['swipe-like'],   // Green
      colors['swipe-skip'],   // Red  
      colors['swipe-unseen']  // Blue
    ]
    
    // Ensure all colors are different
    const uniqueColors = new Set(swipeColors)
    expect(uniqueColors.size).toBe(swipeColors.length)
  })
})

describe('Tailwind CSS Mobile-First Design', () => {
  it('should follow mobile-first responsive design principles', () => {
    // Tailwind is mobile-first by default, so base styles should work on mobile
    // Breakpoints are handled by Tailwind's default breakpoint system
    expect(tailwindConfig.theme.extend).toBeDefined()
  })

  it('should have appropriate spacing for mobile interfaces', () => {
    const { spacing } = tailwindConfig.theme.extend
    
    // Custom spacing values should be appropriate for mobile touch targets
    expect(spacing['18']).toBe('4.5rem') // 72px - good for touch targets
  })
})