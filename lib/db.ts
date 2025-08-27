import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Database utilities
export async function healthCheck(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export async function getDbStats() {
  const [movieCount, voteCount, genreCount] = await Promise.all([
    prisma.movie.count(),
    prisma.vote.count(),
    prisma.genre.count(),
  ]);

  return {
    movies: movieCount,
    votes: voteCount,
    genres: genreCount,
  };
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});