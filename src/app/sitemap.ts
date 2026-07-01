import { MetadataRoute } from 'next';
import { prisma } from '@/lib/auth';

export const revalidate = 43200; // Cache for 12 hours (ISR)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://samuiservices.com';
  
  // Base routes
  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/add-listing`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  // Fetch only slugs directly from DB (highly optimized)
  const [islands, categories, listings] = await Promise.all([
    prisma.island.findMany({ select: { slug: true } }),
    prisma.category.findMany({ select: { slug: true } }),
    prisma.listing.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const islandRoutes: MetadataRoute.Sitemap = islands.map((island) => ({
    url: `${baseUrl}/${island.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/?category=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const businessRoutes: MetadataRoute.Sitemap = listings.map((business) => ({
    url: `${baseUrl}/listing/${business.slug}`,
    lastModified: business.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...routes, ...islandRoutes, ...categoryRoutes, ...businessRoutes];
}
