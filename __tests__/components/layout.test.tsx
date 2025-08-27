import { render, screen } from '@testing-library/react'
import RootLayout, { metadata, viewport } from '../../app/layout'

// Mock Analytics component
jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => <div data-testid="analytics" />
}))

describe('RootLayout Component', () => {
  it('should render children correctly', () => {
    const testContent = 'Test Content'
    render(
      <RootLayout>
        <div>{testContent}</div>
      </RootLayout>
    )

    expect(screen.getByText(testContent)).toBeInTheDocument()
  })

  it('should include Analytics component', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )

    expect(screen.getByTestId('analytics')).toBeInTheDocument()
  })

  it('should have correct HTML structure', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )

    const html = container.querySelector('html')
    expect(html).toHaveAttribute('lang', 'en')
    expect(html).toHaveClass('dark')
    expect(html).toHaveAttribute('suppressHydrationWarning')
  })

  it('should have correct body classes', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )

    const body = document.body
    expect(body).toHaveClass('min-h-screen', 'bg-background', 'text-text-primary', 'antialiased', 'font-sans')
  })

  it('should have flex layout container', () => {
    render(
      <RootLayout>
        <div data-testid="content">Test</div>
      </RootLayout>
    )

    const container = screen.getByTestId('content').parentElement
    expect(container).toHaveClass('flex', 'min-h-screen', 'flex-col')
  })
})

describe('Metadata Configuration', () => {
  it('should have correct default title', () => {
    expect(metadata.title).toEqual({
      default: 'FlickPick - Pick your next flick',
      template: '%s | FlickPick',
    })
  })

  it('should have correct description', () => {
    expect(metadata.description).toBe('Discover movies through an intuitive swipe interface. No login required - just swipe and discover what\'s trending.')
  })

  it('should have relevant keywords', () => {
    const expectedKeywords = ['movies', 'discovery', 'tinder', 'swipe', 'tmdb', 'ratings']
    expect(metadata.keywords).toEqual(expectedKeywords)
  })

  it('should have author information', () => {
    expect(metadata.authors).toEqual([{ name: 'Barry Napier' }])
    expect(metadata.creator).toBe('Barry Napier')
  })

  it('should have Open Graph configuration', () => {
    expect(metadata.openGraph).toEqual({
      type: 'website',
      locale: 'en_US',
      url: 'https://flick-pick.vercel.app',
      title: 'FlickPick - Pick your next flick',
      description: 'Discover movies through an intuitive swipe interface',
      siteName: 'FlickPick',
    })
  })

  it('should have Twitter card configuration', () => {
    expect(metadata.twitter).toEqual({
      card: 'summary_large_image',
      title: 'FlickPick - Pick your next flick',
      description: 'Discover movies through an intuitive swipe interface',
    })
  })

  it('should have robots configuration', () => {
    expect(metadata.robots).toEqual({
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    })
  })

  it('should have manifest and icon configuration', () => {
    expect(metadata.manifest).toBe('/manifest.json')
    expect(metadata.icons).toEqual({
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    })
  })
})

describe('Viewport Configuration', () => {
  it('should have correct theme color', () => {
    expect(viewport.themeColor).toBe('#1a1a1a')
  })

  it('should use dark color scheme', () => {
    expect(viewport.colorScheme).toBe('dark')
  })

  it('should have mobile-optimized viewport settings', () => {
    expect(viewport.width).toBe('device-width')
    expect(viewport.initialScale).toBe(1)
    expect(viewport.maximumScale).toBe(1)
    expect(viewport.userScalable).toBe(false)
  })

  it('should have viewport-fit configured for mobile', () => {
    expect(viewport.viewportFit).toBe('cover')
  })
})

describe('Accessibility', () => {
  it('should have proper lang attribute', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )

    const html = document.documentElement
    expect(html).toHaveAttribute('lang', 'en')
  })

  it('should have antialiased text for better readability', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )

    const body = document.body
    expect(body).toHaveClass('antialiased')
  })

  it('should use semantic font stack', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )

    const body = document.body
    expect(body).toHaveClass('font-sans')
  })
})

describe('Dark Theme', () => {
  it('should have dark class on html element', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )

    const html = document.documentElement
    expect(html).toHaveClass('dark')
  })

  it('should use dark theme colors', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )

    const body = document.body
    expect(body).toHaveClass('bg-background', 'text-text-primary')
  })
})

describe('Performance', () => {
  it('should suppress hydration warnings for better performance', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )

    const html = document.documentElement
    expect(html).toHaveAttribute('suppressHydrationWarning')
  })

  it('should render without unnecessary re-renders', () => {
    const { rerender } = render(
      <RootLayout>
        <div>Content 1</div>
      </RootLayout>
    )

    rerender(
      <RootLayout>
        <div>Content 2</div>
      </RootLayout>
    )

    // Should not throw or cause issues with re-rendering
    expect(screen.getByText('Content 2')).toBeInTheDocument()
  })
})