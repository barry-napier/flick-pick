/**
 * @file CSS Globals and Design System Tests
 * @description Comprehensive tests for CSS custom properties, globals.css implementation,
 * and design system token validation
 */

import fs from 'fs';
import path from 'path';

describe('CSS Globals and Design System', () => {
  let cssContent: string;

  beforeAll(() => {
    // Read the globals.css file
    const cssPath = path.join(process.cwd(), 'app/globals.css');
    cssContent = fs.readFileSync(cssPath, 'utf-8');
  });

  describe('CSS Custom Properties (Design Tokens)', () => {

    it('should define all required Shadcn/ui design tokens', () => {
      const requiredTokens = [
        '--background',
        '--foreground',
        '--card',
        '--card-foreground',
        '--popover',
        '--popover-foreground',
        '--primary',
        '--primary-foreground',
        '--secondary',
        '--secondary-foreground',
        '--muted',
        '--muted-foreground',
        '--accent',
        '--accent-foreground',
        '--destructive',
        '--destructive-foreground',
        '--border',
        '--input',
        '--ring',
        '--radius'
      ];

      requiredTokens.forEach(token => {
        expect(cssContent).toMatch(new RegExp(`${token.replace('--', '\\-\\-')}:`));
      });
    });

    it('should define FlickPick-specific design tokens', () => {
      const flinkPickTokens = [
        '--card-width',
        '--card-height',
        '--card-aspect-ratio',
        '--card-border-radius',
        '--swipe-threshold',
        '--rotation-factor',
        '--max-rotation'
      ];

      flinkPickTokens.forEach(token => {
        expect(cssContent).toMatch(new RegExp(`${token.replace('--', '\\-\\-')}:`));
      });
    });

    it('should define performance-optimized animation timing functions', () => {
      const timingFunctions = [
        '--ease-out-expo',
        '--ease-out-circ',
        '--ease-out-quart',
        '--spring-bounce'
      ];

      timingFunctions.forEach(func => {
        expect(cssContent).toMatch(new RegExp(`${func.replace('--', '\\-\\-')}:`));
      });
    });

    it('should define hardware acceleration optimization flags', () => {
      const optimizationFlags = [
        '--enable-hardware-acceleration',
        '--will-change-transform',
        '--backface-visibility-hidden'
      ];

      optimizationFlags.forEach(flag => {
        expect(cssContent).toMatch(new RegExp(`${flag.replace('--', '\\-\\-')}:`));
      });
    });

    it('should have correct HSL color values for dark theme', () => {
      expect(cssContent).toMatch(/--background:\s*0\s+0%\s+4%/);
      expect(cssContent).toMatch(/--foreground:\s*0\s+0%\s+100%/);
      expect(cssContent).toMatch(/--card:\s*0\s+0%\s+10%/);
      expect(cssContent).toMatch(/--primary:\s*0\s+0%\s+100%/);
    });

    it('should have appropriate card dimensions for responsive design', () => {
      expect(cssContent).toMatch(/--card-width:\s*min\(calc\(100vw - 2rem\), 400px\)/);
      expect(cssContent).toMatch(/--card-height:\s*min\(calc\(100vh - 12rem\), 600px\)/);
      expect(cssContent).toMatch(/--card-aspect-ratio:\s*2\/3/);
    });

    it('should have swipe gesture configuration values', () => {
      expect(cssContent).toMatch(/--swipe-threshold:\s*50px/);
      expect(cssContent).toMatch(/--rotation-factor:\s*0\.1/);
      expect(cssContent).toMatch(/--max-rotation:\s*25deg/);
    });
  });

  describe('Base Styles and Performance Optimizations', () => {
    it('should apply hardware acceleration to body element', () => {
      expect(cssContent).toMatch(/body\s*{[^}]*-webkit-transform:\s*translateZ\(0\)/);
      expect(cssContent).toMatch(/body\s*{[^}]*transform:\s*translateZ\(0\)/);
    });

    it('should prevent overscroll behavior on mobile', () => {
      expect(cssContent).toMatch(/overscroll-behavior:\s*none/);
    });

    it('should optimize font rendering', () => {
      expect(cssContent).toMatch(/-webkit-font-smoothing:\s*antialiased/);
      expect(cssContent).toMatch(/-moz-osx-font-smoothing:\s*grayscale/);
    });

    it('should disable tap highlights for touch devices', () => {
      expect(cssContent).toMatch(/-webkit-tap-highlight-color:\s*transparent/);
    });

    it('should enable smooth scrolling', () => {
      expect(cssContent).toMatch(/scroll-behavior:\s*smooth/);
    });
  });

  describe('Gradient System', () => {
    it('should define gradient overlays with proper opacity stops', () => {
      // Check for gradient-overlay class
      expect(cssContent).toMatch(/\.gradient-overlay/);
      expect(cssContent).toMatch(/hsla\(0,\s*0%,\s*0%,\s*0\.95\)/);
      expect(cssContent).toMatch(/hsla\(0,\s*0%,\s*0%,\s*0\)/);
    });

    it('should define swipe feedback gradients with enhanced visual effects', () => {
      expect(cssContent).toMatch(/\.swipe-like-gradient/);
      expect(cssContent).toMatch(/\.swipe-skip-gradient/);
      expect(cssContent).toMatch(/\.swipe-unseen-gradient/);
      
      // Check for box-shadow effects
      expect(cssContent).toMatch(/box-shadow.*hsla\(158,\s*64%,\s*52%,\s*0\.4\)/);
    });

    it('should define shimmer gradient for loading states', () => {
      expect(cssContent).toMatch(/\.shimmer-gradient/);
      expect(cssContent).toMatch(/background-size:\s*200%\s*100%/);
    });
  });

  describe('Card Stack 3D Effects', () => {
    it('should define perspective and transform-style for card stack', () => {
      expect(cssContent).toMatch(/\.card-stack/);
      expect(cssContent).toMatch(/perspective:\s*1200px/);
      expect(cssContent).toMatch(/transform-style:\s*preserve-3d/);
      expect(cssContent).toMatch(/will-change:\s*transform/);
    });

    it('should define stacked card positioning with depth', () => {
      // Check for nth-child positioning
      expect(cssContent).toMatch(/\.card-stack\s+\.card:nth-child\(1\)/);
      expect(cssContent).toMatch(/\.card-stack\s+\.card:nth-child\(2\)/);
      expect(cssContent).toMatch(/\.card-stack\s+\.card:nth-child\(3\)/);
      expect(cssContent).toMatch(/\.card-stack\s+\.card:nth-child\(4\)/);
    });

    it('should apply progressive opacity and scale to stacked cards', () => {
      expect(cssContent).toMatch(/opacity:\s*0\.85/);
      expect(cssContent).toMatch(/scale\(0\.97\)/);
      expect(cssContent).toMatch(/opacity:\s*0\.7/);
      expect(cssContent).toMatch(/scale\(0\.94\)/);
    });

    it('should include brightness filters for visual depth', () => {
      expect(cssContent).toMatch(/filter:\s*brightness\(0\.9\)/);
      expect(cssContent).toMatch(/filter:\s*brightness\(0\.8\)/);
      expect(cssContent).toMatch(/filter:\s*brightness\(0\.7\)/);
    });
  });

  describe('Safe Area Handling', () => {
    it('should define iOS-style safe area utilities', () => {
      const safeAreaClasses = [
        '.safe-area-top',
        '.safe-area-bottom',
        '.safe-area-left',
        '.safe-area-right'
      ];

      safeAreaClasses.forEach(className => {
        expect(cssContent).toMatch(new RegExp(className.replace('.', '\\.')));
      });

      expect(cssContent).toMatch(/env\(safe-area-inset-top\)/);
      expect(cssContent).toMatch(/env\(safe-area-inset-bottom\)/);
    });

    it('should define safe area spacing utilities in utilities layer', () => {
      expect(cssContent).toMatch(/\.pt-safe/);
      expect(cssContent).toMatch(/\.pb-safe/);
      expect(cssContent).toMatch(/\.px-safe/);
      expect(cssContent).toMatch(/max\(1rem,\s*env\(safe-area-inset-top\)\)/);
    });
  });

  describe('Accessibility Features', () => {
    it('should define focus ring utilities', () => {
      expect(cssContent).toMatch(/\.focus-ring/);
      expect(cssContent).toMatch(/\.focus-card/);
      expect(cssContent).toMatch(/\.focus-prominent/);
    });

    it('should ensure visible focus indicators on interactive elements', () => {
      expect(cssContent).toMatch(/button:focus-visible/);
      expect(cssContent).toMatch(/\[role="button"\]:focus-visible/);
      expect(cssContent).toMatch(/outline:\s*2px\s*solid/);
    });

    it('should define minimum touch target sizes for mobile', () => {
      expect(cssContent).toMatch(/min-height:\s*44px/);
      expect(cssContent).toMatch(/min-width:\s*44px/);
    });

    it('should handle reduced motion preferences', () => {
      expect(cssContent).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
      expect(cssContent).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
      expect(cssContent).toMatch(/transition-duration:\s*0\.01ms\s*!important/);
    });

    it('should support high contrast mode', () => {
      expect(cssContent).toMatch(/@media\s*\(prefers-contrast:\s*high\)/);
      expect(cssContent).toMatch(/border:\s*2px\s*solid/);
    });
  });

  describe('Loading and Skeleton Animations', () => {
    it('should define pulse animation with proper timing', () => {
      expect(cssContent).toMatch(/@keyframes\s+pulse/);
      expect(cssContent).toMatch(/animation:\s*pulse\s*2s.*infinite/);
    });

    it('should define skeleton wave animation', () => {
      expect(cssContent).toMatch(/@keyframes\s+skeleton-wave/);
      expect(cssContent).toMatch(/background-size:\s*200%\s*100%/);
      expect(cssContent).toMatch(/animation:\s*skeleton-wave\s*1\.5s.*infinite/);
    });

    it('should define skeleton component classes', () => {
      expect(cssContent).toMatch(/\.skeleton/);
      expect(cssContent).toMatch(/\.skeleton-card/);
      expect(cssContent).toMatch(/\.skeleton-text/);
      expect(cssContent).toMatch(/\.skeleton-pill/);
    });
  });

  describe('Mobile-First Responsive Design', () => {
    it('should optimize for mobile devices first', () => {
      expect(cssContent).toMatch(/@media\s*\(max-width:\s*640px\)/);
      expect(cssContent).toMatch(/-webkit-text-size-adjust:\s*100%/);
      expect(cssContent).toMatch(/overscroll-behavior-y:\s*contain/);
    });

    it('should adjust card stack complexity based on screen size', () => {
      expect(cssContent).toMatch(/perspective:\s*800px/); // Mobile
      expect(cssContent).toMatch(/transform-style:\s*flat/); // Mobile simplification
    });

    it('should enhance animations on larger screens', () => {
      expect(cssContent).toMatch(/@media\s*\(min-width:\s*1025px\)/);
      expect(cssContent).toMatch(/perspective:\s*1200px/); // Desktop
    });

    it('should add hover states only for devices that support hover', () => {
      expect(cssContent).toMatch(/@media\s*\(hover:\s*hover\)/);
      expect(cssContent).toMatch(/\.card-hoverable:hover/);
    });
  });

  describe('Component Layer Classes', () => {
    it('should define movie card component classes', () => {
      const movieCardClasses = [
        '.movie-card',
        '.movie-card-image',
        '.movie-card-overlay',
        '.movie-card-content',
        '.movie-card-year',
        '.movie-card-title',
        '.movie-card-pills'
      ];

      movieCardClasses.forEach(className => {
        expect(cssContent).toMatch(new RegExp(className.replace('.', '\\.')));
      });
    });

    it('should define pill component variants', () => {
      const pillClasses = [
        '.pill',
        '.pill-small',
        '.pill-genre',
        '.pill-rating',
        '.pill-runtime'
      ];

      pillClasses.forEach(className => {
        expect(cssContent).toMatch(new RegExp(className.replace('.', '\\.')));
      });
    });

    it('should define navigation component classes', () => {
      const navClasses = [
        '.nav-tabs',
        '.nav-tab',
        '.nav-tab-active',
        '.nav-tab-inactive'
      ];

      navClasses.forEach(className => {
        expect(cssContent).toMatch(new RegExp(className.replace('.', '\\.')));
      });
    });

    it('should define tab bar component classes', () => {
      const tabBarClasses = [
        '.tab-bar',
        '.tab-bar-content',
        '.tab-bar-item',
        '.tab-bar-item-active',
        '.tab-bar-item-inactive',
        '.tab-bar-icon',
        '.tab-bar-label'
      ];

      tabBarClasses.forEach(className => {
        expect(cssContent).toMatch(new RegExp(className.replace('.', '\\.')));
      });
    });

    it('should define swipe overlay component classes', () => {
      const overlayClasses = [
        '.swipe-overlay',
        '.swipe-overlay-visible',
        '.swipe-overlay-like',
        '.swipe-overlay-skip',
        '.swipe-overlay-unseen',
        '.swipe-overlay-content',
        '.swipe-overlay-icon'
      ];

      overlayClasses.forEach(className => {
        expect(cssContent).toMatch(new RegExp(className.replace('.', '\\.')));
      });
    });
  });

  describe('Utility Layer Classes', () => {
    it('should define layout utilities', () => {
      expect(cssContent).toMatch(/\.container-card/);
      expect(cssContent).toMatch(/\.container-wide/);
    });

    it('should define performance utilities', () => {
      expect(cssContent).toMatch(/\.gpu-accelerated/);
      expect(cssContent).toMatch(/\.optimize-legibility/);
      expect(cssContent).toMatch(/will-change:\s*transform/);
      expect(cssContent).toMatch(/translateZ\(0\)/);
    });

    it('should define interaction utilities', () => {
      expect(cssContent).toMatch(/\.touch-manipulation/);
      expect(cssContent).toMatch(/touch-action:\s*manipulation/);
    });

    it('should define custom aspect ratio utilities', () => {
      expect(cssContent).toMatch(/\.aspect-card/);
      expect(cssContent).toMatch(/\.aspect-poster/);
      expect(cssContent).toMatch(/\.aspect-backdrop/);
      expect(cssContent).toMatch(/aspect-ratio:\s*var\(--card-aspect-ratio\)/);
    });

    it('should define text shadow utilities', () => {
      expect(cssContent).toMatch(/\.text-shadow-sm/);
      expect(cssContent).toMatch(/\.text-shadow-md/);
      expect(cssContent).toMatch(/\.text-shadow-lg/);
    });

    it('should define backdrop blur utilities', () => {
      expect(cssContent).toMatch(/\.backdrop-blur-card/);
      expect(cssContent).toMatch(/\.backdrop-blur-nav/);
      expect(cssContent).toMatch(/\.backdrop-blur-overlay/);
    });
  });

  describe('CSS Structure and Organization', () => {
    it('should be organized in proper Tailwind layers', () => {
      expect(cssContent).toMatch(/@layer\s+base/);
      expect(cssContent).toMatch(/@layer\s+components/);
      expect(cssContent).toMatch(/@layer\s+utilities/);
    });

    it('should include Tailwind directives', () => {
      expect(cssContent).toMatch(/@tailwind\s+base/);
      expect(cssContent).toMatch(/@tailwind\s+components/);
      expect(cssContent).toMatch(/@tailwind\s+utilities/);
    });

    it('should have consistent indentation and formatting', () => {
      // Check that CSS is properly formatted (basic check)
      expect(cssContent).toMatch(/{\s*\n/); // Opening braces followed by newline
      expect(cssContent).toMatch(/;\s*\n/); // Semicolons followed by newline
    });
  });
});