import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FlickPick - Discover Your Next Movie',
  description: 'Swipe through trending movies and discover your next favorite film',
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          FlickPick 🍿
        </h1>
        <p className="text-lg text-gray-300 max-w-md">
          Pick your next flick - Coming soon!
        </p>
        <div className="mt-8 p-6 bg-card rounded-xl border border-gray-800 shadow-lg">
          <p className="text-sm text-gray-400">
            Next.js 15 with App Router initialized successfully.
            <br />
            Ready for Phase 2 development.
          </p>
        </div>
        <div className="mt-6 space-y-2">
          <p className="text-xs text-gray-500">
            Design System Status: ✅ Enhanced Dark Theme Active
          </p>
          <p className="text-xs text-gray-500">
            Background: {'{'}bg-background{'}'} | Card: {'{'}bg-card{'}'}
          </p>
        </div>
      </div>
    </main>
  );
}