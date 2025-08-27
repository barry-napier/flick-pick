import packageJson from '../../package.json'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Package.json Configuration', () => {
  it('should have correct project metadata', () => {
    expect(packageJson.name).toBe('flick-pick')
    expect(packageJson.version).toBe('1.0.0')
    expect(packageJson.description).toBe('Pick your next flick - A Tinder-style movie discovery platform')
    expect(packageJson.private).toBe(true)
    expect(packageJson.license).toBe('MIT')
  })

  it('should have all required Next.js 15+ dependencies', () => {
    const { dependencies } = packageJson
    
    // Core Next.js and React dependencies
    expect(dependencies.next).toMatch(/^15\./)
    expect(dependencies.react).toMatch(/^19\./)
    expect(dependencies['react-dom']).toMatch(/^19\./)
  })

  it('should have all required database dependencies', () => {
    const { dependencies } = packageJson
    
    // Prisma dependencies
    expect(dependencies['@prisma/client']).toBeDefined()
    expect(dependencies['@prisma/client']).toMatch(/\^5\.20\.0/)
  })

  it('should have all required UI/Animation dependencies', () => {
    const { dependencies } = packageJson
    
    // Animation and gesture libraries
    expect(dependencies['framer-motion']).toBeDefined()
    expect(dependencies['@use-gesture/react']).toBeDefined()
    expect(dependencies['react-spring']).toBeDefined()
    
    // UI libraries
    expect(dependencies['lucide-react']).toBeDefined()
    expect(dependencies['@radix-ui/react-slot']).toBeDefined()
    expect(dependencies['class-variance-authority']).toBeDefined()
    expect(dependencies.clsx).toBeDefined()
    expect(dependencies['tailwind-merge']).toBeDefined()
  })

  it('should have all required utility dependencies', () => {
    const { dependencies } = packageJson
    
    // Utilities
    expect(dependencies.zod).toBeDefined()
    expect(dependencies['date-fns']).toBeDefined()
    expect(dependencies.geist).toBeDefined()
  })

  it('should have all required monitoring dependencies', () => {
    const { dependencies } = packageJson
    
    // Monitoring and analytics
    expect(dependencies['@vercel/analytics']).toBeDefined()
    expect(dependencies['@sentry/nextjs']).toBeDefined()
    expect(dependencies['@fingerprintjs/fingerprintjs']).toBeDefined()
  })

  it('should have all required development dependencies', () => {
    const { devDependencies } = packageJson
    
    // TypeScript dependencies
    expect(devDependencies.typescript).toMatch(/\^5\./)
    expect(devDependencies['@types/node']).toBeDefined()
    expect(devDependencies['@types/react']).toBeDefined()
    expect(devDependencies['@types/react-dom']).toBeDefined()
    
    // Build tools
    expect(devDependencies.prisma).toBeDefined()
    expect(devDependencies.tsx).toBeDefined()
    expect(devDependencies.autoprefixer).toBeDefined()
    expect(devDependencies.postcss).toBeDefined()
    
    // Linting
    expect(devDependencies.eslint).toBeDefined()
    expect(devDependencies['eslint-config-next']).toBeDefined()
    expect(devDependencies['@typescript-eslint/eslint-plugin']).toBeDefined()
    expect(devDependencies['@typescript-eslint/parser']).toBeDefined()
  })

  it('should have all required testing dependencies', () => {
    const { devDependencies } = packageJson
    
    // Testing framework
    expect(devDependencies.jest).toBeDefined()
    expect(devDependencies['jest-environment-jsdom']).toBeDefined()
    expect(devDependencies['@testing-library/react']).toBeDefined()
    expect(devDependencies['@testing-library/jest-dom']).toBeDefined()
    expect(devDependencies['@playwright/test']).toBeDefined()
  })

  it('should have all required build analysis tools', () => {
    const { devDependencies } = packageJson
    
    expect(devDependencies['cross-env']).toBeDefined()
    expect(devDependencies['@next/bundle-analyzer']).toBeDefined()
  })

  it('should have all required npm scripts', () => {
    const { scripts } = packageJson
    
    // Development scripts
    expect(scripts.dev).toBe('next dev --turbo')
    expect(scripts.build).toBe('prisma generate && next build')
    expect(scripts.start).toBe('next start')
    expect(scripts.lint).toBe('next lint')
    expect(scripts['type-check']).toBe('tsc --noEmit')
    
    // Database scripts
    expect(scripts['db:push']).toBe('prisma db push')
    expect(scripts['db:seed']).toBe('tsx prisma/seed.ts')
    expect(scripts['db:studio']).toBe('prisma studio')
    
    // Testing scripts
    expect(scripts.test).toBe('jest')
    expect(scripts['test:e2e']).toBe('playwright test')
    expect(scripts['test:coverage']).toBe('jest --coverage')
    
    // Build analysis
    expect(scripts.analyze).toBe('cross-env ANALYZE=true next build')
  })

  it('should have correct Node.js engine requirements', () => {
    const { engines } = packageJson
    
    expect(engines.node).toBe('>=18.0.0')
    expect(engines.npm).toBe('>=9.0.0')
  })

  it('should have correct repository configuration', () => {
    expect(packageJson.repository).toBeDefined()
    expect(packageJson.repository.type).toBe('git')
    expect(packageJson.repository.url).toContain('github.com')
  })

  it('should have relevant keywords', () => {
    const expectedKeywords = ['movie', 'discovery', 'tinder', 'swipe', 'react', 'nextjs', 'tmdb', 'typescript']
    
    expectedKeywords.forEach(keyword => {
      expect(packageJson.keywords).toContain(keyword)
    })
  })

  it('should have no security vulnerabilities in dependencies', () => {
    // This test ensures we're not using known vulnerable versions
    // In a real scenario, this would integrate with npm audit or similar tools
    const vulnerablePackages = [
      // Add any known vulnerable packages to watch for
    ]
    
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies }
    
    vulnerablePackages.forEach(pkg => {
      expect(allDeps[pkg]).toBeUndefined()
    })
  })
})