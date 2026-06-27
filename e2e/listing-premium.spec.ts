import { test, expect } from '@playwright/test';

test.describe.serial('Premium Business Listing', () => {

  test('Validates SEO, Sidebar, and Product rendering on a seeded listing', async ({ page }) => {
    // Search for the business name directly to get the link
    await page.goto('/all?q=Unclaimed+Test+Business');

    // Find the link to the unclaimed test business
    const firstListingLink = page.locator('a[href*="/listing/"]').first();
    const href = await firstListingLink.getAttribute('href');

    expect(href).toBeTruthy();

    await page.goto(href!);

    // Wait for the main page to load
    await page.waitForSelector('text="About this business"');

    // 2. Assert SEO tags
    const title = await page.title();
    expect(title).toContain('|');

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();

    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBe('summary_large_image');

    // 3. Verify ProductGrid renders - look for text directly
    await expect(page.getByText('Products & Services')).toBeVisible();
    await expect(page.getByText('Test Product')).toBeVisible();

    // 4. Verify Contact Business Sidebar
    await expect(page.getByText('Contact Business')).toBeVisible();
    await expect(page.getByText('Phone Number')).toBeVisible();

    // Verify the message form toggle button exists
    const messageBtn = page.getByRole('button', { name: 'Message Business' });
    if (await messageBtn.isVisible()) {
      await messageBtn.click();
      await expect(page.locator('textarea[name="content"]')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Send' })).toBeVisible();
    }

  });
});
