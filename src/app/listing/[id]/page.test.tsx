import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import BusinessDetail from './page'
import * as db from '@/lib/db'

vi.mock('@/lib/db', () => ({
  getBusinessById: vi.fn(),
}))

describe('BusinessDetail JSON-LD XSS', () => {
  it('escapes malicious characters in JSON-LD', async () => {
    vi.mocked(db.getBusinessById).mockResolvedValue({
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
    } as any)

    // Render the async component
    const Component = await BusinessDetail({ params: Promise.resolve({ id: '1' }) })
    const { container } = render(Component)

    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    const content = script!.innerHTML

    // Check that it DOES NOT contain unescaped </script>
    expect(content).not.toContain('</script>')
    // Check that it contains the escaped unicode
    expect(content).toContain('\\u003c/script\\u003e\\u003cscript\\u003ealert(1)\\u003c/script\\u003e')
  })
})
