import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format runtime in minutes to "1h 23m" format
export function formatRuntime(minutes: number | null): string {
  if (!minutes) return 'Unknown';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  
  return `${hours}h ${remainingMinutes}m`;
}

// Format release date to year only
export function formatReleaseYear(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.getFullYear().toString();
  } catch {
    return 'Unknown';
  }
}

// Format vote average to 1 decimal place
export function formatVoteAverage(rating: number): string {
  return rating.toFixed(1);
}

// Get TMDB image URL
export function getTmdbImageUrl(path: string | null, size: 'w200' | 'w400' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) return '/placeholder-movie.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// Generate device fingerprint (simplified version for demo)
export function generateDeviceId(): string {
  // This is a simplified version. In production, use FingerprintJS
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
  ].join('|');
  
  return btoa(fingerprint).slice(0, 16);
}

// Debounce function for performance
export function debounce<T extends (..._args: any[]) => any>(
  func: T,
  delay: number
): (..._args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (..._args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(..._args), delay);
  };
}

// Throttle function for scroll/gesture events
export function throttle<T extends (..._args: any[]) => any>(
  func: T,
  delay: number
): (..._args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (..._args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(..._args);
    }
  };
}

// Safe JSON parse with fallback
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// Check if we're running in the browser
export const isBrowser = typeof window !== 'undefined';

// Local storage utilities with error handling
export const storage = {
  get: (key: string) => {
    if (!isBrowser) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: string) => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silent fail for storage quota exceeded
    }
  },
  
  remove: (key: string) => {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Silent fail
    }
  },
};