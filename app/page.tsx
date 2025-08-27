import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FlickPick - Discover Your Next Movie',
  description: 'Swipe through trending movies and discover your next favorite film',
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-text-primary">
          FlickPick 🍿
        </h1>
        <p className="text-lg text-text-secondary max-w-md">
          Pick your next flick - Coming soon!
        </p>
        <div className="mt-8 p-6 bg-card rounded-card border border-border">
          <p className="text-sm text-text-secondary">
            Next.js 15 with App Router initialized successfully.
            <br />
            Ready for Phase 2 development.
          </p>
        </div>
      </div>
    </main>
  );
}