import { MetadataRoute } from 'next'
import { getAllIslands, getBusinessesByIsland } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://samuiservices.com'
  
  // Base routes
  const routes = [
    '',
    '/add-listing',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic Island routes
  const islands = await getAllIslands()
  const islandRoutes = islands.map((island) => ({
    url: `${baseUrl}/${island.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  // Dynamic Business routes
  const businessRoutes = []
  for (const island of islands) {
    const businesses = await getBusinessesByIsland(island.slug)
    for (const business of businesses) {
      businessRoutes.push({
        url: `${baseUrl}/listing/${business.id}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })
    }
  }

  return [...routes, ...islandRoutes, ...businessRoutes]
}
