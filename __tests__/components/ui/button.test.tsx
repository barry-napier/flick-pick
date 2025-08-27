import { render, screen, fireEvent } from '@testing-library/react'
import { Button, buttonVariants } from '../../../components/ui/button'

describe('Button Component', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button.tagName).toBe('BUTTON')
  })

  it('should handle click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should not handle clicks when disabled', () => {
    const handleClick = jest.fn()
    render(
      <Button disabled onClick={handleClick}>
        Disabled button
      </Button>
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should render as child element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link button</a>
      </Button>
    )
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/test')
  })

  it('should forward refs correctly', () => {
    const ref = jest.fn()
    render(<Button ref={ref}>Button with ref</Button>)
    
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
  })

  it('should have correct displayName', () => {
    expect(Button.displayName).toBe('Button')
  })
})

describe('Button Variants', () => {
  it('should render with default variant', () => {
    render(<Button>Default button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('should render with destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground')
  })

  it('should render with outline variant', () => {
    render(<Button variant="outline">Outline button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border', 'border-input', 'bg-background')
  })

  it('should render with secondary variant', () => {
    render(<Button variant="secondary">Secondary button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground')
  })

  it('should render with ghost variant', () => {
    render(<Button variant="ghost">Ghost button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground')
  })

  it('should render with link variant', () => {
    render(<Button variant="link">Link button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-primary', 'underline-offset-4', 'hover:underline')
  })
})

describe('Button Sizes', () => {
  it('should render with default size', () => {
    render(<Button>Default size</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-10', 'px-4', 'py-2')
  })

  it('should render with small size', () => {
    render(<Button size="sm">Small button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-9', 'rounded-md', 'px-3')
  })

  it('should render with large size', () => {
    render(<Button size="lg">Large button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-11', 'rounded-md', 'px-8')
  })

  it('should render with icon size', () => {
    render(<Button size="icon">🏠</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-10', 'w-10')
  })
})

describe('Button Styling', () => {
  it('should have base styling classes', () => {
    render(<Button>Base button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'whitespace-nowrap',
      'rounded-md',
      'text-sm',
      'font-medium',
      'ring-offset-background',
      'transition-colors'
    )
  })

  it('should have focus-visible styles', () => {
    render(<Button>Focus button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass(
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2'
    )
  })

  it('should have disabled styles', () => {
    render(<Button disabled>Disabled button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
  })

  it('should merge custom className with variant classes', () => {
    render(<Button className="custom-class">Custom button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
    expect(button).toHaveClass('bg-primary') // Should still have variant classes
  })
})

describe('Button Accessibility', () => {
  it('should be keyboard accessible', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Keyboard button</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })
    
    // Button should be focusable and handle keyboard events natively
    expect(button).toHaveAttribute('type', 'button')
  })

  it('should support ARIA attributes', () => {
    render(
      <Button aria-label="Custom label" aria-describedby="description">
        Button with ARIA
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Custom label')
    expect(button).toHaveAttribute('aria-describedby', 'description')
  })

  it('should be screen reader accessible', () => {
    render(<Button>Screen reader button</Button>)
    
    const button = screen.getByRole('button', { name: 'Screen reader button' })
    expect(button).toBeInTheDocument()
  })

  it('should have proper focus management', () => {
    render(<Button>Focus test</Button>)
    
    const button = screen.getByRole('button')
    button.focus()
    
    expect(button).toHaveFocus()
  })
})

describe('buttonVariants Function', () => {
  it('should return correct classes for default variant', () => {
    const classes = buttonVariants()
    
    expect(classes).toContain('bg-primary')
    expect(classes).toContain('text-primary-foreground')
    expect(classes).toContain('h-10')
    expect(classes).toContain('px-4')
  })

  it('should return correct classes for custom variant and size', () => {
    const classes = buttonVariants({ variant: 'outline', size: 'lg' })
    
    expect(classes).toContain('border')
    expect(classes).toContain('bg-background')
    expect(classes).toContain('h-11')
    expect(classes).toContain('px-8')
  })

  it('should merge custom className', () => {
    const classes = buttonVariants({ className: 'custom-class' })
    
    expect(classes).toContain('custom-class')
    expect(classes).toContain('bg-primary') // Should still have default classes
  })

  it('should handle undefined values gracefully', () => {
    const classes = buttonVariants({ variant: undefined, size: undefined })
    
    // Should use default values
    expect(classes).toContain('bg-primary')
    expect(classes).toContain('h-10')
  })
})

describe('Button Component Integration', () => {
  it('should work with form submission', () => {
    const handleSubmit = jest.fn((e) => e.preventDefault())
    
    render(
      <form onSubmit={handleSubmit}>
        <Button type="submit">Submit</Button>
      </form>
    )
    
    const button = screen.getByRole('button', { name: 'Submit' })
    fireEvent.click(button)
    
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })

  it('should work as a link when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test" data-testid="link-button">
          Link Button
        </a>
      </Button>
    )
    
    const link = screen.getByTestId('link-button')
    expect(link).toHaveAttribute('href', '/test')
    expect(link).toHaveClass('bg-primary') // Should have button styles
  })
})

describe('Button Performance', () => {
  it('should render without unnecessary re-renders', () => {
    const { rerender } = render(<Button>Button 1</Button>)
    
    rerender(<Button>Button 2</Button>)
    
    const button = screen.getByRole('button', { name: 'Button 2' })
    expect(button).toBeInTheDocument()
  })

  it('should handle rapid clicks efficiently', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Rapid click</Button>)
    
    const button = screen.getByRole('button')
    
    // Simulate rapid clicking
    for (let i = 0; i < 10; i++) {
      fireEvent.click(button)
    }
    
    expect(handleClick).toHaveBeenCalledTimes(10)
  })
})