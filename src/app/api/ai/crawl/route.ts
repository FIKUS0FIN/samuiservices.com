import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import * as cheerio from 'cheerio';
import dns from 'dns/promises';

async function fetchGooglePlaceData(mapsUrl: string, apiKey: string) {
  try {
    let placeId: string | null = null;
    
    // 1. Check if CID is in the URL
    const cidMatch = mapsUrl.match(/[?&]cid=(\d+)/);
    if (cidMatch) {
      const cid = cidMatch[1];
      const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=cid:${cid}&inputtype=textquery&fields=place_id&key=${apiKey}`;
      const res = await fetch(findUrl);
      const data = await res.json() as any;
      if (data.status === 'OK' && data.candidates?.length > 0) {
        placeId = data.candidates[0].place_id;
      }
    }
    
    // 2. If no placeId yet, try to extract name from /maps/place/Name+Here/
    if (!placeId) {
      const placeNameMatch = mapsUrl.match(/\/maps\/place\/([^/]+)/);
      if (placeNameMatch) {
        const placeName = decodeURIComponent(placeNameMatch[1].replace(/\+/g, ' '));
        const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(placeName)}&inputtype=textquery&fields=place_id&key=${apiKey}`;
        const res = await fetch(findUrl);
        const data = await res.json() as any;
        if (data.status === 'OK' && data.candidates?.length > 0) {
          placeId = data.candidates[0].place_id;
        }
      }
    }

    if (!placeId) return null;

    // 3. Fetch Place Details
    const fields = 'name,rating,formatted_phone_number,formatted_address,opening_hours,website,photos,reviews,url,price_level,types,user_ratings_total,editorial_summary,geometry';
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;
    const res = await fetch(detailsUrl);
    const data = await res.json() as any;
    if (data.status === 'OK') {
      return data.result;
    }
  } catch (e) {
    console.error('Error fetching Google Place data:', e);
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { env } = getCloudflareContext();
    const apiKey = (env as any)?.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY || '';

    const body = await req.json() as { urls: string[] };
    let { urls } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'Missing required field: urls array' }, { status: 400 });
    }

    // Limit to 5 URLs max
    urls = urls.slice(0, 5);

    const combinedTexts: string[] = [];
    const allImageUrls = new Set<string>();
    let googlePlaceResult: any = null;

    // Fetch and parse all URLs sequentially to avoid Cloudflare Workers I/O context loss
    for (const url of urls) {
      let fetchUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fetchUrl = `https://${url}`;
      }

      // Check if it is a Google Maps Link
      if (fetchUrl.includes('google.com/maps') || fetchUrl.includes('maps.google.com') || fetchUrl.includes('maps.app.goo.gl')) {
        // Resolve redirect for maps.app.goo.gl
        if (fetchUrl.includes('maps.app.goo.gl')) {
          try {
            const res = await fetch(fetchUrl, { redirect: 'manual' });
            const location = res.headers.get('location');
            if (location) {
              fetchUrl = location;
            }
          } catch (e) {
            console.error('Failed to resolve redirect for', fetchUrl, e);
          }
        }
        
        // Fetch data from Google Place Details API
        const placeData = await fetchGooglePlaceData(fetchUrl, apiKey);
        if (placeData) {
          googlePlaceResult = placeData;
          let placeText = `Google Maps Place Details:\n`;
          if (placeData.name) placeText += `Name: ${placeData.name}\n`;
          if (placeData.formatted_address) placeText += `Address: ${placeData.formatted_address}\n`;
          if (placeData.formatted_phone_number) placeText += `Phone: ${placeData.formatted_phone_number}\n`;
          if (placeData.website) placeText += `Website: ${placeData.website}\n`;
          if (placeData.opening_hours?.weekday_text) {
            placeText += `Hours: ${placeData.opening_hours.weekday_text.join(', ')}\n`;
          }
          if (placeData.editorial_summary?.overview) {
            placeText += `Description: ${placeData.editorial_summary.overview}\n`;
          }
          if (placeData.rating) placeText += `Rating: ${placeData.rating}/5 (${placeData.user_ratings_total} reviews)\n`;
          if (placeData.reviews) {
            placeText += `Top Reviews:\n`;
            for (const r of placeData.reviews.slice(0, 5)) {
              placeText += `- ${r.author_name} (${r.rating}/5): ${r.text}\n`;
            }
          }
          combinedTexts.push(placeText);

          if (placeData.photos) {
            for (const photo of placeData.photos.slice(0, 10)) {
              const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photo_reference=${photo.photo_reference}&key=${apiKey}`;
              allImageUrls.add(photoUrl);
            }
          }
        }
        continue;
      }

      // 🛡️ Sentinel: Prevent Server-Side Request Forgery (SSRF)
      try {
        const parsedUrl = new URL(fetchUrl);
        const hostname = parsedUrl.hostname;

        // Check domain endings
        if (/^(localhost|127\.|192\.168\.|10\.|169\.254\.|::1|fd00:|fe80:)/.test(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
          console.warn(`Blocked SSRF attempt for URL: ${fetchUrl}`);
          continue;
        }

        // 🛡️ Sentinel: Prevent DNS Rebinding & Octal IP SSRF
        // Resolve IP and check if it's private/loopback
        const lookupResult = await dns.lookup(hostname);
        const resolvedIp = lookupResult.address;

        if (/^(127\.|192\.168\.|10\.|169\.254\.|::1|fd00:|fe80:)/.test(resolvedIp)) {
           console.warn(`Blocked SSRF (DNS Rebinding/Private IP) attempt for URL: ${fetchUrl}`);
           continue;
        }
      } catch (e) {
        continue; // Invalid URL
      }

      try {
        const fetchResponse = await fetch(fetchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        if (!fetchResponse.ok) continue;

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
    }

    if (combinedTexts.length === 0) {
      return NextResponse.json({ error: 'Failed to fetch content from any provided URLs.' }, { status: 400 });
    }

    // Combine texts, but limit total length to ~15,000 chars for context limits
    const textContext = combinedTexts.join('\n\n---\n\n').substring(0, 15000);
    const imageUrls = Array.from(allImageUrls);



    // Get the Cloudflare AI binding via OpenNext (context env resolved at top)
    
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
1. "name": The name of the business / website.
2. "phone": The primary phone number of the business.
3. "address": The physical address of the business.
4. "website": The main website URL.
5. "mapLink": The Google Maps URL / link for the business location (if found).
6. "keywords": An array of core SEO keywords (strings) describing the business's services and niche (e.g. ["diving", "diving lessons", "padi certifcate"]).
7. "description": Write an engaging, SEO-optimized business description based on the text. 
8. "products": An array of products or services offered. Each object should have: "name" (string), "description" (string, short), "price" (number or null), "image" (string or null).
9. "hours": A string representing their opening and closing hours, if found.
10. "socialLinks": An object containing social media URLs, e.g. {"facebook": "...", "instagram": "..."}.
11. "faqs": An array of frequently asked questions found. Each object should have: {"question": "...", "answer": "..."}.
12. "specialOffers": An array of current discounts or promotions. Each object should have: {"title": "...", "description": "...", "validUntil": "...", "ctaLink": "..."}.
13. "menu": An array representing a menu/pricing table. Each object: {"category": "...", "items": [{"name": "...", "price": "...", "description": "..."}]}.
14. "videoUrls": An array of strings containing any YouTube/Vimeo links found.
15. "bookingUrl": A string containing a link to book or reserve directly.
16. "trustBadges": An array of strings representing any credentials, e.g. ["PADI Certified", "Eco-Friendly"].
17. "amenities": An array of strings representing available facilities, e.g. ["Free Wifi", "Parking"].
18. "externalReviews": An array of URLs pointing to their Google Maps, TripAdvisor, or Yelp review pages.

Respond ONLY with a valid JSON object. Do not wrap it in markdown code blocks like \`\`\`json. The response should start with { and end with }.

Example output format:
{
  "name": "Blue Lagoon Diving",
  "phone": "+66 81 234 5678",
  "address": "123 Beach Rd, Koh Samui",
  "website": "https://bluelagoondiving.com",
  "mapLink": "https://maps.google.com/?cid=12345",
  "keywords": ["scuba diving", "PADI courses", "dive trips"],
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
      ],
      max_tokens: 3000
    });

    let resultText = (response as any).response || response;
    
    if (typeof resultText !== 'string') {
       resultText = JSON.stringify(resultText);
    }
    
    // Clean up potential markdown wrappers or conversational text
    resultText = resultText.trim();
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      resultText = jsonMatch[0];
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

    if (googlePlaceResult) {
      const googleReviews = googlePlaceResult.reviews?.map((r: any) => ({
        author: r.author_name,
        avatar: r.profile_photo_url || null,
        rating: r.rating,
        text: r.text,
        time: r.relative_time_description || (r.time ? new Date(r.time * 1000).toLocaleDateString() : 'Google Review'),
        source: 'Google'
      })) || [];

      parsedJson.externalReviews = {
        rating: googlePlaceResult.rating || 0,
        reviewCount: googlePlaceResult.user_ratings_total || 0,
        reviews: googleReviews
      };

      if (googlePlaceResult.geometry?.location) {
        parsedJson.lat = googlePlaceResult.geometry.location.lat;
        parsedJson.lng = googlePlaceResult.geometry.location.lng;
      }
    }

    return NextResponse.json({ result: parsedJson });

  } catch (error) {
    console.error('Crawl & Extract API Error:', error);
    return NextResponse.json({ error: 'Failed to process website' }, { status: 500 });
  }
}
