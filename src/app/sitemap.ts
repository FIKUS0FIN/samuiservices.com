import { MetadataRoute } from 'next';
import { prisma } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://samuiservices.com';
  
  // Base routes
  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/add-listing`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  // Calculate a rolling limit to gradually feed pages to Google (50 per day since July 13, 2026)
  const launchDate = new Date('2026-07-13T00:00:00Z');
  const daysSinceLaunch = Math.max(0, Math.floor((Date.now() - launchDate.getTime()) / (1000 * 60 * 60 * 24)));
  const indexLimit = Math.max(50, 50 + (daysSinceLaunch * 50));

  // Fetch only slugs directly from DB (highly optimized)
  const [islands, categories, listings] = await Promise.all([
    prisma.island.findMany({ select: { slug: true } }),
    prisma.category.findMany({ select: { slug: true } }),
    prisma.listing.findMany({ 
      select: { slug: true, updatedAt: true },
      orderBy: [
        { isPremium: 'desc' },
        { averageRating: 'desc' },
        { reviewCount: 'desc' }
      ],
      take: indexLimit
    }),
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
