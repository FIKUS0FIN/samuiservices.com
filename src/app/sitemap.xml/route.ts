import { NextResponse } from 'next/server';
import { getAllIslands, getBusinessesByIsland, getAllCategories } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://samuiservices.com';
  
  // Base routes
  const routes = [
    { url: baseUrl, changefreq: 'daily', priority: 1.0 },
    { url: `${baseUrl}/add-listing`, changefreq: 'daily', priority: 0.8 },
  ];

  // Dynamic Island routes
  const islands = await getAllIslands();
  const islandRoutes = islands.map((island) => ({
    url: `${baseUrl}/${island.slug}`,
    changefreq: 'daily',
    priority: 0.9,
  }));

  // Dynamic Category routes
  const categories = await getAllCategories();
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/?category=${cat.slug}`,
    changefreq: 'daily',
    priority: 0.8,
  }));

  // Dynamic Business routes
  const businessRoutes = [];
  for (const island of islands) {
    const { listings: businesses } = await getBusinessesByIsland(island.slug, undefined, undefined, undefined, 1, 1000);
    for (const business of businesses) {
      businessRoutes.push({
        url: `${baseUrl}/listing/${business.slug}`,
        changefreq: 'weekly',
        priority: 0.7,
      });
    }
  }

  const allUrls = [...routes, ...islandRoutes, ...categoryRoutes, ...businessRoutes];
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (route) => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      // Cache on the CDN for 24 hours, but re-fetch dynamically after 24h
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
    },
  });
}
