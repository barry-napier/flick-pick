// Database types (matching Prisma schema)
export interface Movie {
  id: string;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  releaseDate: Date;
  runtime: number | null;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  mediaType: string;
  cached: Date;
  genres: Genre[];
  votes?: Vote[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Vote {
  id: string;
  movieId: string;
  voteType: VoteType;
  deviceId: string;
  timestamp: Date;
  sessionId: string;
}

export interface UserPreferences {
  deviceId: string;
  favoriteGenres: string; // JSON string
  lastSeen: Date;
  totalVotes: number;
}

export interface TrendingCache {
  id: string;
  movieId: string;
  period: TrendingPeriod;
  voteCount: number;
  rank: number;
  changePercent: number | null;
  updatedAt: Date;
}

// Enum-like types
export type VoteType = 'upvote' | 'skip' | 'not_seen';
export type SwipeDirection = 'right' | 'left' | 'up';
export type MediaType = 'movie' | 'tv';
export type MovieCategory = 'trending' | 'new' | 'movies' | 'series' | 'tv';
export type TrendingPeriod = 'daily' | 'weekly' | 'monthly';

// API Response types
export interface MovieStackResponse {
  cards: Movie[];
  nextCursor: string | null;
}

export interface VoteRequest {
  movieId: string;
  voteType: VoteType;
  swipeDirection: SwipeDirection;
  sessionId: string;
}

export interface VoteResponse {
  success: boolean;
  message: string;
}

export interface RecommendationsResponse {
  movies: Movie[];
  basedOn: string[];
}

// Component prop types
export interface MovieCardProps {
  movie: Movie;
  index: number;
  onSwipe: (direction: SwipeDirection, movie: Movie) => void;
  isActive: boolean;
  style?: React.CSSProperties;
}

export interface SwipeOverlayProps {
  direction: SwipeDirection | null;
  opacity: number;
}

export interface NavigationTabsProps {
  activeCategory: MovieCategory;
  onCategoryChange: (category: MovieCategory) => void;
}

export interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Gesture types
export interface SwipeInfo {
  direction: SwipeDirection;
  velocity: number;
  distance: number;
  duration: number;
}

export interface GestureState {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  rotation: number;
  opacity: number;
}

// Animation types
export interface SpringConfig {
  tension: number;
  friction: number;
  precision: number;
}

export interface SwipeAnimation {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

// TMDB API types
export interface TmdbMovie {
  id: number;
  title?: string;
  name?: string; // For TV shows
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date?: string;
  first_air_date?: string; // For TV shows
  runtime?: number;
  episode_run_time?: number[]; // For TV shows
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  media_type?: 'movie' | 'tv';
}

export interface TmdbResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  statusCode: number;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Context types
export interface AppContextType {
  deviceId: string | null;
  sessionId: string;
  preferences: UserPreferences | null;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

// Hook return types
export interface UseSwipeGestureReturn {
  bind: () => any;
  swipeState: GestureState;
  resetPosition: () => void;
}

export interface UseMovieStackReturn {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

export interface UseVotingReturn {
  submitVote: (movieId: string, voteType: VoteType, direction: SwipeDirection) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}