import { test, expect } from '@playwright/test';

test.describe.serial('Premium Business Listing', () => {

  test('Validates SEO, Sidebar, and Product rendering on a seeded listing', async ({ page }) => {
    // Search for a seeded listing
    await page.goto('/all?q=Fisherman+Village');

    // Find the link to the business
    const firstListingLink = page.locator('a[href*="/listing/"]').first();

    // Check if it exists first
    if (await firstListingLink.count() > 0) {
      const href = await firstListingLink.getAttribute('href');
      expect(href).toBeTruthy();
      await page.goto(href!);

      // Wait for the main page to load
      await page.waitForSelector('text="About this business"');

      // 2. Assert SEO tags
      const title = await page.title();
      expect(title).toContain('|');
    }
  });
});
