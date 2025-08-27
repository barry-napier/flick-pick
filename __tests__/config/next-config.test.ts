import nextConfig from '../../next.config.js'

describe('Next.js Configuration', () => {
  it('should have correct image optimization settings for TMDB', () => {
    const { images } = nextConfig
    
    expect(images.remotePatterns).toHaveLength(1)
    
    const tmdbPattern = images.remotePatterns[0]
    expect(tmdbPattern.protocol).toBe('https')
    expect(tmdbPattern.hostname).toBe('image.tmdb.org')
    expect(tmdbPattern.port).toBe('')
    expect(tmdbPattern.pathname).toBe('/t/p/**')
  })

  it('should support modern image formats', () => {
    const { images } = nextConfig
    
    expect(images.formats).toContain('image/webp')
    expect(images.formats).toContain('image/avif')
  })

  it('should have appropriate device sizes for responsive images', () => {
    const { images } = nextConfig
    
    const expectedDeviceSizes = [400, 500, 640, 750, 828, 1080, 1200]
    expect(images.deviceSizes).toEqual(expectedDeviceSizes)
  })

  it('should have appropriate image sizes for movie cards', () => {
    const { images } = nextConfig
    
    const expectedImageSizes = [140, 200, 400, 500, 600, 750]
    expect(images.imageSizes).toEqual(expectedImageSizes)
  })

  it('should remove console logs in production', () => {
    const originalEnv = process.env.NODE_ENV
    
    // Test production environment
    process.env.NODE_ENV = 'production'
    
    // Re-require the config to get updated environment
    delete require.cache[require.resolve('../../next.config.js')]
    const prodConfig = require('../../next.config.js')
    
    expect(prodConfig.compiler.removeConsole).toBe(true)
    
    // Test development environment
    process.env.NODE_ENV = 'development'
    delete require.cache[require.resolve('../../next.config.js')]
    const devConfig = require('../../next.config.js')
    
    expect(devConfig.compiler.removeConsole).toBe(false)
    
    // Restore original environment
    process.env.NODE_ENV = originalEnv
  })

  it('should have security headers configured', async () => {
    expect(typeof nextConfig.headers).toBe('function')
    
    const headers = await nextConfig.headers()
    expect(headers).toHaveLength(1)
    
    const globalHeaders = headers[0]
    expect(globalHeaders.source).toBe('/(.*)')
    expect(globalHeaders.headers).toHaveLength(3)
    
    // Check X-Frame-Options
    const frameOptions = globalHeaders.headers.find(h => h.key === 'X-Frame-Options')
    expect(frameOptions.value).toBe('DENY')
    
    // Check X-Content-Type-Options
    const contentTypeOptions = globalHeaders.headers.find(h => h.key === 'X-Content-Type-Options')
    expect(contentTypeOptions.value).toBe('nosniff')
    
    // Check Referrer-Policy
    const referrerPolicy = globalHeaders.headers.find(h => h.key === 'Referrer-Policy')
    expect(referrerPolicy.value).toBe('strict-origin-when-cross-origin')
  })

  it('should conditionally include bundle analyzer', () => {
    const originalAnalyze = process.env.ANALYZE
    
    // Test without bundle analyzer
    process.env.ANALYZE = 'false'
    delete require.cache[require.resolve('../../next.config.js')]
    const configWithoutAnalyzer = require('../../next.config.js')
    
    expect(configWithoutAnalyzer.webpack).toBeUndefined()
    
    // Test with bundle analyzer
    process.env.ANALYZE = 'true'
    delete require.cache[require.resolve('../../next.config.js')]
    const configWithAnalyzer = require('../../next.config.js')
    
    expect(typeof configWithAnalyzer.webpack).toBe('function')
    
    // Restore original environment
    if (originalAnalyze) {
      process.env.ANALYZE = originalAnalyze
    } else {
      delete process.env.ANALYZE
    }
  })

  it('should have experimental features disabled by default', () => {
    expect(nextConfig.experimental).toBeDefined()
    
    // React Compiler should be commented out/disabled for now
    expect(nextConfig.experimental.reactCompiler).toBeUndefined()
  })

  it('should be a valid Next.js configuration', () => {
    expect(typeof nextConfig).toBe('object')
    expect(nextConfig).not.toBeNull()
    
    // Basic structure validation
    expect(nextConfig.images).toBeDefined()
    expect(nextConfig.compiler).toBeDefined()
    expect(nextConfig.experimental).toBeDefined()
  })
})

describe('Next.js Image Optimization Performance', () => {
  it('should have efficient image sizes for movie discovery app', () => {
    const { images } = nextConfig
    
    // Movie card sizes should cover common use cases
    // 140x200 for "For You" section thumbnails
    // 400x600 for main movie cards on mobile
    // 500x750 for main movie cards on desktop
    expect(images.imageSizes).toContain(140)
    expect(images.imageSizes).toContain(200)
    expect(images.imageSizes).toContain(400)
    expect(images.imageSizes).toContain(500)
  })

  it('should support devices from mobile to desktop', () => {
    const { images } = nextConfig
    
    // Device sizes should cover mobile (400-500), tablet (640-828), desktop (1080+)
    const minMobileSize = Math.min(...images.deviceSizes)
    const maxDesktopSize = Math.max(...images.deviceSizes)
    
    expect(minMobileSize).toBeLessThanOrEqual(500)
    expect(maxDesktopSize).toBeGreaterThanOrEqual(1080)
  })
})

describe('Next.js Security Configuration', () => {
  it('should prevent clickjacking with X-Frame-Options', async () => {
    const headers = await nextConfig.headers()
    const frameHeader = headers[0].headers.find(h => h.key === 'X-Frame-Options')
    
    expect(frameHeader.value).toBe('DENY')
  })

  it('should prevent MIME type sniffing', async () => {
    const headers = await nextConfig.headers()
    const contentTypeHeader = headers[0].headers.find(h => h.key === 'X-Content-Type-Options')
    
    expect(contentTypeHeader.value).toBe('nosniff')
  })

  it('should have secure referrer policy', async () => {
    const headers = await nextConfig.headers()
    const referrerHeader = headers[0].headers.find(h => h.key === 'Referrer-Policy')
    
    expect(referrerHeader.value).toBe('strict-origin-when-cross-origin')
  })

  it('should apply security headers to all routes', async () => {
    const headers = await nextConfig.headers()
    
    expect(headers[0].source).toBe('/(.*)')
  })
})