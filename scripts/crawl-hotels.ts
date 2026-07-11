import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Load config
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyC1ETrImW9Q_lOxGsHwPqoDCoWfmqJM8SU';
const ACCOUNT_ID = '724aeb58ccc92105246f69ce2b9b0ff0';
const ACCESS_KEY_ID = '4120193192aa0fae1a3d3198325474c7';
const SECRET_ACCESS_KEY = '1fd50b47379461e42feaf21f7c4adeaf7d17a184f6d991663e546a00963bb69f';
const BUCKET_NAME = 'samuiservices-media';
const PUBLIC_URL = 'https://pub-3433478e81804444ae052b8316ad0d83.r2.dev';

// Setup DB connection
const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaLibSql({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN
});
const prisma = new PrismaClient({ adapter });

// Temp directory for image downloads
const TEMP_DIR = path.join(process.cwd(), 'scripts', 'temp_images');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Log utility
function log(message: string, level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' = 'INFO') {
  const timestamp = new Date().toISOString();
  let prefix = `[${timestamp}] [INFO]`;
  if (level === 'SUCCESS') prefix = `[${timestamp}] \x1b[32m[SUCCESS]\x1b[0m`;
  if (level === 'WARNING') prefix = `[${timestamp}] \x1b[33m[WARNING]\x1b[0m`;
  if (level === 'ERROR') prefix = `[${timestamp}] \x1b[31m[ERROR]\x1b[0m`;
  console.log(`${prefix} ${message}`);
}

// 1. Google Places Details API helpers
async function fetchGooglePlaceData(businessName: string) {
  try {
    log(`Querying Google Places Find Place for: "${businessName}"`);
    const query = encodeURIComponent(`${businessName} Koh Samui`);
    const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`;
    const findRes = await fetch(findUrl);
    const findData = await findRes.json() as any;

    if (findData.status === 'OK' && findData.candidates?.length > 0) {
      const placeId = findData.candidates[0].place_id;
      log(`Found Google Place ID: ${placeId}. Querying Place Details...`);

      const fields = 'name,rating,formatted_phone_number,formatted_address,opening_hours,website,photos,reviews,url,price_level,types,user_ratings_total,geometry';
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_API_KEY}`;
      const detailsRes = await fetch(detailsUrl);
      const detailsData = await detailsRes.json() as any;

      if (detailsData.status === 'OK' && detailsData.result) {
        log(`Successfully retrieved details from Google Maps Places API for "${businessName}"`, 'SUCCESS');
        return { placeId, details: detailsData.result };
      }
    } else {
      log(`No Google Place candidates found for query: "${businessName}"`, 'WARNING');
    }
  } catch (e: any) {
    log(`Google Places API error for "${businessName}": ${e.message}`, 'ERROR');
  }
  return null;
}

// Download image helper
async function downloadImage(url: string, destPath: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (e: any) {
    log(`Failed to download image ${url}: ${e.message}`, 'WARNING');
    return false;
  }
}

// Upload image using AWS CLI
function uploadImageToR2(localPath: string, destFileName: string): string | null {
  const key = `images/businesses/${destFileName}`;
  const endpoint = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`;
  
  // Set credentials inline for command run
  const command = `AWS_ACCESS_KEY_ID=${ACCESS_KEY_ID} AWS_SECRET_ACCESS_KEY=${SECRET_ACCESS_KEY} aws s3 cp "${localPath}" s3://${BUCKET_NAME}/${key} --endpoint-url ${endpoint} --cache-control "public, max-age=31536000, immutable"`;
  
  try {
    log(`Uploading to R2 using AWS CLI: ${key}...`);
    execSync(command, { stdio: 'pipe' });
    const finalUrl = `${PUBLIC_URL}/${key}`;
    log(`Uploaded successfully: ${finalUrl}`, 'SUCCESS');
    return finalUrl;
  } catch (err: any) {
    log(`Error uploading via AWS CLI: ${err.message}`, 'ERROR');
    return null;
  }
}

// Helper to filter and clean links
function getInternalLinks(links: string[], origin: string): string[] {
  const normalized = links
    .map(link => {
      try {
        const u = new URL(link, origin);
        // Ensure same domain (ignoring protocol and www)
        const host1 = u.hostname.replace('www.', '');
        const host2 = new URL(origin).hostname.replace('www.', '');
        if (host1 !== host2) return null;
        
        // Strip hash/anchor
        u.hash = '';
        return u.toString();
      } catch (e) {
        return null;
      }
    })
    .filter((l): l is string => {
      if (!l) return false;
      // Skip file downloads
      const ext = path.extname(l.split('?')[0]).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.zip', '.mp4'].includes(ext)) return false;
      return true;
    });

  // Unique links only
  return Array.from(new Set(normalized));
}

// Web crawler logic
async function crawlCustomerWebsite(homepageUrl: string, browser: any) {
  log(`Starting web crawl of customer site: ${homepageUrl}`);
  const data = {
    emails: new Set<string>(),
    phones: new Set<string>(),
    socials: {} as Record<string, string>,
    bookingUrls: new Set<string>(),
    faqs: [] as { question: string; answer: string }[],
    amenities: new Set<string>(),
    services: new Set<string>(),
    images: new Set<string>(),
    texts: [] as string[]
  };

  let origin = '';
  try {
    origin = new URL(homepageUrl).origin;
  } catch (e) {
    log(`Invalid homepage URL: ${homepageUrl}`, 'ERROR');
    return null;
  }

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const visited = new Set<string>();
  const queue: string[] = [homepageUrl];

  // Up to 5 pages total
  while (queue.length > 0 && visited.size < 5) {
    const url = queue.shift()!;
    if (visited.has(url)) continue;
    visited.add(url);

    log(`Crawling page [${visited.size}/5]: ${url}`);
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      
      // Get page title and content
      const title = await page.title();
      const textContent = await page.evaluate(() => document.body.innerText);
      const cleanTextContent = await page.evaluate(() => {
        const tags = Array.from(document.querySelectorAll('script, style, noscript, iframe, svg, canvas'));
        tags.forEach(t => t.remove());
        return document.body.innerText.replace(/\s+/g, ' ').trim();
      });
      data.texts.push(`Page Title: ${title}\nPage URL: ${url}\nContent:\n${cleanTextContent}`);

      // 1. Extract Emails
      const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/gi;
      const foundEmails = textContent.match(emailRegex) || [];
      foundEmails.forEach(e => {
        const lower = e.toLowerCase().trim();
        // Ignore generic/mock emails
        if (!lower.endsWith('.png') && !lower.endsWith('.jpg') && !lower.endsWith('.gif') && !lower.includes('example.com') && !lower.includes('sentry.io')) {
          data.emails.add(lower);
        }
      });

      // 2. Extract Phones
      const telLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href^="tel:"]'))
          .map(a => a.getAttribute('href')?.replace('tel:', '').trim())
          .filter((t): t is string => !!t);
      });
      telLinks.forEach(p => data.phones.add(p));

      const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
      const foundPhones = textContent.match(phoneRegex) || [];
      foundPhones.forEach(p => {
        const cleaned = p.trim();
        if (cleaned.length >= 8 && cleaned.length <= 20) data.phones.add(cleaned);
      });

      // 3. Extract Social Links & Booking Links
      const pageLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a'))
          .map(a => ({ href: a.href, text: a.innerText }))
          .filter(l => l.href && l.href.startsWith('http'));
      });

      for (const link of pageLinks) {
        const href = link.href.toLowerCase();
        const text = link.text.toLowerCase();

        // Social networks
        if (href.includes('facebook.com')) data.socials.facebook = link.href;
        else if (href.includes('instagram.com')) data.socials.instagram = link.href;
        else if (href.includes('youtube.com') || href.includes('youtu.be')) data.socials.youtube = link.href;
        else if (href.includes('twitter.com') || href.includes('x.com')) data.socials.twitter = link.href;
        else if (href.includes('tiktok.com')) data.socials.tiktok = link.href;
        else if (href.includes('line.me') || href.includes('line/')) data.socials.line = link.href;

        // Booking engines
        const bookingKeywords = ['booking.com', 'agoda.com', 'cloudbeds.com', 'simplebooking', 'tripadvisor.com', 'secure-booking', 'synxis.com', 'engine.hotellos'];
        const isBookingUrl = bookingKeywords.some(kw => href.includes(kw)) || 
                             href.includes('/book') || href.includes('/reserve') || href.includes('reservation') ||
                             text.includes('book now') || text.includes('reserve now') || text.includes('book online');
        if (isBookingUrl && !href.includes('facebook.com') && !href.includes('instagram.com')) {
          data.bookingUrls.add(link.href);
        }
      }

      // 4. Extract Images
      const imgUrls = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img'))
          .map(img => {
            const src = img.src || img.getAttribute('data-src') || '';
            // Get size characteristics if possible
            const w = img.naturalWidth || img.width || 0;
            const h = img.naturalHeight || img.height || 0;
            return { src, w, h };
          })
          .filter(img => img.src && img.src.startsWith('http'));
      });

      imgUrls.forEach(img => {
        const srcLower = img.src.toLowerCase();
        // Exclude small icon/spacer/svg/control images
        if (
          srcLower.includes('logo') || 
          srcLower.includes('icon') || 
          srcLower.includes('avatar') || 
          srcLower.includes('loader') || 
          srcLower.includes('spacer') ||
          srcLower.includes('close') ||
          srcLower.includes('revisit') ||
          srcLower.includes('cancel') ||
          srcLower.includes('btn') ||
          srcLower.includes('button') ||
          srcLower.includes('play') ||
          srcLower.includes('map') ||
          srcLower.includes('pin') ||
          srcLower.includes('marker') ||
          srcLower.includes('star') ||
          srcLower.includes('rating') ||
          srcLower.includes('.svg') ||
          (img.w > 0 && img.w < 150) ||
          (img.h > 0 && img.h < 150)
        ) {
          return;
        }
        data.images.add(img.src);
      });

      // 5. Extract FAQs (Heuristics)
      const faqsExtracted = await page.evaluate(() => {
        const results: { question: string; answer: string }[] = [];
        // Look for headings ending in "?"
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, strong'));
        for (const heading of headings) {
          const text = (heading as HTMLElement).innerText?.trim() || '';
          if (text.endsWith('?') && text.length > 10 && text.length < 150) {
            // Find next sibling paragraph/div for answer
            let next = heading.nextElementSibling;
            // Traverse up to 3 siblings
            for (let i = 0; i < 3 && next; i++) {
              const nextText = (next as HTMLElement).innerText?.trim() || '';
              if (nextText.length > 20 && nextText.length < 1000) {
                results.push({ question: text, answer: nextText });
                break;
              }
              next = next.nextElementSibling;
            }
          }
        }
        return results;
      });
      faqsExtracted.forEach(faq => {
        if (!data.faqs.some(f => f.question === faq.question)) {
          data.faqs.push(faq);
        }
      });

      // 6. Extract Amenities (Keyword Search)
      const amenitiesKeywords = [
        { kw: 'wi-fi', name: 'Free Wi-Fi' },
        { kw: 'wifi', name: 'Free Wi-Fi' },
        { kw: 'pool', name: 'Swimming Pool' },
        { kw: 'gym', name: 'Fitness Gym' },
        { kw: 'fitness', name: 'Fitness Gym' },
        { kw: 'air conditioning', name: 'Air Conditioning' },
        { kw: 'ac ', name: 'Air Conditioning' },
        { kw: 'spa', name: 'Luxury Spa' },
        { kw: 'massage', name: 'Luxury Spa' },
        { kw: 'bar', name: 'Bar & Lounge' },
        { kw: 'restaurant', name: 'On-site Restaurant' },
        { kw: 'dining', name: 'On-site Restaurant' },
        { kw: 'parking', name: 'Free Parking' },
        { kw: 'beachfront', name: 'Beachfront Access' },
        { kw: 'beach front', name: 'Beachfront Access' },
        { kw: 'pet friendly', name: 'Pet Friendly' },
        { kw: 'pets allowed', name: 'Pet Friendly' },
        { kw: 'room service', name: 'Room Service' },
        { kw: 'breakfast', name: 'Breakfast Included' }
      ];
      const bodyTextLower = textContent.toLowerCase();
      amenitiesKeywords.forEach(item => {
        if (bodyTextLower.includes(item.kw)) {
          data.amenities.add(item.name);
        }
      });

      // 7. Services/Keywords (Heuristics)
      const parsedHeadings = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('h2, h3'))
          .map(h => (h as HTMLElement).innerText.trim())
          .filter(t => t.length > 5 && t.length < 50 && !t.includes('?') && !t.toLowerCase().includes('about') && !t.toLowerCase().includes('contact'));
      });
      parsedHeadings.forEach(h => data.services.add(h));

      // 8. Discover new internal links on homepage to crawl
      if (url === homepageUrl) {
        const rawLinks = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('a')).map(a => a.href);
        });
        const internalLinks = getInternalLinks(rawLinks, origin);
        
        // Prioritize interesting sections
        const priorityPatterns = [/about/i, /contact/i, /room/i, /accommodation/i, /gallery/i, /facility/i, /service/i, /dining/i, /spa/i, /menu/i];
        
        const prioritized = internalLinks.sort((a, b) => {
          const aPriority = priorityPatterns.some(pat => pat.test(a));
          const bPriority = priorityPatterns.some(pat => pat.test(b));
          if (aPriority && !bPriority) return -1;
          if (!aPriority && bPriority) return 1;
          return 0;
        });

        prioritized.forEach(link => {
          if (link !== homepageUrl) {
            queue.push(link);
          }
        });
      }
    } catch (e: any) {
      log(`Error crawling page ${url}: ${e.message}`, 'WARNING');
    } finally {
      await page.close();
    }
  }

  await context.close();
  return data;
}

function getCloudflareToken(): string | null {
  try {
    const defaultPath = path.join(
      process.env.HOME || '/Users/dimasymonenko',
      'Library',
      'Preferences',
      '.wrangler',
      'config',
      'default.toml'
    );
    if (fs.existsSync(defaultPath)) {
      const content = fs.readFileSync(defaultPath, 'utf-8');
      const match = content.match(/oauth_token\s*=\s*"([^"]+)"/);
      if (match) return match[1];
    }
  } catch (e) {}
  return null;
}

async function runCloudflareAI(textContext: string): Promise<any> {
  const token = getCloudflareToken();
  if (!token) {
    log('No Cloudflare OAuth token found in preferences. Skipping AI extraction.', 'WARNING');
    return null;
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
6. "keywords": An array of core SEO keywords/tags (strings) describing the business's services and niche (e.g. ["diving", "diving lessons", "padi certifcate"]).
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
`;

  log('Calling Cloudflare Workers AI (llama-3.1-70b-instruct) for structured data extraction...');
  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-70b-instruct`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a strict data extraction AI. You only output valid, parsable JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 3000
      })
    });

    if (!res.ok) {
      log(`Cloudflare AI request failed: ${res.statusText}`, 'WARNING');
      return null;
    }

    const json = await res.json() as any;
    if (!json.success) {
      log(`Cloudflare AI returned error: ${JSON.stringify(json.errors)}`, 'WARNING');
      return null;
    }

    let resultText = json.result.response || json.result;
    if (typeof resultText !== 'string') {
      resultText = JSON.stringify(resultText);
    }

    resultText = resultText.trim();
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      resultText = jsonMatch[0];
    }

    return JSON.parse(resultText);
  } catch (e: any) {
    log(`Failed to run Cloudflare AI: ${e.message}`, 'WARNING');
    return null;
  }
}

// SQL escape helpers for D1
function escapeSqlString(val: string | null | undefined): string {
  if (val === null || val === undefined) return 'NULL';
  return `'${val.replace(/'/g, "''")}'`;
}

function escapeSqlNumber(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return 'NULL';
  return `${val}`;
}

async function updateProductionD1(slug: string, data: any) {
  let sql = `UPDATE "Listing" SET
  "website" = ${escapeSqlString(data.website)},
  "phone" = ${escapeSqlString(data.phone)},
  "address" = ${escapeSqlString(data.address)},
  "lat" = ${escapeSqlNumber(data.lat)},
  "lng" = ${escapeSqlNumber(data.lng)},
  "averageRating" = ${escapeSqlNumber(data.averageRating)},
  "reviewCount" = ${escapeSqlNumber(data.reviewCount)},
  "hours" = ${escapeSqlString(data.hours)},
  "mapLink" = ${escapeSqlString(data.mapLink)},
  "googlePlaceId" = ${escapeSqlString(data.googlePlaceId)},
  "galleryImages" = ${escapeSqlString(data.galleryImages)},
  "image" = ${escapeSqlString(data.image)},
  "priceLevel" = ${escapeSqlString(data.priceLevel)},
  "socialLinks" = ${escapeSqlString(data.socialLinks)},
  "bookingUrl" = ${escapeSqlString(data.bookingUrl)},
  "faqs" = ${escapeSqlString(data.faqs)},
  "amenities" = ${escapeSqlString(data.amenities)},
  "services" = ${escapeSqlString(data.services)},
  "externalReviews" = ${escapeSqlString(data.externalReviews)},
  "description" = ${escapeSqlString(data.description)},
  "updatedAt" = '${new Date().toISOString()}'
WHERE "slug" = ${escapeSqlString(slug)};`;

  // Sync products: Delete remote products first, then insert new ones
  sql += `\nDELETE FROM "Product" WHERE "listingId" = (SELECT "id" FROM "Listing" WHERE "slug" = ${escapeSqlString(slug)});`;

  if (data.products && Array.isArray(data.products)) {
    for (const prod of data.products) {
      if (prod.name) {
        const prodId = 'prod_' + Math.random().toString(36).substr(2, 9);
        sql += `\nINSERT INTO "Product" ("id", "name", "description", "price", "image", "listingId") VALUES (
          ${escapeSqlString(prodId)},
          ${escapeSqlString(prod.name)},
          ${escapeSqlString(prod.description)},
          ${escapeSqlNumber(prod.price)},
          ${escapeSqlString(prod.image)},
          (SELECT "id" FROM "Listing" WHERE "slug" = ${escapeSqlString(slug)})
        );`;
      }
    }
  }

  const tempFile = path.join(process.cwd(), 'scripts', 'temp_update.sql');
  fs.writeFileSync(tempFile, sql, 'utf-8');
  
  log(`Pushing updates to remote production D1 database for listing: "${slug}"...`);
  try {
    const cmd = `npx wrangler d1 execute samui-services-db --remote --file="${tempFile}"`;
    execSync(cmd, { stdio: 'pipe' });
    log(`Successfully pushed updates to production D1 for "${slug}"!`, 'SUCCESS');
  } catch (e: any) {
    log(`Failed to push to remote D1 for "${slug}": ${e.message}`, 'ERROR');
  } finally {
    try { fs.unlinkSync(tempFile); } catch (e) {}
  }
}

// Core pipeline for a single business
async function processBusiness(listing: any, browser: any) {
  log(`========================================`);
  log(`PROCESSING BUSINESS: ${listing.name} (Slug: ${listing.slug})`);
  log(`========================================`);

  let googleDetails: any = null;
  let googlePlaceId = listing.googlePlaceId;

  // 1. Google Places Details
  const googleData = await fetchGooglePlaceData(listing.name);
  if (googleData) {
    googlePlaceId = googleData.placeId;
    googleDetails = googleData.details;
  }

  // 2. Determine target website URL
  let targetWebsite = listing.website;
  if (googleDetails?.website) {
    targetWebsite = googleDetails.website;
  }

  // Clean website URL
  if (targetWebsite && targetWebsite !== 'Error' && !targetWebsite.startsWith('http')) {
    targetWebsite = 'https://' + targetWebsite;
  }

  // 3. Web crawl if website is available
  let webCrawlData: any = null;
  if (targetWebsite && targetWebsite.startsWith('http')) {
    webCrawlData = await crawlCustomerWebsite(targetWebsite, browser);
  } else {
    log(`No website available for "${listing.name}". Skipping website crawl.`, 'WARNING');
  }

  // 4. Download and upload images
  const uploadedImageUrls: string[] = [];
  
  // Download/upload Google Maps Photos (up to 3)
  if (googleDetails?.photos && googleDetails.photos.length > 0) {
    log(`Processing up to 3 Google Maps Photos for "${listing.name}"...`);
    const photosToDownload = googleDetails.photos.slice(0, 3);
    for (let idx = 0; idx < photosToDownload.length; idx++) {
      const photo = photosToDownload[idx];
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photo_reference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`;
      const tempPath = path.join(TEMP_DIR, `${listing.slug}_google_${idx + 1}.jpg`);
      
      log(`Downloading Google Photo ${idx + 1}...`);
      const success = await downloadImage(photoUrl, tempPath);
      if (success) {
        const r2Url = uploadImageToR2(tempPath, `${listing.slug}-google-${idx + 1}.jpg`);
        if (r2Url) uploadedImageUrls.push(r2Url);
        // Delete temp file
        try { fs.unlinkSync(tempPath); } catch (e) {}
      }
    }
  }

  // Download/upload website images (up to 3)
  if (webCrawlData?.images && webCrawlData.images.size > 0) {
    log(`Processing up to 3 website images for "${listing.name}"...`);
    const websiteImages = Array.from(webCrawlData.images).slice(0, 3) as string[];
    for (let idx = 0; idx < websiteImages.length; idx++) {
      const imgUrl = websiteImages[idx];
      const ext = path.extname(imgUrl.split('?')[0]).toLowerCase() || '.jpg';
      const tempPath = path.join(TEMP_DIR, `${listing.slug}_site_${idx + 1}${ext}`);
      
      log(`Downloading Website Image ${idx + 1}: ${imgUrl}...`);
      const success = await downloadImage(imgUrl, tempPath);
      if (success) {
        const r2Url = uploadImageToR2(tempPath, `${listing.slug}-site-${idx + 1}${ext}`);
        if (r2Url) uploadedImageUrls.push(r2Url);
        // Delete temp file
        try { fs.unlinkSync(tempPath); } catch (e) {}
      }
    }
  }

  // Compile final gallery images
  let finalGallery = uploadedImageUrls;
  if (listing.galleryImages) {
    try {
      const existingGallery = JSON.parse(listing.galleryImages);
      if (Array.isArray(existingGallery)) {
        // Keep existing R2 images too, but filter out icons, buttons, and SVGs
        const cleanExisting = existingGallery.filter(url => {
          const urlLower = url.toLowerCase();
          return !(
            urlLower.includes('.svg') ||
            urlLower.includes('logo') ||
            urlLower.includes('icon') ||
            urlLower.includes('cancel') ||
            urlLower.includes('close') ||
            urlLower.includes('revisit') ||
            urlLower.includes('btn') ||
            urlLower.includes('button') ||
            urlLower.includes('play') ||
            urlLower.includes('marker') ||
            urlLower.includes('pin')
          );
        });
        finalGallery = Array.from(new Set([...finalGallery, ...cleanExisting]));
      }
    } catch (e) {}
  }

  // 5. Gather and merge all details
  const finalPhone = googleDetails?.formatted_phone_number || 
                     (webCrawlData?.phones?.size > 0 ? Array.from(webCrawlData.phones)[0] : listing.phone);
  const finalAddress = googleDetails?.formatted_address || listing.address;
  const finalLat = googleDetails?.geometry?.location?.lat || listing.lat;
  const finalLng = googleDetails?.geometry?.location?.lng || listing.lng;
  const finalRating = googleDetails?.rating || listing.averageRating;
  const finalReviewCount = googleDetails?.user_ratings_total || listing.reviewCount;
  
  // Format hours
  let finalHours = listing.hours;
  if (googleDetails?.opening_hours?.weekday_text) {
    finalHours = JSON.stringify(googleDetails.opening_hours.weekday_text);
  }

  const finalMapLink = googleDetails?.url || listing.mapLink;
  
  // Format price level
  let finalPrice = listing.priceLevel;
  if (googleDetails?.price_level !== undefined) {
    finalPrice = '$'.repeat(googleDetails.price_level + 1); // 0 = $, 1 = $$, etc.
  }

  // 5. Cloudflare Workers AI Extraction / Local AI delegation
  const isLocalAi = process.argv.includes('--local-ai') || process.argv.includes('--local');
  if (isLocalAi) {
    const localCrawlPayload = {
      slug: listing.slug,
      name: listing.name,
      originalListing: {
        description: listing.description,
        services: listing.services,
        amenities: listing.amenities,
        priceLevel: listing.priceLevel,
        socialLinks: listing.socialLinks,
        bookingUrl: listing.bookingUrl,
        faqs: listing.faqs,
        specialOffers: listing.specialOffers,
        menu: listing.menu,
        videoUrls: listing.videoUrls,
        trustBadges: listing.trustBadges
      },
      googleDetails: {
        phone: finalPhone || null,
        address: finalAddress || null,
        lat: finalLat ? parseFloat(finalLat) : null,
        lng: finalLng ? parseFloat(finalLng) : null,
        rating: finalRating ? parseFloat(finalRating) : 0,
        reviewCount: finalReviewCount ? parseInt(finalReviewCount) : 0,
        hours: finalHours,
        mapLink: finalMapLink || null,
        priceLevel: finalPrice || null,
        googlePlaceId: googlePlaceId || null,
        reviews: googleDetails?.reviews || []
      },
      uploadedImages: finalGallery,
      crawledText: webCrawlData ? webCrawlData.texts.join('\n\n---\n\n') : ""
    };

    const outputPath = path.join(process.cwd(), 'crawl_data.json');
    fs.writeFileSync(outputPath, JSON.stringify(localCrawlPayload, null, 2), 'utf-8');
    log(`[SUCCESS] Raw crawl data successfully written to ${outputPath}. Ready for Antigravity AI structuring!`, 'SUCCESS');
    return; // Exit processBusiness without updating DBs yet
  }

  let aiResult: any = null;
  if (webCrawlData && webCrawlData.texts && webCrawlData.texts.length > 0) {
    const textContext = webCrawlData.texts.join('\n\n---\n\n').substring(0, 15000);
    aiResult = await runCloudflareAI(textContext);
  }

  // Description
  let finalDescription = listing.description;
  if (aiResult?.description) {
    finalDescription = aiResult.description;
  } else if (googleDetails?.editorial_summary?.overview) {
    finalDescription = `Google Maps Summary: ${googleDetails.editorial_summary.overview}\n\n${listing.description}`;
  }

  // Socials
  let finalSocials = listing.socialLinks;
  if (aiResult?.socialLinks && Object.keys(aiResult.socialLinks).length > 0) {
    finalSocials = JSON.stringify(aiResult.socialLinks);
  } else if (webCrawlData && Object.keys(webCrawlData.socials).length > 0) {
    finalSocials = JSON.stringify(webCrawlData.socials);
  }

  // Booking URL
  let finalBookingUrl = listing.bookingUrl;
  if (aiResult?.bookingUrl) {
    finalBookingUrl = aiResult.bookingUrl;
  } else if (webCrawlData && webCrawlData.bookingUrls && webCrawlData.bookingUrls.size > 0) {
    finalBookingUrl = Array.from(webCrawlData.bookingUrls)[0];
  }

  // FAQs
  let finalFaqs = listing.faqs;
  if (aiResult?.faqs && Array.isArray(aiResult.faqs) && aiResult.faqs.length > 0) {
    finalFaqs = JSON.stringify(aiResult.faqs);
  } else if (webCrawlData?.faqs && webCrawlData.faqs.length > 0) {
    finalFaqs = JSON.stringify(webCrawlData.faqs);
  }

  // Amenities
  let finalAmenities = listing.amenities;
  if (aiResult?.amenities && Array.isArray(aiResult.amenities) && aiResult.amenities.length > 0) {
    finalAmenities = JSON.stringify(aiResult.amenities);
  } else if (webCrawlData?.amenities && webCrawlData.amenities.size > 0) {
    finalAmenities = JSON.stringify(Array.from(webCrawlData.amenities));
  }

  // Services / Niche Keywords (Service & Product tags)
  let finalServices = listing.services;
  if (aiResult?.keywords && Array.isArray(aiResult.keywords) && aiResult.keywords.length > 0) {
    finalServices = JSON.stringify(aiResult.keywords);
  } else if (webCrawlData?.services && webCrawlData.services.size > 0) {
    finalServices = JSON.stringify(Array.from(webCrawlData.services).slice(0, 10));
  }

  // Special Offers
  let finalSpecialOffers = listing.specialOffers;
  if (aiResult?.specialOffers && Array.isArray(aiResult.specialOffers) && aiResult.specialOffers.length > 0) {
    finalSpecialOffers = JSON.stringify(aiResult.specialOffers);
  }

  // Menu / Pricing
  let finalMenu = listing.menu;
  if (aiResult?.menu && Array.isArray(aiResult.menu) && aiResult.menu.length > 0) {
    finalMenu = JSON.stringify(aiResult.menu);
  }

  // Video URLs
  let finalVideoUrls = listing.videoUrls;
  if (aiResult?.videoUrls && Array.isArray(aiResult.videoUrls) && aiResult.videoUrls.length > 0) {
    finalVideoUrls = JSON.stringify(aiResult.videoUrls);
  }

  // Trust Badges
  let finalTrustBadges = listing.trustBadges;
  if (aiResult?.trustBadges && Array.isArray(aiResult.trustBadges) && aiResult.trustBadges.length > 0) {
    finalTrustBadges = JSON.stringify(aiResult.trustBadges);
  }

  // External reviews structure
  let finalExternalReviews = listing.externalReviews;
  if (googleDetails) {
    const googleReviews = googleDetails.reviews?.map((r: any) => ({
      author: r.author_name,
      avatar: r.profile_photo_url || null,
      rating: r.rating,
      text: r.text,
      time: r.relative_time_description || (r.time ? new Date(r.time * 1000).toLocaleDateString() : 'Google Review'),
      source: 'Google'
    })) || [];

    finalExternalReviews = JSON.stringify({
      rating: googleDetails.rating || 0,
      reviewCount: googleDetails.user_ratings_total || 0,
      reviews: googleReviews
    });
  }

  // Update image (main cover image)
  const finalMainImage = uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : listing.image;

  // 6. Prepare update details
  const updateData = {
    website: targetWebsite || null,
    phone: finalPhone || null,
    address: finalAddress || null,
    lat: finalLat ? parseFloat(finalLat) : null,
    lng: finalLng ? parseFloat(finalLng) : null,
    averageRating: finalRating ? parseFloat(finalRating) : 0,
    reviewCount: finalReviewCount ? parseInt(finalReviewCount) : 0,
    hours: finalHours,
    mapLink: finalMapLink || null,
    googlePlaceId,
    galleryImages: finalGallery.length > 0 ? JSON.stringify(finalGallery) : null,
    image: finalMainImage,
    priceLevel: finalPrice,
    socialLinks: finalSocials,
    bookingUrl: finalBookingUrl || null,
    faqs: finalFaqs,
    amenities: finalAmenities,
    services: finalServices,
    externalReviews: finalExternalReviews,
    description: finalDescription,
    specialOffers: finalSpecialOffers,
    menu: finalMenu,
    videoUrls: finalVideoUrls,
    trustBadges: finalTrustBadges,
    products: aiResult?.products || null
  };

  log(`Saving changes to local database for listing: "${listing.name}"...`);
  await prisma.listing.update({
    where: { id: listing.id },
    data: {
      website: updateData.website,
      phone: updateData.phone,
      address: updateData.address,
      lat: updateData.lat,
      lng: updateData.lng,
      averageRating: updateData.averageRating,
      reviewCount: updateData.reviewCount,
      hours: updateData.hours,
      mapLink: updateData.mapLink,
      googlePlaceId: updateData.googlePlaceId,
      galleryImages: updateData.galleryImages,
      image: updateData.image,
      priceLevel: updateData.priceLevel,
      socialLinks: updateData.socialLinks,
      bookingUrl: updateData.bookingUrl,
      faqs: updateData.faqs,
      amenities: updateData.amenities,
      services: updateData.services,
      externalReviews: updateData.externalReviews,
      description: updateData.description,
      specialOffers: updateData.specialOffers,
      menu: updateData.menu,
      videoUrls: updateData.videoUrls,
      trustBadges: updateData.trustBadges,
      updatedAt: new Date()
    }
  });

  // Sync products locally
  if (aiResult?.products && Array.isArray(aiResult.products)) {
    log(`Syncing ${aiResult.products.length} products to local database...`);
    await prisma.product.deleteMany({ where: { listingId: listing.id } });
    for (const prod of aiResult.products) {
      if (prod.name) {
        await prisma.product.create({
          data: {
            name: prod.name,
            description: prod.description || null,
            price: prod.price ? parseFloat(prod.price) : null,
            image: prod.image || null,
            listingId: listing.id
          }
        });
      }
    }
  }

  log(`Successfully updated "${listing.name}" in local SQLite database!`, 'SUCCESS');

  const isProd = process.argv.includes('--production') || process.argv.includes('--prod');
  if (isProd) {
    await updateProductionD1(listing.slug, updateData);
  }
}

// Main execution block
async function run() {
  const args = process.argv.slice(2);
  const targetSlugIndex = args.indexOf('--slug');
  const targetSlug = targetSlugIndex !== -1 ? args[targetSlugIndex + 1] : null;

  log(`Starting crawl-hotels script.`);
  log(`Database URL: ${dbUrl}`);

  // Retrieve Categories representing Hotels
  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { slug: 'hotels' },
        { slug: 'accommodation-827' }
      ]
    }
  });

  const categoryIds = categories.map(c => c.id);
  log(`Target category IDs: ${categoryIds.join(', ')} (${categories.map(c => c.slug).join(', ')})`);

  let listings: any[] = [];
  if (targetSlug) {
    log(`Filtering specifically for listing slug: "${targetSlug}"`);
    listings = await prisma.listing.findMany({
      where: { slug: targetSlug }
    });
  } else {
    log(`Querying listings in target categories...`);
    listings = await prisma.listing.findMany({
      where: {
        categoryId: { in: categoryIds }
      }
    });
  }

  log(`Found ${listings.length} listings to process.`);
  if (listings.length === 0) {
    log(`No listings found matching criteria. Exiting.`);
    process.exit(0);
  }

  // Open Playwright Browser
  log(`Launching headless Playwright Chrome...`);
  const browser = await chromium.launch({ headless: true });

  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i];
    log(`[${i + 1}/${listings.length}] Starting process for ${listing.name}`);
    try {
      await processBusiness(listing, browser);
    } catch (e: any) {
      log(`Fatal error processing listing ${listing.name}: ${e.message}`, 'ERROR');
    }
    // Rate limit delay between places/crawling
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  log(`Closing Playwright Browser...`);
  await browser.close();

  // Cleanup temp folder
  try {
    log(`Cleaning up temporary download directory...`);
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  } catch (e) {}

  log(`Enrichment complete!`, 'SUCCESS');
}

run()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
