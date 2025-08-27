import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'FlickPick - Pick your next flick',
    template: '%s | FlickPick',
  },
  description: 'Discover movies through an intuitive swipe interface. No login required - just swipe and discover what\'s trending.',
  keywords: ['movies', 'discovery', 'tinder', 'swipe', 'tmdb', 'ratings'],
  authors: [{ name: 'Barry Napier' }],
  creator: 'Barry Napier',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://flick-pick.vercel.app',
    title: 'FlickPick - Pick your next flick',
    description: 'Discover movies through an intuitive swipe interface',
    siteName: 'FlickPick',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlickPick - Pick your next flick',
    description: 'Discover movies through an intuitive swipe interface',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className="dark"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-white antialiased font-sans">
        <div className="flex min-h-screen flex-col">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}