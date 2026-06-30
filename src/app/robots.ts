import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://samuiservices.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/auth/', '/dashboard/'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'anthropic-ai', 'PerplexityBot', 'Applebot', 'OAI-SearchBot'],
        allow: ['/api/agent/', '/llms.txt'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
