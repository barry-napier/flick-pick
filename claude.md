# FlickPick 🍿 - Movie Discovery Platform

## Project Overview
FlickPick is a Tinder-style movie rating application that lets users discover and vote on movies through an intuitive swipe interface. No login required - just swipe and discover what's trending.

**Tagline:** "Pick your next flick"  
**Version:** 1.0.0  
**Status:** Development  

## UI Design Specifications

### Visual Design (Based on Mockup)
- **Theme**: Dark mode with #1a1a1a background
- **Card Stack**: 3-4 cards visible with depth perspective
- **Card Design**: 
  - Rounded corners (16px radius)
  - Poster image fills entire card
  - Subtle shadow for depth
  - Cards slightly rotated for stack effect
  - Front card fully visible, back cards partially visible

### Navigation Layout
- **Top Navigation Tabs**:
  - Horizontal scrollable tabs
  - Categories: Trending (default), New, Movies, Series, TV Shows
  - Active tab: White text, bold
  - Inactive tabs: Gray text (#6b7280)
  - No underline, clean minimal style

### Movie Card Information
- **Card Content**:
  - Full poster image (TMDB poster path)
  - Bottom gradient overlay for text readability
  - Year displayed above title
  - Movie title in large white text
  - Info pills: Genre | Runtime | Rating (⭐)
  - Pills with semi-transparent background (#ffffff20)

### Bottom Section
- **"For you" Section**:
  - Horizontal scroll of recommended movies
  - Smaller poster cards (140x200px)
  - "See all" link on right
  - Based on voting history (device-specific)

### Bottom Navigation Bar
- **Tab Bar Icons**:
  - Home (house icon) - Main swipe interface
  - Discover (compass icon) - Browse categories  
  - Favorites (heart icon) - Liked movies
  - Profile (user icon) - Settings/stats
- **Style**: iOS-style tab bar with gray inactive, white active

## Tech Stack

### Core Framework
- **Next.js 15+** with App Router and Turbopack
- **TypeScript 5+** for type safety
- **React 19** with Server Components

### Styling & UI
- **Tailwind CSS** for utility-first styling
- **Shadcn/ui** for component library
- **Framer Motion** for animations
- **@use-gesture/react** for swipe detection
- **react-spring** for physics-based animations

### Database & ORM
- **SQLite** for local/edge database
- **Prisma 5+** as ORM
- **Prisma Accelerate** for connection pooling (production)

### APIs & Services
- **TMDB API** for movie data
- **FingerprintJS** for device identification
- **Vercel Analytics** for metrics
- **Sentry** for error tracking

## Project Structure

```
flick-pick/
├── app/                      # Next.js 15 App Router
│   ├── (main)/              # Main app routes
│   │   ├── page.tsx         # Swipe interface
│   │   ├── trending/        # Trending movies
│   │   ├── leaderboard/     # All-time popular
│   │   └── discover/        # Haven't seen
│   ├── api/                 # API routes
│   │   ├── movies/          # TMDB integration
│   │   ├── vote/            # Voting system
│   │   ├── trending/        # Trending data
│   │   └── fingerprint/     # Device ID
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Shadcn components
│   ├── cards/               # Movie card components
│   │   ├── MovieCard.tsx
│   │   ├── SwipeableStack.tsx
│   │   └── SwipeOverlay.tsx
│   ├── navigation/          # Navigation components
│   └── leaderboard/         # Leaderboard views
├── lib/
│   ├── db.ts                # Database client
│   ├── tmdb.ts              # TMDB API client
│   ├── fingerprint.ts       # Device fingerprinting
│   ├── utils.ts             # Utility functions
│   └── constants.ts         # App constants
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed data
├── public/                  # Static assets
├── hooks/                   # Custom React hooks
└── types/                   # TypeScript types
```

## Database Schema

```prisma
model Movie {
  id            String   @id // TMDB ID
  title         String
  posterPath    String?
  backdropPath  String?
  overview      String
  releaseDate   DateTime
  runtime       Int?     // in minutes
  voteAverage   Float
  voteCount     Int
  popularity    Float
  genres        Genre[]
  mediaType     String   // movie | tv
  cached        DateTime @default(now())
  votes         Vote[]
  
  @@index([popularity])
  @@index([mediaType])
}

model Genre {
  id            Int      @id
  name          String
  movies        Movie[]
}

model Vote {
  id            String   @id @default(cuid())
  movieId       String
  movie         Movie    @relation(fields: [movieId], references: [id])
  voteType      String   // upvote | skip | not_seen
  deviceId      String
  timestamp     DateTime @default(now())
  sessionId     String   // For "For You" recommendations
  
  @@unique([movieId, deviceId])
  @@index([deviceId, timestamp])
}

model UserPreferences {
  deviceId      String   @id
  favoriteGenres Json    // Array of genre IDs
  lastSeen      DateTime
  totalVotes    Int      @default(0)
  
  @@index([lastSeen])
}

model TrendingCache {
  id            String   @id @default(cuid())
  movieId       String
  period        String   // daily | weekly | monthly
  voteCount     Int
  rank          Int
  changePercent Float?
  updatedAt     DateTime @default(now())
  
  @@unique([movieId, period])
  @@index([period, rank])
}
```

## Component Structure

```typescript
// Main Components
<SwipeInterface />        // Main swipe view with card stack
├── <NavigationTabs />    // Top navigation (Trending, New, etc.)
├── <MovieCardStack />    // Stack of 3-4 movie cards
│   ├── <MovieCard />     // Individual card with gesture handling
│   ├── <CardInfo />      // Year, title, genre pills
│   └── <SwipeOverlay />  // Visual feedback overlays
├── <ForYouSection />     // Bottom recommendations
└── <TabBar />           // Bottom navigation

// Gesture Feedback
- Right Swipe: Green overlay + thumbs up
- Left Swipe: Red overlay + X
- Up Swipe: Blue overlay + eye icon
```

## API Endpoints

### Core APIs
```typescript
// Movie Stack
GET /api/movies?category=trending|new|movies|series|tv
Response: {
  cards: Movie[],  // 10 cards to preload
  nextCursor: string
}

// Voting
POST /api/vote
Body: {
  movieId: string,
  voteType: 'upvote' | 'skip' | 'not_seen',
  swipeDirection: 'right' | 'left' | 'up',
  sessionId: string
}

// For You Section
GET /api/recommendations/for-you
Response: {
  movies: Movie[],  // Based on device voting history
  basedOn: string[] // Genre preferences
}

// Categories
GET /api/movies/trending   // Currently trending
GET /api/movies/new       // New releases
GET /api/movies/movies    // Movies only
GET /api/movies/series    // TV Series only
GET /api/movies/tv        // TV Shows only
```

## Swipe Gestures & Animations

### Gesture Configuration
```typescript
const swipeConfig = {
  threshold: 50,        // Minimum distance for swipe
  velocity: 0.3,        // Minimum velocity
  rotationFactor: 10,   // Card rotation on drag
  maxRotation: 20,      // Maximum rotation degrees
  swipeOutDuration: 300, // Exit animation duration
  springConfig: {
    tension: 200,
    friction: 25,
    precision: 0.1
  }
}

// Visual Feedback
const overlayConfig = {
  right: { 
    color: '#10b981', 
    icon: '👍', 
    text: 'Like',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)'
  },
  left: { 
    color: '#ef4444', 
    icon: '❌', 
    text: 'Skip',
    gradient: 'linear-gradient(135deg, #ef4444, #f87171)'
  },
  up: { 
    color: '#3b82f6', 
    icon: '👁️', 
    text: "Haven't seen",
    gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)'
  }
}
```

## Environment Variables

```bash
# Required
NEXT_PUBLIC_TMDB_API_KEY=     # TMDB API key
DATABASE_URL=                  # SQLite connection
FINGERPRINT_SECRET=            # Device ID salt

# Optional
VERCEL_URL=                    # Production URL
SENTRY_DSN=                    # Error tracking
NEXT_PUBLIC_GA_ID=             # Analytics
```

## Tailwind Configuration

```javascript
// tailwind.config.ts
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        card: '#1a1a1a',
        'card-hover': '#2a2a2a',
        'text-primary': '#ffffff',
        'text-secondary': '#6b7280',
        'pill-bg': 'rgba(255, 255, 255, 0.12)',
        'gradient-start': 'rgba(0,0,0,0)',
        'gradient-end': 'rgba(0,0,0,0.9)',
      },
      animation: {
        'swipe-right': 'swipeRight 0.5s ease-out',
        'swipe-left': 'swipeLeft 0.5s ease-out',
        'swipe-up': 'swipeUp 0.5s ease-out',
        'card-enter': 'cardEnter 0.3s ease-out',
      },
      borderRadius: {
        'card': '16px',
        'pill': '20px',
      },
    },
  },
}
```

## Development Commands

```bash
# Installation
npm install              # Install dependencies
npm run db:push         # Push database schema
npm run db:seed         # Seed initial data

# Development
npm run dev             # Start dev server (Turbopack)
npm run db:studio       # Open Prisma Studio
npm run lint            # Run ESLint
npm run type-check      # TypeScript check

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run E2E tests
npm run test:coverage   # Coverage report

# Production
npm run build           # Production build
npm run start           # Start production server
npm run analyze         # Bundle analysis
```

## Performance Targets

- **First Contentful Paint**: < 1.2s
- **Time to Interactive**: < 2.5s
- **Swipe Animation**: 60fps
- **API Response Time**: < 200ms
- **Lighthouse Score**: > 90

## Mobile-First Responsive Design

### Breakpoints
```css
/* Mobile (default) */
.card-stack {
  width: calc(100vw - 32px);
  max-width: 400px;
  height: 600px;
}

/* Tablet */
@media (min-width: 768px) {
  .card-stack {
    width: 450px;
    height: 650px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .card-stack {
    width: 500px;
    height: 700px;
  }
}
```

## Image Loading Strategy
- Use Next.js Image component with blur placeholder
- Preload next 3 cards' images
- WebP format with fallback to JPEG
- Responsive sizing: 
  - Mobile: 400x600
  - Desktop: 500x750

## Security Considerations

1. **API Key Protection**: Server-side only TMDB calls
2. **Rate Limiting**: 100 votes/device/day
3. **Input Validation**: Zod schemas for all inputs
4. **CSRF Protection**: SameSite cookies
5. **XSS Prevention**: React's built-in escaping
6. **Device Fingerprinting**: Privacy-compliant

## Deployment Strategy

### GitHub Setup
```yaml
branches:
  main:       Production
  develop:    Staging
  feature/*:  Feature branches
```

### Vercel Configuration
```json
{
  "buildCommand": "prisma generate && next build",
  "outputDirectory": ".next",
  "devCommand": "next dev --turbo",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/movies/route.ts": {
      "maxDuration": 10
    }
  }
}
```

### CI/CD Pipeline
1. PR opened → Run tests & linting
2. PR merged to develop → Deploy to staging
3. Develop merged to main → Deploy to production
4. Automatic rollback on failed health checks

## Development Workflow

### Phase 1: Foundation (Week 1)
- [ ] Initialize Next.js 15 with TypeScript
- [ ] Set up Tailwind with dark theme
- [ ] Configure Prisma with SQLite
- [ ] Create basic layout with navigation

### Phase 2: Core Features (Week 2)
- [ ] Implement TMDB API integration
- [ ] Build MovieCard component
- [ ] Add swipe gesture detection
- [ ] Create card stack with animations

### Phase 3: Data Layer (Week 3)
- [ ] Implement voting system
- [ ] Add device fingerprinting
- [ ] Build recommendation engine
- [ ] Cache TMDB responses

### Phase 4: Polish (Week 4)
- [ ] Optimize animations for 60fps
- [ ] Add loading skeletons
- [ ] Implement error boundaries
- [ ] Mobile responsiveness testing

## Testing Strategy

### Unit Tests
- Component rendering tests
- Swipe gesture calculations
- Vote deduplication logic
- API response parsing

### E2E Tests
- Complete swipe flow
- Navigation between tabs
- Offline vote queueing
- For You recommendations

## Monitoring Metrics

### Key Performance Indicators
- Time to First Card: < 1s
- Swipe Response Time: < 50ms
- Card Load Time: < 200ms
- Daily Active Users
- Votes per Session
- Bounce Rate: < 20%

### Dashboards
- Vercel Analytics: Core Web Vitals
- Custom Dashboard: Voting patterns
- Sentry: Error tracking
- Uptime monitoring: 99.9% target

## Future Enhancements

### Phase 2
- [ ] User accounts (optional)
- [ ] Social sharing
- [ ] Genre filtering
- [ ] Search functionality
- [ ] Watchlist feature

### Phase 3
- [ ] Recommendations algorithm
- [ ] Reviews & ratings
- [ ] Watch provider integration
- [ ] Multi-language support
- [ ] PWA support

## Contributing Guidelines

1. Create feature branch from `develop`
2. Follow conventional commits
3. Write tests for new features
4. Update documentation
5. Create PR with description
6. Pass all CI checks
7. Get code review approval

## License & Attribution

- **License**: MIT
- **Movie Data**: Powered by TMDB
- **Icons**: Lucide React / Heroicons
- **Device Fingerprinting**: FingerprintJS
- **UI Inspiration**: Tinder, streaming apps

## Support & Contact

- **GitHub**: [flick-pick repository](https://github.com/yourusername/flick-pick)
- **Issues**: GitHub Issues
- **Documentation**: This file
- **Deployment**: Vercel Dashboard

---

*Last Updated: 2025-01-27*
*Version: 1.0.0*