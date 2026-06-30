import { JSDOM } from 'jsdom';

async function run() {
  const url = 'https://www.samuibusinessdirectory.com/directory/category/Accommodation/Bungalows';
  console.log(`Fetching ${url}...`);
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  });
  const html = await response.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const links = Array.from(document.querySelectorAll('a'));
  const allHrefs = new Set();
  
  for (const link of links) {
    const href = link.href;
    if (href) {
      allHrefs.add(href);
    }
  }
  
  console.log(`Found ${allHrefs.size} total links`);
  console.log([...allHrefs].filter(href => !href.includes('about:blank')).slice(0, 50));
}

run().catch(console.error);
