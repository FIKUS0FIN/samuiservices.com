import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Input } from './Input'

describe('Input Component', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('bg-surface-container-low')
  })

  it('renders a label when provided', () => {
    render(<Input label="My Label" id="my-input" />)
    const label = screen.getByText('My Label')
    expect(label).toBeInTheDocument()
  })

  it('renders an error message when provided', () => {
    render(<Input error="This field is required" />)
    const errorText = screen.getByText('This field is required')
    expect(errorText).toBeInTheDocument()
    // Test for the error class
    expect(errorText).toHaveClass('text-error')
  })

  it('sets input border color when error is provided', () => {
    render(<Input placeholder="Error input" error="Error message" />)
    const input = screen.getByPlaceholderText('Error input')

    expect(input).toHaveClass('border-error')
  })

  it('applies fullWidth style to container and input when true', () => {
    const { container } = render(<Input fullWidth placeholder="Full width" />)
    const input = screen.getByPlaceholderText('Full width')

    // The wrapper div should have w-full class
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('w-full')
  })

  it('appends custom className to the input', () => {
    render(<Input placeholder="Custom class" className="custom-input-class" />)
    const input = screen.getByPlaceholderText('Custom class')
    expect(input).toHaveClass('bg-surface-container-low')
    expect(input).toHaveClass('custom-input-class')
  })

  it('passes other HTML attributes to the input element', () => {
    render(<Input type="email" name="email" required />)
    const input = screen.getByRole('textbox') // type="email" is still textbox for role purposes, but let's be careful
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('name', 'email')
    expect(input).toBeRequired()
  })
})
