import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary', 'text-white') // default variant classes
  })

  it('applies the secondary variant class', () => {
    render(<Button variant="secondary">Cancel</Button>)
    const button = screen.getByRole('button', { name: /cancel/i })
    
    expect(button).toHaveClass('bg-transparent', 'border-2', 'border-primary')
  })

  it('applies fullWidth style when fullWidth is true', () => {
    render(<Button fullWidth>Block Button</Button>)
    const button = screen.getByRole('button', { name: /block button/i })
    
    expect(button).toHaveClass('w-full')
  })

  it('handles onClick events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Clickable</Button>)
    const button = screen.getByRole('button', { name: /clickable/i })
    
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('passes additional props to the button element', () => {
    render(<Button disabled data-testid="custom-btn">Disabled</Button>)
    const button = screen.getByTestId('custom-btn')
    
    expect(button).toBeDisabled()
  })
})
