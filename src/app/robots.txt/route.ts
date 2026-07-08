import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://samuiservices.com';
  
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/auth/
Disallow: /dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

User-agent: GPTBot
Allow: /
Disallow: /api/auth/
Disallow: /dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

User-agent: ChatGPT-User
Allow: /
Disallow: /api/auth/
Disallow: /dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

User-agent: OAI-SearchBot
Allow: /
Disallow: /api/auth/
Disallow: /dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

User-agent: ClaudeBot
Allow: /
Disallow: /api/auth/
Disallow: /dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

User-agent: Claude-SearchBot
Allow: /
Disallow: /api/auth/
Disallow: /dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

User-agent: Claude-User
Allow: /
Disallow: /api/auth/
Disallow: /dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

User-agent: PerplexityBot
Allow: /
Disallow: /api/auth/
Disallow: /dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

User-agent: Perplexity-User
Allow: /
Disallow: /api/auth/
Disallow: /dashboard/
Content-Signal: ai-train=no, search=yes, ai-input=no

Sitemap: ${baseUrl}/sitemap.xml`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400',
    },
  });
}
