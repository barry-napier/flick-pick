/**
 * @file Performance Tests for Design System
 * @description Tests for animation frame rates, CSS bundle optimization,
 * hardware acceleration, and performance benchmarks
 */

import { performance } from 'perf_hooks';
import fs from 'fs';
import path from 'path';
import tailwindConfig from '../../tailwind.config';

// Mock performance API for testing
declare global {
  interface Window {
    requestAnimationFrame: (callback: FrameRequestCallback) => number;
    cancelAnimationFrame: (handle: number) => void;
  }
}

// Performance measurement utilities
class PerformanceMonitor {
  private startTime: number = 0;
  private frames: number = 0;
  private lastFrame: number = 0;
  
  start() {
    this.startTime = performance.now();
    this.frames = 0;
    this.lastFrame = this.startTime;
  }
  
  frame() {
    this.frames++;
    const now = performance.now();
    const deltaTime = now - this.lastFrame;
    this.lastFrame = now;
    return deltaTime;
  }
  
  getFPS() {
    const duration = this.lastFrame - this.startTime;
    return (this.frames * 1000) / duration;
  }
  
  getDuration() {
    return this.lastFrame - this.startTime;
  }
}

describe('Design System Performance Tests', () => {
  describe('Animation Performance and 60fps Target', () => {
    it('should use hardware-accelerated properties in keyframes', () => {
      const { keyframes } = tailwindConfig.theme.extend;
      
      // All keyframe definitions should include translateZ(0) for hardware acceleration
      const hardwareAcceleratedAnimations = [
        'swipeRight',
        'swipeLeft', 
        'swipeUp',
        'swipeDown',
        'cardEnter',
        'cardExit',
        'slideUp',
        'slideDown',
        'slideLeft',
        'slideRight'
      ];
      
      hardwareAcceleratedAnimations.forEach(animName => {
        const animation = keyframes[animName];
        expect(animation).toBeDefined();
        
        // Check that all keyframe steps include translateZ(0)
        Object.values(animation).forEach(step => {
          const stepString = typeof step === 'object' 
            ? JSON.stringify(step) 
            : step;
          expect(stepString).toMatch(/translateZ\(0\)/);
        });
      });
    });

    it('should use optimized cubic-bezier timing functions for smooth animations', () => {
      const { animation } = tailwindConfig.theme.extend;
      
      const performanceOptimizedAnimations = [
        'swipe-right',
        'swipe-left',
        'swipe-up',
        'card-enter',
        'slide-up'
      ];
      
      performanceOptimizedAnimations.forEach(animName => {
        const animationValue = animation[animName];
        expect(animationValue).toBeDefined();
        
        // Should use cubic-bezier for smooth interpolation
        expect(animationValue).toMatch(/cubic-bezier\(\d+\.?\d*,\s*\d+\.?\d*,\s*\d+\.?\d*,\s*\d+\.?\d*\)/);
      });
    });

    it('should have animation durations optimized for perceived performance', () => {
      const { animation } = tailwindConfig.theme.extend;
      
      // Swipe animations should be fast (≤ 300ms) for responsive feel
      const fastAnimations = ['swipe-right', 'swipe-left', 'swipe-up', 'swipe-down'];
      fastAnimations.forEach(animName => {
        const animationValue = animation[animName];
        const durationMatch = animationValue.match(/(\d+\.?\d*)s/);
        expect(durationMatch).not.toBeNull();
        
        const duration = parseFloat(durationMatch![1]) * 1000; // Convert to ms
        expect(duration).toBeLessThanOrEqual(300);
      });
      
      // UI animations should be quick but not jarring (≤ 400ms)
      const uiAnimations = ['card-enter', 'fade-in', 'slide-up'];
      uiAnimations.forEach(animName => {
        const animationValue = animation[animName];
        const durationMatch = animationValue.match(/(\d+\.?\d*)s/);
        expect(durationMatch).not.toBeNull();
        
        const duration = parseFloat(durationMatch![1]) * 1000;
        expect(duration).toBeLessThanOrEqual(400);
      });
    });

    it('should minimize layout thrashing with transform-only animations', () => {
      const { keyframes } = tailwindConfig.theme.extend;
      
      // Performance-critical animations should only use transform and opacity
      const performanceCriticalAnimations = [
        'swipeRight',
        'swipeLeft',
        'swipeUp',
        'cardEnter',
        'slideUp'
      ];
      
      performanceCriticalAnimations.forEach(animName => {
        const animation = keyframes[animName];
        
        Object.values(animation).forEach(step => {
          // Should only contain transform and opacity (no width, height, etc.)
          const stepString = typeof step === 'object' 
            ? JSON.stringify(step) 
            : step as string;
          
          // Check that step contains only performance-friendly properties
          if (typeof step === 'object') {
            const keys = Object.keys(step);
            keys.forEach(key => {
              expect(['transform', 'opacity']).toContain(key);
            });
          } else {
            // Remove transform and opacity to check for other properties
            const withoutTransform = stepString.replace(/transform:[^;,}]+[;,}]?/g, '');
            const withoutOpacity = withoutTransform.replace(/opacity:[^;,}]+[;,}]?/g, '');
            const remainingProperties = withoutOpacity.trim().replace(/[,\s]/g, '');
            
            // Should not have any other CSS properties that trigger layout/paint
            expect(remainingProperties).not.toMatch(/width|height|margin|padding|border|background-color|color(?!:)/);
          }
        });
      });
    });

    it('should use will-change hints for animating elements', () => {
      // This test verifies that our CSS includes will-change declarations
      const cssPath = path.join(process.cwd(), 'app/globals.css');
      
      if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        
        // Check for will-change declarations in critical animation classes
        expect(cssContent).toMatch(/will-change:\s*transform/);
        expect(cssContent).toMatch(/--will-change-transform:\s*transform/);
      }
    });

    it('should define easing functions optimized for 60fps', () => {
      // Test our custom CSS properties for optimized easing
      const cssPath = path.join(process.cwd(), 'app/globals.css');
      
      if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        
        // Verify performance-optimized easing functions are defined
        expect(cssContent).toMatch(/--ease-out-expo:\s*cubic-bezier\(0\.16,\s*1,\s*0\.3,\s*1\)/);
        expect(cssContent).toMatch(/--ease-out-circ:\s*cubic-bezier\(0\.08,\s*0\.82,\s*0\.17,\s*1\)/);
        expect(cssContent).toMatch(/--ease-out-quart:\s*cubic-bezier\(0\.25,\s*1,\s*0\.5,\s*1\)/);
      }
    });
  });

  describe('CSS Bundle Optimization', () => {
    it('should have reasonable Tailwind config complexity for build performance', () => {
      const config = tailwindConfig;
      
      // Count total color definitions
      const colorCount = Object.keys(config.theme.extend.colors).length;
      expect(colorCount).toBeLessThan(100); // Reasonable limit for build performance
      
      // Count animation definitions
      const animationCount = Object.keys(config.theme.extend.animation).length;
      expect(animationCount).toBeLessThan(50); // Should be manageable
      
      // Count keyframe definitions
      const keyframeCount = Object.keys(config.theme.extend.keyframes).length;
      expect(keyframeCount).toBeLessThan(30); // Should be focused
    });

    it('should use efficient content path patterns for PurgeCSS', () => {
      const { content } = tailwindConfig;
      
      // Should not include overly broad patterns
      content.forEach(pattern => {
        expect(pattern).not.toMatch(/\*\*\/\*\.\*/); // Too broad
        expect(pattern).toMatch(/\{[^}]+\}/); // Should specify extensions
      });
    });

    it('should have reasonable complexity in extend configurations', () => {
      const { extend } = tailwindConfig.theme;
      
      // Animation and keyframe complexity check
      const totalAnimationSteps = Object.values(extend.keyframes).reduce((acc, keyframe) => {
        return acc + Object.keys(keyframe).length;
      }, 0);
      
      expect(totalAnimationSteps).toBeLessThan(200); // Reasonable complexity limit
      
      // Color definition complexity
      const nestedColorCount = Object.values(extend.colors).reduce((acc, color) => {
        if (typeof color === 'object' && color !== null) {
          return acc + Object.keys(color).length;
        }
        return acc + 1;
      }, 0);
      
      expect(nestedColorCount).toBeLessThan(150); // Keep color system manageable
    });

    it('should minimize CSS-in-JS runtime overhead with static values', () => {
      const { colors, spacing, borderRadius } = tailwindConfig.theme.extend;
      
      // Most values should be static strings, not functions
      Object.values(colors).forEach(color => {
        if (typeof color === 'string') {
          expect(color).toMatch(/^(hsl|hsla|rgb|rgba|#|var)/);
        }
      });
      
      Object.values(spacing).forEach(space => {
        expect(typeof space).toBe('string');
      });
      
      Object.values(borderRadius).forEach(radius => {
        expect(typeof radius).toBe('string');
      });
    });

    it('should use efficient selectors to minimize CSS output', () => {
      const cssPath = path.join(process.cwd(), 'app/globals.css');
      
      if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        
        // Count complex selectors that might bloat CSS
        const complexSelectorCount = (cssContent.match(/[>+~]/g) || []).length;
        expect(complexSelectorCount).toBeLessThan(50); // Limit complex selectors
        
        // Check for overly specific selectors
        const verySpecificSelectors = cssContent.match(/\.[\w-]+\s+\.[\w-]+\s+\.[\w-]+/g) || [];
        expect(verySpecificSelectors.length).toBeLessThan(10); // Minimize specificity wars
      }
    });
  });

  describe('Runtime Performance Characteristics', () => {
    it('should use composite layers to avoid repaints', () => {
      const cssPath = path.join(process.cwd(), 'app/globals.css');
      
      if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        
        // Check for composite layer hints
        expect(cssContent).toMatch(/transform:\s*translateZ\(0\)/);
        expect(cssContent).toMatch(/backface-visibility:\s*hidden/);
        expect(cssContent).toMatch(/contain:\s*layout\s*style\s*paint/);
      }
    });

    it('should minimize forced reflows with containment', () => {
      const cssPath = path.join(process.cwd(), 'app/globals.css');
      
      if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        
        // Look for CSS containment usage
        expect(cssContent).toMatch(/contain:\s*(layout|style|paint)/);
      }
    });

    it('should optimize for mobile performance with simplified animations', () => {
      const cssPath = path.join(process.cwd(), 'app/globals.css');
      
      if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        
        // Check for mobile-specific optimizations
        expect(cssContent).toMatch(/@media\s*\(max-width:\s*640px\)/);
        expect(cssContent).toMatch(/transform-style:\s*flat/); // Simplified 3D on mobile
        expect(cssContent).toMatch(/perspective:\s*800px/); // Reduced perspective for mobile
      }
    });

    it('should have reduced animation complexity on older devices', () => {
      const cssPath = path.join(process.cwd(), 'app/globals.css');
      
      if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        
        // Check for performance scaling based on device capabilities
        expect(cssContent).toMatch(/@media\s*\(max-width:\s*480px\)/);
        expect(cssContent).toMatch(/transition-duration:\s*0\.2s/); // Faster on mobile
      }
    });
  });

  describe('Memory and Resource Efficiency', () => {
    it('should minimize CSS custom property usage for performance', () => {
      const cssPath = path.join(process.cwd(), 'app/globals.css');
      
      if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        
        // Count CSS custom properties
        const customProperties = cssContent.match(/--[\w-]+:/g) || [];
        expect(customProperties.length).toBeLessThan(100); // Reasonable limit
      }
    });

    it('should use efficient image rendering settings', () => {
      const cssPath = path.join(process.cwd(), 'app/globals.css');
      
      if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        
        // Check for optimized image rendering
        expect(cssContent).toMatch(/image-rendering:\s*-webkit-optimize-contrast/);
        expect(cssContent).toMatch(/image-rendering:\s*crisp-edges/);
      }
    });

    it('should minimize use of expensive CSS properties', () => {
      const { boxShadow } = tailwindConfig.theme.extend;
      
      // Box shadows should not be overly complex
      Object.values(boxShadow).forEach(shadow => {
        // Count shadow layers (separated by commas)
        const shadowLayers = (shadow as string).split(',').length;
        expect(shadowLayers).toBeLessThanOrEqual(10); // Reasonable limit for complex shadows
      });
    });

    it('should use backdrop-filter efficiently', () => {
      const { backdropBlur } = tailwindConfig.theme.extend;
      
      // Backdrop blur values should be reasonable for performance
      Object.values(backdropBlur).forEach(blur => {
        const blurValue = parseInt(blur as string);
        expect(blurValue).toBeLessThanOrEqual(20); // Reasonable blur limit
      });
    });
  });

  describe('Build-time Performance', () => {
    it('should have reasonable Tailwind compilation complexity', () => {
      const config = tailwindConfig;
      
      // Total configuration size shouldn't be excessive
      const configString = JSON.stringify(config);
      const configSize = Buffer.byteLength(configString, 'utf8');
      
      // Config should be under 50KB for reasonable build times
      expect(configSize).toBeLessThan(50 * 1024);
    });

    it('should minimize regex complexity in utility patterns', () => {
      // This tests that we don't have overly complex utility definitions
      // that could slow down Tailwind's JIT compilation
      
      const { extend } = tailwindConfig.theme;
      
      // Check that spacing values are simple
      Object.values(extend.spacing).forEach(space => {
        expect(space as string).not.toMatch(/calc\([^)]*calc/); // No nested calc()
      });
      
      // Check that color values are straightforward
      Object.values(extend.colors).forEach(color => {
        if (typeof color === 'string') {
          expect(color).not.toMatch(/color-mix.*color-mix/); // No nested color-mix
        }
      });
    });

    it('should use static values to enable better tree-shaking', () => {
      const { extend } = tailwindConfig.theme;
      
      // Most values should be static to enable optimal purging
      const dynamicValues = [];
      
      function checkForDynamicValues(obj: any, path: string = '') {
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;
          
          if (typeof value === 'function') {
            dynamicValues.push(currentPath);
          } else if (typeof value === 'object' && value !== null) {
            checkForDynamicValues(value, currentPath);
          }
        }
      }
      
      checkForDynamicValues(extend);
      
      // Should minimize dynamic values for better build performance
      expect(dynamicValues.length).toBeLessThan(5);
    });
  });

  describe('Core Web Vitals Impact', () => {
    it('should minimize Cumulative Layout Shift (CLS) with stable animations', () => {
      const { keyframes } = tailwindConfig.theme.extend;
      
      // Animations should not change layout-affecting properties
      const layoutProperties = /width|height|margin|padding|border(?!-radius)|top|left|right|bottom/;
      
      Object.entries(keyframes).forEach(([name, keyframe]) => {
        Object.values(keyframe).forEach(step => {
          const stepString = typeof step === 'object' 
            ? JSON.stringify(step) 
            : step as string;
          expect(stepString).not.toMatch(layoutProperties);
        });
      });
    });

    it('should support First Contentful Paint (FCP) optimization', () => {
      // Critical CSS should be minimal and efficient
      const cssPath = path.join(process.cwd(), 'app/globals.css');
      
      if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        
        // Check that base styles are simple and render-blocking minimal
        const baseLayerMatch = cssContent.match(/@layer base \{([\s\S]*?)\n\}/);
        if (baseLayerMatch) {
          const baseStyles = baseLayerMatch[1];
          
          // Base styles shouldn't be overly complex
          expect(baseStyles.length).toBeLessThan(5000); // Reasonable size limit
        }
      }
    });

    it('should minimize Total Blocking Time with efficient animations', () => {
      const { animation } = tailwindConfig.theme.extend;
      
      // Animation durations should not block the main thread excessively
      Object.values(animation).forEach(animValue => {
        const durationMatch = (animValue as string).match(/(\d+\.?\d*)s/);
        if (durationMatch) {
          const duration = parseFloat(durationMatch[1]) * 1000;
          expect(duration).toBeLessThan(5000); // No animations longer than 5s (allowing for slower loading animations)
        }
      });
    });
  });
});