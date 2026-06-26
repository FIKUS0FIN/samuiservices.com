import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card } from './Card'

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(<Card><span>Test Content</span></Card>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies default card class', () => {
    render(<Card data-testid="card-element">Content</Card>)
    const card = screen.getByTestId('card-element')
    expect(card).toHaveClass('card')
  })

  it('appends custom className', () => {
    render(<Card data-testid="card-element" className="custom-class">Content</Card>)
    const card = screen.getByTestId('card-element')
    expect(card).toHaveClass('card')
    expect(card).toHaveClass('custom-class')
  })

  it('applies custom style', () => {
    render(<Card data-testid="card-element" style={{ backgroundColor: 'red' }}>Content</Card>)
    const card = screen.getByTestId('card-element')
    expect(card).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' }) // jsdom computes named colors
  })

  it('passes other HTML attributes to the div', () => {
    render(<Card data-testid="card-element" id="my-card" aria-label="custom card">Content</Card>)
    const card = screen.getByTestId('card-element')
    expect(card).toHaveAttribute('id', 'my-card')
    expect(card).toHaveAttribute('aria-label', 'custom card')
  })
})
