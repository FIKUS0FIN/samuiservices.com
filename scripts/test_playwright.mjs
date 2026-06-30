import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('Navigating to directory category accommodation...');
  await page.goto('https://www.samuibusinessdirectory.com/directory/category/accommodation', { waitUntil: 'networkidle' });
  
  // Try to find any link that looks like a business (long url not containing category)
  const links = await page.$$eval('a', els => els.map(el => el.href).filter(href => href.includes('/directory/') && !href.includes('/category/') && href.length > 50));
  
  console.log(`Found ${links.length} business links`);
  if (links.length > 0) {
    console.log(links.slice(0, 5));
  } else {
    // maybe we need to click a subcategory first? Let's check for subcategories.
    const subcats = await page.$$eval('a', els => els.map(el => el.href).filter(href => href.includes('/category/Accommodation/')));
    console.log(`Found ${subcats.length} subcategories`);
    console.log(subcats);
  }
  
  await browser.close();
}

run().catch(console.error);
