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
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'Claude-SearchBot',
          'Claude-User',
          'anthropic-ai',
          'PerplexityBot',
          'Perplexity-User',
          'Google-CloudVertexBot',
          'CCBot',
          'Meta-ExternalAgent',
          'Meta-ExternalFetcher',
          'FacebookBot',
          'Applebot',
          'Amazonbot',
          'Bytespider',
          'DuckAssistBot',
          'MistralAI-User'
        ],
        allow: '/',
        disallow: ['/api/auth/', '/dashboard/'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
