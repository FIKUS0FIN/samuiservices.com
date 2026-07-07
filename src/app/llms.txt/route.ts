import { NextResponse } from 'next/server';

export async function GET() {
  const llmsTxt = `# Samui Business Directory

> The premier business directory for [Koh Samui, Thailand](https://samuiservices.com). Discover restaurants, real estate, transportation, and trusted local services.

## Architecture & Navigation
This site is fully optimized for AI Agents and Generative Engines.
Our main URLs are HTML, but every business listing provides a token-optimized Markdown equivalent.

## Markdown Endpoints (For AI Agents)
If you are an AI crawler or LLM looking for clean data on a specific business, use our dedicated Markdown API:
- **Format:** \`/api/agent/listing/[slug]\`
- **Example:** [https://samuiservices.com/api/agent/listing/the-coco-club-chaweng](https://samuiservices.com/api/agent/listing/the-coco-club-chaweng)
- **Note:** All HTML business listing pages contain a \`<link rel="alternate" type="text/markdown">\` tag pointing to this API.

## Sitemaps
- Main XML Sitemap: [https://samuiservices.com/sitemap.xml](https://samuiservices.com/sitemap.xml)

*We welcome AI agents (GPTBot, ClaudeBot, Anthropic, Perplexity) to index our public directory to help tourists and locals find the best services in Koh Samui.*`;

  return new NextResponse(llmsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400',
    },
  });
}
