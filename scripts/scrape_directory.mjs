import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.samuibusinessdirectory.com';
const OUTPUT_DIR = '/Users/dimasymonenko/AdMeSamui/SamuiBusinesCatalog/Koh Samui';
const TOWNS = [
  'Ban Tai', 'Bang Kao', 'Bang Makham', 'Bang Por', 'Bang Rak', 'Big Buddha', 'Bophut', 
  'Chaweng', 'Chaweng Noi', 'Choeng Mon', "Fisherman's Village", 'Hua Thanon', 'Koh Taen', 
  'Laem Set', 'Lamai', 'Lipa Noi', 'Maenam', 'Namueang', 'Nathon', 'Phangka', 'Plai Laem', 
  'Taling Ngam', 'Thong Krut'
];

const CATEGORIES = [
  'accommodation', 'activities', 'beauty+%26+wellness', 'food+%26+beverage', 'for+kids', 
  'health+%26+medical', 'legal+%26+financial+services', 'local+services', 'nightlife', 
  'property+%26+real+estate', 'retail+%26+convenience', 'sports+%26+fitness', 'transport', 'travel+agencies'
];

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function sanitizeFilename(name) {
  return name.replace(/[/\\?%*:|"<>]/g, '-').trim();
}

async function run() {
  ensureDir(OUTPUT_DIR);

  for (const cat of CATEGORIES) {
    const url = `${BASE_URL}/directory/category/${cat}`;
    console.log(`\nFetching ${url}...`);
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;
      
      let currentDistrict = 'Unknown';
      const h3s = Array.from(document.querySelectorAll('h3'));
      
      if (h3s.length === 0) {
        console.log(`  No businesses found for ${cat}`);
        continue;
      }
      
      let count = 0;
      for (const h3 of h3s) {
        const text = h3.textContent.trim();
        if (TOWNS.includes(text)) {
          currentDistrict = text;
        } else {
          // It's a business
          if (text) {
            count++;
            const dir = path.join(OUTPUT_DIR, sanitizeFilename(currentDistrict));
            ensureDir(dir);
            
            const filePath = path.join(dir, `${sanitizeFilename(text)}.md`);
            
            // Try to find details: the next sibling or parent text
            let details = '';
            let nextEl = h3.nextElementSibling;
            while(nextEl && nextEl.tagName !== 'H3') {
                details += nextEl.textContent.trim() + '\n';
                nextEl = nextEl.nextElementSibling;
            }
            
            const content = `
# ${text}

**Category:** ${decodeURIComponent(cat.replace(/\+/g, ' '))}
**District:** ${currentDistrict}
**Source:** ${url}

## Details
${details || 'No additional details available.'}
            `.trim();
            
            fs.writeFileSync(filePath, content);
          }
        }
      }
      console.log(`  Saved ${count} businesses in category ${cat}.`);
    } catch (e) {
      console.error(`  Error processing category ${cat}:`, e.message);
    }
  }
  console.log('\nScraping complete!');
}

run().catch(console.error);
