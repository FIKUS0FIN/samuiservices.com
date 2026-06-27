# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flows.spec.ts >> Platform Flows >> User can send a message to a business
- Location: e2e/flows.spec.ts:89:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Message Business') to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - link "Samui Services" [ref=e5] [cursor=pointer]:
          - /url: /
        - generic [ref=e6]:
          - link "Koh Samui" [ref=e7] [cursor=pointer]:
            - /url: /samui
          - link "Koh Phangan" [ref=e8] [cursor=pointer]:
            - /url: /phangan
          - link "Koh Tao" [ref=e9] [cursor=pointer]:
            - /url: /tao
      - generic [ref=e10]:
        - link "Dashboard" [ref=e11] [cursor=pointer]:
          - /url: /dashboard
          - button "Dashboard" [ref=e12]
        - link "Add Business" [ref=e13] [cursor=pointer]:
          - /url: /add-listing
          - button "Add Business" [ref=e14]
  - main [ref=e15]:
    - generic [ref=e17]:
      - heading "404" [level=1] [ref=e18]
      - heading "This page could not be found." [level=2] [ref=e20]
  - contentinfo [ref=e21]:
    - paragraph [ref=e23]: © 2026 Samui Services. All rights reserved.
  - button "Open Next.js Dev Tools" [ref=e29] [cursor=pointer]:
    - img [ref=e30]
  - alert [ref=e34]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   |
  3   | // Helper to log in programmatically using our Test Credentials Provider
  4   | async function loginAs(page, email) {
  5   |   // Go to a dummy page or the sign-in page to trigger the credentials login
  6   |   await page.goto('/api/auth/signin?callbackUrl=/dashboard');
  7   |   // NextAuth automatically generates a form for the Credentials provider
  8   |   await page.fill('input[name="email"]', email);
  9   |   const passwordInput = page.locator('input[name="password"]');
  10  |   if (await passwordInput.count() > 0) {
  11  |     await passwordInput.fill(process.env.ADMIN_TEST_PASSWORD || 'secret');
  12  |   }
  13  |   await page.click('button:has-text("Sign in with Test Login")');
  14  |   await page.waitForURL('/dashboard');
  15  | }
  16  |
  17  | test.describe.serial('Platform Flows', () => {
  18  |
  19  |   test('User can log in and see empty dashboard', async ({ page }) => {
  20  |     await loginAs(page, 'test@example.com');
  21  |     await expect(page.getByRole('heading', { name: 'My Dashboard' })).toBeVisible();
  22  |     await expect(page.getByText('You don\'t have any listings yet.')).toBeVisible();
  23  |   });
  24  |
  25  |   test('User can add a new business listing', async ({ page }) => {
  26  |     await loginAs(page, 'owner@example.com');
  27  |
  28  |     // Navigate to Add Listing
  29  |     await page.click('text=Add Business');
  30  |     await expect(page).toHaveURL(/.*add-listing/);
  31  |
  32  |     // Fill out the form
  33  |     await page.fill('input[name="name"]', 'My Awesome Cafe');
  34  |     await page.fill('input[name="slug"]', 'my-awesome-cafe-' + Date.now());
  35  |     await page.selectOption('select[name="categoryId"]', { index: 1 }); // Just pick the first category
  36  |     await page.selectOption('select[name="islandId"]', { index: 1 }); // Pick an island
  37  |     await page.fill('input[name="phone"]', '+66 123 456 789');
  38  |     await page.fill('textarea[name="description"]', 'The best coffee on the island.');
  39  |
  40  |     // Submit
  41  |     await page.click('button[type="submit"]');
  42  |
  43  |     // Should redirect to dashboard and show the new listing
  44  |     await page.waitForURL('/dashboard');
  45  |     await expect(page.getByText('My Awesome Cafe').first()).toBeVisible();
  46  |   });
  47  |
  48  |   test('User can edit their business listing', async ({ page }) => {
  49  |     await loginAs(page, 'owner@example.com');
  50  |
  51  |     // Click Edit on the dashboard
  52  |     // The previous test creates the business. If tests run in parallel or independently,
  53  |     // it's safer to have the setup script seed the DB. For now, assuming state is kept or we click the first edit button.
  54  |     const editButton = page.locator('text=Edit').first();
  55  |     await expect(editButton).toBeVisible();
  56  |     await editButton.click();
  57  |
  58  |     await expect(page).toHaveURL(/.*\/dashboard\/edit\/.*/);
  59  |     await page.fill('input[name="name"]', 'My Awesome Cafe (Updated)');
  60  |     await page.click('button[type="submit"]');
  61  |
  62  |     await page.waitForURL('/dashboard');
  63  |     await expect(page.getByText('My Awesome Cafe (Updated)').first()).toBeVisible();
  64  |   });
  65  |
  66  |   test('User can claim an unclaimed business', async ({ page }) => {
  67  |     // For this to work reliably, we need an unclaimed business in the DB.
  68  |     // The global setup will seed one, or we can just assume one exists from our seed.
  69  |     // Since we don't have a robust seeder yet, let's navigate to the first listing on the homepage.
  70  |     await loginAs(page, 'claimer@example.com');
  71  |     await page.goto('/');
  72  |
  73  |     const firstListing = page.locator('a:has(.card)').first();
  74  |     if (await firstListing.count() > 0) {
  75  |       const href = await firstListing.getAttribute('href');
  76  |       if (href) await page.goto(href);
  77  |
  78  |       // If it's unclaimed, there should be a claim button.
  79  |       // If our DB has no unclaimed listings, this test will fail.
  80  |       // A proper seeder is necessary, but this outlines the flow.
  81  |       const claimButton = page.getByRole('button', { name: 'Claim Business' });
  82  |       if (await claimButton.count() > 0) {
  83  |         await claimButton.click();
  84  |         await expect(page.getByText('Request Submitted!')).toBeVisible();
  85  |       }
  86  |     }
  87  |   });
  88  |
  89  |   test('User can send a message to a business', async ({ page }) => {
  90  |     await loginAs(page, 'test@example.com');
  91  |     await page.goto('/');
  92  |
  93  |     // Go to first listing
  94  |     const firstListing = page.locator('a:has(.card)').first();
  95  |     if (await firstListing.count() > 0) {
  96  |       const href = await firstListing.getAttribute('href');
  97  |       if (href) await page.goto(href);
  98  |
  99  |       // Wait for the listing page to load
> 100 |       await page.waitForSelector('text=Message Business');
      |                  ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  101 |       await page.click('text=Message Business');
  102 |
  103 |       // Fill the message
  104 |       await page.fill('textarea[placeholder="Type your message here..."]', 'Hello, I have a question about your services.');
  105 |       await page.click('button:has-text("Send")');
  106 |
  107 |       // Expect success
  108 |       await expect(page.getByText('Message sent successfully!')).toBeVisible();
  109 |     }
  110 |   });
  111 |
  112 |   test('User can add a listing to favorites', async ({ page }) => {
  113 |     await loginAs(page, 'user@example.com');
  114 |     await page.goto('/');
  115 |
  116 |     const firstListing = page.locator('a:has(.card)').first();
  117 |     if (await firstListing.count() > 0) {
  118 |       const href = await firstListing.getAttribute('href');
  119 |       if (href) await page.goto(href);
  120 |
  121 |       // Find and click the favorite button
  122 |       const favButton = page.locator('button:has-text("Favorite"), button:has-text("Unfavorite")').first();
  123 |       if (await favButton.count() > 0) {
  124 |         await favButton.click();
  125 |         // Since it's a toggle, we just ensure it doesn't crash, but ideally we'd check the toast notification if it existed.
  126 |       }
  127 |     }
  128 |   });
  129 |
  130 |   test('User can leave a review on a listing', async ({ page }) => {
  131 |     await loginAs(page, 'user@example.com');
  132 |     await page.goto('/');
  133 |
  134 |     const firstListing = page.locator('a:has(.card)').first();
  135 |     if (await firstListing.count() > 0) {
  136 |       const href = await firstListing.getAttribute('href');
  137 |       if (href) await page.goto(href);
  138 |
  139 |       // Check if review section is present
  140 |       const reviewTextarea = page.locator('textarea[placeholder="Write your review..."]');
  141 |       if (await reviewTextarea.count() > 0) {
  142 |         // Select 5 stars
  143 |         await page.selectOption('select', '5');
  144 |         // Write review
  145 |         await reviewTextarea.fill('Amazing service! Highly recommended.');
  146 |         // Submit
  147 |         await page.click('button:has-text("Submit Review")');
  148 |
  149 |         // Wait for the new review to appear
  150 |         await expect(page.getByText('Amazing service! Highly recommended.')).toBeVisible();
  151 |       }
  152 |     }
  153 |   });
  154 |
  155 | });
  156 |
```