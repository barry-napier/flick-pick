import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Prisma Schema Configuration', () => {
  let schemaContent: string

  beforeAll(() => {
    const schemaPath = join(process.cwd(), 'prisma', 'schema.prisma')
    schemaContent = readFileSync(schemaPath, 'utf8')
  })

  it('should use SQLite as database provider', () => {
    expect(schemaContent).toMatch(/provider\s*=\s*"sqlite"/)
  })

  it('should use DATABASE_URL environment variable', () => {
    expect(schemaContent).toMatch(/url\s*=\s*env\("DATABASE_URL"\)/)
  })

  it('should have prisma-client-js generator', () => {
    expect(schemaContent).toMatch(/provider\s*=\s*"prisma-client-js"/)
  })

  describe('Movie Model', () => {
    it('should have all required fields', () => {
      const requiredFields = [
        'id String @id',
        'title String',
        'posterPath String?',
        'backdropPath String?',
        'overview String',
        'releaseDate DateTime',
        'runtime Int?',
        'voteAverage Float',
        'voteCount Int',
        'popularity Float',
        'mediaType String',
        'cached DateTime @default(now())'
      ]

      requiredFields.forEach(field => {
        expect(schemaContent).toMatch(new RegExp(field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      })
    })

    it('should have proper indexes for performance', () => {
      expect(schemaContent).toMatch(/@@index\(\[popularity\]\)/)
      expect(schemaContent).toMatch(/@@index\(\[mediaType\]\)/)
      expect(schemaContent).toMatch(/@@index\(\[cached\]\)/)
    })

    it('should have relationships defined', () => {
      expect(schemaContent).toMatch(/genres\s+Genre\[\]/)
      expect(schemaContent).toMatch(/votes\s+Vote\[\]/)
    })
  })

  describe('Genre Model', () => {
    it('should have correct structure', () => {
      expect(schemaContent).toMatch(/model Genre \{/)
      expect(schemaContent).toMatch(/id\s+Int\s+@id/)
      expect(schemaContent).toMatch(/name\s+String\s+@unique/)
      expect(schemaContent).toMatch(/movies\s+Movie\[\]/)
    })

    it('should have unique constraint on name', () => {
      expect(schemaContent).toMatch(/name\s+String\s+@unique/)
    })
  })

  describe('Vote Model', () => {
    it('should have all required fields', () => {
      const requiredFields = [
        'id String @id @default(cuid())',
        'movieId String',
        'voteType String',
        'deviceId String',
        'timestamp DateTime @default(now())',
        'sessionId String'
      ]

      requiredFields.forEach(field => {
        expect(schemaContent).toMatch(new RegExp(field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      })
    })

    it('should have proper foreign key relationship', () => {
      expect(schemaContent).toMatch(/movie\s+Movie\s+@relation\(fields: \[movieId\], references: \[id\], onDelete: Cascade\)/)
    })

    it('should have unique constraint for vote deduplication', () => {
      expect(schemaContent).toMatch(/@@unique\(\[movieId, deviceId\]\)/)
    })

    it('should have performance indexes', () => {
      expect(schemaContent).toMatch(/@@index\(\[deviceId, timestamp\]\)/)
      expect(schemaContent).toMatch(/@@index\(\[sessionId\]\)/)
      expect(schemaContent).toMatch(/@@index\(\[voteType\]\)/)
    })
  })

  describe('UserPreferences Model', () => {
    it('should have correct structure', () => {
      expect(schemaContent).toMatch(/model UserPreferences \{/)
      expect(schemaContent).toMatch(/deviceId\s+String\s+@id/)
      expect(schemaContent).toMatch(/favoriteGenres\s+String/)
      expect(schemaContent).toMatch(/lastSeen\s+DateTime\s+@default\(now\(\)\)/)
      expect(schemaContent).toMatch(/totalVotes\s+Int\s+@default\(0\)/)
    })

    it('should have index on lastSeen for cleanup', () => {
      expect(schemaContent).toMatch(/@@index\(\[lastSeen\]\)/)
    })
  })

  describe('TrendingCache Model', () => {
    it('should have all required fields', () => {
      const requiredFields = [
        'id String @id @default(cuid())',
        'movieId String',
        'period String',
        'voteCount Int',
        'rank Int',
        'changePercent Float?',
        'updatedAt DateTime @default(now())'
      ]

      requiredFields.forEach(field => {
        expect(schemaContent).toMatch(new RegExp(field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      })
    })

    it('should have unique constraint for cache deduplication', () => {
      expect(schemaContent).toMatch(/@@unique\(\[movieId, period\]\)/)
    })

    it('should have performance indexes', () => {
      expect(schemaContent).toMatch(/@@index\(\[period, rank\]\)/)
      expect(schemaContent).toMatch(/@@index\(\[updatedAt\]\)/)
    })
  })
})

describe('Prisma Client Generation', () => {
  it('should generate Prisma client successfully', async () => {
    // Test that Prisma client can be instantiated
    expect(() => {
      const prisma = new PrismaClient()
      prisma.$disconnect()
    }).not.toThrow()
  })

  it('should have all models available in client', () => {
    const prisma = new PrismaClient()
    
    expect(prisma.movie).toBeDefined()
    expect(prisma.genre).toBeDefined()
    expect(prisma.vote).toBeDefined()
    expect(prisma.userPreferences).toBeDefined()
    expect(prisma.trendingCache).toBeDefined()
    
    prisma.$disconnect()
  })
})

describe('Database Schema Validation', () => {
  it('should support required vote types', () => {
    // Vote types should be: upvote, skip, not_seen
    const validVoteTypes = ['upvote', 'skip', 'not_seen']
    
    // Schema doesn't enforce enum in SQLite, but we document the expected values
    expect(schemaContent).toMatch(/voteType\s+String\s+\/\/ upvote \| skip \| not_seen/)
  })

  it('should support required media types', () => {
    // Media types should be: movie, tv
    expect(schemaContent).toMatch(/mediaType\s+String\s+\/\/ movie \| tv/)
  })

  it('should support required trending periods', () => {
    // Trending periods should be: daily, weekly, monthly
    expect(schemaContent).toMatch(/period\s+String\s+\/\/ daily \| weekly \| monthly/)
  })

  it('should have proper cascade deletion for votes', () => {
    // When a movie is deleted, its votes should also be deleted
    expect(schemaContent).toMatch(/onDelete: Cascade/)
  })
})

describe('Performance and Scaling Considerations', () => {
  it('should have indexes on frequently queried fields', () => {
    const expectedIndexes = [
      // Movie indexes
      '@@index([popularity])',
      '@@index([mediaType])',
      '@@index([cached])',
      
      // Vote indexes
      '@@index([deviceId, timestamp])',
      '@@index([sessionId])',
      '@@index([voteType])',
      
      // UserPreferences indexes
      '@@index([lastSeen])',
      
      // TrendingCache indexes
      '@@index([period, rank])',
      '@@index([updatedAt])'
    ]

    expectedIndexes.forEach(index => {
      expect(schemaContent).toMatch(new RegExp(index.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    })
  })

  it('should have unique constraints to prevent duplicates', () => {
    const expectedUniqueConstraints = [
      '@@unique([movieId, deviceId])', // Prevent duplicate votes
      '@@unique([movieId, period])',   // Prevent duplicate trending cache entries
      '@unique' // Genre name uniqueness
    ]

    expectedUniqueConstraints.forEach(constraint => {
      expect(schemaContent).toMatch(new RegExp(constraint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    })
  })

  it('should use appropriate field types for data efficiency', () => {
    // String IDs for flexibility with TMDB IDs
    expect(schemaContent).toMatch(/id\s+String\s+@id/)
    
    // Integer for numeric values
    expect(schemaContent).toMatch(/runtime\s+Int\?/)
    expect(schemaContent).toMatch(/voteCount\s+Int/)
    expect(schemaContent).toMatch(/totalVotes\s+Int/)
    
    // Float for decimal values
    expect(schemaContent).toMatch(/voteAverage\s+Float/)
    expect(schemaContent).toMatch(/popularity\s+Float/)
    expect(schemaContent).toMatch(/changePercent\s+Float\?/)
    
    // DateTime with defaults
    expect(schemaContent).toMatch(/timestamp\s+DateTime\s+@default\(now\(\)\)/)
  })
})