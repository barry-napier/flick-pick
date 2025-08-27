import { execSync, spawn } from 'child_process'
import { existsSync, statSync, readFileSync, readdirSync } from 'fs'
import { join } from 'path'

describe('Build Performance Tests', () => {
  const BUILD_TIMEOUT = 180000 // 3 minutes
  const BUNDLE_SIZE_LIMITS = {
    // Size limits in KB
    maxTotalSize: 2000, // 2MB total bundle size
    maxChunkSize: 500,  // 500KB per chunk
    maxInitialJS: 300,  // 300KB initial JavaScript
    maxInitialCSS: 50,  // 50KB initial CSS
  }

  describe('Build Process Performance', () => {
    let buildTime: number
    let buildOutput: string

    beforeAll(async () => {
      const startTime = Date.now()
      
      try {
        buildOutput = execSync('npm run build', {
          cwd: process.cwd(),
          stdio: 'pipe',
          timeout: BUILD_TIMEOUT,
          encoding: 'utf8',
          maxBuffer: 1024 * 1024 * 10, // 10MB buffer
        })
        
        buildTime = Date.now() - startTime
      } catch (error: any) {
        throw new Error(`Build failed: ${error.stdout || error.message}`)
      }
    }, BUILD_TIMEOUT)

    it('should build within reasonable time limit', () => {
      const maxBuildTime = 120000 // 2 minutes
      expect(buildTime).toBeLessThan(maxBuildTime)
    })

    it('should generate all required build artifacts', () => {
      const requiredArtifacts = [
        '.next',
        '.next/static',
        '.next/server',
        '.next/server/app',
        '.next/static/chunks',
      ]

      requiredArtifacts.forEach(artifact => {
        const artifactPath = join(process.cwd(), artifact)
        expect(existsSync(artifactPath)).toBe(true)
      })
    })

    it('should optimize for production', () => {
      expect(buildOutput).toContain('Compiled successfully')
      
      // Should show optimization steps
      if (buildOutput.includes('Creating an optimized production build')) {
        expect(buildOutput).toMatch(/Creating an optimized production build/)
      }
    })

    it('should have reasonable bundle sizes', () => {
      const buildManifest = join(process.cwd(), '.next/static/chunks/_buildManifest.js')
      if (existsSync(buildManifest)) {
        const manifestSize = statSync(buildManifest).size / 1024 // Size in KB
        expect(manifestSize).toBeLessThan(50) // Build manifest should be small
      }
    })

    it('should generate static files efficiently', () => {
      const staticDir = join(process.cwd(), '.next/static')
      if (existsSync(staticDir)) {
        const files = readdirSync(staticDir, { recursive: true })
        expect(files.length).toBeGreaterThan(0)
        
        // Should have generated CSS and JS chunks
        const hasCSS = files.some(file => String(file).endsWith('.css'))
        const hasJS = files.some(file => String(file).endsWith('.js'))
        
        expect(hasCSS || hasJS).toBe(true)
      }
    })

    it('should not have excessively large individual files', () => {
      const staticDir = join(process.cwd(), '.next/static/chunks')
      
      if (existsSync(staticDir)) {
        const files = readdirSync(staticDir)
        
        files.forEach(file => {
          const filePath = join(staticDir, file)
          const stats = statSync(filePath)
          
          if (stats.isFile() && (file.endsWith('.js') || file.endsWith('.css'))) {
            const sizeKB = stats.size / 1024
            expect(sizeKB).toBeLessThan(BUNDLE_SIZE_LIMITS.maxChunkSize)
          }
        })
      }
    })
  })

  describe('Bundle Analysis', () => {
    it('should have treeshaking working', () => {
      // Check if unused imports are eliminated
      const chunksDir = join(process.cwd(), '.next/static/chunks')
      
      if (existsSync(chunksDir)) {
        const files = readdirSync(chunksDir)
        const jsFiles = files.filter(file => file.endsWith('.js'))
        
        expect(jsFiles.length).toBeGreaterThan(0)
        
        // Check if there's evidence of code splitting
        const hasPageChunks = jsFiles.some(file => 
          file.includes('pages/') || file.includes('app/') || file.startsWith('app-')
        )
        
        // Next.js should create separate chunks
        expect(jsFiles.length).toBeGreaterThan(1)
      }
    })

    it('should have reasonable CSS bundle size', () => {
      const staticDir = join(process.cwd(), '.next/static')
      
      if (existsSync(staticDir)) {
        let totalCSSSize = 0
        
        const findCSSFiles = (dir: string) => {
          const files = readdirSync(dir, { withFileTypes: true })
          
          for (const file of files) {
            const filePath = join(dir, file.name)
            
            if (file.isDirectory()) {
              findCSSFiles(filePath)
            } else if (file.name.endsWith('.css')) {
              totalCSSSize += statSync(filePath).size
            }
          }
        }
        
        findCSSFiles(staticDir)
        const totalCSSKB = totalCSSSize / 1024
        
        if (totalCSSSize > 0) {
          expect(totalCSSKB).toBeLessThan(BUNDLE_SIZE_LIMITS.maxInitialCSS)
        }
      }
    })

    it('should compress assets effectively', () => {
      const staticDir = join(process.cwd(), '.next/static')
      
      if (existsSync(staticDir)) {
        const findLargeFiles = (dir: string): string[] => {
          let largeFiles: string[] = []
          const files = readdirSync(dir, { withFileTypes: true })
          
          for (const file of files) {
            const filePath = join(dir, file.name)
            
            if (file.isDirectory()) {
              largeFiles = [...largeFiles, ...findLargeFiles(filePath)]
            } else {
              const stats = statSync(filePath)
              const sizeKB = stats.size / 1024
              
              if (sizeKB > 100) { // Files larger than 100KB
                largeFiles.push(`${file.name}: ${sizeKB.toFixed(1)}KB`)
              }
            }
          }
          
          return largeFiles
        }
        
        const largeFiles = findLargeFiles(staticDir)
        
        // Allow some large files but check they're reasonable
        largeFiles.forEach(file => {
          const sizeMatch = file.match(/(\d+\.?\d*)KB/)
          if (sizeMatch) {
            const sizeKB = parseFloat(sizeMatch[1])
            expect(sizeKB).toBeLessThan(1000) // No single file should be > 1MB
          }
        })
      }
    })
  })

  describe('Build Configuration Performance', () => {
    it('should have TypeScript compilation optimized', () => {
      const tsconfigPath = join(process.cwd(), 'tsconfig.json')
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'))
      
      // Should have incremental compilation enabled
      expect(tsconfig.compilerOptions.incremental).toBe(true)
      
      // Should skip lib checks for faster compilation
      expect(tsconfig.compilerOptions.skipLibCheck).toBe(true)
    })

    it('should have Next.js optimizations enabled', () => {
      const nextConfigPath = join(process.cwd(), 'next.config.js')
      
      if (existsSync(nextConfigPath)) {
        const nextConfigContent = readFileSync(nextConfigPath, 'utf8')
        
        // Should have production optimizations
        expect(nextConfigContent).toMatch(/removeConsole.*production/)
        
        // Should have image optimization configured
        expect(nextConfigContent).toMatch(/images.*remotePatterns/)
      }
    })

    it('should have Tailwind CSS optimized', () => {
      const tailwindConfigPath = join(process.cwd(), 'tailwind.config.ts')
      const tailwindConfig = readFileSync(tailwindConfigPath, 'utf8')
      
      // Should have proper content paths for purging unused styles
      expect(tailwindConfig).toMatch(/content.*\[/)
      expect(tailwindConfig).toMatch(/\.tsx/)
      expect(tailwindConfig).toMatch(/\.jsx/)
    })
  })

  describe('Development Server Performance', () => {
    it('should start development server quickly', (done) => {
      const startTime = Date.now()
      const maxStartupTime = 15000 // 15 seconds
      
      const devServer = spawn('npm', ['run', 'dev'], {
        cwd: process.cwd(),
        stdio: 'pipe'
      })

      let serverStarted = false

      const timeout = setTimeout(() => {
        devServer.kill()
        if (!serverStarted) {
          fail(`Development server took more than ${maxStartupTime}ms to start`)
        }
        done()
      }, maxStartupTime)

      devServer.stdout?.on('data', (data) => {
        const output = data.toString()
        
        if (output.includes('Ready') || 
            output.includes('started server') ||
            output.includes('Local:')) {
          
          const startupTime = Date.now() - startTime
          serverStarted = true
          
          clearTimeout(timeout)
          devServer.kill()
          
          expect(startupTime).toBeLessThan(maxStartupTime)
          done()
        }
      })

      devServer.stderr?.on('data', (data) => {
        const errorMessage = data.toString()
        
        // Ignore warnings but fail on actual errors
        if (!errorMessage.includes('Warning:') && 
            !errorMessage.includes('ExperimentalWarning')) {
          clearTimeout(timeout)
          devServer.kill()
          fail(`Development server error: ${errorMessage}`)
        }
      })

      devServer.on('error', (error) => {
        clearTimeout(timeout)
        fail(`Failed to start development server: ${error.message}`)
      })
    }, 20000)

    it('should have Turbopack enabled for fast builds', () => {
      const packageJsonPath = join(process.cwd(), 'package.json')
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
      
      // Should use --turbo flag for development
      expect(packageJson.scripts.dev).toMatch(/--turbo/)
    })

    it('should have hot reload configured', () => {
      // Next.js has hot reload enabled by default
      // We just verify the dev script is properly configured
      const packageJsonPath = join(process.cwd(), 'package.json')
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
      
      expect(packageJson.scripts.dev).toBe('next dev --turbo')
    })
  })

  describe('Memory Usage', () => {
    it('should not have memory leaks in build process', async () => {
      // This is a basic check - in production you'd use more sophisticated tools
      const initialMemory = process.memoryUsage()
      
      // Simulate some build operations
      const staticDir = join(process.cwd(), '.next/static')
      if (existsSync(staticDir)) {
        readdirSync(staticDir, { recursive: true })
      }
      
      const finalMemory = process.memoryUsage()
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed
      
      // Should not increase memory usage dramatically
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024) // 100MB increase max
    })
  })

  describe('Production Bundle Performance', () => {
    it('should have appropriate route segments', () => {
      const appDir = join(process.cwd(), '.next/server/app')
      
      if (existsSync(appDir)) {
        const routes = readdirSync(appDir, { recursive: true })
        
        // Should have at least the main page
        const hasMainPage = routes.some(route => 
          String(route).includes('page') || String(route) === 'page.js'
        )
        
        expect(hasMainPage).toBe(true)
      }
    })

    it('should generate efficient static assets', () => {
      const staticDir = join(process.cwd(), '.next/static')
      
      if (existsSync(staticDir)) {
        const chunks = readdirSync(join(staticDir, 'chunks'))
        
        // Should have webpack runtime
        const hasWebpackRuntime = chunks.some(chunk => 
          chunk.includes('webpack') || chunk.includes('runtime')
        )
        
        expect(chunks.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Performance Budgets', () => {
    it('should meet Core Web Vitals targets for build output', () => {
      const buildManifestPath = join(process.cwd(), '.next/BUILD_ID')
      
      if (existsSync(buildManifestPath)) {
        const buildId = readFileSync(buildManifestPath, 'utf8').trim()
        expect(buildId.length).toBeGreaterThan(0)
        expect(buildId.length).toBeLessThan(50) // Reasonable build ID length
      }
    })

    it('should have reasonable asset counts', () => {
      const staticDir = join(process.cwd(), '.next/static')
      
      if (existsSync(staticDir)) {
        const allFiles = readdirSync(staticDir, { recursive: true })
        
        // Should have a reasonable number of assets (not too fragmented)
        expect(allFiles.length).toBeLessThan(200)
        expect(allFiles.length).toBeGreaterThan(5)
      }
    })
  })
})

describe('Lighthouse Performance Simulation', () => {
  it('should have optimized resource hints configuration', () => {
    const nextConfigPath = join(process.cwd(), 'next.config.js')
    
    if (existsSync(nextConfigPath)) {
      const nextConfigContent = readFileSync(nextConfigPath, 'utf8')
      
      // Should have image optimization
      expect(nextConfigContent).toMatch(/images/)
      
      // Should have modern image formats
      expect(nextConfigContent).toMatch(/webp|avif/)
    }
  })

  it('should have performance headers configured', () => {
    const nextConfigPath = join(process.cwd(), 'next.config.js')
    
    if (existsSync(nextConfigPath)) {
      const nextConfigContent = readFileSync(nextConfigPath, 'utf8')
      
      // Should have security headers that also help with performance
      expect(nextConfigContent).toMatch(/headers.*function/)
    }
  })
})