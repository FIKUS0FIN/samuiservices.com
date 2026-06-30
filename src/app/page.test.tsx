/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BusinessCard } from '../components/features/BusinessCard'

const mockBusiness: any = {
  id: 'test-1',
  slug: 'test-1',
  name: 'Test Business',
  category: { id: 'cat-1', name: 'construction' },
  island: { id: 'isl-1', name: 'koh-samui' },
  averageRating: 4.5,
  reviewCount: 10,
  image: 'https://example.com/image.jpg',
  description: 'A test business description.'
}

describe('BusinessCard Integration', () => {
  it('renders business information correctly', () => {
    render(<BusinessCard business={mockBusiness} />)
    
    // Check main details
    expect(screen.getByText('Test Business')).toBeInTheDocument()
    
    // Check badges/meta
    expect(screen.getByText(/4\.5/)).toBeInTheDocument()
    expect(screen.getByText(/\(10 reviews\)/i)).toBeInTheDocument()
    expect(screen.getAllByText(/construction/i).length).toBeGreaterThan(0)
    
    // Check link
    const link = screen.getAllByRole('link')[0]
    expect(link).toHaveAttribute('href', '/listing/test-1')
  })
})
