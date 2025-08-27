import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

/**
 * Basic validation tests to ensure FlickPick project foundation is ready
 * These tests validate the core setup without complex edge cases
 */

describe('FlickPick Foundation Setup Validation', () => {
  describe('Project Structure', () => {
    it('should have all required directories', () => {
      const requiredDirs = [
        'app',
        'components',
        'lib',
        'prisma',
        '__tests__'
      ]

      requiredDirs.forEach(dir => {
        const dirPath = join(process.cwd(), dir)
        expect(existsSync(dirPath)).toBe(true)
      })
    })

    it('should have all required configuration files', () => {
      const requiredFiles = [
        'package.json',
        'tsconfig.json',
        'next.config.js',
        'tailwind.config.ts',
        'jest.config.js',
        'jest.setup.js'
      ]

      requiredFiles.forEach(file => {
        const filePath = join(process.cwd(), file)
        expect(existsSync(filePath)).toBe(true)
      })
    })
  })

  describe('Package Configuration', () => {
    it('should have correct Next.js version', () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
      expect(packageJson.dependencies.next).toMatch(/^15\./)
      expect(packageJson.dependencies.react).toMatch(/^19\./)
      expect(packageJson.dependencies['react-dom']).toMatch(/^19\./)
    })

    it('should have all test scripts', () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
      expect(packageJson.scripts.test).toBe('jest')
      expect(packageJson.scripts['test:coverage']).toBe('jest --coverage')
      expect(packageJson.scripts['test:e2e']).toBe('playwright test')
    })

    it('should have testing dependencies', () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
      const devDeps = packageJson.devDependencies
      
      expect(devDeps.jest).toBeDefined()
      expect(devDeps['@testing-library/react']).toBeDefined()
      expect(devDeps['@testing-library/jest-dom']).toBeDefined()
      expect(devDeps['@playwright/test']).toBeDefined()
    })
  })

  describe('TypeScript Configuration', () => {
    it('should have strict mode enabled', () => {
      const tsconfig = JSON.parse(readFileSync('tsconfig.json', 'utf8'))
      expect(tsconfig.compilerOptions.strict).toBe(true)
    })

    it('should have path mapping configured', () => {
      const tsconfig = JSON.parse(readFileSync('tsconfig.json', 'utf8'))
      expect(tsconfig.compilerOptions.paths).toBeDefined()
      expect(tsconfig.compilerOptions.paths['@/*']).toEqual(['./*'])
    })
  })

  describe('Next.js Configuration', () => {
    it('should have image optimization configured', () => {
      const nextConfigContent = readFileSync('next.config.js', 'utf8')
      expect(nextConfigContent).toMatch(/images/)
      expect(nextConfigContent).toMatch(/remotePatterns/)
      expect(nextConfigContent).toMatch(/image\.tmdb\.org/)
    })

    it('should have security headers', () => {
      const nextConfigContent = readFileSync('next.config.js', 'utf8')
      expect(nextConfigContent).toMatch(/headers/)
      expect(nextConfigContent).toMatch(/X-Frame-Options/)
    })
  })

  describe('Database Configuration', () => {
    it('should have Prisma schema', () => {
      const schemaPath = join('prisma', 'schema.prisma')
      expect(existsSync(schemaPath)).toBe(true)
      
      const schema = readFileSync(schemaPath, 'utf8')
      expect(schema).toMatch(/model Movie/)
      expect(schema).toMatch(/model Vote/)
      expect(schema).toMatch(/model Genre/)
    })

    it('should use SQLite provider', () => {
      const schema = readFileSync(join('prisma', 'schema.prisma'), 'utf8')
      expect(schema).toMatch(/provider\s*=\s*"sqlite"/)
    })
  })

  describe('Test Infrastructure', () => {
    it('should have Jest configured', () => {
      const jestConfig = readFileSync('jest.config.js', 'utf8')
      expect(jestConfig).toMatch(/createJestConfig/)
      expect(jestConfig).toMatch(/setupFilesAfterEnv/)
      expect(jestConfig).toMatch(/coverage/)
    })

    it('should have test setup file', () => {
      expect(existsSync('jest.setup.js')).toBe(true)
      
      const setup = readFileSync('jest.setup.js', 'utf8')
      expect(setup).toMatch(/@testing-library\/jest-dom/)
      expect(setup).toMatch(/next\/router/)
      expect(setup).toMatch(/next\/navigation/)
    })

    it('should have Playwright configuration', () => {
      expect(existsSync('playwright.config.ts')).toBe(true)
      
      const config = readFileSync('playwright.config.ts', 'utf8')
      expect(config).toMatch(/testDir.*e2e/)
      expect(config).toMatch(/webServer/)
    })
  })

  describe('Styling Configuration', () => {
    it('should have Tailwind configured', () => {
      const tailwindConfig = readFileSync('tailwind.config.ts', 'utf8')
      expect(tailwindConfig).toMatch(/darkMode.*class/)
      expect(tailwindConfig).toMatch(/app\/.*tsx/)
      expect(tailwindConfig).toMatch(/components\/.*tsx/)
    })

    it('should have global styles', () => {
      const globalStyles = join('app', 'globals.css')
      expect(existsSync(globalStyles)).toBe(true)
      
      const styles = readFileSync(globalStyles, 'utf8')
      expect(styles).toMatch(/@tailwind base/)
      expect(styles).toMatch(/@tailwind components/)
      expect(styles).toMatch(/@tailwind utilities/)
    })
  })

  describe('Application Structure', () => {
    it('should have Next.js App Router layout', () => {
      const layoutPath = join('app', 'layout.tsx')
      expect(existsSync(layoutPath)).toBe(true)
      
      const layout = readFileSync(layoutPath, 'utf8')
      expect(layout).toMatch(/export.*metadata/)
      expect(layout).toMatch(/export.*viewport/)
      expect(layout).toMatch(/RootLayout/)
    })

    it('should have main page', () => {
      const pagePath = join('app', 'page.tsx')
      expect(existsSync(pagePath)).toBe(true)
      
      const page = readFileSync(pagePath, 'utf8')
      expect(page).toMatch(/HomePage/)
      expect(page).toMatch(/FlickPick/)
    })

    it('should have utility functions', () => {
      const utilsPath = join('lib', 'utils.ts')
      expect(existsSync(utilsPath)).toBe(true)
      
      const utils = readFileSync(utilsPath, 'utf8')
      expect(utils).toMatch(/export.*cn/)
      expect(utils).toMatch(/formatRuntime/)
      expect(utils).toMatch(/getTmdbImageUrl/)
    })
  })

  describe('Development Workflow', () => {
    it('should have proper git ignore', () => {
      expect(existsSync('.gitignore')).toBe(true)
      
      const gitignore = readFileSync('.gitignore', 'utf8')
      expect(gitignore).toMatch(/node_modules/)
      expect(gitignore).toMatch(/\.next/)
      expect(gitignore).toMatch(/\.env/)
    })

    it('should have development scripts', () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
      const scripts = packageJson.scripts
      
      expect(scripts.dev).toMatch(/next dev.*turbo/)
      expect(scripts.build).toMatch(/next build/)
      expect(scripts.start).toBe('next start')
      expect(scripts.lint).toBe('next lint')
    })

    it('should have database scripts', () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
      const scripts = packageJson.scripts
      
      expect(scripts['db:push']).toBe('prisma db push')
      expect(scripts['db:seed']).toBe('tsx prisma/seed.ts')
      expect(scripts['db:studio']).toBe('prisma studio')
    })
  })
})

describe('Test Coverage Validation', () => {
  it('should have comprehensive test structure', () => {
    const testDirs = [
      '__tests__/config',
      '__tests__/components',
      '__tests__/lib',
      '__tests__/integration',
      '__tests__/performance',
      'tests/e2e'
    ]

    testDirs.forEach(dir => {
      const dirPath = join(process.cwd(), dir)
      expect(existsSync(dirPath)).toBe(true)
    })
  })

  it('should have test files for core functionality', () => {
    const testFiles = [
      '__tests__/config/package.test.ts',
      '__tests__/config/typescript.test.ts',
      '__tests__/config/next-config.test.ts',
      '__tests__/components/layout.test.tsx',
      '__tests__/lib/utils.test.ts'
    ]

    testFiles.forEach(file => {
      const filePath = join(process.cwd(), file)
      expect(existsSync(filePath)).toBe(true)
    })
  })

  it('should have E2E test configuration', () => {
    expect(existsSync('tests/e2e/app-initialization.spec.ts')).toBe(true)
    expect(existsSync('playwright.config.ts')).toBe(true)
  })
})

describe('Ready for Phase 2 Development', () => {
  it('should have foundation complete', () => {
    // Verify all core pieces are in place
    const coreComponents = [
      'package.json',
      'tsconfig.json', 
      'next.config.js',
      'tailwind.config.ts',
      'prisma/schema.prisma',
      'app/layout.tsx',
      'app/page.tsx',
      'lib/utils.ts',
      'components/ui/button.tsx'
    ]

    coreComponents.forEach(component => {
      expect(existsSync(component)).toBe(true)
    })
  })

  it('should have proper project metadata', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
    
    expect(packageJson.name).toBe('flick-pick')
    expect(packageJson.version).toBe('1.0.0')
    expect(packageJson.description).toContain('movie discovery')
    expect(packageJson.keywords).toContain('movie')
    expect(packageJson.keywords).toContain('swipe')
  })

  it('should validate test infrastructure is working', () => {
    // This test itself validates that Jest is working
    expect(true).toBe(true)
    
    // Validate test utilities are available
    expect(expect).toBeDefined()
    expect(describe).toBeDefined()
    expect(it).toBeDefined()
  })
})