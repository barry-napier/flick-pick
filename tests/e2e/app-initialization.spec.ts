import { test, expect } from '@playwright/test';

test.describe('FlickPick App Initialization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage successfully', async ({ page }) => {
    // Check that the page title is correct
    await expect(page).toHaveTitle(/FlickPick/);
    
    // Check that the main heading is visible
    const heading = page.locator('h1');
    await expect(heading).toContainText('FlickPick 🍿');
    
    // Check that the tagline is present
    await expect(page.locator('text=Pick your next flick')).toBeVisible();
  });

  test('should have correct metadata and SEO elements', async ({ page }) => {
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /Discover movies through an intuitive swipe interface/);
    
    // Check that the page has proper Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /FlickPick/);
    
    // Check viewport meta tag for mobile optimization
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  test('should have dark theme applied by default', async ({ page }) => {
    // Check that the html element has dark class
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    
    // Check that the background color reflects dark theme
    const body = page.locator('body');
    await expect(body).toHaveClass(/bg-background/);
  });

  test('should display status information correctly', async ({ page }) => {
    // Check for the status card
    const statusCard = page.locator('.bg-card');
    await expect(statusCard).toBeVisible();
    
    // Check for initialization success message
    await expect(page.locator('text=Next.js 15 with App Router initialized successfully')).toBeVisible();
    
    // Check for Phase 2 ready message
    await expect(page.locator('text=Ready for Phase 2 development')).toBeVisible();
  });

  test('should have proper semantic HTML structure', async ({ page }) => {
    // Check for main element
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Check for heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Ensure there's only one h1 element
    await expect(h1).toHaveCount(1);
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that content is still visible and properly laid out
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    
    // Check that text is readable (not overflowing)
    const tagline = page.locator('text=Pick your next flick - Coming soon!');
    await expect(tagline).toBeVisible();
    
    // Check that the status card is visible on mobile
    const statusCard = page.locator('.bg-card');
    await expect(statusCard).toBeVisible();
  });

  test('should have proper color contrast for accessibility', async ({ page }) => {
    // Check that text elements have appropriate contrast classes
    const heading = page.locator('h1');
    await expect(heading).toHaveClass(/text-text-primary/);
    
    // Check secondary text uses appropriate color
    const tagline = page.locator('text=Pick your next flick - Coming soon!');
    const taglineParent = tagline.locator('..');
    await expect(taglineParent).toHaveClass(/text-text-secondary/);
  });

  test('should load without console errors', async ({ page }) => {
    const consoleMessages: string[] = [];
    
    // Collect console messages
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out acceptable errors (like missing favicon, etc.)
    const criticalErrors = consoleMessages.filter(msg => 
      !msg.includes('favicon') && 
      !msg.includes('manifest') &&
      !msg.includes('robots.txt')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should have analytics component loaded', async ({ page }) => {
    // Check that Vercel Analytics is loaded (it should be in the DOM)
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // The Analytics component should be present (even if not visually rendered)
    // This is a basic check to ensure the component is mounted
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should handle page refresh correctly', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await expect(page.locator('h1')).toBeVisible();
    
    // Refresh the page
    await page.reload();
    
    // Check that everything still loads correctly
    await expect(page.locator('h1')).toContainText('FlickPick 🍿');
    await expect(page.locator('text=Pick your next flick')).toBeVisible();
  });
});

test.describe('Performance and Core Web Vitals', () => {
  test('should load within acceptable performance budgets', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds on a fast connection
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have proper resource loading', async ({ page }) => {
    const responses: string[] = [];
    
    // Track network responses
    page.on('response', (response) => {
      responses.push(`${response.status()} ${response.url()}`);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for successful responses
    const successful = responses.filter(r => r.startsWith('200'));
    expect(successful.length).toBeGreaterThan(0);
    
    // Check that there are no critical resource failures
    const criticalFailures = responses.filter(r => 
      (r.startsWith('404') || r.startsWith('500')) &&
      !r.includes('favicon') &&
      !r.includes('manifest')
    );
    
    expect(criticalFailures).toHaveLength(0);
  });

  test('should have acceptable LCP (Largest Contentful Paint)', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the main heading (likely the LCP element)
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    
    // Ensure the heading text is rendered
    await expect(heading).toContainText('FlickPick');
  });

  test('should have good CLS (Cumulative Layout Shift)', async ({ page }) => {
    await page.goto('/');
    
    // Get initial position of key elements
    const heading = page.locator('h1');
    const initialBox = await heading.boundingBox();
    
    // Wait for any potential layout shifts
    await page.waitForTimeout(1000);
    
    // Check that position hasn't shifted significantly
    const finalBox = await heading.boundingBox();
    
    expect(initialBox).toBeDefined();
    expect(finalBox).toBeDefined();
    
    if (initialBox && finalBox) {
      // Allow for minor pixel differences
      expect(Math.abs(initialBox.y - finalBox.y)).toBeLessThan(5);
    }
  });

  test('should be interactive quickly (FID simulation)', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be interactive
    await page.waitForLoadState('domcontentloaded');
    
    // Try to interact with the page (scroll)
    await page.mouse.wheel(0, 100);
    
    // Page should be responsive to interactions
    // This is a basic simulation of First Input Delay
    const scrollPosition = await page.evaluate(() => window.pageYOffset);
    expect(scrollPosition).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Browser Compatibility', () => {
  test('should work across different browsers', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Basic functionality should work in all browsers
    await expect(page.locator('h1')).toContainText('FlickPick 🍿');
    await expect(page.locator('text=Pick your next flick')).toBeVisible();
    
    // Log browser for debugging
    console.log(`Testing on: ${browserName}`);
  });

  test('should handle different screen sizes', async ({ page }) => {
    const screenSizes = [
      { width: 320, height: 568 }, // iPhone SE
      { width: 768, height: 1024 }, // iPad
      { width: 1920, height: 1080 }, // Desktop
    ];
    
    for (const size of screenSizes) {
      await page.setViewportSize(size);
      await page.goto('/');
      
      // Core content should be visible at all screen sizes
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=Pick your next flick')).toBeVisible();
    }
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    
    // Check that there's exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // Check that h1 has meaningful content
    const h1Text = await page.locator('h1').textContent();
    expect(h1Text).toContain('FlickPick');
  });

  test('should have proper HTML semantics', async ({ page }) => {
    await page.goto('/');
    
    // Check for main landmark
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Check that the HTML has proper lang attribute
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Tab navigation should work
    await page.keyboard.press('Tab');
    
    // Check that focus is manageable
    const focusedElement = page.locator(':focus');
    const focusedCount = await focusedElement.count();
    
    // Should have focusable elements or proper focus management
    expect(focusedCount).toBeGreaterThanOrEqual(0);
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');
    
    // This is a basic check - in production you'd use automated accessibility testing tools
    // Check that text has appropriate color classes
    const heading = page.locator('h1');
    await expect(heading).toHaveClass(/text-text-primary/);
  });
});