/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import BusinessDetail from './page'
import * as db from '@/lib/db'

vi.mock('@/lib/db', () => ({
  getBusinessBySlug: vi.fn(),
}))

vi.mock('@/components/features/MessageForm', () => ({
  MessageForm: () => <div data-testid="message-form"></div>,
}))

vi.mock('@/components/features/QAWidget', () => ({
  QAWidget: () => <div data-testid="qa-widget"></div>,
}))

describe('BusinessDetail JSON-LD XSS', () => {
  it('escapes malicious characters in JSON-LD', async () => {
    vi.mocked(db.getBusinessBySlug).mockResolvedValue({
      id: '1',
      name: 'Test Business',
      category: { name: 'Cat' },
      island: { name: 'Island' },
      averageRating: 5,
      reviewCount: 1,
      image: 'img.jpg',
      phone: '123',
      address: '123 Test St',
      description: '</script><script>alert(1)</script>',
      isClaimed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as any)

    // Render the async component
    const Component = await BusinessDetail({ params: Promise.resolve({ slug: '1' }) })
    const { container } = render(Component)

    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    const content = script!.innerHTML

    // Check that it DOES NOT contain unescaped </script>
    expect(content).not.toContain('</script>')
    // Check that it contains the escaped unicode
    expect(content).toContain('\\u003c/script\\u003e\\u003cscript\\u003ealert(1)\\u003c/script\\u003e')
  })

  it('correctly builds JSON-LD schemas with nested product details, return policy, brand, and shipping details', async () => {
    const mockReviews = [
      {
        id: 'rev1',
        rating: 5,
        comment: 'Great service!',
        createdAt: new Date('2026-07-01'),
        user: { name: 'Alice' }
      }
    ];
    const mockProducts = [
      {
        id: 'prod1',
        name: 'Sofa Cleaning',
        description: 'Deep cleaning of home sofa',
        price: 1500,
        image: null, // Test fallback image logic
      }
    ];

    vi.mocked(db.getBusinessBySlug).mockResolvedValue({
      id: '1',
      name: 'Test Business',
      category: { name: 'Cleaning Services' },
      island: { name: 'Samui' },
      averageRating: 4.5,
      reviewCount: 1,
      image: 'business-main.jpg',
      phone: '123456789',
      address: '123 Test St',
      description: 'Reliable cleaning services',
      isClaimed: true,
      products: mockProducts,
      reviews: mockReviews,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as any)

    const Component = await BusinessDetail({ params: Promise.resolve({ slug: 'test-business' }) })
    const { container } = render(Component)

    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    expect(scripts.length).toBeGreaterThan(0)

    let localBusinessSchema: any = null
    scripts.forEach((script) => {
      const parsed = JSON.parse(script.innerHTML)
      if (parsed['@type'] === 'LocalBusiness') {
        localBusinessSchema = parsed
      }
    })

    expect(localBusinessSchema).not.toBeNull()
    expect(localBusinessSchema.hasOfferCatalog).toBeDefined()
    expect(localBusinessSchema.hasOfferCatalog.itemListElement).toHaveLength(1)

    const item = localBusinessSchema.hasOfferCatalog.itemListElement[0]
    expect(item['@type']).toBe('Offer')
    expect(item.price).toBe(1500)
    expect(item.priceCurrency).toBe('THB')
    expect(item.availability).toBe('https://schema.org/InStock')

    const product = item.itemOffered
    expect(product['@type']).toBe('Product')
    expect(product.name).toBe('Sofa Cleaning')
    expect(product.description).toBe('Deep cleaning of home sofa')
    expect(product.image).toBe('business-main.jpg') // Fallback from null to business image

    expect(product.brand).toEqual({
      '@type': 'Brand',
      name: 'Test Business'
    })

    expect(product.offers).toBeDefined()
    expect(product.offers.availability).toBe('https://schema.org/InStock')
    expect(product.offers.priceValidUntil).toBe('2027-12-31')
    expect(product.offers.shippingDetails).toEqual({
      '@type': 'OfferShippingDetails',
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: '0',
        currency: 'THB'
      },
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: 'TH'
      },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: {
          '@type': 'QuantitativeValue',
          minValue: 0,
          maxValue: 1,
          unitCode: 'DAY'
        },
        transitTime: {
          '@type': 'QuantitativeValue',
          minValue: 1,
          maxValue: 3,
          unitCode: 'DAY'
        }
      }
    })
    expect(product.offers.hasMerchantReturnPolicy).toEqual({
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'TH',
      returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted'
    })

    expect(product.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: 4.5,
      reviewCount: 1
    })

    expect(product.review).toHaveLength(1)
    expect(product.review[0]).toEqual({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Alice'
      },
      datePublished: '2026-07-01',
      reviewBody: 'Great service!',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: 5,
        bestRating: 5,
        worstRating: 1
      }
    })
  })
})
