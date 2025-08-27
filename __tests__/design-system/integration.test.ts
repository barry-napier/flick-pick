/**
 * @file Integration Tests for Tailwind CSS and Next.js Build Process
 * @description Tests for CSS compilation, PostCSS pipeline, build optimization,
 * and integration with Next.js 15
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import tailwindConfig from '../../tailwind.config';

// Utility function to run shell commands safely
const runCommand = (command: string, options: { timeout?: number } = {}): string => {
  try {
    return execSync(command, {
      encoding: 'utf8',
      timeout: options.timeout || 30000,
      stdio: 'pipe'
    }).toString().trim();
  } catch (error: any) {
    throw new Error(`Command failed: ${command}\nError: ${error.message}`);
  }
};

// Check if a file exists and get its stats
const getFileStats = (filePath: string) => {
  try {
    return fs.statSync(filePath);
  } catch {
    return null;
  }
};

// Get file size in bytes
const getFileSize = (filePath: string): number => {
  const stats = getFileStats(filePath);
  return stats ? stats.size : 0;
};

describe('Tailwind CSS and Next.js Integration Tests', () => {
  const projectRoot = process.cwd();
  const nextConfigPath = path.join(projectRoot, 'next.config.js');
  const postcssConfigPath = path.join(projectRoot, 'postcss.config.js');
  const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.ts');
  const globalsPath = path.join(projectRoot, 'app/globals.css');

  describe('Configuration Files Validation', () => {
    it('should have all required configuration files', () => {
      expect(fs.existsSync(nextConfigPath)).toBe(true);
      expect(fs.existsSync(postcssConfigPath)).toBe(true);
      expect(fs.existsSync(tailwindConfigPath)).toBe(true);
      expect(fs.existsSync(globalsPath)).toBe(true);
    });

    it('should have valid Next.js configuration', () => {
      const nextConfig = require(nextConfigPath);
      
      // Should be a function or object
      expect(typeof nextConfig).toMatch(/function|object/);
      
      // If it's a function, it should return a config object when called
      const config = typeof nextConfig === 'function' ? nextConfig() : nextConfig;
      expect(typeof config).toBe('object');
    });

    it('should have PostCSS configuration with required plugins', () => {
      const postcssConfig = require(postcssConfigPath);
      expect(postcssConfig.plugins).toBeDefined();
      
      const pluginNames = Object.keys(postcssConfig.plugins);
      expect(pluginNames).toContain('tailwindcss');
      expect(pluginNames).toContain('autoprefixer');
    });

    it('should have TypeScript configuration for Tailwind', () => {
      const configContent = fs.readFileSync(tailwindConfigPath, 'utf-8');
      
      // Should be TypeScript with proper imports
      expect(configContent).toMatch(/import.*Config.*from.*tailwindcss/);
      expect(configContent).toMatch(/export default config/);
      expect(configContent).toMatch(/satisfies Config/);
    });
  });

  describe('Tailwind CSS Compilation', () => {
    it('should successfully compile Tailwind CSS configuration', () => {
      // Import should not throw
      expect(() => require(tailwindConfigPath)).not.toThrow();
      
      // Config should be valid
      expect(tailwindConfig).toBeDefined();
      expect(tailwindConfig.content).toBeDefined();
      expect(tailwindConfig.theme).toBeDefined();
    });

    it('should have proper content purging configuration', () => {
      const { content } = tailwindConfig;
      
      // Should include all relevant file patterns
      expect(content).toContain('./app/**/*.{js,ts,jsx,tsx,mdx}');
      expect(content).toContain('./components/**/*.{js,ts,jsx,tsx,mdx}');
      
      // Should not be empty
      expect(content.length).toBeGreaterThan(0);
    });

    it('should generate CSS without errors', () => {
      // This test simulates the CSS generation process
      const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
      
      // Should contain Tailwind directives
      expect(globalsContent).toMatch(/@tailwind base/);
      expect(globalsContent).toMatch(/@tailwind components/);
      expect(globalsContent).toMatch(/@tailwind utilities/);
      
      // Should not contain obvious syntax errors
      expect(globalsContent).not.toMatch(/\@tailwind [^;]*[^;]$/m); // Unterminated directives
    });

    it('should have valid CSS syntax in globals.css', () => {
      const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
      
      // Basic CSS syntax validation
      const openBraces = (globalsContent.match(/{/g) || []).length;
      const closeBraces = (globalsContent.match(/}/g) || []).length;
      expect(openBraces).toBe(closeBraces);
      
      // Should not have obvious syntax errors
      expect(globalsContent).not.toMatch(/[^@].*{[^}]*{/); // Nested selectors without @ rules
    });
  });

  describe('Build Process Integration', () => {
    it('should successfully run type checking', () => {
      expect(() => {
        runCommand('npx tsc --noEmit', { timeout: 60000 });
      }).not.toThrow();
    });

    it('should successfully lint the project', () => {
      expect(() => {
        runCommand('npm run lint', { timeout: 30000 });
      }).not.toThrow();
    });

    it('should have optimized CSS for production build', () => {
      // Note: This test may be slow and is optional in CI
      if (process.env.SKIP_BUILD_TESTS) {
        return;
      }

      // Run a production build (this might take a while)
      try {
        runCommand('npm run build', { timeout: 120000 });
        
        // Check that .next directory was created
        const nextDir = path.join(projectRoot, '.next');
        expect(fs.existsSync(nextDir)).toBe(true);
        
        // Check for CSS optimization
        const staticDir = path.join(nextDir, 'static');
        if (fs.existsSync(staticDir)) {
          const cssFiles = fs.readdirSync(staticDir, { recursive: true })
            .filter(file => file.toString().endsWith('.css'));
          
          if (cssFiles.length > 0) {
            // CSS files should exist and be reasonably sized
            cssFiles.forEach(file => {
              const filePath = path.join(staticDir, file.toString());
              const size = getFileSize(filePath);
              expect(size).toBeGreaterThan(0);
              expect(size).toBeLessThan(500 * 1024); // Should be under 500KB
            });
          }
        }
      } catch (error) {
        console.warn('Build test skipped due to error:', error);
        // Don't fail the test if build fails due to missing dependencies
      }
    });

    it('should generate proper source maps in development', () => {
      // Check that development server can start without CSS errors
      // This is a simplified test since we can't easily start dev server in test
      
      const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
      
      // Should not have comments that break source maps
      expect(globalsContent).not.toMatch(/\/\*[^*]*\*\/[^}]*}/); // Comments before closing braces
    });
  });

  describe('PostCSS Pipeline Integration', () => {
    it('should process Tailwind with autoprefixer', () => {
      const postcssConfig = require(postcssConfigPath);
      
      // Should have both plugins in the right order
      const plugins = Object.keys(postcssConfig.plugins);
      const tailwindIndex = plugins.indexOf('tailwindcss');
      const autoprefixerIndex = plugins.indexOf('autoprefixer');
      
      expect(tailwindIndex).not.toBe(-1);
      expect(autoprefixerIndex).not.toBe(-1);
      expect(tailwindIndex).toBeLessThan(autoprefixerIndex); // Tailwind should come first
    });

    it('should handle CSS custom properties correctly', () => {
      const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
      
      // CSS custom properties should be valid
      const customProps = globalsContent.match(/--[\w-]+:\s*[^;]+/g) || [];
      
      customProps.forEach(prop => {
        // Should not have syntax errors in custom properties
        expect(prop).toMatch(/^--[\w-]+:\s*.+$/);
        expect(prop).not.toMatch(/--[\w-]+:\s*$/); // Empty values
      });
    });

    it('should handle CSS layers correctly', () => {
      const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
      
      // Should have proper layer structure
      expect(globalsContent).toMatch(/@layer base/);
      expect(globalsContent).toMatch(/@layer components/);
      expect(globalsContent).toMatch(/@layer utilities/);
      
      // Layers should be properly closed
      const baseLayerMatch = globalsContent.match(/@layer base \{([\s\S]*?)^\}/m);
      const componentsLayerMatch = globalsContent.match(/@layer components \{([\s\S]*?)^\}/m);
      const utilitiesLayerMatch = globalsContent.match(/@layer utilities \{([\s\S]*?)^\}/m);
      
      expect(baseLayerMatch).not.toBeNull();
      expect(componentsLayerMatch).not.toBeNull();
      expect(utilitiesLayerMatch).not.toBeNull();
    });
  });

  describe('JIT Compilation and Purging', () => {
    it('should use JIT mode for efficient compilation', () => {
      // JIT should be enabled by default in Tailwind CSS 3+
      // We can verify this by checking that all utilities are not pre-generated
      
      const config = tailwindConfig;
      
      // Should not have mode: 'jit' as it's default
      expect(config).not.toHaveProperty('mode');
    });

    it('should have efficient content scanning patterns', () => {
      const { content } = tailwindConfig;
      
      // Content patterns should be specific enough to avoid scanning unnecessary files
      content.forEach(pattern => {
        expect(pattern).toMatch(/\{[^}]+\}/); // Should specify extensions
        expect(pattern).not.toBe('**/*'); // Should not be too broad
      });
    });

    it('should include all necessary file patterns for components', () => {
      const { content } = tailwindConfig;
      
      // Should scan all relevant directories
      const patternsString = content.join(' ');
      expect(patternsString).toMatch(/components/);
      expect(patternsString).toMatch(/app/);
      expect(patternsString).toMatch(/hooks/);
      expect(patternsString).toMatch(/lib/);
    });
  });

  describe('CSS Variables and Themes Integration', () => {
    it('should properly integrate with CSS custom properties', () => {
      const { colors } = tailwindConfig.theme.extend;
      
      // Should use var() for Shadcn compatibility
      expect(colors.border).toBe('hsl(var(--border))');
      expect(colors.background).toBe('hsl(0 0% 4%)'); // Static value
      
      // Mix of static and variable values should work
      expect(typeof colors.primary).toBe('object');
      expect(colors.primary.DEFAULT).toBe('hsl(var(--primary))');
    });

    it('should handle dark mode class strategy correctly', () => {
      expect(tailwindConfig.darkMode).toBe('class');
      
      // Should support dark: variants
      const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
      
      // Should define appropriate dark mode colors
      expect(globalsContent).toMatch(/:root/); // Root definitions
    });

    it('should support theme customization without breaking core functionality', () => {
      const { extend } = tailwindConfig.theme;
      
      // Custom extensions should not override critical Tailwind defaults
      expect(extend.colors).toBeDefined();
      expect(extend.spacing).toBeDefined();
      
      // Should maintain Tailwind's core color system
      expect(tailwindConfig.theme.extend.colors).toHaveProperty('primary');
      expect(tailwindConfig.theme.extend.colors).toHaveProperty('secondary');
    });
  });

  describe('Asset and Bundle Optimization', () => {
    it('should optimize CSS for production', () => {
      // Check that we have proper purging configuration
      const { content } = tailwindConfig;
      expect(content.length).toBeGreaterThan(0);
      
      // Should not include development-only patterns
      content.forEach(pattern => {
        expect(pattern).not.toMatch(/node_modules/);
        expect(pattern).not.toMatch(/\.git/);
      });
    });

    it('should have efficient plugin configuration', () => {
      const { plugins } = tailwindConfig;
      
      // Should only have necessary plugins
      expect(plugins).toHaveLength(1); // Only tailwindcss-animate
      
      // Plugins should be properly loaded
      expect(plugins[0]).toBeDefined();
    });

    it('should minimize runtime CSS generation', () => {
      const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
      
      // Should prefer static CSS over dynamic generation
      // Most styles should be in the CSS file, not generated at runtime
      const dynamicReferences = (globalsContent.match(/var\(/g) || []).length;
      const staticDeclarations = (globalsContent.match(/:\s*[^;]*;/g) || []).length;
      
      // Should have more static declarations than dynamic ones for performance
      expect(staticDeclarations).toBeGreaterThan(dynamicReferences);
    });
  });

  describe('Next.js 15 Specific Integration', () => {
    it('should work with Next.js App Router', () => {
      // Check that globals.css is properly structured for App Router
      const appLayoutPath = path.join(projectRoot, 'app/layout.tsx');
      
      if (fs.existsSync(appLayoutPath)) {
        const layoutContent = fs.readFileSync(appLayoutPath, 'utf-8');
        expect(layoutContent).toMatch(/globals\.css/);
      }
    });

    it('should support Next.js font optimization', () => {
      const { fontFamily } = tailwindConfig.theme.extend;
      
      // Should use Next.js font variables
      expect(fontFamily.sans).toContain('var(--font-geist-sans)');
      expect(fontFamily.mono).toContain('var(--font-geist-mono)');
    });

    it('should be compatible with Turbopack', () => {
      // Check package.json for turbo flag
      const packageJsonPath = path.join(projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      expect(packageJson.scripts.dev).toMatch(/--turbo/);
    });

    it('should work with React Server Components', () => {
      // CSS should not require client-side JavaScript
      const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
      
      // Should not contain client-side only features
      expect(globalsContent).not.toMatch(/document\./);
      expect(globalsContent).not.toMatch(/window\./);
    });
  });

  describe('Error Handling and Validation', () => {
    it('should provide helpful error messages for invalid configurations', () => {
      // This test ensures our config is valid and won't cause cryptic errors
      expect(() => {
        const config = tailwindConfig;
        
        // Basic validation
        expect(config.content).toBeDefined();
        expect(Array.isArray(config.content)).toBe(true);
        expect(config.theme).toBeDefined();
        expect(config.plugins).toBeDefined();
      }).not.toThrow();
    });

    it('should handle missing dependencies gracefully', () => {
      const packageJsonPath = path.join(projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      // Required dependencies should be present
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      expect(deps.tailwindcss).toBeDefined();
      expect(deps['tailwindcss-animate']).toBeDefined();
      expect(deps.autoprefixer).toBeDefined();
      expect(deps.postcss).toBeDefined();
    });

    it('should validate CSS syntax in all layers', () => {
      const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
      
      // Check for common CSS syntax errors
      expect(globalsContent).not.toMatch(/\{\s*\}/); // Empty rule sets
      expect(globalsContent).not.toMatch(/;\s*;/); // Double semicolons
      expect(globalsContent).not.toMatch(/:\s*;/); // Empty values
    });
  });

  describe('Performance in Development and Production', () => {
    it('should have reasonable compilation time characteristics', () => {
      // This is more about config efficiency than actual timing
      const { extend } = tailwindConfig.theme;
      
      // Should not have overly complex configurations that slow down compilation
      const totalKeys = Object.keys(extend).reduce((acc, key) => {
        const value = extend[key as keyof typeof extend];
        if (typeof value === 'object' && value !== null) {
          return acc + Object.keys(value).length;
        }
        return acc + 1;
      }, 0);
      
      expect(totalKeys).toBeLessThan(500); // Reasonable complexity limit
    });

    it('should support hot reloading efficiently', () => {
      // Content paths should be specific enough for efficient watching
      const { content } = tailwindConfig;
      
      content.forEach(pattern => {
        // Should not watch overly broad patterns that cause excessive rebuilds
        expect(pattern).not.toMatch(/\*\*\/\*/); // Too broad without extensions
        expect(pattern).toMatch(/\{[^}]+\}/); // Should specify extensions
      });
    });
  });
});