import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json() as { urls: string[] };
    let { urls } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'Missing required field: urls array' }, { status: 400 });
    }

    // Limit to 5 URLs max
    urls = urls.slice(0, 5);

    const combinedTexts: string[] = [];
    const allImageUrls = new Set<string>();

    // Fetch and parse all URLs in parallel
    const fetchPromises = urls.map(async (url) => {
      let fetchUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fetchUrl = `https://${url}`;
      }

      try {
        const fetchResponse = await fetch(fetchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        if (!fetchResponse.ok) return;

        const html = await fetchResponse.text();
        const $ = cheerio.load(html);

        // Remove scripts, styles, noscript, etc to get cleaner text
        $('script, style, noscript, iframe, svg, canvas').remove();

        const rawText = $('body').text().replace(/\s+/g, ' ').trim();
        combinedTexts.push(rawText);

        const baseUrl = new URL(fetchUrl).origin;
        $('img').each((i, el) => {
          let src = $(el).attr('src') || $(el).attr('data-src');
          if (src) {
            try {
              if (src.startsWith('//')) src = `https:${src}`;
              else if (src.startsWith('/')) src = `${baseUrl}${src}`;
              else if (!src.startsWith('http')) src = `${baseUrl}/${src}`;
              
              if (!src.startsWith('data:')) {
                allImageUrls.add(src);
              }
            } catch (e) { }
          }
        });
      } catch (e) {
        console.error(`Error crawling ${url}:`, e);
      }
    });

    await Promise.all(fetchPromises);

    if (combinedTexts.length === 0) {
      return NextResponse.json({ error: 'Failed to fetch content from any provided URLs.' }, { status: 400 });
    }

    // Combine texts, but limit total length to ~15,000 chars for context limits
    const textContext = combinedTexts.join('\n\n---\n\n').substring(0, 15000);
    const imageUrls = Array.from(allImageUrls);



    // Get the Cloudflare AI binding via OpenNext
    const { env } = getCloudflareContext();
    
    if (!env || !env.AI) {
      // Fallback for local development
      if (process.env.NODE_ENV === 'development') {
        console.warn("AI binding not found in development. Returning mock response.");
        return NextResponse.json({ 
          result: {
            description: `Mock description extracted from ${urls.join(', ')}. The site seems to offer diving lessons and trips around Koh Samui.`,
            products: [{ name: "PADI Open Water", description: "Learn to dive in 3 days", price: 15000, image: null }],
            hours: "Mon-Sun 8AM-6PM",
            discounts: "10% off for online bookings",
            images: imageUrls.slice(0, 5)
          }
        });
      }
      return NextResponse.json({ error: 'AI binding not configured' }, { status: 500 });
    }

    const prompt = `
You are an expert data extractor. I am giving you the raw text extracted from a business's website.
Your task is to parse this text and extract key information into a STRICT JSON format.

Raw Website Text:
---
${textContext}
---

Extract the following information:
1. "description": Write an engaging, SEO-optimized business description based on the text. 
2. "products": An array of products or services offered. Each object should have: "name" (string), "description" (string, short), "price" (number or null), "image" (string or null).
3. "hours": A string representing their opening and closing hours, if found.
4. "socialLinks": An object containing social media URLs, e.g. {"facebook": "...", "instagram": "..."}.
5. "faqs": An array of frequently asked questions found. Each object should have: {"question": "...", "answer": "..."}.
6. "specialOffers": An array of current discounts or promotions. Each object should have: {"title": "...", "description": "...", "validUntil": "...", "ctaLink": "..."}.
7. "menu": An array representing a menu/pricing table. Each object: {"category": "...", "items": [{"name": "...", "price": "...", "description": "..."}]}.
8. "videoUrls": An array of strings containing any YouTube/Vimeo links found.
9. "bookingUrl": A string containing a link to book or reserve directly.
10. "trustBadges": An array of strings representing any credentials, e.g. ["PADI Certified", "Eco-Friendly"].
11. "amenities": An array of strings representing available facilities, e.g. ["Free Wifi", "Parking"].
12. "externalReviews": An array of URLs pointing to their Google Maps, TripAdvisor, or Yelp review pages.

Respond ONLY with a valid JSON object. Do not wrap it in markdown code blocks like \`\`\`json. The response should start with { and end with }.

Example output format:
{
  "description": "Engaging description...",
  "products": [
    { "name": "Service A", "description": "...", "price": 100, "image": null }
  ],
  "hours": "Mon-Fri 9AM-5PM",
  "socialLinks": { "facebook": "https://facebook.com/..." },
  "faqs": [ { "question": "Do you offer hotel pickup?", "answer": "Yes..." } ],
  "specialOffers": [ { "title": "10% Off", "description": "Book online for 10% off", "validUntil": null, "ctaLink": null } ],
  "menu": [ { "category": "Diving", "items": [{ "name": "Open Water", "price": "15000", "description": "3 days" }] } ],
  "videoUrls": [],
  "bookingUrl": "https://...",
  "trustBadges": ["Verified"],
  "amenities": ["Wifi"],
  "externalReviews": ["https://g.page/r/.../review"]
}
`;

    const response = await env.AI.run('@cf/meta/llama-3.1-70b-instruct', {
      messages: [
        { role: 'system', content: 'You are a strict data extraction AI. You only output valid, parsable JSON.' },
        { role: 'user', content: prompt }
      ]
    });

    let resultText = (response as any).response || response;
    
    if (typeof resultText !== 'string') {
       resultText = JSON.stringify(resultText);
    }
    
    // Clean up potential markdown wrappers
    resultText = resultText.trim();
    if (resultText.startsWith('```json')) {
      resultText = resultText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (resultText.startsWith('```')) {
      resultText = resultText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(resultText);
    } catch (e) {
      console.error("Failed to parse LLM output as JSON:", resultText);
      return NextResponse.json({ error: 'Failed to extract structured data from the website.' }, { status: 500 });
    }

    // Add images to the response (we'll let the user pick or we'll upload them)
    parsedJson.images = imageUrls.slice(0, 20); // Limit to top 20 found images

    return NextResponse.json({ result: parsedJson });

  } catch (error) {
    console.error('Crawl & Extract API Error:', error);
    return NextResponse.json({ error: 'Failed to process website' }, { status: 500 });
  }
}
