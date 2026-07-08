import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// Read the original seed-data.ts
const seedDataPath = path.resolve(__dirname, '../src/app/actions/seed-data.ts');
const seedDataContent = fs.readFileSync(seedDataPath, 'utf-8');

// A quick hack to extract the array, since we don't want to deal with TS compilation inside this script context
const match = seedDataContent.match(/export const seedBusinesses = (\[[\s\S]*\]);/);
if (!match) {
  console.error("Could not parse seedBusinesses from seed-data.ts");
  process.exit(1);
}

const businesses = eval(match[1]);

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyC1ETrImW9Q_lOxGsHwPqoDCoWfmqJM8SU';

async function fetchGooglePlaceData(businessName: string) {
  try {
    const query = encodeURIComponent(`${businessName} Koh Samui`);
    const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`;
    const findRes = await fetch(findUrl);
    const findData = await findRes.json() as any;
    
    if (findData.status === 'OK' && findData.candidates?.length > 0) {
      const placeId = findData.candidates[0].place_id;
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,geometry,types&key=${GOOGLE_API_KEY}`;
      const detailsRes = await fetch(detailsUrl);
      const detailsData = await detailsRes.json() as any;
      
      if (detailsData.status === 'OK' && detailsData.result) {
        const result = detailsData.result;
        return {
          rating: result.rating || 0,
          reviewsCount: result.user_ratings_total || 0,
          lat: result.geometry?.location?.lat || null,
          lng: result.geometry?.location?.lng || null,
          types: result.types || []
        };
      }
    }
  } catch (e) {
    console.error(`Error fetching Google Places stats for ${businessName}:`, e);
  }
  return null;
}

function getBestCategoryFromGoogleTypes(types: string[]): string | null {
  if (!types || !Array.isArray(types)) return null;
  if (types.includes('cafe')) return 'cafe';
  if (types.includes('restaurant')) return 'restaurant';
  if (types.includes('bar') || types.includes('night_club')) return 'bar';
  if (types.includes('spa') || types.includes('beauty_salon') || types.includes('hair_care')) return 'spa';
  if (types.includes('lodging')) return 'hotel';
  if (types.includes('car_rental')) return 'rental';
  if (types.includes('travel_agency') || types.includes('tourist_attraction')) return 'tour';
  if (types.includes('general_contractor') || types.includes('painter') || types.includes('plumber') || types.includes('electrician') || types.includes('roofing_contractor')) return 'construction';
  return null;
}

async function run() {
  console.log(`Starting scrape for ${businesses.length} businesses...`);
  const browser = await chromium.launch({ headless: true });
  
  // Scrape in batches of 5
  const batchSize = 5;
  for (let i = 0; i < businesses.length; i += batchSize) {
    const batch = businesses.slice(i, i + batchSize);
    
    await Promise.all(batch.map(async (business: any) => {
      // Initialize with category-based fallback keywords
      const categoryFallbackMap: Record<string, string[]> = {
        hotel: ['Resort', 'Accommodation', 'Hotel', 'Rooms', 'Stay'],
        resort: ['Resort', 'Accommodation', 'Suites', 'Beachfront', 'Villas'],
        villa: ['Villas', 'Luxury Villa', 'Private Pool', 'Holiday Rental'],
        restaurant: ['Dining', 'Restaurant', 'Cuisine', 'Food', 'Menu'],
        cafe: ['Cafe', 'Coffee', 'Desserts', 'Breakfast', 'Beverages'],
        spa: ['Spa', 'Massage', 'Wellness', 'Relaxation', 'Therapy'],
        bar: ['Bar', 'Cocktails', 'Nightlife', 'Drinks', 'Music'],
        club: ['Beach Club', 'Entertainment', 'Events', 'Cocktails'],
        construction: ['Construction', 'Repair', 'Building', 'Contractor', 'Renovation'],
        rental: ['Car Rental', 'Scooter Rental', 'Motorbike', 'Vehicles', 'Transport'],
        tour: ['Tours', 'Excursions', 'Sightseeing', 'Guided Tour', 'Adventures']
      };

      // Fetch Google Place reviews count, rating, coordinates, and types
      const googleData = await fetchGooglePlaceData(business.name);
      if (googleData) {
        business.averageRating = googleData.rating;
        business.reviewCount = googleData.reviewsCount;
        if (googleData.lat && googleData.lng) {
          business.lat = googleData.lat;
          business.lng = googleData.lng;
        }

        // Fix category inconsistency if detected
        if (googleData.types && googleData.types.length > 0) {
          const detectedCategory = getBestCategoryFromGoogleTypes(googleData.types);
          if (detectedCategory) {
            const currentLower = business.category?.toLowerCase();
            const isGastronomy = ['restaurant', 'cafe', 'bar', 'club'].includes(currentLower) && 
                                 ['restaurant', 'cafe', 'bar'].includes(detectedCategory);
            const isLodging = ['hotel', 'resort', 'villa'].includes(currentLower) && 
                              detectedCategory === 'hotel';
            
            if (currentLower !== detectedCategory && !isGastronomy && !isLodging) {
              console.log(`Fixing category inconsistency for ${business.name}: ${business.category} -> ${detectedCategory}`);
              business.category = detectedCategory;
            }
          }
        }
      }

      business.services = categoryFallbackMap[business.category?.toLowerCase()] || ['Local Service', 'Koh Samui', 'Thailand'];

      if (!business.website || business.website === 'Error' || business.website.includes('404 Error') || business.website.includes('Access Denied')) {
        console.log(`Skipping ${business.name} website crawl (No valid website, Google Place data updated: ${googleData ? 'Yes' : 'No'})`);
        return;
      }
      
      let url = business.website;
      if (!url.startsWith('http')) url = 'https://' + url;

      console.log(`Scraping ${business.name} at ${url}...`);
      
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      });
      const page = await context.newPage();
      
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        
        // Extract basic emails
        const emails = await page.evaluate(() => {
          const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
          const matches = document.body.innerText.match(emailRegex) || [];
          return [...new Set(matches)]; // Unique
        });
        
        // Extract basic social links
        const socials = await page.evaluate(() => {
          const links = Array.from(document.querySelectorAll('a'));
          const fb = links.find(a => a.href.includes('facebook.com'))?.href;
          const ig = links.find(a => a.href.includes('instagram.com'))?.href;
          return { facebook: fb, instagram: ig };
        });

        // Simple heuristic for products/services
        const services = await page.evaluate(() => {
          const headings = Array.from(document.querySelectorAll('h2, h3'));
          const possibleServices = headings
            .map(h => (h as HTMLElement).innerText.trim())
            .filter(t => t.length > 5 && t.length < 50 && !t.toLowerCase().includes('about') && !t.toLowerCase().includes('contact'))
            .slice(0, 4);
          
          return possibleServices.map(s => ({
            name: s,
            description: 'Experience our premium ' + s.toLowerCase()
          }));
        });

        // Extract and clean core keywords
        const keywords = await page.evaluate(() => {
          const metaKeywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content');
          if (metaKeywords) {
            return metaKeywords
              .split(',')
              .map(k => k.trim())
              .filter(k => k.length > 2 && k.length < 25)
              .slice(0, 6);
          }

          const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
            .map(h => (h as HTMLElement).innerText.trim())
            .filter(t => t.length > 3 && t.length < 30);

          const title = document.title || '';
          const candidates = [
            ...title.split(/[|\-–•]/).map(t => t.trim()),
            ...headings
          ].filter(t => t.length > 3 && t.length < 25 && !t.toLowerCase().includes('home') && !t.toLowerCase().includes('contact') && !t.toLowerCase().includes('about'));

          return [...new Set(candidates)].slice(0, 5);
        });

        const formattedKeywords = keywords
          .map((k: string) => 
            k.split(' ')
             .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
             .join(' ')
          )
          .filter((k: string) => k);

        // Extract phone number from tel links or text content
        const extractedPhone = await page.evaluate(() => {
          const telLink = document.querySelector('a[href^="tel:"]');
          if (telLink) {
            const href = telLink.getAttribute('href') || '';
            return href.replace('tel:', '').trim();
          }
          const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
          const match = document.body.innerText.match(phoneRegex);
          return match ? match[0].trim() : null;
        });

        // Extract description from meta tags or OpenGraph
        const extractedDescription = await page.evaluate(() => {
          return document.querySelector('meta[name="description"]')?.getAttribute('content') ||
                 document.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                 document.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ||
                 null;
        });

        // Extract image from og:image or high-res elements
        const extractedImage = await page.evaluate(() => {
          return document.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                 document.querySelector('meta[name="twitter:image"]')?.getAttribute('content') ||
                 null;
        });

        // Update website with final URL after redirects
        const finalUrl = page.url();
        if (finalUrl && finalUrl.startsWith('http')) {
          business.website = finalUrl;
        }

        // Fill in / override phone
        if (extractedPhone) {
          business.phone = extractedPhone;
        }

        // Fill in / override description
        if (extractedDescription && extractedDescription.length > 20) {
          business.description = extractedDescription;
        }

        // Fill in / override image
        if (extractedImage && extractedImage.startsWith('http')) {
          business.image = extractedImage;
        }

        if (formattedKeywords.length > 0) {
          business.services = formattedKeywords;
        }

        business.extracted = {
          emails: emails.slice(0, 2),
          socials,
          products: services
        };
        
        console.log(`✅ Success for ${business.name}: Found ${services.length} services`);
      } catch (error: any) {
        console.log(`❌ Failed for ${business.name}: ${error.message?.split('\\n')[0]}`);
      } finally {
        await context.close();
      }
    }));
  }

  await browser.close();

  // Write enriched data back
  const newContent = `export const seedBusinesses = ${JSON.stringify(businesses, null, 2)};\n`;
  fs.writeFileSync(path.resolve(__dirname, '../src/app/actions/seed-data.ts'), newContent);
  console.log("Finished scraping! Wrote enriched data to seed-data.ts.");
}

run().catch(console.error);
