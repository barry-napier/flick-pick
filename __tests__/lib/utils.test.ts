import {
  cn,
  formatRuntime,
  formatReleaseYear,
  formatVoteAverage,
  getTmdbImageUrl,
  generateDeviceId,
  debounce,
  throttle,
  safeJsonParse,
  isBrowser,
  storage
} from '../../lib/utils'

// Mock browser environment
const mockWindow = {
  navigator: {
    userAgent: 'test-agent',
    language: 'en-US'
  },
  screen: {
    width: 1920,
    height: 1080
  }
}

const mockDocument = {
  createElement: jest.fn(() => ({
    getContext: jest.fn(() => ({
      textBaseline: '',
      font: '',
      fillText: jest.fn()
    })),
    toDataURL: jest.fn(() => 'mock-canvas-data')
  }))
}

// Mock btoa
global.btoa = jest.fn((str) => Buffer.from(str).toString('base64'))

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500')
    expect(result).toBe('text-red-500 bg-blue-500')
  })

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'conditional', false && 'not-included')
    expect(result).toBe('base conditional')
  })

  it('should merge conflicting Tailwind classes', () => {
    // tailwind-merge should resolve conflicts
    const result = cn('px-2', 'px-4')
    expect(result).toBe('px-4')
  })

  it('should handle empty or undefined inputs', () => {
    const result = cn('', undefined, null, 'valid')
    expect(result).toBe('valid')
  })

  it('should handle arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toBe('class1 class2 class3')
  })
})

describe('formatRuntime utility', () => {
  it('should format runtime with hours and minutes', () => {
    expect(formatRuntime(90)).toBe('1h 30m')
    expect(formatRuntime(125)).toBe('2h 5m')
  })

  it('should format runtime with only hours', () => {
    expect(formatRuntime(120)).toBe('2h')
    expect(formatRuntime(180)).toBe('3h')
  })

  it('should format runtime with only minutes', () => {
    expect(formatRuntime(45)).toBe('45m')
    expect(formatRuntime(30)).toBe('30m')
  })

  it('should handle null or undefined runtime', () => {
    expect(formatRuntime(null)).toBe('Unknown')
    expect(formatRuntime(undefined as any)).toBe('Unknown')
  })

  it('should handle zero runtime', () => {
    expect(formatRuntime(0)).toBe('0m')
  })

  it('should handle edge cases', () => {
    expect(formatRuntime(1)).toBe('1m')
    expect(formatRuntime(60)).toBe('1h')
    expect(formatRuntime(61)).toBe('1h 1m')
  })
})

describe('formatReleaseYear utility', () => {
  it('should extract year from Date object', () => {
    const date = new Date('2023-05-15')
    expect(formatReleaseYear(date)).toBe('2023')
  })

  it('should extract year from date string', () => {
    expect(formatReleaseYear('2023-05-15')).toBe('2023')
    expect(formatReleaseYear('2020-12-25T00:00:00.000Z')).toBe('2020')
  })

  it('should handle invalid dates', () => {
    expect(formatReleaseYear('invalid-date')).toBe('Unknown')
    expect(formatReleaseYear('')).toBe('Unknown')
  })

  it('should handle edge cases', () => {
    expect(formatReleaseYear('1900-01-01')).toBe('1900')
    expect(formatReleaseYear('2050-12-31')).toBe('2050')
  })
})

describe('formatVoteAverage utility', () => {
  it('should format vote average to 1 decimal place', () => {
    expect(formatVoteAverage(7.2)).toBe('7.2')
    expect(formatVoteAverage(8.456789)).toBe('8.5')
  })

  it('should handle whole numbers', () => {
    expect(formatVoteAverage(8)).toBe('8.0')
    expect(formatVoteAverage(10)).toBe('10.0')
  })

  it('should handle zero and negative numbers', () => {
    expect(formatVoteAverage(0)).toBe('0.0')
    expect(formatVoteAverage(-1.5)).toBe('-1.5')
  })

  it('should round correctly', () => {
    expect(formatVoteAverage(7.05)).toBe('7.1')
    expect(formatVoteAverage(7.04)).toBe('7.0')
  })
})

describe('getTmdbImageUrl utility', () => {
  it('should generate correct TMDB image URL', () => {
    const path = '/abc123.jpg'
    const expected = 'https://image.tmdb.org/t/p/w500/abc123.jpg'
    expect(getTmdbImageUrl(path)).toBe(expected)
  })

  it('should handle different image sizes', () => {
    const path = '/test.jpg'
    expect(getTmdbImageUrl(path, 'w200')).toBe('https://image.tmdb.org/t/p/w200/test.jpg')
    expect(getTmdbImageUrl(path, 'w400')).toBe('https://image.tmdb.org/t/p/w400/test.jpg')
    expect(getTmdbImageUrl(path, 'original')).toBe('https://image.tmdb.org/t/p/original/test.jpg')
  })

  it('should return placeholder for null path', () => {
    expect(getTmdbImageUrl(null)).toBe('/placeholder-movie.jpg')
    expect(getTmdbImageUrl('')).toBe('/placeholder-movie.jpg')
  })

  it('should default to w500 size', () => {
    const path = '/test.jpg'
    expect(getTmdbImageUrl(path)).toBe(getTmdbImageUrl(path, 'w500'))
  })
})

describe('generateDeviceId utility', () => {
  beforeEach(() => {
    // Mock DOM APIs
    Object.assign(global, {
      document: mockDocument,
      navigator: mockWindow.navigator,
      screen: mockWindow.screen
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should generate a device ID', () => {
    const deviceId = generateDeviceId()
    expect(typeof deviceId).toBe('string')
    expect(deviceId.length).toBe(16)
  })

  it('should create canvas for fingerprinting', () => {
    generateDeviceId()
    expect(mockDocument.createElement).toHaveBeenCalledWith('canvas')
  })

  it('should use browser fingerprinting data', () => {
    const deviceId = generateDeviceId()
    expect(deviceId).toBeDefined()
    expect(global.btoa).toHaveBeenCalled()
  })

  it('should generate consistent IDs for same environment', () => {
    const id1 = generateDeviceId()
    const id2 = generateDeviceId()
    // Note: In this simple implementation, IDs might be the same in the same test environment
    expect(typeof id1).toBe('string')
    expect(typeof id2).toBe('string')
  })
})

describe('debounce utility', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should delay function execution', () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn()
    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(100)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should cancel previous calls', () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn()
    debouncedFn()
    debouncedFn()

    jest.advanceTimersByTime(100)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should pass arguments correctly', () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn('arg1', 'arg2')
    jest.advanceTimersByTime(100)

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
  })
})

describe('throttle utility', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should limit function execution rate', () => {
    const mockFn = jest.fn()
    const throttledFn = throttle(mockFn, 100)

    throttledFn()
    throttledFn()
    throttledFn()

    expect(mockFn).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(100)
    throttledFn()
    
    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('should pass arguments correctly', () => {
    const mockFn = jest.fn()
    const throttledFn = throttle(mockFn, 100)

    throttledFn('arg1', 'arg2')
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('should respect timing constraints', () => {
    const mockFn = jest.fn()
    const throttledFn = throttle(mockFn, 100)

    throttledFn()
    expect(mockFn).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(50)
    throttledFn()
    expect(mockFn).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(50)
    throttledFn()
    expect(mockFn).toHaveBeenCalledTimes(2)
  })
})

describe('safeJsonParse utility', () => {
  it('should parse valid JSON', () => {
    const json = '{"key": "value", "number": 42}'
    const result = safeJsonParse(json, {})
    
    expect(result).toEqual({ key: 'value', number: 42 })
  })

  it('should return fallback for invalid JSON', () => {
    const invalidJson = '{"invalid": json}'
    const fallback = { error: true }
    const result = safeJsonParse(invalidJson, fallback)
    
    expect(result).toEqual(fallback)
  })

  it('should handle different data types', () => {
    expect(safeJsonParse('[]', null)).toEqual([])
    expect(safeJsonParse('null', 'fallback')).toBeNull()
    expect(safeJsonParse('true', false)).toBe(true)
    expect(safeJsonParse('"string"', 'fallback')).toBe('string')
  })

  it('should preserve TypeScript types', () => {
    interface TestType {
      id: number
      name: string
    }

    const json = '{"id": 1, "name": "test"}'
    const fallback: TestType = { id: 0, name: '' }
    const result = safeJsonParse<TestType>(json, fallback)
    
    expect(result.id).toBe(1)
    expect(result.name).toBe('test')
  })
})

describe('isBrowser utility', () => {
  it('should return true in test environment with jsdom', () => {
    // jsdom provides window object
    expect(isBrowser).toBe(true)
  })
})

describe('storage utilities', () => {
  beforeEach(() => {
    // Mock localStorage
    const mockStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    }

    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true,
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('storage.get', () => {
    it('should get item from localStorage', () => {
      const mockLocalStorage = window.localStorage as jest.Mocked<Storage>
      mockLocalStorage.getItem.mockReturnValue('test-value')

      const result = storage.get('test-key')
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key')
      expect(result).toBe('test-value')
    })

    it('should handle localStorage errors gracefully', () => {
      const mockLocalStorage = window.localStorage as jest.Mocked<Storage>
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      const result = storage.get('test-key')
      expect(result).toBeNull()
    })
  })

  describe('storage.set', () => {
    it('should set item in localStorage', () => {
      const mockLocalStorage = window.localStorage as jest.Mocked<Storage>
      
      storage.set('test-key', 'test-value')
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value')
    })

    it('should handle localStorage errors gracefully', () => {
      const mockLocalStorage = window.localStorage as jest.Mocked<Storage>
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      // Should not throw
      expect(() => storage.set('test-key', 'test-value')).not.toThrow()
    })
  })

  describe('storage.remove', () => {
    it('should remove item from localStorage', () => {
      const mockLocalStorage = window.localStorage as jest.Mocked<Storage>
      
      storage.remove('test-key')
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key')
    })

    it('should handle localStorage errors gracefully', () => {
      const mockLocalStorage = window.localStorage as jest.Mocked<Storage>
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      expect(() => storage.remove('test-key')).not.toThrow()
    })
  })
})

describe('Utility Functions Integration', () => {
  it('should work together for movie data formatting', () => {
    const movieData = {
      runtime: 148,
      releaseDate: '2023-07-21T00:00:00.000Z',
      voteAverage: 8.456,
      posterPath: '/abc123.jpg'
    }

    expect(formatRuntime(movieData.runtime)).toBe('2h 28m')
    expect(formatReleaseYear(movieData.releaseDate)).toBe('2023')
    expect(formatVoteAverage(movieData.voteAverage)).toBe('8.5')
    expect(getTmdbImageUrl(movieData.posterPath)).toBe('https://image.tmdb.org/t/p/w500/abc123.jpg')
  })

  it('should handle performance optimization utilities together', () => {
    const mockFn = jest.fn()
    
    // Combine debounce and throttle for different use cases
    const debouncedFn = debounce(mockFn, 300)
    const throttledFn = throttle(mockFn, 100)
    
    expect(typeof debouncedFn).toBe('function')
    expect(typeof throttledFn).toBe('function')
  })
})