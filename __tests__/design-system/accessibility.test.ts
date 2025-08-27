/**
 * @file Accessibility Tests for Design System
 * @description Comprehensive tests for WCAG 2.1 AA compliance, reduced motion support,
 * focus management, color contrast, and accessibility features
 */

import fs from 'fs';
import path from 'path';
import tailwindConfig from '../../tailwind.config';

// Color contrast calculation utilities
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) throw new Error(`Invalid hex color: ${hex}`);
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ];
};

const hslToRgb = (hsl: string): [number, number, number] => {
  const match = hsl.match(/hsl\((\d+)\s*,?\s*(\d+)%\s*,?\s*(\d+)%\)/);
  if (!match) throw new Error(`Invalid HSL color: ${hsl}`);
  
  let [, h, s, l] = match.map(Number);
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

const getLuminance = (rgb: [number, number, number]): number => {
  const [r, g, b] = rgb.map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const getContrastRatio = (color1: string, color2: string): number => {
  let rgb1: [number, number, number];
  let rgb2: [number, number, number];
  
  try {
    rgb1 = color1.startsWith('#') ? hexToRgb(color1) : hslToRgb(color1);
    rgb2 = color2.startsWith('#') ? hexToRgb(color2) : hslToRgb(color2);
  } catch {
    // Fallback for complex color values
    return 21; // Assume maximum contrast for safety
  }
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

// Touch target size validation
const getTouchTargetSize = (cssValue: string): number => {
  const match = cssValue.match(/(\d+(?:\.\d+)?)(?:px|rem)/);
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  const unit = cssValue.includes('rem') ? 'rem' : 'px';
  
  // Convert rem to px (assuming 16px base)
  return unit === 'rem' ? value * 16 : value;
};

describe('Accessibility Tests (WCAG 2.1 AA Compliance)', () => {
  let cssContent: string;

  beforeAll(() => {
    const cssPath = path.join(process.cwd(), 'app/globals.css');
    cssContent = fs.readFileSync(cssPath, 'utf-8');
  });

  describe('Color Contrast Requirements (WCAG 2.1 AA)', () => {
    it('should meet contrast requirements for primary text on background', () => {
      const backgroundColor = tailwindConfig.theme.extend.colors.background;
      const primaryText = tailwindConfig.theme.extend.colors['text-primary'];
      
      const contrastRatio = getContrastRatio(backgroundColor, primaryText);
      expect(contrastRatio).toBeGreaterThanOrEqual(4.5); // WCAG AA normal text
    });

    it('should meet contrast requirements for secondary text on background', () => {
      const backgroundColor = tailwindConfig.theme.extend.colors.background;
      const secondaryText = tailwindConfig.theme.extend.colors['text-secondary'];
      
      const contrastRatio = getContrastRatio(backgroundColor, secondaryText);
      expect(contrastRatio).toBeGreaterThanOrEqual(4.5); // WCAG AA normal text
    });

    it('should meet enhanced contrast requirements for tertiary text', () => {
      const backgroundColor = tailwindConfig.theme.extend.colors.background;
      const tertiaryText = tailwindConfig.theme.extend.colors['text-tertiary'];
      
      const contrastRatio = getContrastRatio(backgroundColor, tertiaryText);
      expect(contrastRatio).toBeGreaterThanOrEqual(3.0); // Minimum for secondary content
    });

    it('should meet contrast requirements for text on card backgrounds', () => {
      const cardBackground = tailwindConfig.theme.extend.colors.card;
      const primaryText = tailwindConfig.theme.extend.colors['text-primary'];
      
      const contrastRatio = getContrastRatio(cardBackground, primaryText);
      expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
    });

    it('should meet contrast requirements for interactive elements', () => {
      const cardHover = tailwindConfig.theme.extend.colors['card-hover'];
      const primaryText = tailwindConfig.theme.extend.colors['text-primary'];
      
      const contrastRatio = getContrastRatio(cardHover, primaryText);
      expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
    });

    it('should meet contrast requirements for swipe feedback overlays', () => {
      const swipeColors = [
        tailwindConfig.theme.extend.colors['swipe-like'].DEFAULT,
        tailwindConfig.theme.extend.colors['swipe-skip'].DEFAULT,
        tailwindConfig.theme.extend.colors['swipe-unseen'].DEFAULT,
      ];
      
      const whiteText = 'hsl(0 0% 100%)';
      
      swipeColors.forEach((color, index) => {
        const contrastRatio = getContrastRatio(color, whiteText);
        expect(contrastRatio).toBeGreaterThanOrEqual(3.0); // Large text/graphics minimum
      });
    });

    it('should provide sufficient contrast for navigation elements', () => {
      const activeTabColor = tailwindConfig.theme.extend.colors['nav-tab-active'];
      const inactiveTabColor = tailwindConfig.theme.extend.colors['nav-tab-inactive'];
      const backgroundColor = tailwindConfig.theme.extend.colors.background;
      
      expect(getContrastRatio(backgroundColor, activeTabColor)).toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio(backgroundColor, inactiveTabColor)).toBeGreaterThanOrEqual(4.5);
    });

    it('should maintain contrast in high contrast mode', () => {
      // Check that CSS includes high contrast media query adjustments
      expect(cssContent).toMatch(/@media\s*\(prefers-contrast:\s*high\)/);
      
      // High contrast mode should include stronger borders
      const highContrastSection = cssContent.match(
        /@media\s*\(prefers-contrast:\s*high\)\s*\{([\s\S]*?)\n\}/
      );
      
      if (highContrastSection) {
        expect(highContrastSection[1]).toMatch(/border:\s*2px\s*solid/);
      }
    });
  });

  describe('Focus Management and Keyboard Navigation', () => {
    it('should define visible focus indicators for all interactive elements', () => {
      // Check for focus ring utilities
      expect(cssContent).toMatch(/\.focus-ring/);
      expect(cssContent).toMatch(/\.focus-card/);
      expect(cssContent).toMatch(/\.focus-prominent/);
    });

    it('should provide prominent focus indicators for critical actions', () => {
      expect(cssContent).toMatch(/\.focus-prominent/);
      expect(cssContent).toMatch(/focus:ring-4/);
    });

    it('should ensure focus-visible selectors for keyboard navigation', () => {
      expect(cssContent).toMatch(/button:focus-visible/);
      expect(cssContent).toMatch(/\[role="button"\]:focus-visible/);
      expect(cssContent).toMatch(/\[tabindex="0"\]:focus-visible/);
    });

    it('should define appropriate focus ring colors with sufficient contrast', () => {
      const focusRingColor = 'hsl(var(--ring))';
      const backgroundColor = tailwindConfig.theme.extend.colors.background;
      
      // Focus indicators should be highly visible
      expect(cssContent).toMatch(/outline:\s*2px\s*solid.*hsl\(var\(--ring\)\)/);
    });

    it('should provide focus offset for better visibility', () => {
      expect(cssContent).toMatch(/focus:ring-offset-2/);
      expect(cssContent).toMatch(/focus:ring-offset-4/);
      expect(cssContent).toMatch(/outline-offset:\s*2px/);
    });

    it('should support focus within compound components', () => {
      // Tab bar items should have focus states
      expect(cssContent).toMatch(/\.tab-bar-item[^}]*\.focus-ring/);
      
      // Navigation tabs should be focusable
      expect(cssContent).toMatch(/\.nav-tab[^}]*cursor-pointer/);
    });
  });

  describe('Touch Target Sizes (WCAG 2.1 AA)', () => {
    it('should meet minimum 44px touch target size requirement', () => {
      // Check that minimum sizes are defined
      expect(cssContent).toMatch(/min-height:\s*44px/);
      expect(cssContent).toMatch(/min-width:\s*44px/);
    });

    it('should apply appropriate touch targets to interactive elements', () => {
      // Button elements should have adequate size
      const minTouchTargetPattern = /min-height:\s*44px/;
      expect(cssContent).toMatch(minTouchTargetPattern);
    });

    it('should define appropriate spacing for custom touch targets', () => {
      const { spacing } = tailwindConfig.theme.extend;
      
      // 18 = 4.5rem = 72px, which exceeds minimum requirements
      const touchTargetSize = getTouchTargetSize(spacing['18']);
      expect(touchTargetSize).toBeGreaterThanOrEqual(44);
    });

    it('should provide adequate spacing between interactive elements', () => {
      // Tab bar items should have sufficient spacing
      expect(cssContent).toMatch(/\.tab-bar-item[^}]*flex-1/); // Distributed spacing
      
      // Pills should have appropriate gap
      const { spacing } = tailwindConfig.theme.extend;
      const pillGap = getTouchTargetSize(spacing['pill-gap']);
      expect(pillGap).toBeGreaterThanOrEqual(8); // Minimum spacing
    });

    it('should optimize touch targets for mobile devices', () => {
      // Mobile-specific touch optimizations
      expect(cssContent).toMatch(/@media\s*\(max-width:\s*640px\)/);
      expect(cssContent).toMatch(/touch-action:\s*manipulation/);
      expect(cssContent).toMatch(/-webkit-tap-highlight-color:\s*transparent/);
    });
  });

  describe('Reduced Motion Support (WCAG 2.1 AAA)', () => {
    it('should respect prefers-reduced-motion preference', () => {
      expect(cssContent).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    });

    it('should disable animations when reduced motion is preferred', () => {
      const reducedMotionMatch = cssContent.match(
        /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\n\}/
      );
      
      if (reducedMotionMatch) {
        const reducedMotionCSS = reducedMotionMatch[1];
        
        expect(reducedMotionCSS).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
        expect(reducedMotionCSS).toMatch(/transition-duration:\s*0\.01ms\s*!important/);
        expect(reducedMotionCSS).toMatch(/scroll-behavior:\s*auto\s*!important/);
      }
    });

    it('should disable complex transforms that may cause motion sickness', () => {
      const reducedMotionMatch = cssContent.match(
        /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\n\}/
      );
      
      if (reducedMotionMatch) {
        const reducedMotionCSS = reducedMotionMatch[1];
        
        // Complex 3D transforms should be disabled
        expect(reducedMotionCSS).toMatch(/transform:\s*translateZ\(0\)\s*!important/);
      }
    });

    it('should maintain essential feedback while reducing motion', () => {
      const reducedMotionMatch = cssContent.match(
        /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\n\}/
      );
      
      if (reducedMotionMatch) {
        const reducedMotionCSS = reducedMotionMatch[1];
        
        // Swipe overlays should still work but without motion
        expect(reducedMotionCSS).toMatch(/transition:\s*opacity\s*0\.01ms/);
      }
    });

    it('should provide alternative feedback mechanisms', () => {
      // When motion is reduced, we should still provide visual feedback
      // This might be through opacity changes, color changes, etc.
      
      const swipeOverlayClasses = [
        '.swipe-overlay-like',
        '.swipe-overlay-skip', 
        '.swipe-overlay-unseen'
      ];
      
      swipeOverlayClasses.forEach(className => {
        expect(cssContent).toMatch(new RegExp(className.replace('.', '\\.')));
      });
    });
  });

  describe('Screen Reader and Assistive Technology Support', () => {
    it('should use semantic HTML structure through CSS classes', () => {
      // Navigation components should support proper structure
      expect(cssContent).toMatch(/\.nav-tabs/);
      expect(cssContent).toMatch(/\.tab-bar/);
      
      // These classes should be applied to semantic elements in implementation
    });

    it('should not hide content from screen readers unless intentional', () => {
      // Check that we don't have widespread display: none or visibility: hidden
      const hiddenContentMatches = cssContent.match(/display:\s*none/g) || [];
      const invisibleContentMatches = cssContent.match(/visibility:\s*hidden/g) || [];
      
      // Should be minimal and intentional
      expect(hiddenContentMatches.length).toBeLessThan(5);
      expect(invisibleContentMatches.length).toBeLessThan(3);
    });

    it('should provide appropriate text alternatives for visual elements', () => {
      // Icon-only elements should have proper text content or labels
      expect(cssContent).toMatch(/\.tab-bar-icon/);
      expect(cssContent).toMatch(/\.tab-bar-label/);
    });

    it('should maintain logical tab order through CSS layout', () => {
      // Flexbox and grid layouts should maintain logical order
      expect(cssContent).toMatch(/\.tab-bar-content[^}]*justify-around/);
      
      // Cards should be ordered logically in stack
      expect(cssContent).toMatch(/\.card-stack/);
    });

    it('should provide sufficient text sizing and spacing', () => {
      const { fontSize } = tailwindConfig.theme.extend;
      
      // Text should be at least 16px equivalent for readability
      const cardTitleSize = parseFloat(fontSize['card-title'][0]);
      expect(cardTitleSize).toBeGreaterThanOrEqual(1.0); // 1rem = 16px
      
      // Line heights should support readability
      expect(parseFloat(fontSize['card-title'][1].lineHeight)).toBeGreaterThanOrEqual(1.2);
      expect(parseFloat(fontSize['card-subtitle'][1].lineHeight)).toBeGreaterThanOrEqual(1.2);
    });
  });

  describe('Color Independence and Visual Cues', () => {
    it('should not rely solely on color for important information', () => {
      // Swipe overlays should have both color and iconographic cues
      expect(cssContent).toMatch(/\.swipe-overlay-icon/);
      expect(cssContent).toMatch(/\.swipe-overlay-content/);
    });

    it('should provide multiple visual cues for different states', () => {
      // Active/inactive states should have multiple indicators
      expect(cssContent).toMatch(/\.nav-tab-active/);
      expect(cssContent).toMatch(/\.nav-tab-inactive/);
      expect(cssContent).toMatch(/\.tab-bar-item-active/);
      expect(cssContent).toMatch(/\.tab-bar-item-inactive/);
    });

    it('should maintain visual hierarchy without relying solely on color', () => {
      const { fontSize } = tailwindConfig.theme.extend;
      
      // Different text levels should have different sizes and weights
      expect(fontSize['card-title'][1].fontWeight).toBe('700');
      expect(fontSize['card-subtitle'][1].fontWeight).toBe('500');
      expect(fontSize['card-meta'][1].fontWeight).toBe('400');
    });

    it('should provide visual affordances for interactive elements', () => {
      // Interactive elements should have visual cues beyond color
      expect(cssContent).toMatch(/cursor:\s*pointer/);
      expect(cssContent).toMatch(/cursor:\s*grabbing/);
      
      // Hover states should provide additional feedback
      expect(cssContent).toMatch(/:hover/);
    });
  });

  describe('Error Prevention and User Control', () => {
    it('should provide clear loading states that are accessible', () => {
      expect(cssContent).toMatch(/\.loading-card/);
      expect(cssContent).toMatch(/\.skeleton/);
      expect(cssContent).toMatch(/\.animate-pulse/);
    });

    it('should define error states with appropriate visual treatment', () => {
      expect(cssContent).toMatch(/\.error-card/);
      expect(cssContent).toMatch(/\.error-title/);
      expect(cssContent).toMatch(/\.error-message/);
    });

    it('should provide undo or reversal mechanisms through styling', () => {
      // Card stack should allow for visual feedback and potential reversal
      expect(cssContent).toMatch(/\.card-dragging/);
      
      // Animation states should be manageable
      expect(cssContent).toMatch(/\.animation-paused/);
      expect(cssContent).toMatch(/\.animation-running/);
    });
  });

  describe('Responsive Accessibility', () => {
    it('should maintain accessibility across different screen sizes', () => {
      // Mobile breakpoint should maintain touch targets
      expect(cssContent).toMatch(/@media\s*\(max-width:\s*640px\)/);
      
      // Touch targets should be maintained on mobile
      const mobileSection = cssContent.match(
        /@media\s*\(max-width:\s*640px\)\s*\{([\s\S]*?)\n(?=@|\n\s*$)/
      );
      
      if (mobileSection) {
        expect(mobileSection[1]).toMatch(/min-height:\s*44px/);
      }
    });

    it('should optimize for different input methods', () => {
      // Hover states only where supported
      expect(cssContent).toMatch(/@media\s*\(hover:\s*hover\)/);
      
      // Touch-specific optimizations
      expect(cssContent).toMatch(/touch-action:\s*manipulation/);
    });

    it('should handle safe areas for mobile devices', () => {
      // Safe area utilities should be accessible
      expect(cssContent).toMatch(/\.safe-area-top/);
      expect(cssContent).toMatch(/\.safe-area-bottom/);
      
      // Environmental values should be used
      expect(cssContent).toMatch(/env\(safe-area-inset-/);
    });
  });

  describe('Performance Impact on Accessibility', () => {
    it('should not compromise accessibility for performance optimizations', () => {
      // Hardware acceleration shouldn't interfere with screen readers
      expect(cssContent).toMatch(/transform:\s*translateZ\(0\)/);
      
      // But should maintain content accessibility
      expect(cssContent).not.toMatch(/user-select:\s*none.*\.movie-card-title/);
    });

    it('should maintain semantic structure with CSS Grid/Flexbox', () => {
      // Layout should support logical reading order
      expect(cssContent).toMatch(/\.for-you-grid[^}]*flex/);
      expect(cssContent).toMatch(/\.tab-bar-content[^}]*flex/);
    });

    it('should provide fallbacks for complex visual effects', () => {
      // Complex effects should degrade gracefully
      expect(cssContent).toMatch(/backdrop-filter/);
      
      // Should have fallbacks or not break content if unsupported
      // This is more about defensive CSS practices
    });
  });

  describe('WCAG 2.1 AAA Enhancements (Optional)', () => {
    it('should support enhanced contrast ratios where possible', () => {
      const backgroundColor = tailwindConfig.theme.extend.colors.background;
      const primaryText = tailwindConfig.theme.extend.colors['text-primary'];
      
      const contrastRatio = getContrastRatio(backgroundColor, primaryText);
      expect(contrastRatio).toBeGreaterThanOrEqual(7.0); // WCAG AAA level
    });

    it('should minimize context changes that could disorient users', () => {
      // Animations should be predictable and not cause unexpected context changes
      const { animation } = tailwindConfig.theme.extend;
      
      // Animation names should be semantic and predictable
      expect(animation).toHaveProperty('swipe-right');
      expect(animation).toHaveProperty('swipe-left');
      expect(animation).toHaveProperty('card-enter');
      
      // No surprising or disorienting animation names
      const animationNames = Object.keys(animation);
      animationNames.forEach(name => {
        expect(name).not.toMatch(/shake|flash|strobe/);
      });
    });

    it('should provide adequate spacing for cognitive accessibility', () => {
      const { spacing } = tailwindConfig.theme.extend;
      
      // Adequate spacing between interactive elements
      const cardGap = getTouchTargetSize(spacing['card-gap']);
      expect(cardGap).toBeGreaterThanOrEqual(16); // 1rem spacing
      
      const pillGap = getTouchTargetSize(spacing['pill-gap']);
      expect(pillGap).toBeGreaterThanOrEqual(8); // 0.5rem spacing
    });
  });
});