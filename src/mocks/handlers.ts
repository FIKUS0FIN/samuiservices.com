import { http, HttpResponse } from 'msw'

// Mock Data
const mockBusinesses: any[] = [
  {
    id: '1',
    name: 'Samui Builders Pro',
    category: 'construction',
    island: 'koh-samui',
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1541888081-3677b10214c7?auto=format&fit=crop&w=800&q=80',
    description: 'Professional construction and renovation services across Koh Samui.'
  }
]

const mockIslands: any[] = [
  { name: 'Koh Samui', slug: 'koh-samui' },
  { name: 'Koh Phangan', slug: 'koh-phangan' },
  { name: 'Koh Tao', slug: 'koh-tao' }
]

const mockCategories: any[] = [
  { name: 'Construction & Repair', slug: 'construction' },
  { name: 'Cleaning Services', slug: 'cleaning' }
]

export const handlers = [
  http.get('/api/businesses', ({ request }) => {
    const url = new URL(request.url)
    const island = url.searchParams.get('island')
    const category = url.searchParams.get('category')
    
    let filtered = [...mockBusinesses]
    if (island) filtered = filtered.filter(b => b.island === island)
    if (category) filtered = filtered.filter(b => b.category === category)
      
    return HttpResponse.json(filtered)
  }),

  http.get('/api/businesses/:id', ({ params }) => {
    const business = mockBusinesses.find(b => b.id === params.id)
    if (!business) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(business)
  }),

  http.get('/api/islands', () => {
    return HttpResponse.json(mockIslands)
  }),

  http.get('/api/categories', () => {
    return HttpResponse.json(mockCategories)
  })
]
