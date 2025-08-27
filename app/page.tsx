export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          FlickPick 🍿
        </h1>
        <p className="text-lg text-gray-300 max-w-md">
          Pick your next flick - Coming soon!
        </p>
        <div className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-lg">
          <p className="text-sm text-gray-400">
            Next.js 15 with Tailwind CSS Dark Theme
            <br />
            Design System Ready!
          </p>
        </div>
      </div>
    </main>
  );
}