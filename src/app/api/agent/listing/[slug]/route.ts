import { NextRequest, NextResponse } from 'next/server';
import { getBusinessBySlug } from '@/lib/db';

const safeParse = (str: string | null | undefined, fallback: any = []) => {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    return new NextResponse('# 404 Not Found\n\nThe business you are looking for does not exist.', { status: 404, headers: { 'Content-Type': 'text/markdown' } });
  }

  const services = safeParse(business.services, []);
  const hours = safeParse(business.hours, []);
  
  // Construct Markdown
  let markdown = `# ${business.name}\n\n`;
  markdown += `**Category:** ${business.category.name}\n`;
  markdown += `**Location:** ${business.island.name}, Koh Samui, Thailand\n`;
  if (business.address) markdown += `**Address:** ${business.address}\n`;
  if (business.phone) markdown += `**Phone:** ${business.phone}\n`;
  if (business.website) markdown += `**Website:** ${business.website}\n`;
  if (business.priceLevel) markdown += `**Price Level:** ${business.priceLevel}\n`;
  if (business.averageRating > 0) markdown += `**Rating:** ${business.averageRating} stars (${business.reviewCount} reviews)\n`;
  markdown += `\n## About\n${business.description || 'No description provided.'}\n\n`;

  if (services.length > 0) {
    markdown += `## Services\n`;
    services.forEach((service: string) => {
      markdown += `- ${service}\n`;
    });
    markdown += `\n`;
  }

  if (hours.length > 0) {
    markdown += `## Opening Hours\n`;
    hours.forEach((hour: string) => {
      markdown += `- ${hour}\n`;
    });
    markdown += `\n`;
  }

  if (business.products && business.products.length > 0) {
    markdown += `## Products & Offerings\n`;
    business.products.forEach((product: any) => {
      markdown += `### ${product.name}\n`;
      if (product.price) markdown += `**Price:** ${product.price} THB\n`;
      if (product.description) markdown += `${product.description}\n`;
      markdown += `\n`;
    });
  }

  if (business.reviews && business.reviews.length > 0) {
    markdown += `## Customer Reviews\n`;
    business.reviews.forEach((review: any) => {
      markdown += `> **${review.user?.name || 'Anonymous'}** (${review.rating}/5 stars)  \n`;
      markdown += `> ${review.comment}\n\n`;
    });
  }

  markdown += `---\n*Data provided by Samui Business Directory*`;

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
