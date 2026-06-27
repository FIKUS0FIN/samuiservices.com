# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: listing-premium.spec.ts >> Premium Business Listing >> Validates SEO, Sidebar, and Product rendering on a seeded listing
- Location: e2e/listing-premium.spec.ts:5:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text="About this business"') to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - link "Samui Services" [ref=e5]:
          - /url: /
        - generic [ref=e6]:
          - link "Koh Samui" [ref=e7]:
            - /url: /samui
          - link "Koh Phangan" [ref=e8]:
            - /url: /phangan
          - link "Koh Tao" [ref=e9]:
            - /url: /tao
      - generic [ref=e10]:
        - link "Login" [ref=e11]:
          - /url: /dashboard
          - button "Login" [ref=e12] [cursor=pointer]
        - link "Add Business" [ref=e13]:
          - /url: /add-listing
          - button "Add Business" [ref=e14] [cursor=pointer]
  - main [ref=e15]:
    - generic [ref=e17]:
      - heading "404" [level=1] [ref=e18]
      - heading "This page could not be found." [level=2] [ref=e20]
  - contentinfo [ref=e21]:
    - paragraph [ref=e23]: © 2026 Samui Services. All rights reserved.
  - button "Open Next.js Dev Tools" [ref=e29] [cursor=pointer]:
    - img [ref=e30]
  - alert [ref=e35]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe.serial('Premium Business Listing', () => {
  4  |
  5  |   test('Validates SEO, Sidebar, and Product rendering on a seeded listing', async ({ page }) => {
  6  |     // Search for the business name directly to get the link
  7  |     await page.goto('/all?q=Unclaimed+Test+Business');
  8  |
  9  |     // Find the link to the unclaimed test business
  10 |     const firstListingLink = page.locator('a[href*="/listing/"]').first();
  11 |     const href = await firstListingLink.getAttribute('href');
  12 |
  13 |     expect(href).toBeTruthy();
  14 |
  15 |     await page.goto(href!);
  16 |
  17 |     // Wait for the main page to load
> 18 |     await page.waitForSelector('text="About this business"');
     |                ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  19 |
  20 |     // 2. Assert SEO tags
  21 |     const title = await page.title();
  22 |     expect(title).toContain('|');
  23 |
  24 |     const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
  25 |     expect(ogTitle).toBeTruthy();
  26 |
  27 |     const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
  28 |     expect(twitterCard).toBe('summary_large_image');
  29 |
  30 |     // 3. Verify ProductGrid renders - look for text directly
  31 |     await expect(page.getByText('Products & Services')).toBeVisible();
  32 |     await expect(page.getByText('Test Product')).toBeVisible();
  33 |
  34 |     // 4. Verify Contact Business Sidebar
  35 |     await expect(page.getByText('Contact Business')).toBeVisible();
  36 |     await expect(page.getByText('Phone Number')).toBeVisible();
  37 |
  38 |     // Verify the message form toggle button exists
  39 |     const messageBtn = page.getByRole('button', { name: 'Message Business' });
  40 |     if (await messageBtn.isVisible()) {
  41 |       await messageBtn.click();
  42 |       await expect(page.locator('textarea[name="content"]')).toBeVisible();
  43 |       await expect(page.getByRole('button', { name: 'Send' })).toBeVisible();
  44 |     }
  45 |
  46 |   });
  47 | });
  48 |
```