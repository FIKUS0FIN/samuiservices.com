import { chromium } from 'playwright';

async function run() {
  console.log('Starting Playwright...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const query = encodeURIComponent('Raya Spa By Sereeya Koh Samui');
  const url = `https://www.google.com/maps/search/${query}`;
  console.log(`Navigating to ${url}`);
  
  await page.goto(url, { waitUntil: 'networkidle' });
  
  // Wait a moment for dynamic content
  await page.waitForTimeout(3000);
  
  const title = await page.title();
  console.log(`Page title: ${title}`);
  
  // Try to find the rating or address
  const textContent = await page.evaluate(() => {
    return document.body.innerText;
  });
  
  if (textContent.includes('Raya Spa By Sereeya')) {
     console.log('Found the business name on the page!');
  } else {
     console.log('Did not find the business name. Possibly a CAPTCHA or consent page.');
  }
  
  // Try to get specific elements if it loaded correctly
  const hasConsent = textContent.includes('Before you continue to Google');
  if (hasConsent) console.log('Hit Google Consent page.');
  
  await browser.close();
}

run().catch(console.error);
