# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flows.spec.ts >> Platform Flows >> User can claim an unclaimed business
- Location: e2e/flows.spec.ts:65:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Request Submitted!')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Request Submitted!')

```

```yaml
- navigation:
  - link "Samui Services":
    - /url: /
  - link "Koh Samui":
    - /url: /samui
  - link "Koh Phangan":
    - /url: /phangan
  - link "Koh Tao":
    - /url: /tao
  - link "Dashboard":
    - /url: /dashboard
    - button "Dashboard"
  - button "Logout"
  - link "Add Business":
    - /url: /add-listing
    - button "Add Business"
- main:
  - img "Unclaimed Test Business"
  - text: Restaurants
  - heading "Unclaimed Test Business" [level=1]
  - text: ★ 0 (0 verified reviews) 📍 , Koh Samui
  - heading "Are you the owner of this business?" [level=3]
  - paragraph: Claim this listing to update photos, respond to reviews, and manage your details.
  - button "Claim Business"
  - text: You have already submitted a claim request for this business.
  - heading "About Us" [level=2]
  - paragraph: This business is imported and unclaimed.
  - heading "Products & Services" [level=2]
  - heading "Test Product" [level=3]
  - paragraph: Test Desc
  - text: $100.00
  - button
  - heading "Reviews" [level=2]
  - heading "Leave a Review" [level=3]
  - text: Rating
  - group "Select rating":
    - button "Rate 1 star" [pressed]: ★
    - button "Rate 2 stars" [pressed]: ★
    - button "Rate 3 stars" [pressed]: ★
    - button "Rate 4 stars" [pressed]: ★
    - button "Rate 5 stars" [pressed]: ★
  - text: Comment
  - textbox "Comment":
    - /placeholder: Share your experience...
  - button "Submit Review"
  - text: No reviews yet. Be the first to review this business!
  - heading "Contact Business" [level=3]
  - text: 📞 Phone Number 📍 Location
  - button "Message Business"
- contentinfo:
  - paragraph: © 2026 Samui Services. All rights reserved.
- alert
```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | async function loginAs(page: Page, email: string) {
  4   |   // Go to a dummy page or the sign-in page to trigger the credentials login
  5   |   await page.goto('/api/auth/signin?callbackUrl=/dashboard');
  6   |   // NextAuth automatically generates a form for the Credentials provider
  7   |   await page.fill('input[name="email"]', email);
  8   |   const passwordInput = page.locator('input[name="password"]');
  9   |   if (await passwordInput.count() > 0) {
  10  |     await passwordInput.fill(process.env.ADMIN_TEST_PASSWORD || 'secret');
  11  |   }
  12  |   await page.click('button[type="submit"]');
  13  |   await page.waitForURL('**/dashboard', { timeout: 10000 });
  14  | }
  15  | 
  16  | test.describe.serial('Platform Flows', () => {
  17  | 
  18  |   test('User can log in and see empty dashboard', async ({ page }) => {
  19  |     await loginAs(page, 'test@example.com');
  20  |     await expect(page.getByRole('heading', { name: 'My Dashboard' })).toBeVisible();
  21  |     await expect(page.getByText('You don\'t have any listings yet.')).toBeVisible();
  22  |   });
  23  | 
  24  |   test('User can add a new business listing', async ({ page }) => {
  25  |     await loginAs(page, 'owner@example.com');
  26  |     
  27  |     // Navigate to Add Listing
  28  |     await page.click('text=Add Business');
  29  |     await expect(page).toHaveURL(/.*add-listing/);
  30  | 
  31  |     // Fill out the form
  32  |     await page.fill('input[name="name"]', 'My Awesome Cafe');
  33  |     await page.fill('input[name="slug"]', 'my-awesome-cafe-' + Date.now());
  34  |     await page.selectOption('select[name="categoryId"]', { index: 1 }); // Just pick the first category
  35  |     await page.selectOption('select[name="islandId"]', { index: 1 }); // Pick an island
  36  |     await page.fill('input[name="phone"]', '+66 123 456 789');
  37  |     await page.fill('textarea[name="description"]', 'The best coffee on the island.');
  38  | 
  39  |     // Submit
  40  |     await page.click('button[type="submit"]');
  41  | 
  42  |     // Should redirect to dashboard and show the new listing
  43  |     await page.waitForURL('/dashboard');
  44  |     await expect(page.getByText('My Awesome Cafe').first()).toBeVisible();
  45  |   });
  46  | 
  47  |   test('User can edit their business listing', async ({ page }) => {
  48  |     await loginAs(page, 'owner@example.com');
  49  |     
  50  |     // Click Edit on the dashboard
  51  |     // The previous test creates the business. If tests run in parallel or independently, 
  52  |     // it's safer to have the setup script seed the DB. For now, assuming state is kept or we click the first edit button.
  53  |     const editButton = page.locator('text=Edit').first();
  54  |     await expect(editButton).toBeVisible();
  55  |     await editButton.click();
  56  | 
  57  |     await expect(page).toHaveURL(/.*\/dashboard\/edit\/.*/);
  58  |     await page.fill('input[name="name"]', 'My Awesome Cafe (Updated)');
  59  |     await page.click('button[type="submit"]');
  60  | 
  61  |     await page.waitForURL('/dashboard');
  62  |     await expect(page.getByText('My Awesome Cafe (Updated)').first()).toBeVisible();
  63  |   });
  64  | 
  65  |   test('User can claim an unclaimed business', async ({ page }) => {
  66  |     // For this to work reliably, we need an unclaimed business in the DB.
  67  |     // The global setup will seed one, or we can just assume one exists from our seed.
  68  |     // Since we don't have a robust seeder yet, let's navigate to the first listing on the homepage.
  69  |     await loginAs(page, 'claimer@example.com');
  70  |     await page.goto('/');
  71  | 
  72  |     const firstListing = page.locator('a:has(.card)').first();
  73  |     if (await firstListing.count() > 0) {
  74  |       const href = await firstListing.getAttribute('href');
  75  |       if (href) await page.goto(href);
  76  |       
  77  |       // If it's unclaimed, there should be a claim button.
  78  |       // If our DB has no unclaimed listings, this test will fail. 
  79  |       // A proper seeder is necessary, but this outlines the flow.
  80  |       const claimButton = page.getByRole('button', { name: 'Claim Business' });
  81  |       if (await claimButton.count() > 0) {
  82  |         await claimButton.click();
> 83  |         await expect(page.getByText('Request Submitted!')).toBeVisible();
      |                                                            ^ Error: expect(locator).toBeVisible() failed
  84  |       }
  85  |     }
  86  |   });
  87  | 
  88  |   test('User can send a message to a business', async ({ page }) => {
  89  |     await loginAs(page, 'test@example.com');
  90  |     await page.goto('/');
  91  |     
  92  |     // Go to first listing
  93  |     const firstListing = page.locator('.listing-card-container a').first();
  94  |     if (await firstListing.count() > 0) {
  95  |       const href = await firstListing.getAttribute('href');
  96  |       if (href) await page.goto(href);
  97  |       
  98  |       // Wait for the listing page to load
  99  |       await page.waitForSelector('text=Message Business');
  100 |       await page.click('text=Message Business');
  101 |       
  102 |       // Fill the message
  103 |       await page.fill('textarea[placeholder="Type your message here..."]', 'Hello, I have a question about your services.');
  104 |       await page.click('button:has-text("Send")');
  105 |       
  106 |       // Expect success
  107 |       await expect(page.getByText('Message sent successfully!')).toBeVisible();
  108 |     }
  109 |   });
  110 | 
  111 |   test('User can add a listing to favorites', async ({ page }) => {
  112 |     await loginAs(page, 'user@example.com');
  113 |     await page.goto('/');
  114 |     
  115 |     const firstListing = page.locator('a:has(.card)').first();
  116 |     if (await firstListing.count() > 0) {
  117 |       const href = await firstListing.getAttribute('href');
  118 |       if (href) await page.goto(href);
  119 |       
  120 |       // Find and click the favorite button
  121 |       const favButton = page.locator('button:has-text("Favorite"), button:has-text("Unfavorite")').first();
  122 |       if (await favButton.count() > 0) {
  123 |         await favButton.click();
  124 |         // Since it's a toggle, we just ensure it doesn't crash, but ideally we'd check the toast notification if it existed.
  125 |       }
  126 |     }
  127 |   });
  128 | 
  129 |   test('User can leave a review on a listing', async ({ page }) => {
  130 |     await loginAs(page, 'user@example.com');
  131 |     await page.goto('/');
  132 |     
  133 |     const firstListing = page.locator('a:has(.card)').first();
  134 |     if (await firstListing.count() > 0) {
  135 |       const href = await firstListing.getAttribute('href');
  136 |       if (href) await page.goto(href);
  137 |       
  138 |       // Check if review section is present
  139 |       const reviewTextarea = page.locator('textarea[placeholder="Write your review..."]');
  140 |       if (await reviewTextarea.count() > 0) {
  141 |         // Select 5 stars
  142 |         await page.selectOption('select', '5');
  143 |         // Write review
  144 |         await reviewTextarea.fill('Amazing service! Highly recommended.');
  145 |         // Submit
  146 |         await page.click('button:has-text("Submit Review")');
  147 |         
  148 |         // Wait for the new review to appear
  149 |         await expect(page.getByText('Amazing service! Highly recommended.')).toBeVisible();
  150 |       }
  151 |     }
  152 |   });
  153 | 
  154 | });
  155 | 
```