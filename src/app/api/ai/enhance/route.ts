import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json() as { businessName: string, categoryName: string, islandName: string, description: string };
    const { businessName, categoryName, islandName, description } = body;

    if (!businessName || !categoryName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the Cloudflare AI binding via OpenNext
    const { env } = getCloudflareContext();
    
    if (!env || !env.AI) {
      // Fallback for local development if AI binding isn't available
      if (process.env.NODE_ENV === 'development') {
        console.warn("AI binding not found in development. Returning mock response.");
        return NextResponse.json({ 
          result: `## Welcome to ${businessName}\n\nLocated in beautiful ${islandName}, we are your premier choice for ${categoryName}.\n\n### Why Choose Us?\n- **Expertise**: Top rated in Koh Samui\n- **Quality**: We deliver the best.\n\n*This is a mock response because local AI binding is not connected.*` 
        });
      }
      return NextResponse.json({ error: 'AI binding not configured' }, { status: 500 });
    }

    const prompt = `
You are an expert SEO Content Writer, Keyword Strategist, and Business Analyst.

Business Name: ${businessName}
Category: ${categoryName}
Location: ${islandName || 'Koh Samui'}, Thailand
Current Description: ${description || 'No description provided.'}

Your task is to rewrite the business description based on these guidelines:
1. Hook the reader immediately and clearly state the unique value proposition and business advantage.
2. Write comprehensive, engaging body content using natural keyword integration (aim for 0.5-1.5% density for primary keywords like the category and location).
3. Include E-E-A-T signals (e.g., mention expertise, reliability, and local presence).
4. Analyze the business context and incorporate a persuasive business analytics perspective—highlighting the value delivered to customers, market positioning, and why this business stands out competitively in the local area.
5. Use Markdown formatting. Include clear subheadings (H2/H3), bullet points for scannability, and bold text for emphasis.
6. Conclude with a strong call-to-action (e.g., inviting them to visit or contact).
7. Ensure the tone is professional, authoritative, yet welcoming and helpful to tourists and expats.

Output ONLY the rewritten Markdown description. Do not include any other conversational text or pleasantries.
`;

    // Run the Cloudflare Llama 3.1 70B model (the smarter one)
    const response = await env.AI.run('@cf/meta/llama-3.1-70b-instruct', {
      messages: [
        { role: 'system', content: 'You are an SEO writing assistant and business analyst.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000
    });

    // @ts-ignore - The types for Ai response can be tricky, but it usually returns { response: string }
    const resultText = response.response || response;

    return NextResponse.json({ result: resultText });

  } catch (error) {
    console.error('AI Enhance API Error:', error);
    return NextResponse.json({ error: 'Failed to enhance SEO content' }, { status: 500 });
  }
}
