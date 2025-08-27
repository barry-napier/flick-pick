import tsConfig from '../../tsconfig.json'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

describe('TypeScript Configuration', () => {
  it('should have strict mode enabled', () => {
    expect(tsConfig.compilerOptions.strict).toBe(true)
  })

  it('should target modern JavaScript', () => {
    expect(tsConfig.compilerOptions.target).toBe('ES2022')
    expect(tsConfig.compilerOptions.lib).toContain('dom')
    expect(tsConfig.compilerOptions.lib).toContain('dom.iterable')
    expect(tsConfig.compilerOptions.lib).toContain('es6')
  })

  it('should have Next.js specific settings', () => {
    expect(tsConfig.compilerOptions.jsx).toBe('preserve')
    expect(tsConfig.compilerOptions.incremental).toBe(true)
    expect(tsConfig.compilerOptions.plugins).toEqual([{ name: 'next' }])
  })

  it('should have module resolution configured for bundler', () => {
    expect(tsConfig.compilerOptions.moduleResolution).toBe('bundler')
    expect(tsConfig.compilerOptions.module).toBe('esnext')
    expect(tsConfig.compilerOptions.esModuleInterop).toBe(true)
  })

  it('should have path mapping configured correctly', () => {
    const { paths } = tsConfig.compilerOptions
    
    expect(paths['@/*']).toEqual(['./*'])
    expect(paths['@/components/*']).toEqual(['./components/*'])
    expect(paths['@/lib/*']).toEqual(['./lib/*'])
    expect(paths['@/types/*']).toEqual(['./types/*'])
    expect(paths['@/hooks/*']).toEqual(['./hooks/*'])
    expect(paths['@/prisma/*']).toEqual(['./prisma/*'])
  })

  it('should have enhanced type checking enabled', () => {
    const { compilerOptions } = tsConfig
    
    expect(compilerOptions.forceConsistentCasingInFileNames).toBe(true)
    expect(compilerOptions.noUncheckedIndexedAccess).toBe(true)
    expect(compilerOptions.exactOptionalPropertyTypes).toBe(true)
    expect(compilerOptions.noImplicitReturns).toBe(true)
    expect(compilerOptions.noFallthroughCasesInSwitch).toBe(true)
    expect(compilerOptions.noImplicitOverride).toBe(true)
  })

  it('should include correct files', () => {
    const expectedIncludes = [
      'next-env.d.ts',
      '**/*.ts',
      '**/*.tsx',
      '.next/types/**/*.ts'
    ]
    
    expectedIncludes.forEach(pattern => {
      expect(tsConfig.include).toContain(pattern)
    })
  })

  it('should exclude node_modules', () => {
    expect(tsConfig.exclude).toContain('node_modules')
  })

  it('should have baseUrl set for absolute imports', () => {
    expect(tsConfig.compilerOptions.baseUrl).toBe('.')
  })

  it('should not emit JavaScript files (Next.js handles compilation)', () => {
    expect(tsConfig.compilerOptions.noEmit).toBe(true)
  })

  it('should allow JSON module imports', () => {
    expect(tsConfig.compilerOptions.resolveJsonModule).toBe(true)
  })

  it('should enforce isolated modules for better bundling', () => {
    expect(tsConfig.compilerOptions.isolatedModules).toBe(true)
  })
})

describe('TypeScript Environment Files', () => {
  it('should have next-env.d.ts file', () => {
    const nextEnvPath = join(process.cwd(), 'next-env.d.ts')
    expect(existsSync(nextEnvPath)).toBe(true)
    
    const content = readFileSync(nextEnvPath, 'utf8')
    expect(content).toContain('/// <reference types="next" />')
  })

  it('should have TypeScript build info excluded from git', () => {
    const buildInfoPath = join(process.cwd(), 'tsconfig.tsbuildinfo')
    
    // Check if .gitignore exists and contains the build info
    const gitignorePath = join(process.cwd(), '.gitignore')
    if (existsSync(gitignorePath)) {
      const gitignoreContent = readFileSync(gitignorePath, 'utf8')
      expect(gitignoreContent).toMatch(/tsconfig\.tsbuildinfo|\.tsbuildinfo/)
    }
  })
})

describe('TypeScript Compilation', () => {
  it('should compile without errors', async () => {
    // This test would run TypeScript compilation
    // In a real scenario, you might want to spawn a child process to run tsc --noEmit
    const { execSync } = require('child_process')
    
    try {
      execSync('npx tsc --noEmit', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        timeout: 30000 // 30 second timeout
      })
    } catch (error) {
      // If there are TypeScript errors, fail the test
      fail(`TypeScript compilation failed: ${error.stdout || error.message}`)
    }
  }, 35000) // 35 second timeout for this test
})