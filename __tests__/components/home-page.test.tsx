import { render, screen } from '@testing-library/react'
import HomePage, { metadata } from '../../app/page'

describe('HomePage Component', () => {
  it('should render the main heading', () => {
    render(<HomePage />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('FlickPick 🍿')
  })

  it('should display the tagline', () => {
    render(<HomePage />)
    
    const tagline = screen.getByText('Pick your next flick - Coming soon!')
    expect(tagline).toBeInTheDocument()
  })

  it('should show initialization success message', () => {
    render(<HomePage />)
    
    const successMessage = screen.getByText(/Next.js 15 with App Router initialized successfully/i)
    expect(successMessage).toBeInTheDocument()
  })

  it('should show Phase 2 ready message', () => {
    render(<HomePage />)
    
    const readyMessage = screen.getByText(/Ready for Phase 2 development/i)
    expect(readyMessage).toBeInTheDocument()
  })

  it('should have proper semantic HTML structure', () => {
    render(<HomePage />)
    
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass('flex', 'min-h-screen', 'flex-col', 'items-center', 'justify-center')
  })

  it('should have centered content layout', () => {
    render(<HomePage />)
    
    const main = screen.getByRole('main')
    expect(main).toHaveClass('items-center', 'justify-center')
  })

  it('should have responsive padding', () => {
    render(<HomePage />)
    
    const main = screen.getByRole('main')
    expect(main).toHaveClass('p-4')
  })

  it('should have proper text hierarchy', () => {
    render(<HomePage />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('text-4xl', 'font-bold', 'text-text-primary')
    
    const tagline = screen.getByText('Pick your next flick - Coming soon!')
    expect(tagline).toHaveClass('text-lg', 'text-text-secondary', 'max-w-md')
  })

  it('should have styled status card', () => {
    const { container } = render(<HomePage />)
    
    const statusCard = container.querySelector('.bg-card')
    expect(statusCard).toHaveClass('mt-8', 'p-6', 'bg-card', 'rounded-card', 'border', 'border-border')
  })

  it('should use proper spacing classes', () => {
    const { container } = render(<HomePage />)
    
    const textCenter = container.querySelector('.text-center')
    expect(textCenter).toHaveClass('space-y-4')
  })
})

describe('HomePage Metadata', () => {
  it('should have correct title', () => {
    expect(metadata.title).toBe('FlickPick - Discover Your Next Movie')
  })

  it('should have appropriate description', () => {
    expect(metadata.description).toBe('Swipe through trending movies and discover your next favorite film')
  })
})

describe('HomePage Styling', () => {
  it('should use correct color classes', () => {
    render(<HomePage />)
    
    const heading = screen.getByRole('heading')
    expect(heading).toHaveClass('text-text-primary')
    
    const tagline = screen.getByText('Pick your next flick - Coming soon!')
    expect(tagline).toHaveClass('text-text-secondary')
  })

  it('should use theme-appropriate card styling', () => {
    const { container } = render(<HomePage />)
    
    const card = container.querySelector('.bg-card')
    expect(card).toHaveClass('bg-card', 'rounded-card')
  })

  it('should have proper text sizing', () => {
    render(<HomePage />)
    
    const heading = screen.getByRole('heading')
    expect(heading).toHaveClass('text-4xl')
    
    const tagline = screen.getByText('Pick your next flick - Coming soon!')
    expect(tagline).toHaveClass('text-lg')
  })
})

describe('HomePage Accessibility', () => {
  it('should have proper heading hierarchy', () => {
    render(<HomePage />)
    
    const headings = screen.getAllByRole('heading')
    expect(headings).toHaveLength(1)
    expect(headings[0].tagName).toBe('H1')
  })

  it('should have semantic main element', () => {
    render(<HomePage />)
    
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })

  it('should have readable text content', () => {
    render(<HomePage />)
    
    // Check that all text content is present and accessible
    expect(screen.getByText('FlickPick 🍿')).toBeInTheDocument()
    expect(screen.getByText('Pick your next flick - Coming soon!')).toBeInTheDocument()
    expect(screen.getByText(/Next.js 15 with App Router/)).toBeInTheDocument()
  })

  it('should have appropriate text contrast classes', () => {
    render(<HomePage />)
    
    const heading = screen.getByRole('heading')
    expect(heading).toHaveClass('text-text-primary')
    
    // Secondary text should use secondary color for proper hierarchy
    const statusText = screen.getByText(/Next.js 15 with App Router/i)
    expect(statusText).toHaveClass('text-text-secondary')
  })
})

describe('HomePage Responsive Design', () => {
  it('should have mobile-first responsive classes', () => {
    render(<HomePage />)
    
    const main = screen.getByRole('main')
    expect(main).toHaveClass('p-4') // Mobile padding
    
    const tagline = screen.getByText('Pick your next flick - Coming soon!')
    expect(tagline).toHaveClass('max-w-md') // Constrained width for readability
  })

  it('should use full viewport height', () => {
    render(<HomePage />)
    
    const main = screen.getByRole('main')
    expect(main).toHaveClass('min-h-screen')
  })

  it('should center content properly', () => {
    render(<HomePage />)
    
    const main = screen.getByRole('main')
    expect(main).toHaveClass('flex', 'items-center', 'justify-center')
  })
})

describe('HomePage Performance', () => {
  it('should render without errors', () => {
    expect(() => render(<HomePage />)).not.toThrow()
  })

  it('should not have any console errors', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    render(<HomePage />)
    
    expect(consoleSpy).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should render efficiently with minimal DOM nodes', () => {
    const { container } = render(<HomePage />)
    
    // Should have a reasonable number of DOM nodes for a simple landing page
    const allElements = container.querySelectorAll('*')
    expect(allElements.length).toBeLessThan(20) // Arbitrary reasonable limit
  })
})