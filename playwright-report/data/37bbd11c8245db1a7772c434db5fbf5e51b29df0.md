# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flows.spec.ts >> Platform Flows >> User can leave a review on a listing
- Location: e2e/flows.spec.ts:129:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://127.0.0.1:3001/", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - link "Samui Services" [ref=e4] [cursor=pointer]:
        - /url: /
      - generic [ref=e5]:
        - link "Dashboard" [ref=e6] [cursor=pointer]:
          - /url: /dashboard
          - button "Dashboard" [ref=e7]
        - link "Add Business" [ref=e8] [cursor=pointer]:
          - /url: /add-listing
          - button "Add Business" [ref=e9]
  - main [ref=e10]:
    - generic [ref=e11]:
      - generic [ref=e14]:
        - heading "Discover Local Services in Samui" [level=1] [ref=e15]
        - paragraph [ref=e16]: Find trusted professionals for everything you need on the island.
        - generic [ref=e18]:
          - generic [ref=e19]:
            - textbox "Search for services (e.g., Plumbers, Deliveries, Construction)..." [ref=e20]
            - generic [ref=e21] [cursor=pointer]: ⌕
          - generic [ref=e23]:
            - generic [ref=e24]: 📍
            - combobox [ref=e25] [cursor=pointer]:
              - option "Samui" [selected]
              - option "Phangan"
              - option "Tao"
          - button "Find Services" [ref=e26] [cursor=pointer]
      - generic [ref=e28]:
        - complementary [ref=e29]:
          - generic [ref=e30]:
            - generic [ref=e31]:
              - heading "Categories" [level=3] [ref=e32]
              - generic [ref=e33]:
                - generic [ref=e34] [cursor=pointer]:
                  - checkbox "Restaurants" [ref=e35]
                  - text: Restaurants
                - generic [ref=e36] [cursor=pointer]:
                  - checkbox "Hotels" [ref=e37]
                  - text: Hotels
            - generic [ref=e38]:
              - heading "Location" [level=3] [ref=e39]
              - generic [ref=e40]:
                - generic [ref=e41] [cursor=pointer]:
                  - checkbox "Chaweng" [ref=e42]
                  - text: Chaweng
                - generic [ref=e43] [cursor=pointer]:
                  - checkbox "Lamai" [ref=e44]
                  - text: Lamai
                - generic [ref=e45] [cursor=pointer]:
                  - checkbox "Bophut" [ref=e46]
                  - text: Bophut
                - generic [ref=e47] [cursor=pointer]:
                  - checkbox "Maenam" [ref=e48]
                  - text: Maenam
                - generic [ref=e49] [cursor=pointer]:
                  - checkbox "Nathon" [ref=e50]
                  - text: Nathon
            - generic [ref=e51]:
              - heading "Rating" [level=3] [ref=e52]
              - generic [ref=e53]:
                - generic [ref=e54] [cursor=pointer]:
                  - checkbox "★★★★★ & Up (120)" [checked] [ref=e55]
                  - generic [ref=e56]: ★★★★★
                  - text: "& Up"
                  - generic [ref=e57]: (120)
                - generic [ref=e58] [cursor=pointer]:
                  - checkbox "★★★★ ★ (98)" [ref=e59]
                  - generic [ref=e60]: ★★★★
                  - generic [ref=e61]: ★
                  - generic [ref=e62]: (98)
                - generic [ref=e63] [cursor=pointer]:
                  - checkbox "★★★ ★★ (45)" [ref=e64]
                  - generic [ref=e65]: ★★★
                  - generic [ref=e66]: ★★
                  - generic [ref=e67]: (45)
            - heading "Price" [level=3] [ref=e69]
        - main [ref=e74]:
          - heading "FEATURED SERVICES IN SAMUI" [level=2] [ref=e76]
          - generic [ref=e77]:
            - generic [ref=e78]:
              - button "Add to favorites" [ref=e79] [cursor=pointer]:
                - img [ref=e80]
              - link "Hotels My Awesome Cafe (Updated) 0.0 ★ Provider Name 📍 Samui - 0 reviews from 800 THB/hr VIEW PROFILE" [ref=e82] [cursor=pointer]:
                - /url: /listing/cmquqitrf0006urj6uolh6axz
                - generic [ref=e83]:
                  - generic [ref=e86]: Hotels
                  - generic [ref=e87]:
                    - generic [ref=e88]:
                      - heading "My Awesome Cafe (Updated)" [level=3] [ref=e89]
                      - generic [ref=e90]:
                        - text: "0.0"
                        - generic [ref=e91]: ★
                    - generic [ref=e92]: Provider Name
                    - generic [ref=e93]:
                      - generic [ref=e94]: 📍
                      - text: Samui - 0 reviews
                    - generic [ref=e95]: from 800 THB/hr
                    - button "VIEW PROFILE" [ref=e97]
            - generic [ref=e98]:
              - button "Add to favorites" [ref=e99] [cursor=pointer]:
                - img [ref=e100]
              - link "Hotels My Awesome Cafe (Updated) 0.0 ★ Provider Name 📍 Samui - 0 reviews from 800 THB/hr VIEW PROFILE" [ref=e102] [cursor=pointer]:
                - /url: /listing/cmquqihsj0002urj68whmq8ha
                - generic [ref=e103]:
                  - generic [ref=e106]: Hotels
                  - generic [ref=e107]:
                    - generic [ref=e108]:
                      - heading "My Awesome Cafe (Updated)" [level=3] [ref=e109]
                      - generic [ref=e110]:
                        - text: "0.0"
                        - generic [ref=e111]: ★
                    - generic [ref=e112]: Provider Name
                    - generic [ref=e113]:
                      - generic [ref=e114]: 📍
                      - text: Samui - 0 reviews
                    - generic [ref=e115]: from 800 THB/hr
                    - button "VIEW PROFILE" [ref=e117]
            - generic [ref=e118]:
              - button "Add to favorites" [ref=e119] [cursor=pointer]:
                - img [ref=e120]
              - link "Restaurants Unclaimed Test Business 0.0 ★ Provider Name 📍 Samui - 0 reviews from 800 THB/hr VIEW PROFILE" [ref=e122] [cursor=pointer]:
                - /url: /listing/cmquqiebi0000tqj6tf2pyz9u
                - generic [ref=e123]:
                  - generic [ref=e126]: Restaurants
                  - generic [ref=e127]:
                    - generic [ref=e128]:
                      - heading "Unclaimed Test Business" [level=3] [ref=e129]
                      - generic [ref=e130]:
                        - text: "0.0"
                        - generic [ref=e131]: ★
                    - generic [ref=e132]: Provider Name
                    - generic [ref=e133]:
                      - generic [ref=e134]: 📍
                      - text: Samui - 0 reviews
                    - generic [ref=e135]: from 800 THB/hr
                    - button "VIEW PROFILE" [ref=e137]
  - contentinfo [ref=e138]:
    - paragraph [ref=e140]: © 2026 Samui Services. All rights reserved.
  - button "Open Next.js Dev Tools" [ref=e146] [cursor=pointer]:
    - img [ref=e147]
  - alert [ref=e151]
```

# Test source

```ts
  31  |
  32  |     // Fill out the form
  33  |     await page.fill('input[name="name"]', 'My Awesome Cafe');
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
  83  |         await expect(page.getByText('Request Submitted!')).toBeVisible();
  84  |       }
  85  |     }
  86  |   });
  87  |
  88  |   test('User can send a message to a business', async ({ page }) => {
  89  |     await loginAs(page, 'test@example.com');
  90  |     await page.goto('/');
  91  |
  92  |     // Go to first listing
  93  |     const firstListing = page.locator('a:has(.card)').first();
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
> 131 |     await page.goto('/');
      |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
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