// App configuration constants
export const APP_CONFIG = {
  name: 'FlickPick',
  tagline: 'Pick your next flick',
  version: '1.0.0',
  description: 'Discover movies through an intuitive swipe interface',
} as const;

// Performance targets
export const PERFORMANCE = {
  firstContentfulPaint: 1200, // ms
  timeToInteractive: 2500, // ms
  swipeAnimation: 60, // fps
  apiResponseTime: 200, // ms
  lighthouseScore: 90,
} as const;

// Swipe gesture configuration
export const SWIPE_CONFIG = {
  threshold: 50, // Minimum distance for swipe
  velocity: 0.3, // Minimum velocity
  rotationFactor: 10, // Card rotation on drag
  maxRotation: 20, // Maximum rotation degrees
  swipeOutDuration: 300, // Exit animation duration
  springConfig: {
    tension: 200,
    friction: 25,
    precision: 0.1,
  },
} as const;

// Swipe directions and their meanings
export const SWIPE_DIRECTIONS = {
  RIGHT: 'right',
  LEFT: 'left',
  UP: 'up',
} as const;

// Vote types
export const VOTE_TYPES = {
  UPVOTE: 'upvote',
  SKIP: 'skip',
  NOT_SEEN: 'not_seen',
} as const;

// Media types
export const MEDIA_TYPES = {
  MOVIE: 'movie',
  TV: 'tv',
} as const;

// Movie categories
export const MOVIE_CATEGORIES = {
  TRENDING: 'trending',
  NEW: 'new',
  MOVIES: 'movies',
  SERIES: 'series',
  TV: 'tv',
} as const;

// Trending periods
export const TRENDING_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
} as const;

// Visual feedback configuration
export const OVERLAY_CONFIG = {
  [SWIPE_DIRECTIONS.RIGHT]: {
    color: '#10b981',
    icon: '👍',
    text: 'Like',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    className: 'swipe-like-gradient',
  },
  [SWIPE_DIRECTIONS.LEFT]: {
    color: '#ef4444',
    icon: '❌',
    text: 'Skip',
    gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
    className: 'swipe-skip-gradient',
  },
  [SWIPE_DIRECTIONS.UP]: {
    color: '#3b82f6',
    icon: '👁️',
    text: "Haven't seen",
    gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    className: 'swipe-unseen-gradient',
  },
} as const;

// Image sizes for different screen sizes
export const IMAGE_SIZES = {
  MOBILE: {
    width: 400,
    height: 600,
  },
  DESKTOP: {
    width: 500,
    height: 750,
  },
  RECOMMENDATION: {
    width: 140,
    height: 200,
  },
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Rate limiting
export const RATE_LIMITS = {
  VOTES_PER_DAY: 100,
  API_REQUESTS_PER_MINUTE: 60,
} as const;

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  MOVIE_DATA: 3600, // 1 hour
  TRENDING_DATA: 1800, // 30 minutes
  RECOMMENDATION_DATA: 900, // 15 minutes
  STATIC_ASSETS: 86400, // 24 hours
} as const;

// Default values
export const DEFAULTS = {
  CARDS_TO_PRELOAD: 10,
  RECOMMENDATION_COUNT: 20,
  GENRE_LIMIT: 5,
  SESSION_DURATION: 3600000, // 1 hour in ms
} as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  NOT_FOUND: 'The requested content was not found.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
  VALIDATION: 'Invalid input. Please check your data.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  VOTE_RECORDED: 'Your vote has been recorded!',
  PREFERENCES_SAVED: 'Preferences saved successfully!',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  DEVICE_ID: 'flick-pick-device-id',
  USER_PREFERENCES: 'flick-pick-preferences',
  VOTE_HISTORY: 'flick-pick-votes',
  SESSION_ID: 'flick-pick-session',
  THEME: 'flick-pick-theme',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  MOVIES: '/api/movies',
  VOTE: '/api/vote',
  RECOMMENDATIONS: '/api/recommendations/for-you',
  TRENDING: '/api/trending',
  FINGERPRINT: '/api/fingerprint',
} as const;

// TMDB configuration
export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/',
  POSTER_SIZES: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
  BACKDROP_SIZES: ['w300', 'w780', 'w1280', 'original'],
} as const;