import { JSDOM } from 'jsdom';

async function run() {
  const url = 'https://www.samuisocial.com/directory/listing/695/';
  console.log(`Fetching ${url}...`);
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await response.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const h1 = document.querySelector('h1')?.textContent.trim();
  console.log(`Title: ${h1}`);
  
  // Find all text blocks that might contain details
  const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.textContent.trim()).filter(t => t.length > 0);
  console.log(`Paragraphs:`, paragraphs.slice(0, 5));
  
  const imgs = Array.from(document.querySelectorAll('img')).map(img => img.src);
  console.log(`Images:`, imgs.filter(src => src.includes('business')).slice(0, 5));
  
  // Any specific lists or links like phone, email?
  const links = Array.from(document.querySelectorAll('a')).map(a => ({ text: a.textContent.trim(), href: a.href })).filter(a => a.href.includes('mailto:') || a.href.includes('tel:'));
  console.log(`Contact Links:`, links);
}

run().catch(console.error);
