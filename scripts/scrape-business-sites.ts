import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// Read the original seed-data.ts
const seedDataPath = path.resolve(__dirname, '../src/app/actions/seed-data.ts');
let seedDataContent = fs.readFileSync(seedDataPath, 'utf-8');

// A quick hack to extract the array, since we don't want to deal with TS compilation inside this script context
const match = seedDataContent.match(/export const seedBusinesses = (\[[\s\S]*\]);/);
if (!match) {
  console.error("Could not parse seedBusinesses from seed-data.ts");
  process.exit(1);
}

let businesses = eval(match[1]);

async function run() {
  console.log(`Starting scrape for ${businesses.length} businesses...`);
  const browser = await chromium.launch({ headless: true });
  
  // Scrape in batches of 5
  const batchSize = 5;
  for (let i = 0; i < businesses.length; i += batchSize) {
    const batch = businesses.slice(i, i + batchSize);
    
    await Promise.all(batch.map(async (business: any) => {
      if (!business.website || business.website === 'Error' || business.website.includes('404 Error') || business.website.includes('Access Denied')) {
        console.log(`Skipping ${business.name} (No valid website)`);
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

        business.extracted = {
          emails: emails.slice(0, 2),
          socials,
          products: services
        };
        
        console.log(`✅ Success for ${business.name}: Found ${services.length} services`);
      } catch (error: any) {
        console.log(`❌ Failed for ${business.name}: ${error.message.split('\\n')[0]}`);
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
