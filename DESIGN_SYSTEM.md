# FlickPick Design System

## Overview

The FlickPick design system provides a comprehensive foundation for building the Tinder-style movie discovery interface. Built on Tailwind CSS with custom tokens, animations, and component classes optimized for 60fps performance.

## Core Design Tokens

### Color System

#### Brand Colors
```css
--background: hsl(0 0% 4%)           /* Primary background #0a0a0a */
--background-secondary: hsl(0 0% 6%) /* Secondary background */
--card: hsl(0 0% 10%)                /* Card background #1a1a1a */
--card-hover: hsl(0 0% 16%)          /* Card hover state #2a2a2a */
```

#### Text Colors
```css
--text-primary: hsl(0 0% 100%)       /* Primary text - white */
--text-secondary: hsl(220 9% 46%)    /* Secondary text - gray */
--text-tertiary: hsl(220 9% 32%)     /* Tertiary text - darker gray */
```

#### Swipe Feedback Colors
```css
--swipe-like: hsl(158 64% 52%)       /* Like - green #10b981 */
--swipe-skip: hsl(0 84% 60%)         /* Skip - red #ef4444 */
--swipe-unseen: hsl(217 91% 60%)     /* Haven't Seen - blue #3b82f6 */
```

### Typography Scale

```css
/* Card Typography */
.text-card-title    /* 24px, font-bold, line-height: 1.3 */
.text-card-subtitle /* 16px, font-medium, line-height: 1.4 */
.text-card-meta     /* 14px, font-normal, line-height: 1.4 */
.text-pill          /* 12px, font-semibold, line-height: 1 */
.text-nav-tab       /* 14px, font-semibold, line-height: 1.2 */
```

### Spacing System

```css
--card-gap: 1rem        /* 16px - Gap between cards */
--card-stack: 0.5rem    /* 8px - Stack offset */
--pill-gap: 0.5rem      /* 8px - Gap between pills */
```

### Border Radius

```css
--card: 16px           /* Movie cards */
--card-small: 12px     /* Small recommendation cards */
--pill: 20px           /* Genre/info pills */
--pill-small: 16px     /* Small pills */
--button: 12px         /* Action buttons */
```

## Animation System

### Performance-Optimized Keyframes

All animations use `transform: translateZ(0)` for hardware acceleration:

#### Swipe Animations
```css
.animate-swipe-right   /* 300ms cubic-bezier(0.4, 0.0, 0.2, 1) */
.animate-swipe-left    /* 300ms cubic-bezier(0.4, 0.0, 0.2, 1) */
.animate-swipe-up      /* 300ms cubic-bezier(0.4, 0.0, 0.2, 1) */
```

#### Card Animations
```css
.animate-card-enter    /* 400ms cubic-bezier(0.16, 1, 0.3, 1) */
.animate-card-exit     /* 300ms cubic-bezier(0.4, 0.0, 0.2, 1) */
.animate-card-stack-shift /* Stack reorganization */
```

#### UI Animations
```css
.animate-fade-in       /* 300ms ease-in-out */
.animate-slide-up      /* 300ms cubic-bezier(0.16, 1, 0.3, 1) */
.animate-shimmer       /* 2s linear infinite - loading states */
```

### Custom Timing Functions
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)
--ease-out-circ: cubic-bezier(0.08, 0.82, 0.17, 1)
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1)
--spring-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

## Component Classes

### Movie Card System

#### Base Movie Card
```css
.movie-card {
  /* Optimized card with hardware acceleration */
  @apply relative rounded-card overflow-hidden shadow-card;
  @apply bg-card border border-card-border;
  aspect-ratio: var(--card-aspect-ratio);
  will-change: transform;
  transform: translateZ(0);
}
```

#### Card Elements
```css
.movie-card-image     /* Full bleed poster image */
.movie-card-overlay   /* Gradient overlay for text readability */
.movie-card-content   /* Bottom content area */
.movie-card-year      /* Release year */
.movie-card-title     /* Movie title with text shadow */
.movie-card-pills     /* Flex container for info pills */
```

### Pill Components

#### Standard Pills
```css
.pill              /* Base pill style with backdrop blur */
.pill-small        /* Smaller variant */
.pill-genre        /* Dynamic genre colors */
.pill-rating       /* Yellow rating pill */
.pill-runtime      /* Runtime information */
```

### Navigation System

#### Top Navigation
```css
.nav-tabs          /* Horizontal scrolling tabs */
.nav-tab           /* Individual tab */
.nav-tab-active    /* Active tab state */
.nav-tab-inactive  /* Inactive tab with hover */
```

#### Bottom Tab Bar
```css
.tab-bar           /* Fixed bottom navigation */
.tab-bar-content   /* Inner container */
.tab-bar-item      /* Individual tab item */
.tab-bar-icon      /* Tab icon */
.tab-bar-label     /* Tab label */
```

### Card Stack 3D System

#### Enhanced Depth Effects
```css
.card-stack {
  perspective: 1200px;
  transform-style: preserve-3d;
}

/* Stack positioning with hardware acceleration */
.card:nth-child(1) { z-index: 40; transform: translateZ(0) scale(1); }
.card:nth-child(2) { z-index: 30; transform: translateZ(-15px) scale(0.97) translateY(-12px); }
.card:nth-child(3) { z-index: 20; transform: translateZ(-30px) scale(0.94) translateY(-24px); }
.card:nth-child(4) { z-index: 10; transform: translateZ(-45px) scale(0.91) translateY(-36px); }
```

### Swipe Feedback Overlays

#### Overlay System
```css
.swipe-overlay          /* Base overlay */
.swipe-overlay-visible  /* Visible state */
.swipe-overlay-like     /* Like feedback - green gradient */
.swipe-overlay-skip     /* Skip feedback - red gradient */
.swipe-overlay-unseen   /* Haven't seen - blue gradient */
```

## Gradient System

### Movie Card Overlays
```css
.gradient-overlay        /* Standard text overlay */
.gradient-overlay-strong /* High contrast overlay */
.gradient-overlay-subtle /* Light overlay */
```

### Swipe Feedback Gradients
```css
.swipe-like-gradient    /* Green gradient with glow */
.swipe-skip-gradient    /* Red gradient with glow */
.swipe-unseen-gradient  /* Blue gradient with glow */
```

## Loading States

### Skeleton System
```css
.skeleton           /* Base shimmer animation */
.skeleton-card      /* Card-shaped skeleton */
.skeleton-text      /* Text line skeleton */
.skeleton-pill      /* Pill-shaped skeleton */

.loading-card       /* Complete loading card */
.loading-content    /* Loading content area */
.loading-title      /* Loading title */
.loading-pills      /* Loading pills */
```

## Responsive Design

### Mobile-First Approach
```css
/* Base (Mobile) */
.card-width: min(calc(100vw - 2rem), 400px)
.card-height: min(calc(100vh - 12rem), 600px)

/* Tablet - 768px+ */
@media (min-width: 768px) {
  .card-width: 450px
  .card-height: 650px
}

/* Desktop - 1024px+ */
@media (min-width: 1024px) {
  .card-width: 500px
  .card-height: 700px
}
```

### Performance Optimizations by Device
```css
/* Mobile - Reduced complexity */
@media (max-width: 640px) {
  .card-stack .card { transform-style: flat; }
}

/* Desktop - Full 3D effects */
@media (min-width: 1025px) {
  .card-stack .card { transform-style: preserve-3d; }
}
```

## Accessibility Features

### Focus Management
```css
.focus-ring       /* Standard focus ring */
.focus-card       /* Card-specific focus */
.focus-prominent  /* High visibility focus */
```

### Touch Targets
```css
/* Minimum 44x44px touch targets */
button, .touchable, [role="button"] {
  min-height: 44px;
  min-width: 44px;
}
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  /* Disable complex transforms and animations */
}
```

### High Contrast Mode
```css
@media (prefers-contrast: high) {
  .card { border: 2px solid hsl(var(--border)); }
}
```

## Utility Classes

### Performance Utilities
```css
.gpu-accelerated     /* Hardware acceleration */
.optimize-legibility /* Font rendering optimization */
.touch-manipulation  /* Touch optimization */
```

### Layout Utilities
```css
.container-card      /* Card-width container */
.container-wide      /* Wide container */
.aspect-card         /* Card aspect ratio */
.aspect-poster       /* 2:3 aspect ratio */
.aspect-backdrop     /* 16:9 aspect ratio */
```

### Safe Area Utilities
```css
.pt-safe            /* Top safe area padding */
.pb-safe            /* Bottom safe area padding */
.px-safe            /* Horizontal safe area padding */
```

### Text Shadow Utilities
```css
.text-shadow-sm     /* Subtle text shadow */
.text-shadow-md     /* Medium text shadow */
.text-shadow-lg     /* Strong text shadow */
```

## Usage Examples

### Basic Movie Card
```jsx
<div className="movie-card gpu-accelerated">
  <img src={posterUrl} alt={title} className="movie-card-image" />
  <div className="movie-card-overlay" />
  <div className="movie-card-content">
    <div className="movie-card-year">{year}</div>
    <h2 className="movie-card-title">{title}</h2>
    <div className="movie-card-pills">
      <span className="pill-genre" style={{'--genre-color': genreColor}}>
        {genre}
      </span>
      <span className="pill-runtime">{runtime}</span>
      <span className="pill-rating">⭐ {rating}</span>
    </div>
  </div>
</div>
```

### Card Stack Container
```jsx
<div className="card-stack gpu-accelerated">
  {movies.map((movie, index) => (
    <MovieCard key={movie.id} movie={movie} className="card" />
  ))}
</div>
```

### Navigation Tabs
```jsx
<nav className="nav-tabs">
  {tabs.map((tab) => (
    <button
      key={tab.id}
      className={`nav-tab ${active === tab.id ? 'nav-tab-active' : 'nav-tab-inactive'}`}
    >
      {tab.label}
    </button>
  ))}
</nav>
```

## Performance Targets

- **Animation Frame Rate**: 60fps for all swipe animations
- **Hardware Acceleration**: All transformations use `translateZ(0)`
- **CSS Bundle Size**: Optimized with Tailwind purging
- **First Contentful Paint**: < 1.2s
- **Animation Response**: < 50ms for swipe detection

## Development Notes

1. **Hardware Acceleration**: All animated elements include `will-change: transform` and `transform: translateZ(0)`
2. **Reduced Motion**: Comprehensive support for `prefers-reduced-motion`
3. **Touch Optimization**: All interactive elements meet WCAG touch target requirements
4. **Performance**: Mobile-first with progressive enhancement for desktop
5. **Accessibility**: WCAG 2.1 AA compliant with focus management and screen reader support

---

*This design system provides the complete foundation for FlickPick's movie discovery interface, ensuring consistent styling, optimal performance, and exceptional user experience across all devices.*