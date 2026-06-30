import { JSDOM } from 'jsdom';
import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';
import https from 'https';

const BASE_URL = 'https://www.samuisocial.com';
const CATEGORY_URL = `${BASE_URL}/directory/category/Property+Services`;
const OUTPUT_DIR = path.join(process.cwd(), 'SamuiBusinesCatalog', 'Koh Samui');

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
      file.on('error', (err) => {
        fs.unlink(filepath, () => reject(err));
      });
    }).on('error', reject);
  });
}

async function fetchPage(url) {
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const html = await response.text();
  return new JSDOM(html).window.document;
}

function cleanText(str) {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
}

async function scrapeListing(listingUrl, category) {
  console.log(`  Scraping ${listingUrl}...`);
  const doc = await fetchPage(listingUrl);
  
  // Extract Breadcrumbs to get name and district if possible
  const pTags = Array.from(doc.querySelectorAll('p')).map(p => cleanText(p.textContent));
  let breadcrumb = pTags.find(p => p.includes('Samui Social > Directory >'));
  
  let name = 'Unknown Business';
  let district = 'Unknown';
  
  if (breadcrumb) {
    const parts = breadcrumb.split('>');
    if (parts.length >= 4) {
      name = parts[parts.length - 1].trim();
    }
    // District might be the text of the next p tag, or somewhere else.
    // The previous test showed breadcrumb then District then Report Error then Name then Description.
    const breadcrumbIndex = pTags.indexOf(breadcrumb);
    if (breadcrumbIndex >= 0 && pTags.length > breadcrumbIndex + 1) {
       let potentialDistrict = pTags[breadcrumbIndex + 1];
       if (potentialDistrict && potentialDistrict !== 'Report Error' && potentialDistrict.length < 30) {
           district = potentialDistrict;
       }
    }
  }

  // Fallback for Name if breadcrumb parsing failed
  if (name === 'Unknown Business') {
    const h1 = doc.querySelector('h1');
    if (h1 && cleanText(h1.textContent)) name = cleanText(h1.textContent);
    else {
        // Find the strongest header or bold text if possible. Let's just rely on the breadcrumb text we found earlier.
        const strong = doc.querySelector('strong');
        if (strong) name = cleanText(strong.textContent);
    }
  }

  // Description
  // Usually the longest paragraph
  const descriptions = pTags.filter(p => p.length > 100);
  const description = descriptions.length > 0 ? descriptions[0] : '';
  
  // Contact Links
  const linkElements = Array.from(doc.querySelectorAll('a'));
  const phoneLinks = linkElements.filter(a => a.href.includes('tel:')).map(a => a.href.replace('tel:', ''));
  const emailLinks = linkElements.filter(a => a.href.includes('mailto:')).map(a => a.href.replace('mailto:', ''));
  
  const phone = phoneLinks.length > 0 ? phoneLinks[0] : '';
  const email = emailLinks.length > 0 ? emailLinks[0] : '';
  
  // Images
  const imgElements = Array.from(doc.querySelectorAll('img')).map(img => img.src);
  let profileImg = imgElements.find(src => src.includes('profile.jpg'));
  let headerImg = imgElements.find(src => src.includes('header.jpg'));
  
  if (profileImg && profileImg.startsWith('/')) profileImg = BASE_URL + profileImg;
  if (headerImg && headerImg.startsWith('/')) headerImg = BASE_URL + headerImg;

  // Ensure district folder exists
  const districtPath = path.join(OUTPUT_DIR, district.replace(/[/\\?%*:|"<>]/g, '-'));
  const imagesPath = path.join(districtPath, 'images');
  
  await fsPromises.mkdir(districtPath, { recursive: true });
  await fsPromises.mkdir(imagesPath, { recursive: true });
  
  const safeName = name.replace(/[/\\?%*:|"<>]/g, '-');
  
  let localProfilePath = '';
  let localHeaderPath = '';
  
  if (profileImg) {
    const filename = `${safeName}_profile.jpg`;
    const filepath = path.join(imagesPath, filename);
    try {
      await downloadImage(profileImg, filepath);
      localProfilePath = `images/${filename}`;
    } catch (e) {
      console.error(`  Failed to download profile img for ${name}: ${e.message}`);
    }
  }
  
  if (headerImg) {
    const filename = `${safeName}_header.jpg`;
    const filepath = path.join(imagesPath, filename);
    try {
       // Remove query params if any
       const cleanUrl = headerImg.split('?')[0];
       await downloadImage(cleanUrl, filepath);
       localHeaderPath = `images/${filename}`;
    } catch (e) {
      console.error(`  Failed to download header img for ${name}: ${e.message}`);
    }
  }
  
  // Construct Markdown
  let md = `# ${name}\n\n`;
  
  if (localHeaderPath) {
    md += `![Header](${localHeaderPath})\n\n`;
  }
  if (localProfilePath) {
    md += `![Profile](${localProfilePath})\n\n`;
  }
  
  md += `**Category:** ${category}\n`;
  md += `**District:** ${district}\n`;
  if (phone) md += `**Phone:** ${phone}\n`;
  if (email) md += `**Email:** ${email}\n`;
  md += `**Source:** ${listingUrl}\n\n`;
  
  md += `## Description\n${description || 'No description available.'}\n`;
  
  const mdPath = path.join(districtPath, `${safeName}.md`);
  await fsPromises.writeFile(mdPath, md);
  console.log(`  Saved ${mdPath}`);
}

async function run() {
  console.log(`Fetching category page: ${CATEGORY_URL}`);
  const doc = await fetchPage(CATEGORY_URL);
  
  const categoryName = 'Property Services';
  
  // Find all distinct listing links
  const allLinks = Array.from(doc.querySelectorAll('a')).map(a => a.href);
  const listingLinks = Array.from(new Set(allLinks.filter(href => href.includes('/directory/listing/'))));
  
  console.log(`Found ${listingLinks.length} listings in category ${categoryName}`);
  
  for (const link of listingLinks) {
    const fullUrl = link.startsWith('http') ? link : BASE_URL + link;
    try {
      await scrapeListing(fullUrl, categoryName);
    } catch (e) {
      console.error(`Failed to scrape ${fullUrl}:`, e);
    }
  }
  
  console.log('Scraping complete!');
}

run().catch(console.error);
