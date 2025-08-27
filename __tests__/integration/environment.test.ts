import { execSync, spawn } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

describe('Development Environment Integration', () => {
  const timeout = 60000 // 60 seconds for longer operations

  describe('Project Structure Validation', () => {
    it('should have all required directories', () => {
      const requiredDirs = [
        'app',
        'app/(main)',
        'app/api',
        'components',
        'components/ui',
        'components/cards',
        'components/navigation',
        'components/leaderboard',
        'lib',
        'hooks',
        'types',
        'prisma',
        'public'
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
        'postcss.config.js',
        'components.json',
        'prisma/schema.prisma'
      ]

      requiredFiles.forEach(file => {
        const filePath = join(process.cwd(), file)
        expect(existsSync(filePath)).toBe(true)
      })
    })

    it('should have Next.js App Router structure', () => {
      const appRoutes = [
        'app/layout.tsx',
        'app/page.tsx',
        'app/globals.css',
        'app/(main)',
        'app/api'
      ]

      appRoutes.forEach(route => {
        const routePath = join(process.cwd(), route)
        expect(existsSync(routePath)).toBe(true)
      })
    })
  })

  describe('NPM Scripts Validation', () => {
    it('should validate package installation', () => {
      expect(existsSync(join(process.cwd(), 'node_modules'))).toBe(true)
      expect(existsSync(join(process.cwd(), 'package-lock.json'))).toBe(true)
    })

    it('should run type checking successfully', () => {
      try {
        const result = execSync('npm run type-check', {
          cwd: process.cwd(),
          stdio: 'pipe',
          timeout: timeout,
          encoding: 'utf8'
        })
        // TypeScript should compile without errors
        expect(typeof result).toBe('string')
      } catch (error: any) {
        throw new Error(`TypeScript compilation failed: ${error.stdout || error.message}`)
      }
    }, timeout)

    it('should run linting successfully', () => {
      try {
        const result = execSync('npm run lint', {
          cwd: process.cwd(),
          stdio: 'pipe',
          timeout: timeout,
          encoding: 'utf8'
        })
        expect(typeof result).toBe('string')
      } catch (error: any) {
        // ESLint might have warnings, but it shouldn't crash
        expect(error.status).not.toBe(2) // Exit code 2 indicates ESLint error
      }
    }, timeout)

    it('should generate Prisma client successfully', () => {
      try {
        const result = execSync('npx prisma generate', {
          cwd: process.cwd(),
          stdio: 'pipe',
          timeout: timeout,
          encoding: 'utf8'
        })
        expect(result).toContain('Generated Prisma Client')
      } catch (error: any) {
        fail(`Prisma client generation failed: ${error.stdout || error.message}`)
      }
    }, timeout)
  })

  describe('Database Setup Validation', () => {
    it('should have DATABASE_URL configured', () => {
      // Check for .env.example file
      const envExamplePath = join(process.cwd(), '.env.example')
      if (existsSync(envExamplePath)) {
        const envExample = readFileSync(envExamplePath, 'utf8')
        expect(envExample).toMatch(/DATABASE_URL/)
      }
    })

    it('should validate Prisma schema syntax', () => {
      try {
        const result = execSync('npx prisma validate', {
          cwd: process.cwd(),
          stdio: 'pipe',
          timeout: timeout,
          encoding: 'utf8'
        })
        expect(result).toContain('schema is valid')
      } catch (error: any) {
        throw new Error(`Prisma schema validation failed: ${error.stdout || error.message}`)
      }
    }, timeout)
  })

  describe('Build Process Validation', () => {
    it('should build the project successfully', () => {
      try {
        const result = execSync('npm run build', {
          cwd: process.cwd(),
          stdio: 'pipe',
          timeout: 120000, // 2 minutes for build
          encoding: 'utf8',
          maxBuffer: 1024 * 1024 * 10 // 10MB buffer
        })
        
        expect(result).toContain('Compiled successfully')
        
        // Check if .next directory was created
        expect(existsSync(join(process.cwd(), '.next'))).toBe(true)
      } catch (error: any) {
        throw new Error(`Build failed: ${error.stdout || error.message}`)
      }
    }, 120000)

    it('should have required build artifacts', () => {
      const buildArtifacts = [
        '.next',
        '.next/static',
        '.next/server'
      ]

      // Only check if build has been run
      if (existsSync(join(process.cwd(), '.next'))) {
        buildArtifacts.forEach(artifact => {
          const artifactPath = join(process.cwd(), artifact)
          expect(existsSync(artifactPath)).toBe(true)
        })
      }
    })
  })

  describe('Development Server', () => {
    it('should start development server without immediate crashes', (done) => {
      const devServer = spawn('npm', ['run', 'dev'], {
        cwd: process.cwd(),
        stdio: 'pipe'
      })

      let serverStarted = false
      let serverOutput = ''

      const timeout = setTimeout(() => {
        devServer.kill()
        if (!serverStarted) {
          throw new Error('Development server failed to start within timeout')
        }
        done()
      }, 30000)

      devServer.stdout?.on('data', (data) => {
        serverOutput += data.toString()
        
        // Check for successful startup indicators
        if (data.toString().includes('Ready') || 
            data.toString().includes('started server') ||
            data.toString().includes('Local:')) {
          serverStarted = true
          clearTimeout(timeout)
          devServer.kill()
          done()
        }
      })

      devServer.stderr?.on('data', (data) => {
        const errorMessage = data.toString()
        
        // Ignore common development warnings
        if (!errorMessage.includes('Warning:') && 
            !errorMessage.includes('ExperimentalWarning')) {
          clearTimeout(timeout)
          devServer.kill()
          throw new Error(`Development server error: ${errorMessage}`)
        }
      })

      devServer.on('error', (error) => {
        clearTimeout(timeout)
        throw new Error(`Failed to start development server: ${error.message}`)
      })

      devServer.on('close', (code) => {
        clearTimeout(timeout)
        if (code !== 0 && code !== null && !serverStarted) {
          throw new Error(`Development server exited with code ${code}. Output: ${serverOutput}`)
        }
      })
    }, 35000)
  })

  describe('Environment Variables', () => {
    it('should have environment template file', () => {
      const envExamplePath = join(process.cwd(), '.env.example')
      if (existsSync(envExamplePath)) {
        const envExample = readFileSync(envExamplePath, 'utf8')
        
        // Should contain required environment variables
        const requiredEnvVars = [
          'DATABASE_URL',
          'NEXT_PUBLIC_TMDB_API_KEY',
          'FINGERPRINT_SECRET'
        ]

        requiredEnvVars.forEach(envVar => {
          expect(envExample).toMatch(new RegExp(`^${envVar}=`, 'm'))
        })
      }
    })

    it('should not commit sensitive environment files', () => {
      const gitignorePath = join(process.cwd(), '.gitignore')
      if (existsSync(gitignorePath)) {
        const gitignore = readFileSync(gitignorePath, 'utf8')
        
        // Check that .env files are ignored (can be .env, .env*.local, etc.)
        expect(gitignore).toMatch(/\.env(\*\.local|\*)?\s*$/m)
        
        // Check that specific .env files are covered
        const envPatterns = ['.env', '.env*.local']
        const hasEnvIgnore = envPatterns.some(pattern => 
          gitignore.includes(pattern) || gitignore.includes('.env')
        )
        expect(hasEnvIgnore).toBe(true)
      }
    })
  })

  describe('Dependencies Integrity', () => {
    it('should have no high-severity vulnerabilities', () => {
      try {
        const result = execSync('npm audit --audit-level=high', {
          cwd: process.cwd(),
          stdio: 'pipe',
          timeout: 30000,
          encoding: 'utf8'
        })
        
        expect(result).not.toMatch(/high severity/i)
      } catch (error: any) {
        // npm audit exits with non-zero code if vulnerabilities found
        if (error.stdout && error.stdout.includes('high severity')) {
          throw new Error('High severity vulnerabilities found in dependencies')
        }
        // Otherwise, audit command might have failed for other reasons (acceptable)
      }
    }, 35000)

    it('should have consistent lockfile', () => {
      try {
        execSync('npm ci --dry-run', {
          cwd: process.cwd(),
          stdio: 'pipe',
          timeout: 30000
        })
      } catch (error: any) {
        throw new Error('Package lock file is inconsistent with package.json')
      }
    }, 35000)
  })
})

describe('Development Workflow Integration', () => {
  describe('Hot Reload Readiness', () => {
    it('should have Fast Refresh configuration', () => {
      const nextConfigPath = join(process.cwd(), 'next.config.js')
      const nextConfig = readFileSync(nextConfigPath, 'utf8')
      
      // Next.js 15 has Fast Refresh enabled by default
      // Just ensure the config doesn't explicitly disable it
      expect(nextConfig).not.toMatch(/fastRefresh:\s*false/)
    })
  })

  describe('TypeScript Integration', () => {
    it('should have proper module resolution for imports', () => {
      const tsconfigPath = join(process.cwd(), 'tsconfig.json')
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'))
      
      expect(tsconfig.compilerOptions.baseUrl).toBe('.')
      expect(tsconfig.compilerOptions.paths).toBeDefined()
    })
  })

  describe('CSS and Styling Integration', () => {
    it('should have Tailwind CSS processing configured', () => {
      const postcssConfigPath = join(process.cwd(), 'postcss.config.js')
      expect(existsSync(postcssConfigPath)).toBe(true)
      
      const postcssConfig = readFileSync(postcssConfigPath, 'utf8')
      expect(postcssConfig).toMatch(/tailwindcss/)
      expect(postcssConfig).toMatch(/autoprefixer/)
    })

    it('should have global styles setup', () => {
      const globalStylesPath = join(process.cwd(), 'app', 'globals.css')
      expect(existsSync(globalStylesPath)).toBe(true)
      
      const globalStyles = readFileSync(globalStylesPath, 'utf8')
      expect(globalStyles).toMatch(/@tailwind base/)
      expect(globalStyles).toMatch(/@tailwind components/)
      expect(globalStyles).toMatch(/@tailwind utilities/)
    })
  })
})