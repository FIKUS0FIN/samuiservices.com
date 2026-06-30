import { JSDOM } from 'jsdom';

async function run() {
  const query = encodeURIComponent('Raya Spa By Sereeya Koh Samui');
  const url = `https://www.google.com/search?q=${query}&hl=en`;
  console.log(`Fetching ${url}...`);
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
  const html = await response.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const title = document.querySelector('title')?.textContent;
  console.log(`Title: ${title}`);
  
  // Try to find knowledge panel info like address, hours
  const kpElements = document.querySelectorAll('.BNeawe.tAd8D.AP7Wnd'); 
  // Google classes change often, let's just grab some text containing "Address" or "Hours"
  const allText = document.body.textContent;
  const addressMatch = allText.match(/Address: (.*?)(?:\n|Phone|Hours|$)/);
  const hoursMatch = allText.match(/Hours: (.*?)(?:\n|Phone|Address|$)/);
  
  console.log('Address match:', addressMatch ? addressMatch[1] : 'Not found in simple regex');
  console.log('Hours match:', hoursMatch ? hoursMatch[1] : 'Not found in simple regex');
  
  // Try finding standard links
  const links = Array.from(document.querySelectorAll('a')).map(a => a.href).filter(h => h.startsWith('http') && !h.includes('google.'));
  console.log('External Links found:', links.slice(0, 5));
}

run().catch(console.error);
