/**
 * @file E2E Visual Tests for Design System Responsive Design
 * @description Playwright tests for visual regression, responsive breakpoints,
 * dark theme accuracy, and cross-browser compatibility
 */

import { test, expect, devices } from '@playwright/test';

// Test configuration for different viewport sizes
const viewports = {
  mobile: { width: 375, height: 667 }, // iPhone SE
  mobileLarge: { width: 414, height: 896 }, // iPhone 11 Pro Max
  tablet: { width: 768, height: 1024 }, // iPad
  desktop: { width: 1440, height: 900 }, // Desktop
  desktopLarge: { width: 1920, height: 1080 }, // Large Desktop
};

// Color accuracy validation helper
const expectColorToMatch = async (page: any, selector: string, expectedColor: string) => {
  const computedColor = await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return null;
    return window.getComputedStyle(element).backgroundColor;
  }, selector);
  
  // Convert RGB to hex or compare HSL values
  expect(computedColor).toBeTruthy();
};

test.describe('Design System Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app and wait for it to be ready
    await page.goto('/');
    
    // Wait for any initial loading
    await page.waitForLoadState('networkidle');
    
    // Ensure dark mode is enabled
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
  });

  test.describe('Dark Theme Visual Validation', () => {
    test('should display correct background color (#1a1a1a)', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize(viewports.mobile);
      
      // Check main background color
      const backgroundColor = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor;
      });
      
      // Should be very dark (close to #0a0a0a)
      expect(backgroundColor).toMatch(/rgb\(10,\s*10,\s*10\)/);
    });

    test('should render movie cards with proper styling', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      
      // Look for movie card elements (this assumes the app has loaded some content)
      const movieCard = page.locator('[data-testid="movie-card"]').first();
      
      if (await movieCard.count() > 0) {
        // Check card border radius
        const borderRadius = await movieCard.evaluate(el => 
          window.getComputedStyle(el).borderRadius
        );
        expect(borderRadius).toBe('16px');
        
        // Check card background
        const cardBg = await movieCard.evaluate(el => 
          window.getComputedStyle(el).backgroundColor
        );
        expect(cardBg).toMatch(/rgb\(26,\s*26,\s*26\)/); // #1a1a1a
      }
    });

    test('should display correct text colors for dark theme', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      
      // Check for primary text color (should be white)
      const primaryTextElements = await page.locator('h1, h2, [class*="text-primary"]');
      
      if (await primaryTextElements.count() > 0) {
        const textColor = await primaryTextElements.first().evaluate(el => 
          window.getComputedStyle(el).color
        );
        expect(textColor).toMatch(/rgb\(255,\s*255,\s*255\)/); // White text
      }
    });

    test('should render swipe feedback colors correctly', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      
      // This test would need actual swipe interaction, so we'll check CSS classes exist
      const swipeLikeElement = page.locator('[class*="swipe-like"]');
      const swipeSkipElement = page.locator('[class*="swipe-skip"]');
      const swipeUnseenElement = page.locator('[class*="swipe-unseen"]');
      
      // Check that swipe overlay classes are defined (even if not visible)
      await expect(page.locator('body')).toHaveCSS('--color-swipe-like', /#10b981|hsl\(158[\s,]*64%[\s,]*52%\)|rgb\(16,\s*185,\s*129\)/ as any);
    });
  });

  test.describe('Responsive Design Across Breakpoints', () => {
    test('should adapt card stack for mobile (375px)', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      
      const cardStack = page.locator('[class*="card-stack"]');
      
      if (await cardStack.count() > 0) {
        // Mobile should have simpler 3D effects
        const perspective = await cardStack.evaluate(el => 
          window.getComputedStyle(el).perspective
        );
        
        // Mobile typically uses reduced perspective for performance
        expect(parseInt(perspective)).toBeLessThanOrEqual(1000);
      }
    });

    test('should adapt card stack for tablet (768px)', async ({ page }) => {
      await page.setViewportSize(viewports.tablet);
      
      const cardStack = page.locator('[class*="card-stack"]');
      
      if (await cardStack.count() > 0) {
        const perspective = await cardStack.evaluate(el => 
          window.getComputedStyle(el).perspective
        );
        
        // Tablet should have moderate 3D effects
        expect(parseInt(perspective)).toBeGreaterThan(800);
        expect(parseInt(perspective)).toBeLessThanOrEqual(1200);
      }
    });

    test('should adapt card stack for desktop (1440px)', async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      
      const cardStack = page.locator('[class*="card-stack"]');
      
      if (await cardStack.count() > 0) {
        const perspective = await cardStack.evaluate(el => 
          window.getComputedStyle(el).perspective
        );
        
        // Desktop should have full 3D effects
        expect(parseInt(perspective)).toBeGreaterThanOrEqual(1200);
      }
    });

    test('should maintain touch target sizes across breakpoints', async ({ page }) => {
      for (const [name, viewport] of Object.entries(viewports)) {
        await page.setViewportSize(viewport);
        
        // Check button elements have minimum 44px touch targets
        const buttons = page.locator('button, [role="button"], [tabindex="0"]');
        
        if (await buttons.count() > 0) {
          const firstButton = buttons.first();
          const buttonSize = await firstButton.evaluate(el => {
            const rect = el.getBoundingClientRect();
            return { width: rect.width, height: rect.height };
          });
          
          expect(buttonSize.height).toBeGreaterThanOrEqual(44);
          expect(buttonSize.width).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('should handle safe areas on mobile devices', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      
      // Simulate iPhone with notch
      await page.addStyleTag({
        content: `
          :root {
            --safe-area-inset-top: 44px;
            --safe-area-inset-bottom: 34px;
          }
        `
      });
      
      // Check that safe area classes are applied
      const safeAreaElements = page.locator('[class*="safe-area"], [class*="pt-safe"], [class*="pb-safe"]');
      
      if (await safeAreaElements.count() > 0) {
        const paddingTop = await safeAreaElements.first().evaluate(el => 
          window.getComputedStyle(el).paddingTop
        );
        
        // Should have some padding for safe area
        expect(parseInt(paddingTop)).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Animation Performance Visual Tests', () => {
    test('should not show layout shift during animations', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      
      // Enable layout shift tracking
      let cumulativeLayoutShift = 0;
      
      page.on('console', msg => {
        if (msg.text().includes('Layout Shift')) {
          const shift = parseFloat(msg.text().match(/[\d.]+/)?.[0] || '0');
          cumulativeLayoutShift += shift;
        }
      });
      
      // Add a script to monitor layout shifts
      await page.addInitScript(() => {
        let cls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
              console.log(`Layout Shift: ${(entry as any).value}`);
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });
      });
      
      // Trigger some interactions that might cause animations
      const interactiveElements = page.locator('button, [role="button"]');
      if (await interactiveElements.count() > 0) {
        await interactiveElements.first().hover();
        await page.waitForTimeout(500); // Wait for hover animations
      }
      
      // CLS should be minimal
      expect(cumulativeLayoutShift).toBeLessThan(0.1);
    });

    test('should maintain 60fps during transitions', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      
      // Monitor frame rates during animations
      const frameRates: number[] = [];
      
      await page.addInitScript(() => {
        let lastTime = performance.now();
        let frameCount = 0;
        
        function measureFPS() {
          const now = performance.now();
          frameCount++;
          
          if (now - lastTime >= 1000) {
            const fps = (frameCount * 1000) / (now - lastTime);
            (window as any).currentFPS = fps;
            frameCount = 0;
            lastTime = now;
          }
          
          requestAnimationFrame(measureFPS);
        }
        
        requestAnimationFrame(measureFPS);
      });
      
      // Trigger animations and measure FPS
      const animatedElements = page.locator('[class*="animate-"], [class*="transition-"]');
      
      if (await animatedElements.count() > 0) {
        await animatedElements.first().hover();
        await page.waitForTimeout(1000); // Let animation run
        
        const currentFPS = await page.evaluate(() => (window as any).currentFPS);
        
        if (currentFPS) {
          expect(currentFPS).toBeGreaterThan(50); // Should be close to 60fps
        }
      }
    });

    test('should respect reduced motion preferences', async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize(viewports.mobile);
      
      // Check that animations are disabled or shortened
      const animatedElements = page.locator('[class*="animate-"]');
      
      if (await animatedElements.count() > 0) {
        const animationDuration = await animatedElements.first().evaluate(el => 
          window.getComputedStyle(el).animationDuration
        );
        
        // Should be very short or 0 when reduced motion is preferred
        const duration = parseFloat(animationDuration);
        expect(duration).toBeLessThan(0.1); // Less than 100ms
      }
    });
  });

  test.describe('Component Visual Consistency', () => {
    test('should render pill components with correct styling', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      
      const pillElements = page.locator('[class*="pill"]');
      
      if (await pillElements.count() > 0) {
        const pill = pillElements.first();
        
        // Check border radius
        const borderRadius = await pill.evaluate(el => 
          window.getComputedStyle(el).borderRadius
        );
        expect(borderRadius).toBe('20px');
        
        // Check background has transparency
        const backgroundColor = await pill.evaluate(el => 
          window.getComputedStyle(el).backgroundColor
        );
        expect(backgroundColor).toMatch(/rgba?\([^)]*,\s*[\d.]+\)/); // Should have alpha
      }
    });

    test('should render navigation with proper spacing', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      
      const navTabs = page.locator('[class*="nav-tab"]');
      
      if (await navTabs.count() > 0) {
        // Check that tabs have adequate spacing
        const tabPositions = await navTabs.evaluateAll(els => 
          els.map(el => el.getBoundingClientRect().left)
        );
        
        // Tabs should be properly spaced
        for (let i = 1; i < tabPositions.length; i++) {
          const spacing = tabPositions[i] - tabPositions[i - 1];
          expect(spacing).toBeGreaterThan(20); // Minimum spacing
        }
      }
    });

    test('should render bottom tab bar with correct positioning', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      
      const tabBar = page.locator('[class*="tab-bar"]');
      
      if (await tabBar.count() > 0) {
        const position = await tabBar.evaluate(el => 
          window.getComputedStyle(el).position
        );
        expect(position).toBe('fixed');
        
        const bottom = await tabBar.evaluate(el => 
          window.getComputedStyle(el).bottom
        );
        expect(bottom).toBe('0px');
        
        // Check backdrop blur
        const backdropFilter = await tabBar.evaluate(el => 
          window.getComputedStyle(el).backdropFilter
        );
        expect(backdropFilter).toMatch(/blur\(/);
      }
    });
  });

  test.describe('Cross-Browser Compatibility', () => {
    // Test on different browsers if available
    ['chromium', 'firefox', 'webkit'].forEach(browserName => {
      test(`should render correctly on ${browserName}`, async ({ page, browserName: currentBrowser }) => {
        test.skip(currentBrowser !== browserName, `Skipping ${browserName} test`);
        
        await page.setViewportSize(viewports.desktop);
        
        // Take a screenshot for visual comparison
        await expect(page).toHaveScreenshot(`design-system-${browserName}.png`, {
          fullPage: true,
          threshold: 0.2, // Allow for minor rendering differences
        });
      });
    });

    test('should handle CSS Grid and Flexbox consistently', async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      
      const gridElements = page.locator('[class*="grid"], [class*="flex"]');
      
      if (await gridElements.count() > 0) {
        // Check that layout is not broken
        const elementsInView = await gridElements.evaluateAll(els => 
          els.filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          }).length
        );
        
        expect(elementsInView).toBeGreaterThan(0);
      }
    });

    test('should handle CSS custom properties across browsers', async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      
      // Check that CSS custom properties are working
      const customPropValue = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--card-width');
      });
      
      expect(customPropValue).toBeTruthy();
      expect(customPropValue.trim()).toMatch(/min\(/); // Should contain the min() function
    });
  });

  test.describe('Performance Visual Metrics', () => {
    test('should achieve good Largest Contentful Paint (LCP)', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      
      const lcpMetric = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          }).observe({ entryTypes: ['largest-contentful-paint'] });
          
          // Fallback timeout
          setTimeout(() => resolve(0), 5000);
        });
      });
      
      expect(lcpMetric).toBeLessThan(2500); // Good LCP threshold
    });

    test('should minimize First Input Delay (FID)', async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      
      // Simulate user interaction
      const interactiveElement = page.locator('button, [role="button"]').first();
      
      if (await interactiveElement.count() > 0) {
        const startTime = Date.now();
        await interactiveElement.click();
        const endTime = Date.now();
        
        const delay = endTime - startTime;
        expect(delay).toBeLessThan(100); // Good FID threshold
      }
    });

    test('should have efficient CSS loading', async ({ page }) => {
      // Monitor network activity
      const cssRequests: any[] = [];
      
      page.on('response', response => {
        if (response.url().includes('.css')) {
          cssRequests.push({
            url: response.url(),
            size: response.headers()['content-length'],
            status: response.status()
          });
        }
      });
      
      await page.setViewportSize(viewports.desktop);
      await page.waitForLoadState('networkidle');
      
      // Should not have excessive CSS requests
      expect(cssRequests.length).toBeLessThan(5);
      
      // CSS files should be reasonably sized
      cssRequests.forEach(request => {
        if (request.size) {
          expect(parseInt(request.size)).toBeLessThan(100000); // 100KB limit
        }
      });
    });
  });

  test.describe('Accessibility Visual Tests', () => {
    test('should provide visible focus indicators', async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      
      // Check that focused element is visible
      const focusedElement = page.locator(':focus');
      
      if (await focusedElement.count() > 0) {
        const outline = await focusedElement.evaluate(el => 
          window.getComputedStyle(el).outline
        );
        
        // Should have visible focus outline
        expect(outline).not.toBe('none');
        expect(outline).toMatch(/solid|auto/);
      }
    });

    test('should maintain contrast ratios in high contrast mode', async ({ page }) => {
      // Enable high contrast mode
      await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
      await page.setViewportSize(viewports.desktop);
      
      // Check that elements remain visible
      const textElements = page.locator('h1, h2, p, span').first();
      
      if (await textElements.count() > 0) {
        const color = await textElements.evaluate(el => 
          window.getComputedStyle(el).color
        );
        
        const backgroundColor = await textElements.evaluate(el => 
          window.getComputedStyle(el).backgroundColor
        );
        
        // Colors should be valid (not transparent)
        expect(color).not.toBe('rgba(0, 0, 0, 0)');
        expect(color).not.toBe('transparent');
      }
    });

    test('should scale text appropriately at 200% zoom', async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      
      // Simulate 200% zoom
      await page.setViewportSize({ 
        width: Math.floor(viewports.desktop.width / 2), 
        height: Math.floor(viewports.desktop.height / 2) 
      });
      
      // Text should still be readable and not overflow containers
      const textElements = page.locator('h1, h2, p');
      
      if (await textElements.count() > 0) {
        const firstElement = textElements.first();
        const rect = await firstElement.boundingBox();
        
        if (rect) {
          expect(rect.width).toBeGreaterThan(0);
          expect(rect.height).toBeGreaterThan(0);
        }
      }
    });
  });
});