# Samui Services

A service directory platform covering Koh Samui, Koh Phangan, and Koh Tao. This application allows users to discover local businesses, add their own listings, claim unclaimed businesses, send messages, and leave reviews.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com/) (via OpenNext)
- **Database**: SQLite (Local) / Cloudflare D1 (Production)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Testing**: [Playwright](https://playwright.dev/) (E2E), [Vitest](https://vitest.dev/) (Unit/Integration)

## Getting Started

### 1. Environment Setup
Copy the example environment variables to a new `.env` file:
```bash
cp .env.example .env
```
Ensure you have `DATABASE_URL` set to `"file:./dev.db"` for local development.

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup (Local)
Push the Prisma schema to your local SQLite database:
```bash
npx prisma db push
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Testing

### Unit and Integration Tests
We use Vitest and Testing Library for unit and integration testing.
```bash
npm run test
```

### End-to-End Tests
We use Playwright for E2E tests. Playwright runs tests locally against a dedicated `test.db` database.
1. Install Playwright browsers (if not already installed):
   ```bash
   npx playwright install
   ```
2. Run the E2E test suite:
   ```bash
   npm run test:e2e
   ```
*Note: The E2E tests run sequentially by default to avoid SQLite database locking issues.*

## Deployment

This project uses `opennextjs-cloudflare` to deploy to Cloudflare Workers and D1.

1. Ensure your Cloudflare configuration in `wrangler.jsonc` is accurate.
2. Generate Cloudflare TypeScript interfaces:
   ```bash
   npm run cf-typegen
   ```
3. Deploy to your Cloudflare account:
   ```bash
   npm run deploy
   ```
