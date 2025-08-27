# FlickPick 🍿

> Pick your next flick - A Tinder-style movie discovery app

FlickPick is a modern movie rating application that lets users discover and vote on movies through an intuitive swipe interface. No login required - just swipe and discover what's trending.

## Features

- 🎬 **Swipe to Vote**: Like Tinder, but for movies
  - Right swipe = Like
  - Left swipe = Skip
  - Up swipe = Haven't seen
- 📈 **Trending Discovery**: See what's popular right now
- 🎯 **Personalized Recommendations**: Get movie suggestions based on your votes
- 📱 **Mobile-First Design**: Optimized for touch devices
- 🌙 **Dark Mode**: Easy on the eyes
- ⚡ **No Login Required**: Start swiping immediately

## Tech Stack

- **Next.js 15+** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Prisma** - Database ORM
- **SQLite** - Local database
- **Framer Motion** - Animations
- **TMDB API** - Movie data

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- TMDB API key ([Get one here](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/barry-napier/flick-pick.git
cd flick-pick
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Add your TMDB API key to .env.local
```

4. Set up the database:
```bash
npm run db:push
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start swiping!

## Project Structure

```
flick-pick/
├── app/                # Next.js App Router
├── components/         # React components
├── lib/               # Utility functions
├── prisma/            # Database schema
├── public/            # Static assets
└── types/             # TypeScript types
```

## Development

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run test       # Run tests
```

## Deployment

The app is configured for easy deployment on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbarry-napier%2Fflick-pick)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © 2025 Barry Napier

---

Built with ❤️ using Next.js and TMDB API