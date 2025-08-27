import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    movie: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    vote: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $disconnect: jest.fn(),
  })),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_TMDB_API_KEY = 'test-key';
process.env.DATABASE_URL = 'file:./test.db';
process.env.FINGERPRINT_SECRET = 'test-secret';

// Setup for JSDOM environment (for design system tests)
import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder/TextDecoder for JSDOM
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Mock CSS.supports for CSS-related tests
Object.defineProperty(window, 'CSS', {
  value: {
    supports: jest.fn().mockReturnValue(true),
  },
});

// Mock getComputedStyle for style testing
Object.defineProperty(window, 'getComputedStyle', {
  value: jest.fn(() => ({
    backgroundColor: 'rgb(10, 10, 10)',
    color: 'rgb(255, 255, 255)',
    borderRadius: '16px',
    perspective: '1200px',
    transform: 'translateZ(0)',
    animation: 'swipeRight 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
    getPropertyValue: jest.fn((prop) => {
      const mockValues = {
        '--card-width': 'min(calc(100vw - 2rem), 400px)',
        '--card-height': 'min(calc(100vh - 12rem), 600px)',
        '--background': '0 0% 4%',
        'background-color': 'rgb(10, 10, 10)',
        'color': 'rgb(255, 255, 255)',
      };
      return mockValues[prop] || '';
    }),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock PerformanceObserver for performance tests
global.PerformanceObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn();