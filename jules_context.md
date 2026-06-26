# Project Context for Jules

This document contains the entire source code and configuration for the samuiservices.com / AdMeSamui project.

Project Stack: Next.js (App Router), Prisma (SQLite/D1), Cloudflare (OpenNext)

## File: .env.example
```example
# Database
# Local SQLite database URL
DATABASE_URL="file:./dev.db"

# Authentication
# Run `openssl rand -base64 32` to generate a secret
NEXTAUTH_SECRET="your-development-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Application Mode
# Set to true during testing to mock external dependencies or override auth
NEXT_PUBLIC_TEST_MODE="false"

# Cloudflare (Optional for local development)
# D1_DATABASE_ID="your-d1-database-id"

```

## File: .gitignore
```text
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

/src/generated/prisma

# OpenNext
.open-next

# wrangler files
.wrangler
.dev.vars*
!.dev.vars.example
*.db
dev.db*
"dev.db*"
tail.log

```

## File: AGENTS.md
```md
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

```

## File: CLAUDE.md
```md
@AGENTS.md

```

## File: README.md
```md
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

```

## File: eslint.config.mjs
```mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

```

## File: next-env.d.ts
```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

## File: next.config.ts
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/adapter-better-sqlite3", "better-sqlite3"],
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());

```

## File: open-next.config.ts
```ts
// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
	incrementalCache: r2IncrementalCache,
});

```

## File: package.json
```json
{
  "name": "samuiservices",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "pretest:e2e": "DATABASE_URL=file:./test.db npx prisma db push --accept-data-loss",
    "test:e2e": "NEXT_PUBLIC_TEST_MODE=true DATABASE_URL=file:./test.db npm run build && NEXT_PUBLIC_TEST_MODE=true DATABASE_URL=file:./test.db playwright test",
    "test:e2e:remote": "ADMIN_TEST_PASSWORD=${ADMIN_TEST_PASSWORD:-secret} BASE_URL=${BASE_URL:-https://samuiservices.com} playwright test",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
    "upload": "opennextjs-cloudflare build && opennextjs-cloudflare upload",
    "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
  },
  "dependencies": {
    "@auth/prisma-adapter": "^2.11.2",
    "@prisma/adapter-better-sqlite3": "^7.8.0",
    "@prisma/adapter-d1": "^7.8.0",
    "@prisma/client": "^7.8.0",
    "@types/better-sqlite3": "^7.6.13",
    "better-sqlite3": "^12.11.1",
    "leaflet": "^1.9.4",
    "lucide-react": "^1.21.0",
    "next": "16.2.9",
    "next-auth": "^4.24.14",
    "prisma": "^7.8.0",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-leaflet": "^5.0.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20260625.1",
    "@opennextjs/cloudflare": "^1.20.0",
    "@playwright/test": "^1.61.1",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@types/leaflet": "^1.9.21",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^6.0.3",
    "eslint": "^9",
    "eslint-config-next": "16.2.9",
    "jsdom": "^29.1.1",
    "msw": "^2.14.6",
    "typescript": "^5",
    "vitest": "^4.1.9",
    "wrangler": "^4.104.0"
  }
}

```

## File: playwright.config.ts
```ts
import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  globalSetup: require.resolve('./e2e/global.setup'),
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI, and force 1 worker locally for SQLite test stability. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:3001',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: process.env.BASE_URL ? undefined : {
    command: 'npm run dev -- -p 3001',
    url: 'http://127.0.0.1:3001',
    reuseExistingServer: false,
    env: {
      NEXTAUTH_SECRET: 'test-secret-12345',
      NEXTAUTH_URL: 'http://127.0.0.1:3001',
      NEXT_PUBLIC_TEST_MODE: 'true'
    }
  },
});

```

## File: prisma/seed.ts
```ts
import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" })

const prisma = new PrismaClient({ 
  adapter
})

async function main() {
  // Dummy User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@admesamui.local' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@admesamui.local',
      role: 'ADMIN',
    },
  })

  // Islands
  const samui = await prisma.island.upsert({
    where: { slug: 'samui' },
    update: {},
    create: { name: 'Koh Samui', slug: 'samui' },
  })
  
  const phangan = await prisma.island.upsert({
    where: { slug: 'phangan' },
    update: {},
    create: { name: 'Koh Phangan', slug: 'phangan' },
  })
  
  const tao = await prisma.island.upsert({
    where: { slug: 'tao' },
    update: {},
    create: { name: 'Koh Tao', slug: 'tao' },
  })

  // Categories
  const categories = [
    { name: 'Construction & Repair', slug: 'construction', icon: 'hammer' },
    { name: 'Cleaning Services', slug: 'cleaning', icon: 'sparkles' },
    { name: 'Finance & Legal', slug: 'finance-legal', icon: 'briefcase' },
    { name: 'Food Delivery', slug: 'food-delivery', icon: 'shopping-bag' },
    { name: 'Health & Beauty', slug: 'health-beauty', icon: 'heart' },
    { name: 'Tours & Activities', slug: 'tours', icon: 'map' },
  ]

  const createdCategories = await Promise.all(
    categories.map(cat => 
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  )

  const constructionCat = createdCategories.find(c => c.slug === 'construction')!
  const cleaningCat = createdCategories.find(c => c.slug === 'cleaning')!
  const foodCat = createdCategories.find(c => c.slug === 'food-delivery')!
  const healthCat = createdCategories.find(c => c.slug === 'health-beauty')!
  const toursCat = createdCategories.find(c => c.slug === 'tours')!

  // Sample Companies
  const sampleListings = [
    {
      name: 'Samui Eco Builders',
      description: 'Sustainable construction and repair services across Koh Samui. We specialize in bamboo architecture and eco-friendly materials.',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Bophut, Koh Samui',
      lat: 9.5530,
      lng: 100.0245,
      averageRating: 4.8,
      reviewCount: 24,
      isPremium: true,
      categoryId: constructionCat.id,
      islandId: samui.id,
      userId: adminUser.id,
    },
    {
      name: 'Sparkle Island Cleaning',
      description: 'Professional villa and resort cleaning. Fast, reliable, and thorough.',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Chaweng, Koh Samui',
      lat: 9.5310,
      lng: 100.0610,
      averageRating: 4.5,
      reviewCount: 15,
      categoryId: cleaningCat.id,
      islandId: samui.id,
      userId: adminUser.id,
    },
    {
      name: 'Phangan Fresh Delivery',
      description: 'The quickest food delivery on the island. Local Thai and international cuisine delivered to your door.',
      image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Thong Sala, Koh Phangan',
      lat: 9.7125,
      lng: 99.9880,
      averageRating: 4.9,
      reviewCount: 112,
      isPremium: true,
      categoryId: foodCat.id,
      islandId: phangan.id,
      userId: adminUser.id,
    },
    {
      name: 'Tao Diving Masters',
      description: 'PADI certified diving courses and tours around the best spots in Koh Tao.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Sairee Beach, Koh Tao',
      lat: 10.0950,
      lng: 99.8285,
      averageRating: 5.0,
      reviewCount: 340,
      isPremium: true,
      categoryId: toursCat.id,
      islandId: tao.id,
      userId: adminUser.id,
    },
    {
      name: 'Lotus Wellness Spa',
      description: 'Traditional Thai massage and modern wellness treatments.',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Lamai, Koh Samui',
      lat: 9.4700,
      lng: 100.0485,
      averageRating: 4.7,
      reviewCount: 56,
      categoryId: healthCat.id,
      islandId: samui.id,
      userId: adminUser.id,
    },
    {
      name: 'Island Handyman Services',
      description: 'Quick fixes, plumbing, and electrical work. Available 24/7.',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Maenam, Koh Samui',
      lat: 9.5700,
      lng: 99.9985,
      averageRating: 4.3,
      reviewCount: 12,
      categoryId: constructionCat.id,
      islandId: samui.id,
      userId: adminUser.id,
    },
    {
      name: 'Vegan Bites Delivery',
      description: 'Healthy, plant-based meals delivered anywhere in Koh Phangan.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Sri Thanu, Koh Phangan',
      lat: 9.7560,
      lng: 99.9650,
      averageRating: 4.8,
      reviewCount: 89,
      categoryId: foodCat.id,
      islandId: phangan.id,
      userId: adminUser.id,
    },
    {
      name: 'Samui Safari Tours',
      description: 'Jungle safaris, waterfall visits, and elephant sanctuary tours.',
      image: 'https://images.unsplash.com/photo-1534777367038-f4023e5eaa63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Nathon, Koh Samui',
      lat: 9.5350,
      lng: 99.9350,
      averageRating: 4.6,
      reviewCount: 145,
      categoryId: toursCat.id,
      islandId: samui.id,
      userId: adminUser.id,
    },
    {
      name: 'Crystal Clear Pools',
      description: 'Pool maintenance, cleaning, and chemical balancing services.',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Choeng Mon, Koh Samui',
      lat: 9.5700,
      lng: 100.0750,
      averageRating: 4.9,
      reviewCount: 33,
      categoryId: cleaningCat.id,
      islandId: samui.id,
      userId: adminUser.id,
    },
    {
      name: 'Yoga Retreat Tao',
      description: 'Daily yoga classes and wellness retreats by the ocean.',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Chalok Baan Kao, Koh Tao',
      lat: 10.0650,
      lng: 99.8250,
      averageRating: 5.0,
      reviewCount: 210,
      isPremium: true,
      categoryId: healthCat.id,
      islandId: tao.id,
      userId: adminUser.id,
    }
  ]

  for (const listing of sampleListings) {
    const existing = await prisma.listing.findFirst({
      where: { name: listing.name }
    })

    if (!existing) {
      await prisma.listing.create({
        data: listing
      })
    } else {
      await prisma.listing.update({
        where: { id: existing.id },
        data: {
          lat: listing.lat,
          lng: listing.lng
        }
      })
    }
  }

  console.log('Seeded database with dummy data!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

```

## File: prisma.config.ts
```ts
// This file was generated by Prisma, and assumes you have installed the following:
// npm install --save-dev prisma dotenv
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});

```

## File: seed-categories.js
```js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  { name: 'Construction & Builders', slug: 'construction-builders', icon: 'hammer' },
  { name: 'Plumbers', slug: 'plumbers', icon: 'wrench' },
  { name: 'Electricians', slug: 'electricians', icon: 'zap' },
  { name: 'Cleaning & Housekeeping', slug: 'cleaning-housekeeping', icon: 'sparkles' },
  { name: 'Deliveries & Moving', slug: 'deliveries-moving', icon: 'truck' },
  { name: 'Handyman & Repairs', slug: 'handyman-repairs', icon: 'tool' },
  { name: 'Transport & Rentals', slug: 'transport-rentals', icon: 'car' },
  { name: 'Legal & Visa Services', slug: 'legal-visa-services', icon: 'briefcase' },
  { name: 'Tech & IT Support', slug: 'tech-it-support', icon: 'monitor' },
  { name: 'Gardening & Pool Care', slug: 'gardening-pool-care', icon: 'leaf' }
];

async function main() {
  console.log('Seeding categories...');
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon },
      create: { name: cat.name, slug: cat.slug, icon: cat.icon }
    });
  }

  const oldSlugs = ['stays', 'dining', 'activities', 'experiences', 'restaurants'];
  for (const slug of oldSlugs) {
    try {
      await prisma.category.delete({ where: { slug } });
      console.log(`Deleted old category: ${slug}`);
    } catch (e) {
      // ignore
    }
  }
  
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

```

## File: seed.js
```js
const Database = require('better-sqlite3');
const db = new Database('./dev.db');

const categories = [
  { id: 'c1', name: 'Construction & Builders', slug: 'construction-builders', icon: 'hammer' },
  { id: 'c2', name: 'Plumbers', slug: 'plumbers', icon: 'wrench' },
  { id: 'c3', name: 'Electricians', slug: 'electricians', icon: 'zap' },
  { id: 'c4', name: 'Cleaning & Housekeeping', slug: 'cleaning-housekeeping', icon: 'sparkles' },
  { id: 'c5', name: 'Deliveries & Moving', slug: 'deliveries-moving', icon: 'truck' },
  { id: 'c6', name: 'Handyman & Repairs', slug: 'handyman-repairs', icon: 'tool' },
  { id: 'c7', name: 'Transport & Rentals', slug: 'transport-rentals', icon: 'car' },
  { id: 'c8', name: 'Legal & Visa Services', slug: 'legal-visa-services', icon: 'briefcase' },
  { id: 'c9', name: 'Tech & IT Support', slug: 'tech-it-support', icon: 'monitor' },
  { id: 'c10', name: 'Gardening & Pool Care', slug: 'gardening-pool-care', icon: 'leaf' }
];

const insert = db.prepare('INSERT OR REPLACE INTO Category (id, name, slug, icon) VALUES (?, ?, ?, ?)');
const deleteOld = db.prepare('DELETE FROM Category WHERE slug IN (?, ?, ?, ?, ?)');

db.transaction(() => {
  deleteOld.run('stays', 'dining', 'activities', 'experiences', 'restaurants');
  for (const cat of categories) {
    insert.run(cat.id, cat.name, cat.slug, cat.icon);
  }
})();

console.log('Seeding complete.');

```

## File: src/app/[island]/page.tsx
```tsx
import { notFound } from 'next/navigation';
import { getBusinessesByIsland, getAllIslands, getAllCategories } from '@/lib/db';
import { FilterSidebar } from '@/components/features/FilterSidebar';
import { BusinessCard } from '@/components/features/BusinessCard';
import { Card } from '@/components/ui/Card';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import DynamicMap from '@/components/features/DynamicMap';

export async function generateMetadata({ params }: { params: Promise<{ island: string }> }) {
  const { island } = await params;
  const islandName = island.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `Services in ${islandName} | Samui Services`,
    description: `Find the best local services, construction, delivery, and more in ${islandName}.`,
  };
}

export default async function IslandDirectory({ 
  params,
  searchParams
}: { 
  params: Promise<{ island: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { island } = await params;
  const resolvedSearchParams = await searchParams;
  
  const categoriesParam = resolvedSearchParams.category;
  const categorySlugs = categoriesParam 
    ? (Array.isArray(categoriesParam) ? categoriesParam : [categoriesParam]) 
    : undefined;
    
  const query = resolvedSearchParams.q as string | undefined;

  const islands = await getAllIslands();
  
  if (island !== 'all' && !islands.find(i => i.slug === island)) {
    notFound();
  }

  const islandName = island === 'all' ? 'All' : island.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const session = await getServerSession(authOptions);
  
  // Now pass the filters to getBusinessesByIsland
  const islandBusinesses = await getBusinessesByIsland(island, categorySlugs, query, session?.user?.id);
  const categories = await getAllCategories();

  return (
    <div>
      <div className="section" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{islandName} Services</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>Browse local businesses and top-rated services on the island.</p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="island-page-grid">
            {/* Sidebar Filters */}
            <div style={{ alignSelf: 'start', position: 'sticky', top: '100px' }}>
              <FilterSidebar categories={categories} />
            </div>

            {/* Results */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <p style={{ fontWeight: 600 }}>{islandBusinesses.length} businesses found</p>
                <select className="input-field" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                  <option>Recommended</option>
                  <option>Highest Rated</option>
                  <option>Newest</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {islandBusinesses.length > 0 && islandBusinesses.some(b => b.lat && b.lng) && (
                  <div style={{ marginBottom: '1rem' }}>
                    <DynamicMap businesses={islandBusinesses as any} />
                  </div>
                )}
                {islandBusinesses.length === 0 ? (
                  <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>No businesses found yet. Be the first to add yours!</p>
                  </Card>
                ) : (
                  islandBusinesses.map(business => (
                    <BusinessCard key={business.id} business={business} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

```

## File: src/app/actions/claim.ts
```ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function submitClaimRequest(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return { error: 'You must be logged in to claim a business.' };
  }

  const listingId = formData.get('listingId') as string;
  if (!listingId) {
    return { error: 'Listing ID is missing.' };
  }

  try {
    // Check if a pending claim already exists for this user and listing
    const existing = await prisma.claimRequest.findFirst({
      where: {
        userId: session.user.id,
        listingId: listingId,
        status: 'PENDING'
      }
    });

    if (existing) {
      return { error: 'You have already submitted a claim request for this business.' };
    }

    await prisma.claimRequest.create({
      data: {
        userId: session.user.id,
        listingId: listingId,
        status: 'PENDING'
      }
    });

    revalidatePath(`/listing/${listingId}`);
    return { success: true };
  } catch (error) {
    console.error('Error submitting claim:', error);
    return { error: 'Failed to submit claim request.' };
  }
}

```

## File: src/app/actions/claims.ts
```ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function approveClaim(claimId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    throw new Error('Not authenticated');
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== 'ADMIN') {
    throw new Error('Not authorized');
  }

  // ClaimRequest doesn't have a direct Prisma relation to Listing in the schema
  // so we need to just find it
  const claim = await prisma.claimRequest.findUnique({
    where: { id: claimId }
  });

  if (!claim) {
    throw new Error('Claim not found');
  }

  // Update claim status to APPROVED
  await prisma.claimRequest.update({
    where: { id: claimId },
    data: { status: 'APPROVED' }
  });

  // Assign the listing to the user who requested the claim and mark it as claimed
  await prisma.listing.update({
    where: { id: claim.listingId },
    data: { 
      userId: claim.userId,
      isClaimed: true 
    }
  });

  revalidatePath('/admin/claims');
  revalidatePath('/admin/listings');
  revalidatePath('/dashboard');
}

export async function rejectClaim(claimId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    throw new Error('Not authenticated');
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== 'ADMIN') {
    throw new Error('Not authorized');
  }

  // Update claim status to REJECTED
  await prisma.claimRequest.update({
    where: { id: claimId },
    data: { status: 'REJECTED' }
  });

  revalidatePath('/admin/claims');
}

```

## File: src/app/actions/favorites.ts
```ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function toggleFavorite(listingId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return { error: 'You must be logged in to favorite a listing.' };
  }
  
  const userId = session.user.id;
  
  try {
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        }
      }
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      });
      revalidatePath('/', 'layout');
      return { isFavorited: false };
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          listingId,
        }
      });
      revalidatePath('/', 'layout');
      return { isFavorited: true };
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return { error: 'Failed to toggle favorite.' };
  }
}

```

## File: src/app/actions/messages.ts
```ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function sendMessage(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return { error: 'You must be logged in to send a message.' };
  }
  
  const receiverId = formData.get('receiverId') as string;
  const content = formData.get('content') as string;
  const listingId = formData.get('listingId') as string | null;
  
  if (!receiverId || !content) {
    return { error: 'Message content is required.' };
  }
  
  if (receiverId === session.user.id) {
    return { error: 'You cannot send a message to yourself.' };
  }

  try {
    await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content,
        listingId,
      }
    });

    if (listingId) {
      revalidatePath(`/listing/${listingId}`);
    }
    revalidatePath('/dashboard/inbox');
    
    return { success: true };
  } catch (error) {
    console.error('Error sending message:', error);
    return { error: 'Failed to send message.' };
  }
}

export async function markAsRead(messageId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return { error: 'Unauthorized' };
  }
  
  try {
    // Only the receiver can mark a message as read
    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });
    
    if (!message || message.receiverId !== session.user.id) {
      return { error: 'Message not found or unauthorized' };
    }
    
    if (!message.isRead) {
      await prisma.message.update({
        where: { id: messageId },
        data: { isRead: true }
      });
      revalidatePath('/dashboard/inbox');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error marking message as read:', error);
    return { error: 'Failed to update message' };
  }
}

```

## File: src/app/actions/reviews.ts
```ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function submitReview(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return { error: 'You must be logged in to submit a review.' };
  }
  
  const listingId = formData.get('listingId') as string;
  const rating = parseInt(formData.get('rating') as string, 10);
  const comment = formData.get('comment') as string;
  
  if (!listingId || !rating || rating < 1 || rating > 5 || !comment) {
    return { error: 'Invalid form data. Please provide a rating and a comment.' };
  }
  
  try {
    // 1. Check if user already reviewed this listing
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        listingId,
      }
    });

    if (existingReview) {
      return { error: 'You have already reviewed this listing.' };
    }

    // 2. Create the review
    await prisma.review.create({
      data: {
        userId: session.user.id,
        listingId,
        rating,
        comment,
      }
    });

    // 3. Update the listing's average rating and review count
    const aggregate = await prisma.review.aggregate({
      where: { listingId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    await prisma.listing.update({
      where: { id: listingId },
      data: {
        averageRating: aggregate._avg.rating || 0,
        reviewCount: aggregate._count.rating || 0,
      }
    });

    revalidatePath(`/listing/${listingId}`);
    return { success: true };
    
  } catch (error) {
    console.error('Error submitting review:', error);
    return { error: 'Failed to submit review.' };
  }
}

```

## File: src/app/actions/seed.ts
```ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';

export async function seedDatabase() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    throw new Error('Unauthorized');
  }

  const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (currentUser?.role !== 'ADMIN') {
    throw new Error('Unauthorized - Admin access required');
  }

  try {
    // 1. Seed Categories
    const categories = [
      { name: 'Construction & Builders', slug: 'construction-builders', icon: 'hammer' },
      { name: 'Plumbers', slug: 'plumbers', icon: 'wrench' },
      { name: 'Electricians', slug: 'electricians', icon: 'zap' },
      { name: 'Cleaning & Housekeeping', slug: 'cleaning-housekeeping', icon: 'sparkles' },
      { name: 'Deliveries & Moving', slug: 'deliveries-moving', icon: 'truck' },
      { name: 'Handyman & Repairs', slug: 'handyman-repairs', icon: 'tool' },
      { name: 'Transport & Rentals', slug: 'transport-rentals', icon: 'car' },
      { name: 'Legal & Visa Services', slug: 'legal-visa-services', icon: 'briefcase' },
      { name: 'Tech & IT Support', slug: 'tech-it-support', icon: 'monitor' },
      { name: 'Gardening & Pool Care', slug: 'gardening-pool-care', icon: 'leaf' }
    ];

    for (const cat of categories) {
      const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
      if (!existing) {
        await prisma.category.create({ data: cat });
      } else {
        await prisma.category.update({
          where: { slug: cat.slug },
          data: { name: cat.name, icon: cat.icon }
        });
      }
    }

    // Ensure Islands Exist
    const islandsData = [
      { name: 'Koh Samui', slug: 'samui' },
      { name: 'Koh Phangan', slug: 'phangan' },
      { name: 'Koh Tao', slug: 'tao' },
    ];
    for (const isl of islandsData) {
      const existing = await prisma.island.findUnique({ where: { slug: isl.slug } });
      if (!existing) {
        await prisma.island.create({ data: isl });
      }
    }

    // 2. Fetch required refs
    const samui = await prisma.island.findUnique({ where: { slug: 'samui' } });
    const phangan = await prisma.island.findUnique({ where: { slug: 'phangan' } });
    const constructionCat = await prisma.category.findUnique({ where: { slug: 'construction-builders' } });
    const cleaningCat = await prisma.category.findUnique({ where: { slug: 'cleaning-housekeeping' } });
    const deliveriesCat = await prisma.category.findUnique({ where: { slug: 'deliveries-moving' } });

    if (!samui || !phangan || !constructionCat || !cleaningCat || !deliveriesCat) {
      throw new Error('Required references missing during seed.');
    }

    // 3. Seed Sample Listings
    const sampleListings = [
      {
        name: 'Samui Eco Builders',
        description: 'Sustainable construction and repair services across Koh Samui. We specialize in bamboo architecture and eco-friendly materials.',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        address: 'Bophut, Koh Samui',
        lat: 9.5530,
        lng: 100.0245,
        averageRating: 4.8,
        reviewCount: 24,
        isPremium: true,
        categoryId: constructionCat.id,
        islandId: samui.id,
        userId: currentUser.id,
      },
      {
        name: 'Sparkle Island Cleaning',
        description: 'Professional villa and resort cleaning. Fast, reliable, and thorough.',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        address: 'Chaweng, Koh Samui',
        lat: 9.5310,
        lng: 100.0610,
        averageRating: 4.5,
        reviewCount: 15,
        isPremium: false,
        categoryId: cleaningCat.id,
        islandId: samui.id,
        userId: currentUser.id,
      },
      {
        name: 'Phangan Fresh Delivery',
        description: 'The quickest delivery on the island. Groceries, parcels, and more delivered to your door.',
        image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        address: 'Thong Sala, Koh Phangan',
        lat: 9.7125,
        lng: 99.9880,
        averageRating: 4.9,
        reviewCount: 112,
        isPremium: true,
        categoryId: deliveriesCat.id,
        islandId: phangan.id,
        userId: currentUser.id,
      }
    ];

    let seededCount = 0;
    for (const listing of sampleListings) {
      const existing = await prisma.listing.findFirst({
        where: { name: listing.name }
      });

      if (!existing) {
        await prisma.listing.create({
          data: listing
        });
        seededCount++;
      }
    }

    return { success: true, message: `Successfully seeded categories and ${seededCount} new listings!` };
  } catch (error: any) {
    console.error('Seed error:', error);
    return { success: false, message: error.message || 'Unknown error' };
  }
}

```

## File: src/app/add-listing/page.tsx
```tsx
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/auth';

export const metadata = {
  title: 'Add Your Business | Samui Services',
  description: 'Register your business on the premier directory for Koh Samui, Phangan, and Tao.',
};

export default async function AddListing() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/api/auth/signin?callbackUrl=/add-listing');
  }

  // Fetch categories and islands to populate dropdowns
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const islands = await prisma.island.findMany({ orderBy: { name: 'asc' } });

  async function createListing(formData: FormData) {
    'use server'
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");

    const name = formData.get('name') as string;
    const categoryId = formData.get('categoryId') as string;
    const islandId = formData.get('islandId') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as string;

    const lat = formData.get('lat') ? parseFloat(formData.get('lat') as string) : null;
    const lng = formData.get('lng') ? parseFloat(formData.get('lng') as string) : null;

    if (!name || !categoryId || !islandId || !description) {
      throw new Error("Missing required fields");
    }

    await prisma.listing.create({
      data: {
        name,
        categoryId,
        islandId,
        phone,
        address,
        lat,
        lng,
        description,
        image,
        userId: session.user.id
      }
    });

    revalidatePath('/');
    redirect('/dashboard');
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Add Your Business</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>Join the largest service directory in the Gulf of Thailand.</p>
        </div>

        <Card style={{ padding: '3rem' }}>
          <form action={createListing} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Basic Info */}
            <div>
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>1. Basic Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <Input label="Business Name" name="name" type="text" placeholder="e.g. Samui Builders Pro" required />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.875rem' }}>Category</label>
                  <select name="categoryId" className="input-field" required>
                    <option value="">Select a category...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location & Contact */}
            <div>
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>2. Location & Contact</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.875rem' }}>Island</label>
                  <select name="islandId" className="input-field" required>
                    <option value="">Select an island...</option>
                    {islands.map(island => (
                      <option key={island.id} value={island.id}>{island.name}</option>
                    ))}
                  </select>
                </div>
                <Input label="Phone Number" name="phone" type="tel" placeholder="+66 XX XXX XXXX" />
                <div style={{ gridColumn: '1 / -1' }}>
                  <Input label="Full Address" name="address" type="text" fullWidth placeholder="123 Beach Rd, Koh Samui..." />
                </div>
                <Input label="Latitude (Map Pin)" name="lat" type="number" step="any" placeholder="e.g. 9.5120" />
                <Input label="Longitude (Map Pin)" name="lng" type="number" step="any" placeholder="e.g. 100.0136" />
              </div>
            </div>

            {/* Description & Media */}
            <div>
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>3. Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.875rem' }}>Business Description</label>
                <textarea name="description" className="input-field" rows={5} placeholder="Describe what you do, your experience, and what makes your service great..." required></textarea>
              </div>
              <Input label="Cover Image URL (Temporary)" name="image" type="url" fullWidth placeholder="https://..." />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <Link href="/dashboard">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
              <Button type="submit" variant="primary">Submit Listing</Button>
            </div>

          </form>
        </Card>

      </div>
    </div>
  );
}

```

## File: src/app/admin/claims/page.tsx
```tsx
'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { approveClaim, rejectClaim } from '@/app/actions/claims';
import { useState, useEffect } from 'react';
import { Check, X, Building, User, Calendar, Clock } from 'lucide-react';

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await fetch('/api/admin/claims');
      if (res.ok) {
        const data = await res.json();
        setClaims(data);
      }
    } catch (e) {
      console.error('Failed to fetch claims', e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await approveClaim(id);
      await fetchClaims();
    } catch (e) {
      console.error(e);
      alert('Failed to approve claim');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await rejectClaim(id);
      await fetchClaims();
    } catch (e) {
      console.error(e);
      alert('Failed to reject claim');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 700, color: '#0f172a' }}>Claim Requests</h1>
          <p style={{ color: 'var(--text-muted)' }}>Review and manage ownership claims for businesses on the platform.</p>
        </div>
      </div>

      {loading ? (
        <Card style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading claims...
        </Card>
      ) : claims.length === 0 ? (
        <Card style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '50%', marginBottom: '1rem' }}>
            <Building style={{ width: '2rem', height: '2rem', color: '#94a3b8' }} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>No pending claims</h3>
          <p style={{ color: 'var(--text-muted)' }}>All business claim requests have been processed.</p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {claims.map((claim) => (
            <Card key={claim.id} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{ 
                      backgroundColor: claim.status === 'PENDING' ? '#fef08a' : claim.status === 'APPROVED' ? '#bbf7d0' : '#fecaca',
                      color: claim.status === 'PENDING' ? '#854d0e' : claim.status === 'APPROVED' ? '#166534' : '#991b1b',
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      letterSpacing: '0.05em'
                    }}>
                      {claim.status}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      <Clock size={14} />
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#0f172a' }}>
                    {claim.listing?.name || 'Unknown Business'}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>Requested By</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', fontWeight: 500 }}>
                        <User size={16} color="#64748b" />
                        {claim.user?.name || 'Unknown User'}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem', paddingLeft: '1.5rem' }}>
                        {claim.user?.email}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>Business Info</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', fontWeight: 500 }}>
                        <Building size={16} color="#64748b" />
                        ID: {claim.listingId.substring(0, 8)}...
                      </div>
                    </div>
                  </div>
                </div>

                {claim.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'center' }}>
                    <Button 
                      variant="secondary" 
                      onClick={() => handleReject(claim.id)}
                      disabled={actionLoading === claim.id}
                      style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <X size={16} /> Reject
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={() => handleApprove(claim.id)}
                      disabled={actionLoading === claim.id}
                      style={{ backgroundColor: '#22c55e', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Check size={16} /> Approve
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

```

## File: src/app/admin/import/page.tsx
```tsx
'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { seedDatabase } from '@/app/actions/seed';

export default function AdminImportPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSeed = async () => {
    if (!window.confirm('Are you sure you want to seed the database? This will insert sample categories and businesses.')) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await seedDatabase();
      if (result.success) {
        setMessage({ text: result.message, type: 'success' });
      } else {
        setMessage({ text: result.message, type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'An unexpected error occurred', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Import & Seed Data</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your database records and sample data.</p>
      </div>

      <Card style={{ padding: '2rem', maxWidth: '600px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Seed Test Data</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Running this tool will populate your database with the 10 core service categories (Construction, Plumbers, etc.) 
          and insert a set of high-quality sample listings for testing purposes. It safely skips existing records to prevent duplicates.
        </p>

        {message && (
          <div style={{ 
            padding: '1rem', 
            marginBottom: '1.5rem', 
            borderRadius: '4px',
            backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: message.type === 'success' ? '#166534' : '#991b1b',
            fontWeight: 500
          }}>
            {message.text}
          </div>
        )}

        <Button 
          variant="primary" 
          onClick={handleSeed} 
          disabled={loading}
          style={{ minWidth: '150px' }}
        >
          {loading ? 'Seeding...' : 'Run Seed Script'}
        </Button>
      </Card>
    </div>
  );
}

```

## File: src/app/admin/layout.tsx
```tsx
import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Store, Users, ClipboardCheck, Database, ArrowLeft } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect('/api/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (user?.role !== 'ADMIN') {
    // Redirect non-admins to the normal dashboard
    redirect('/dashboard');
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)', display: 'flex' }}>
      
      {/* Premium Sidebar */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: 'white', 
        borderRight: '1px solid #e2e8f0',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: '64px',
        height: 'calc(100vh - 64px)',
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem' }}>Management</h2>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Super Admin</div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#475569', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s', backgroundColor: 'transparent' }} className="admin-nav-link">
            <LayoutDashboard size={18} />
            Overview
          </Link>
          <Link href="/admin/listings" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#475569', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s' }} className="admin-nav-link">
            <Store size={18} />
            Manage Listings
          </Link>
          <Link href="/admin/users" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#475569', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s' }} className="admin-nav-link">
            <Users size={18} />
            Manage Users
          </Link>
          <Link href="/admin/claims" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#475569', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s' }} className="admin-nav-link">
            <ClipboardCheck size={18} />
            Claim Requests
          </Link>
          <Link href="/admin/import" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#475569', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s' }} className="admin-nav-link">
            <Database size={18} />
            Seed Database
          </Link>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#64748b', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s', border: '1px solid #e2e8f0' }} className="admin-nav-back">
            <ArrowLeft size={16} />
            Back to User Dash
          </Link>
        </div>
        
        <style>{`
          .admin-nav-link:hover {
            background-color: #f1f5f9 !important;
            color: #0f172a !important;
          }
          .admin-nav-back:hover {
            background-color: #f8fafc;
            color: #334155 !important;
          }
        `}</style>
      </aside>

      {/* Admin Main Content */}
      <main style={{ flexGrow: 1, padding: '2rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}

```

## File: src/app/admin/listings/page.tsx
```tsx
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { prisma } from '@/lib/auth';
import Link from 'next/link';

export const metadata = {
  title: 'Manage Listings | Super Admin',
};

export default async function AdminListingsPage() {
  const listings = await prisma.listing.findMany({
    include: {
      category: true,
      island: true,
      user: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Manage Listings</h1>
          <p style={{ color: 'var(--text-muted)' }}>View and edit all published businesses in the directory.</p>
        </div>
        <Link href="/add-listing">
          <Button variant="primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 500 }}>Add New Listing</Button>
        </Link>
      </div>

      <Card style={{ overflow: 'hidden', padding: 0, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, color: '#64748b' }}>Name & Location</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, color: '#64748b' }}>Owner</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, color: '#64748b' }}>Status</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, color: '#64748b', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '1.125rem', fontWeight: 500, color: '#475569', marginBottom: '0.5rem' }}>No listings found</div>
                    <p>There are no businesses listed on the platform yet.</p>
                  </td>
                </tr>
              ) : (
                listings.map((listing) => (
                  <tr key={listing.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }} className="admin-table-row">
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                        <Link href={`/listing/${listing.id}`} style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                          {listing.name}
                        </Link>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ padding: '0.125rem 0.375rem', backgroundColor: '#f1f5f9', borderRadius: '4px' }}>{listing.category?.name || 'No Category'}</span>
                        • {listing.island?.name || 'No Island'}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      {listing.user ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 500, color: '#334155' }}>{listing.user.name || 'User'}</span>
                          <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{listing.user.email}</span>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>System</span>
                      )}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      {listing.isPremium ? (
                        <span style={{ backgroundColor: '#fef08a', color: '#854d0e', padding: '0.375rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>PREMIUM</span>
                      ) : (
                        <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', padding: '0.375rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>STANDARD</span>
                      )}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                      <Link href={`/dashboard/edit/${listing.id}`}>
                        <Button variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: '6px' }}>Edit</Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <style>{`
            .admin-table-row:hover {
              background-color: #f8fafc;
            }
          `}</style>
        </div>
      </Card>
    </div>
  );
}

```

## File: src/app/admin/page.tsx
```tsx
import { Card } from '@/components/ui/Card';
import { prisma } from '@/lib/auth';
import { Users, Store, ClipboardList } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Super Admin | Samui Services',
};

export default async function AdminDashboard() {
  const usersCount = await prisma.user.count();
  const listingsCount = await prisma.listing.count();
  const claimsCount = await prisma.claimRequest.count({
    where: { status: 'PENDING' }
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Platform Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Monitor the health and activity of the Samui Services directory.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>Total Users</h3>
            <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '12px' }}>
              <Users color="#16a34a" size={24} />
            </div>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{usersCount}</div>
        </Card>
        
        <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>Total Listings</h3>
            <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '12px' }}>
              <Store color="#2563eb" size={24} />
            </div>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{listingsCount}</div>
        </Card>

        <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>Pending Claims</h3>
            <div style={{ padding: '0.75rem', backgroundColor: claimsCount > 0 ? '#fef2f2' : '#f8fafc', borderRadius: '12px' }}>
              <ClipboardList color={claimsCount > 0 ? '#ef4444' : '#94a3b8'} size={24} />
            </div>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: claimsCount > 0 ? '#ef4444' : '#0f172a', lineHeight: 1 }}>{claimsCount}</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <Card style={{ padding: '2rem', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/add-listing" style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px', fontWeight: 500, textDecoration: 'none' }}>
              Add New Listing
            </Link>
            <Link href="/admin/import" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f1f5f9', color: '#334155', borderRadius: '8px', fontWeight: 500, textDecoration: 'none' }}>
              Run Seed Script
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

```

## File: src/app/api/admin/claims/route.ts
```ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  try {
    const claims = await prisma.claimRequest.findMany({
      orderBy: { createdAt: 'desc' },
      // We manually fetch user and listing since listing is not relation in prisma
    });

    // Enhance claims with user and listing data
    const enhancedClaims = await Promise.all(claims.map(async (claim) => {
      const claimUser = await prisma.user.findUnique({ where: { id: claim.userId } });
      const listing = await prisma.listing.findUnique({ where: { id: claim.listingId } });
      
      return {
        ...claim,
        user: claimUser,
        listing: listing,
      };
    }));

    return NextResponse.json(enhancedClaims);
  } catch (e) {
    console.error('Error fetching claims', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

```

## File: src/app/api/auth/[...nextauth]/route.ts
```ts
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

```

## File: src/app/dashboard/edit/[id]/page.tsx
```tsx
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/auth';
import Link from 'next/link';

export const metadata = {
  title: 'Edit Listing | Samui Services',
};

export default async function EditListing({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect('/api/auth/signin');
  }

  const listing = await prisma.listing.findUnique({
    where: { id }
  });

  if (!listing) {
    notFound();
  }

  // Ensure only the owner or an ADMIN can edit this
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const isAdmin = user?.role === 'ADMIN';

  if (listing.userId !== session.user.id && !isAdmin) {
    redirect('/dashboard');
  }

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const islands = await prisma.island.findMany({ orderBy: { name: 'asc' } });

  async function updateListing(formData: FormData) {
    'use server'
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) throw new Error("Unauthorized");

    // Re-verify permissions inside server action
    const currentListing = await prisma.listing.findUnique({ where: { id } });
    const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!currentListing) throw new Error("Not found");
    if (currentListing.userId !== session.user.id && currentUser?.role !== 'ADMIN') {
      throw new Error("Unauthorized");
    }

    const name = formData.get('name') as string;
    const categoryId = formData.get('categoryId') as string;
    const islandId = formData.get('islandId') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const website = formData.get('website') as string;
    const hours = formData.get('hours') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as string;

    const lat = formData.get('lat') ? parseFloat(formData.get('lat') as string) : null;
    const lng = formData.get('lng') ? parseFloat(formData.get('lng') as string) : null;

    if (!name || !categoryId || !islandId || !description) {
      throw new Error("Missing required fields");
    }

    await prisma.listing.update({
      where: { id },
      data: {
        name,
        categoryId,
        islandId,
        phone,
        address,
        website,
        hours,
        lat,
        lng,
        description,
        image,
      }
    });

    revalidatePath('/');
    revalidatePath(`/listing/${id}`);
    redirect('/dashboard');
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Edit Listing</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>Update your business details and photos.</p>
        </div>

        <Card style={{ padding: '3rem' }}>
          <form action={updateListing} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Basic Info */}
            <div>
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>1. Basic Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <Input label="Business Name" name="name" type="text" defaultValue={listing.name} required />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.875rem' }}>Category</label>
                  <select name="categoryId" className="input-field" defaultValue={listing.categoryId} required>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location & Contact */}
            <div>
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>2. Location & Contact</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.875rem' }}>Island</label>
                  <select name="islandId" className="input-field" defaultValue={listing.islandId} required>
                    {islands.map(island => (
                      <option key={island.id} value={island.id}>{island.name}</option>
                    ))}
                  </select>
                </div>
                <Input label="Phone Number" name="phone" type="tel" defaultValue={listing.phone || ''} />
                <div style={{ gridColumn: '1 / -1' }}>
                  <Input label="Full Address" name="address" type="text" fullWidth defaultValue={listing.address || ''} />
                </div>
                <Input label="Website" name="website" type="url" defaultValue={listing.website || ''} placeholder="https://" />
                <Input label="Business Hours" name="hours" type="text" defaultValue={listing.hours || ''} placeholder="e.g. Mon-Fri 9AM-5PM" />
                <Input label="Latitude (Map Pin)" name="lat" type="number" step="any" defaultValue={listing.lat || ''} />
                <Input label="Longitude (Map Pin)" name="lng" type="number" step="any" defaultValue={listing.lng || ''} />
              </div>
            </div>

            {/* Description & Media */}
            <div>
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>3. Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.875rem' }}>Business Description</label>
                <textarea name="description" className="input-field" rows={5} defaultValue={listing.description} required></textarea>
              </div>
              <Input label="Cover Image URL (Temporary)" name="image" type="url" fullWidth defaultValue={listing.image || ''} placeholder="https://..." />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <Link href="/dashboard">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
              <Button type="submit" variant="primary">Save Changes</Button>
            </div>

          </form>
        </Card>

      </div>
    </div>
  );
}

```

## File: src/app/dashboard/inbox/page.tsx
```tsx
import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { InboxView } from '@/components/features/InboxView';

export const metadata = {
  title: 'Inbox | Dashboard | Samui Services',
};

export default async function InboxPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }

  // Fetch messages received by the user
  const receivedMessages = await prisma.message.findMany({
    where: { receiverId: session.user.id },
    include: {
      sender: {
        select: { name: true, image: true }
      },
      listing: {
        select: { id: true, name: true, island: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Fetch messages sent by the user
  const sentMessages = await prisma.message.findMany({
    where: { senderId: session.user.id },
    include: {
      receiver: {
        select: { name: true, image: true }
      },
      listing: {
        select: { id: true, name: true, island: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="section">
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Inbox</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your messages</p>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Sidebar Menu */}
          <Card style={{ padding: '2rem 1.5rem', alignSelf: 'start' }}>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0, margin: 0 }}>
              <li>
                <Link href="/dashboard" style={{ display: 'block', padding: '0.5rem', color: 'var(--text-muted)' }}>My Listings</Link>
              </li>
              <li>
                <Link href="/dashboard/inbox" style={{ display: 'block', padding: '0.5rem', fontWeight: 600, color: 'var(--primary-color)' }}>Inbox</Link>
              </li>
              <li>
                <a href="#" style={{ display: 'block', padding: '0.5rem', color: 'var(--text-muted)' }}>Analytics</a>
              </li>
              <li>
                <a href="#" style={{ display: 'block', padding: '0.5rem', color: 'var(--text-muted)' }}>Account Settings</a>
              </li>
              <li>
                <a href="/api/auth/signout" style={{ display: 'block', padding: '0.5rem', color: 'red', marginTop: '1rem' }}>Log Out</a>
              </li>
            </ul>
          </Card>

          {/* Main Content */}
          <div style={{ flex: 1 }}>
            <InboxView 
              receivedMessages={receivedMessages} 
              sentMessages={sentMessages} 
              currentUserId={session.user.id} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}

```

## File: src/app/dashboard/page.tsx
```tsx
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/auth';

export const metadata = {
  title: 'Dashboard | Samui Services',
};

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }

  // Fetch user's listings from the database
  const listings = await prisma.listing.findMany({
    where: { userId: session.user.id },
    include: { category: true, island: true },
    orderBy: { createdAt: 'desc' }
  });

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      listing: {
        include: { category: true, island: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="section">
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>My Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Welcome back, {session.user.name || session.user.email}!</p>
          </div>
          <Link href="/add-listing">
            <Button variant="primary">+ Add New Listing</Button>
          </Link>
        </div>

        <div className="dashboard-grid">
          {/* Sidebar Menu */}
          <Card style={{ padding: '2rem 1.5rem', alignSelf: 'start' }}>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0, margin: 0 }}>
              <li>
                <Link href="/dashboard" style={{ display: 'block', padding: '0.5rem', fontWeight: 600, color: 'var(--primary-color)' }}>My Listings</Link>
              </li>
              <li>
                <Link href="/dashboard/inbox" style={{ display: 'block', padding: '0.5rem', color: 'var(--text-muted)' }}>Inbox</Link>
              </li>
              <li>
                <a href="#" style={{ display: 'block', padding: '0.5rem', color: 'var(--text-muted)' }}>Analytics</a>
              </li>
              <li>
                <a href="#" style={{ display: 'block', padding: '0.5rem', color: 'var(--text-muted)' }}>Account Settings</a>
              </li>
              <li>
                <a href="/api/auth/signout" style={{ display: 'block', padding: '0.5rem', color: 'red', marginTop: '1rem' }}>Log Out</a>
              </li>
            </ul>
          </Card>

          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            
            {/* Active Listings */}
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Active Listings ({listings.length})</h2>
              
              {listings.length === 0 ? (
                <Card style={{ padding: '3rem', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>You don't have any listings yet.</p>
                  <Link href="/add-listing">
                    <Button variant="primary">Create Your First Listing</Button>
                  </Link>
                </Card>
              ) : (
                listings.map(listing => (
                  <Card key={listing.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '80px', height: '60px', backgroundColor: '#e2e8f0', borderRadius: 'var(--radius-sm)' }}>
                        {listing.image && <img src={listing.image} alt={listing.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h4 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', marginTop: 0 }}>{listing.name}</h4>
                          {listing.isPremium && (
                            <span style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.15rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                              Premium
                            </span>
                          )}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                          {listing.category?.name || 'Uncategorized'} • {listing.island?.name || 'Unknown Location'}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {!listing.isPremium && (
                        <Button variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                          Upgrade
                        </Button>
                      )}
                      <Link href={`/dashboard/edit/${listing.id}`}>
                        <Button variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Edit</Button>
                      </Link>
                      <Link href={`/${listing.island?.slug || 'all'}/${listing.id}`}>
                        <Button variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>View Public</Button>
                      </Link>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Favorites */}
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Saved Favorites ({favorites.length})</h2>
              
              {favorites.length === 0 ? (
                <Card style={{ padding: '3rem', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>You haven't saved any listings to your favorites yet.</p>
                  <Link href="/all">
                    <Button variant="secondary">Browse Listings</Button>
                  </Link>
                </Card>
              ) : (
                favorites.map(favorite => {
                  const listing = favorite.listing;
                  return (
                    <Card key={listing.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '80px', height: '60px', backgroundColor: '#e2e8f0', borderRadius: 'var(--radius-sm)' }}>
                          {listing.image && <img src={listing.image} alt={listing.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', marginTop: 0 }}>{listing.name}</h4>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            {listing.category?.name || 'Uncategorized'} • {listing.island?.name || 'Unknown Location'}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link href={`/${listing.island?.slug || 'all'}/${listing.id}`}>
                          <Button variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>View Public</Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

```

## File: src/app/globals.css
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;600;700;800&display=swap');

:root {
  /* Color Palette */
  --primary-color: #3b82f6; /* Blue for trust/action */
  --primary-hover: #2563eb;
  --secondary-color: #10b981; /* Green for growth/eco */
  --accent-color: #f59e0b; /* Orange for attention/island vibe */
  
  /* Backgrounds */
  --bg-color: #f8fafc;
  --bg-card: #ffffff;
  --bg-nav: rgba(255, 255, 255, 0.8);
  
  /* Text */
  --text-main: #0f172a;
  --text-muted: #64748b;
  --text-light: #ffffff;
  
  /* Borders */
  --border-color: #e2e8f0;
  
  /* Typography */
  --font-body: 'Inter', sans-serif;
  --font-heading: 'Outfit', sans-serif;
  
  /* Spacing & Sizes */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-pill: 9999px;
  
  /* Shadows & Effects */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --glass-effect: blur(12px);
  
  /* Animations */
  --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #0f172a;
    --bg-card: #1e293b;
    --bg-nav: rgba(15, 23, 42, 0.8);
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --border-color: #334155;
    
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.2);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
    --shadow-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  }
}

/* Base Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: var(--font-body);
  scroll-behavior: smooth;
  height: 100%;
}

body {
  background-color: var(--bg-color);
  color: var(--text-main);
  line-height: 1.6;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--primary-hover);
}

/* Layout Classes */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section {
  padding: 4rem 0;
}

/* Components */
.card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.glass-nav {
  background: var(--bg-nav);
  backdrop-filter: var(--glass-effect);
  -webkit-backdrop-filter: var(--glass-effect);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-pill);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: none;
  outline: none;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.23);
  color: white;
}

.btn-secondary {
  background-color: transparent;
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--bg-card);
  border-color: var(--text-main);
  transform: translateY(-2px);
}

/* Forms */
.input-group {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-muted);
}

.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-card);
  color: var(--text-main);
  font-family: var(--font-body);
  font-size: 1rem;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.input-field:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Micro-animations */
.fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card:hover .island-bg {
  transform: scale(1.05);
}

/* Tabs */
.tab-list {
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
}

.tab-btn {
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-muted);
  cursor: pointer;
  position: relative;
  transition: color var(--transition-fast);
}

.tab-btn:hover {
  color: var(--text-main);
}

.tab-active {
  color: var(--primary-color);
}

.tab-active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--primary-color);
  border-radius: 2px 2px 0 0;
}

/* Badges */
.badge-unread {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  padding: 0 6px;
  margin-left: 0.5rem;
}

/* Responsive Layouts */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
}

.island-page-grid {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

.business-card-layout {
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  flex-direction: row;
}

.business-card-image {
  width: 200px;
  height: 150px;
}

@media (max-width: 768px) {
  .dashboard-grid,
  .island-page-grid {
    grid-template-columns: 1fr;
  }
  
  .business-card-layout {
    flex-direction: column;
    gap: 1rem;
  }

  .business-card-image {
    width: 100%;
    height: 200px;
  }
  
  .section {
    padding: 2rem 0;
  }
  
  h1 {
    font-size: 2rem !important;
  }
  
  .container {
    padding: 0 1rem;
  }

  .nav-container {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem !important;
  }
}

```

## File: src/app/layout.tsx
```tsx
import type { Metadata, Viewport } from 'next';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0a',
};

export const metadata: Metadata = {
  title: 'Samui Services - The Premier Service Directory',
  description: 'Find the best local services, construction, delivery, and more in Koh Samui, Phangan, and Tao.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Samui Services',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

```

## File: src/app/listing/[id]/page.tsx
```tsx
import { notFound } from 'next/navigation';
import { getBusinessById } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ReviewForm } from '@/components/features/ReviewForm';
import { MessageForm } from '@/components/features/MessageForm';
import { ClaimButton } from '@/components/features/ClaimButton';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const business = await getBusinessById(id);
  if (!business) return { title: 'Not Found' };
  
  return {
    title: `${business.name} | ${business.category.name} in ${business.island.name}`,
    description: business.description,
  };
}

export default async function BusinessDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const business = await getBusinessById(id);
  
  if (!business) {
    notFound();
  }

  // Schema.org JSON-LD for LocalBusiness
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    image: business.image,
    telephone: business.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.island.name,
      addressRegion: 'Surat Thani',
      addressCountry: 'TH'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: business.averageRating,
      reviewCount: business.reviewCount
    },
    description: business.description
  };

  return (
    <div>
      {/* Inject JSON-LD into the head for Google and AI agents */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Image */}
      <div style={{ width: '100%', height: '400px', backgroundImage: `url(${business.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-color) 0%, transparent 100%)' }}></div>
      </div>

      <div className="container" style={{ marginTop: '-100px', position: 'relative', zIndex: 10, paddingBottom: '4rem' }}>
        {!business.isClaimed && <ClaimButton listingId={business.id} />}
        <Card style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
            
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ color: 'var(--primary-color)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>
                {business.category.name} • {business.island.name}
              </div>
              <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{business.name}</h1>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.25rem', marginBottom: '2rem' }}>
                <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>★ {business.averageRating}</span>
                <span style={{ color: 'var(--text-muted)' }}>({business.reviewCount} verified reviews)</span>
              </div>
              
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>About this business</h3>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {business.description}
              </p>
            </div>
            
            <div style={{ width: '350px', background: 'var(--bg-color)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Contact Info</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Phone Number</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 500 }}>{business.phone}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Location</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 500 }}>{business.address}</div>
                </div>
                <MessageForm receiverId={business.userId} listingId={business.id} />
              </div>
            </div>
            
            
          </div>
        </Card>

        {/* Reviews Section */}
        <div style={{ marginTop: '2rem' }}>
          <Card style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Reviews</h2>
            
            <ReviewForm listingId={business.id} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {business.reviews && business.reviews.length > 0 ? (
                business.reviews.map(review => (
                  <div key={review.id} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '50%', overflow: 'hidden' }}>
                        {review.user?.image ? (
                          <img src={review.user.image} alt={review.user.name || 'User'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                            {(review.user?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{review.user?.name || 'Anonymous User'}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ marginLeft: 'auto', color: 'var(--accent-color)' }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p style={{ margin: 0, lineHeight: 1.6 }}>{review.comment}</p>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>
                  No reviews yet. Be the first to review this business!
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}

```

## File: src/app/page.module.css
```css
.page {
  --background: #fafafa;
  --foreground: #fff;

  --text-primary: #000;
  --text-secondary: #666;

  --button-primary-hover: #383838;
  --button-secondary-hover: #f2f2f2;
  --button-secondary-border: #ebebeb;

  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: var(--font-geist-sans);
  background-color: var(--background);
}

.main {
  display: flex;
  flex: 1;
  width: 100%;
  max-width: 800px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  background-color: var(--foreground);
  padding: 120px 60px;
}

.intro {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 24px;
}

.intro h1 {
  max-width: 320px;
  font-size: 40px;
  font-weight: 600;
  line-height: 48px;
  letter-spacing: -2.4px;
  text-wrap: balance;
  color: var(--text-primary);
}

.intro p {
  max-width: 440px;
  font-size: 18px;
  line-height: 32px;
  text-wrap: balance;
  color: var(--text-secondary);
}

.intro a {
  font-weight: 500;
  color: var(--text-primary);
}

.ctas {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 440px;
  gap: 16px;
  font-size: 14px;
}

.ctas a {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  border-radius: 128px;
  border: 1px solid transparent;
  transition: 0.2s;
  cursor: pointer;
  width: fit-content;
  font-weight: 500;
}

a.primary {
  background: var(--text-primary);
  color: var(--background);
  gap: 8px;
}

a.secondary {
  border-color: var(--button-secondary-border);
}

/* Enable hover only on non-touch devices */
@media (hover: hover) and (pointer: fine) {
  a.primary:hover {
    background: var(--button-primary-hover);
    border-color: transparent;
  }

  a.secondary:hover {
    background: var(--button-secondary-hover);
    border-color: transparent;
  }
}

@media (max-width: 600px) {
  .main {
    padding: 48px 24px;
  }

  .intro {
    gap: 16px;
  }

  .intro h1 {
    font-size: 32px;
    line-height: 40px;
    letter-spacing: -1.92px;
  }
}

@media (prefers-color-scheme: dark) {
  .logo {
    filter: invert();
  }

  .page {
    --background: #000;
    --foreground: #000;

    --text-primary: #ededed;
    --text-secondary: #999;

    --button-primary-hover: #ccc;
    --button-secondary-hover: #1a1a1a;
    --button-secondary-border: #1a1a1a;
  }
}

```

## File: src/app/page.test.tsx
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BusinessCard } from '../components/features/BusinessCard'
import { Business } from '@/lib/db'

const mockBusiness: any = {
  id: 'test-1',
  name: 'Test Business',
  category: { id: 'cat-1', name: 'construction' },
  island: { id: 'isl-1', name: 'koh-samui' },
  averageRating: 4.5,
  reviewCount: 10,
  image: 'https://example.com/image.jpg',
  description: 'A test business description.'
}

describe('BusinessCard Integration', () => {
  it('renders business information correctly', () => {
    render(<BusinessCard business={mockBusiness} />)
    
    // Check main details
    expect(screen.getByText('Test Business')).toBeInTheDocument()
    
    // Check badges/meta
    expect(screen.getByText(/4\.5/)).toBeInTheDocument()
    expect(screen.getByText(/\(10 reviews\)/i)).toBeInTheDocument()
    expect(screen.getByText(/construction/i)).toBeInTheDocument()
    
    // Check link
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/listing/test-1')
  })
})

```

## File: src/app/page.tsx
```tsx
import Link from 'next/link';
import { getAllCategories, getBusinessesByIsland, getAllIslands } from '@/lib/db';
import { HeroSearch } from '@/components/features/HeroSearch';
import { Button } from '@/components/ui/Button';
import { ServiceFilter } from '@/components/features/ServiceFilter';
import { ListingCard } from '@/components/features/ListingCard';
import { IslandCard } from '@/components/features/IslandCard';
import DynamicMap from '@/components/features/DynamicMap';

export default async function Home(props: { searchParams?: Promise<{ category?: string, view?: string }> }) {
  const searchParams = await props.searchParams;
  const categorySlug = searchParams?.category;
  
  const categories = await getAllCategories();
  
  // Fetch listings based on filter. 
  const categoryFilter = categorySlug ? [categorySlug] : undefined;
  const allListings = await getBusinessesByIsland('all', categoryFilter);
  
  const listings = allListings.slice(0, 12);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        backgroundImage: 'url("https://images.unsplash.com/photo-1516815231560-8f41ec531527?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white',
        overflow: 'hidden',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 1.5rem 3rem 1.5rem'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.2) 100%)', zIndex: 1 }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%', maxWidth: '800px' }}>
          <h1 className="fade-in-up" style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1rem', textShadow: '0 2px 10px rgba(0,0,0,0.3)', fontWeight: 800 }}>
            Discover Local Services in Samui
          </h1>
          <p className="fade-in-up" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', marginBottom: '2rem', opacity: 0.9, textShadow: '0 2px 10px rgba(0,0,0,0.3)', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Find trusted professionals for everything you need on the island.
          </p>
          
          <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f8fafc' }}>
        <div className="container" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          
          {/* Left Sidebar */}
          <aside style={{ width: '250px', flexShrink: 0, position: 'sticky', top: '2rem' }}>
            <ServiceFilter categories={categories} />
          </aside>
          
          {/* Right Content */}
          <main style={{ flex: 1 }}>
            <div style={{ marginBottom: '1.5rem' }}>
               <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#0f172a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                 FEATURED SERVICES IN SAMUI
               </h2>
            </div>

            {/* Listings Content */}
            {allListings.length > 0 ? (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '1.5rem',
                animation: 'fadeInUp 0.4s ease forwards'
              }}>
                {listings.map((listing) => (
                  <ListingCard key={listing.id} business={listing} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--text-muted)', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.5 }}>🏝️</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 700 }}>No services found</h3>
                <p style={{ fontSize: '1.125rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>We couldn't find any services matching this category yet.</p>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}

```

## File: src/app/robots.ts
```ts
import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://samuiservices.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

```

## File: src/app/sitemap.ts
```ts
import { MetadataRoute } from 'next'
import { getAllIslands, getBusinessesByIsland } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://samuiservices.com'
  
  // Base routes
  const routes = [
    '',
    '/add-listing',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic Island routes
  const islands = await getAllIslands()
  const islandRoutes = islands.map((island) => ({
    url: `${baseUrl}/${island.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  // Dynamic Business routes
  const businessRoutes = []
  for (const island of islands) {
    const businesses = await getBusinessesByIsland(island.slug)
    for (const business of businesses) {
      businessRoutes.push({
        url: `${baseUrl}/listing/${business.id}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })
    }
  }

  return [...routes, ...islandRoutes, ...businessRoutes]
}

```

## File: src/components/features/BusinessCard.tsx
```tsx
import Link from 'next/link';
import { Listing, Category, Island } from '@prisma/client';
import { Card } from '@/components/ui/Card';

import { FavoriteToggle } from '@/components/features/FavoriteToggle';

type BusinessWithRelations = Listing & { category?: Category, island?: Island, isFavorited?: boolean };

interface BusinessCardProps {
  business: BusinessWithRelations;
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <div style={{ position: 'relative' }}>
      <FavoriteToggle listingId={business.id} initialIsFavorited={!!business.isFavorited} />
      <Link href={`/listing/${business.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card 
        style={{ 
          border: business.isPremium ? '2px solid #fbbf24' : undefined,
          boxShadow: business.isPremium ? '0 4px 15px rgba(251, 191, 36, 0.2)' : undefined,
        }} 
        className="card business-card-layout"
      >
        <div 
          className="business-card-image"
          style={{ 
          backgroundImage: `url(${business.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          flexShrink: 0,
          borderRadius: 'var(--radius-md)'
        }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <div style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {business.category?.name || 'Uncategorized'} • {business.island?.name || 'Unknown Location'}
            </div>
            {business.isPremium && (
              <span style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                Premium
              </span>
            )}
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', marginTop: 0 }}>{business.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--accent-color)' }}>★ {business.averageRating}</span>
            <span>({business.reviewCount} reviews)</span>
          </div>
        </div>
      </Card>
    </Link>
    </div>
  );
}

```

## File: src/components/features/ClaimButton.test.tsx
```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ClaimButton } from './ClaimButton';
import * as claimActions from '@/app/actions/claim';

// Mock the server action
vi.mock('@/app/actions/claim', () => ({
  submitClaimRequest: vi.fn(),
}));

describe('ClaimButton', () => {
  it('renders the claim button and description', () => {
    render(<ClaimButton listingId="test-123" />);
    expect(screen.getByText('Are you the owner of this business?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Claim Business' })).toBeInTheDocument();
  });

  it('shows submitting state when clicked', async () => {
    // Mock the action to never resolve so we can see the loading state
    vi.mocked(claimActions.submitClaimRequest).mockImplementation(() => new Promise(() => {}));
    
    render(<ClaimButton listingId="test-123" />);
    const button = screen.getByRole('button', { name: 'Claim Business' });
    
    fireEvent.submit(screen.getByRole('button', { name: 'Claim Business' }).closest('form')!);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submitting...' })).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  it('shows success message on successful claim', async () => {
    vi.mocked(claimActions.submitClaimRequest).mockResolvedValue({ success: true });
    
    render(<ClaimButton listingId="test-123" />);
    
    fireEvent.submit(screen.getByRole('button', { name: 'Claim Business' }).closest('form')!);
    
    await waitFor(() => {
      expect(screen.getByText(/Request Submitted!/)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Claim Business' })).not.toBeInTheDocument();
    });
  });

  it('shows error message on failure', async () => {
    vi.mocked(claimActions.submitClaimRequest).mockResolvedValue({ error: 'Failed to claim' });
    
    render(<ClaimButton listingId="test-123" />);
    
    fireEvent.submit(screen.getByRole('button', { name: 'Claim Business' }).closest('form')!);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to claim')).toBeInTheDocument();
      // Button should reset
      expect(screen.getByRole('button', { name: 'Claim Business' })).not.toBeDisabled();
    });
  });
});

```

## File: src/components/features/ClaimButton.tsx
```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { submitClaimRequest } from '@/app/actions/claim';

export function ClaimButton({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleClaim(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const result = await submitClaimRequest(formData);
    
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #10b981', textAlign: 'center', marginTop: '1rem' }}>
        <strong>Request Submitted!</strong> Our team will review your claim and contact you shortly.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#b45309' }}>Are you the owner of this business?</h3>
        <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem' }}>Claim this listing to update photos, respond to reviews, and manage your details.</p>
      </div>
      <form onSubmit={handleClaim} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input type="hidden" name="listingId" value={listingId} />
        <Button variant="primary" type="submit" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
          {loading ? 'Submitting...' : 'Claim Business'}
        </Button>
        {error && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{error}</span>}
      </form>
    </div>
  );
}

```

## File: src/components/features/DynamicMap.tsx
```tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Leaflet map with SSR disabled
const ListingsMap = dynamic(() => import('./ListingsMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '500px', width: '100%', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
      <p style={{ color: 'var(--text-muted)' }}>Loading map...</p>
    </div>
  )
});

export default ListingsMap;

```

## File: src/components/features/FavoriteToggle.tsx
```tsx
'use client';

import { useState } from 'react';
import { toggleFavorite } from '@/app/actions/favorites';

interface FavoriteToggleProps {
  listingId: string;
  initialIsFavorited: boolean;
}

export function FavoriteToggle({ listingId, initialIsFavorited }: FavoriteToggleProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if this is inside a link
    
    if (loading) return;
    
    setLoading(true);
    
    // Optimistic update
    setIsFavorited(!isFavorited);
    
    const result = await toggleFavorite(listingId);
    
    if (result.error) {
      alert(result.error);
      setIsFavorited(isFavorited); // Revert on error
    } else if (result.isFavorited !== undefined) {
      setIsFavorited(result.isFavorited);
    }
    
    setLoading(false);
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        border: 'none',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 10,
        transition: 'transform 0.2s ease',
        transform: loading ? 'scale(0.9)' : 'scale(1)',
      }}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill={isFavorited ? "var(--accent-color)" : "none"} 
        stroke={isFavorited ? "var(--accent-color)" : "currentColor"} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>
  );
}

```

## File: src/components/features/FilterSidebar.tsx
```tsx
'use client';

import { Category } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Input } from '@/components/ui/Input';

interface FilterSidebarProps {
  categories: Category[];
}

export function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read current state from URL
  const currentCategories = searchParams.getAll('category');
  const currentQuery = searchParams.get('q') || '';

  const createQueryString = useCallback(
    (name: string, value: string, action: 'add' | 'remove' | 'set' = 'set') => {
      const params = new URLSearchParams(searchParams.toString());
      if (action === 'set') {
        if (value) params.set(name, value);
        else params.delete(name);
      } else if (action === 'add') {
        params.append(name, value);
      } else if (action === 'remove') {
        const values = params.getAll(name).filter(v => v !== value);
        params.delete(name);
        values.forEach(v => params.append(name, v));
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryChange = (slug: string, checked: boolean) => {
    const action = checked ? 'add' : 'remove';
    router.push('?' + createQueryString('category', slug, action), { scroll: false });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push('?' + createQueryString('q', e.target.value, 'set'), { scroll: false });
  };

  return (
    <aside>
      <div style={{ marginBottom: '2rem' }}>
        <Input 
          type="search" 
          placeholder="Search businesses..." 
          defaultValue={currentQuery}
          onChange={(e) => {
            // Debounce in a real app, but this is simple enough for now
            const val = e.target.value;
            setTimeout(() => {
              if (e.target.value === val) handleSearch(e);
            }, 300);
          }}
          fullWidth
        />
      </div>

      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', marginTop: 0 }}>Categories</h3>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0, margin: 0 }}>
        <li>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: currentCategories.length === 0 ? 'var(--primary-color)' : 'var(--text-main)', fontWeight: 500 }}>
            <input 
              type="checkbox" 
              checked={currentCategories.length === 0} 
              onChange={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete('category');
                router.push('?' + params.toString(), { scroll: false });
              }} 
            /> All Categories
          </label>
        </li>
        {categories.map((cat) => {
          const isChecked = currentCategories.includes(cat.slug);
          return (
            <li key={cat.slug}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: isChecked ? 'var(--primary-color)' : 'var(--text-muted)' }}>
                <input 
                  type="checkbox" 
                  checked={isChecked}
                  onChange={(e) => handleCategoryChange(cat.slug, e.target.checked)}
                /> {cat.name}
              </label>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

```

## File: src/components/features/HeroSearch.tsx
```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function HeroSearch() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Samui');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/all?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/all');
    }
  };

  return (
    <form onSubmit={handleSearch} className="fade-in-up" style={{ 
      animationDelay: '0.2s',
      maxWidth: '800px', 
      margin: '0 auto', 
      background: 'white',
      padding: '0.35rem', 
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0.5rem 1rem' }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for services (e.g., Plumbers, Deliveries, Construction)..." 
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            fontSize: '1rem',
            color: '#334155',
            backgroundColor: 'transparent'
          }}
          className="hero-search-input"
        />
        <span style={{ color: '#94a3b8', fontSize: '1.25rem', cursor: 'pointer' }}>⌕</span>
      </div>
      
      <div style={{ width: '1px', height: '30px', backgroundColor: '#e2e8f0', margin: '0 0.5rem' }}></div>
      
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', color: '#334155', fontWeight: 600 }}>
        <span style={{ color: '#64748b', marginRight: '0.5rem', fontSize: '1.1rem' }}>📍</span>
        <select style={{ 
          border: 'none', 
          outline: 'none', 
          background: 'transparent', 
          fontWeight: 600, 
          color: '#334155',
          fontSize: '0.95rem',
          cursor: 'pointer',
          WebkitAppearance: 'none',
          paddingRight: '1rem',
          backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23334155%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          backgroundSize: '10px auto'
        }}>
          <option>Samui</option>
          <option>Phangan</option>
          <option>Tao</option>
        </select>
      </div>
      
      <button type="submit" style={{ 
        padding: '0.75rem 1.5rem', 
        fontSize: '0.95rem', 
        borderRadius: '6px',
        background: '#06b6d4',
        color: 'white',
        border: 'none',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background 0.2s ease-in-out',
        marginLeft: '0.5rem'
      }}>
        Find Services
      </button>
      <style>{`
        .hero-search-input::placeholder {
          color: #94a3b8;
        }
      `}</style>
    </form>
  );
}

```

## File: src/components/features/InboxView.tsx
```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { markAsRead, sendMessage } from '@/app/actions/messages';

type MessageWithDetails = {
  id: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
  listingId: string | null;
  senderId: string;
  receiverId: string;
  sender?: { name: string | null; image: string | null } | null;
  receiver?: { name: string | null; image: string | null } | null;
  listing?: { 
    id: string; 
    name: string; 
    island: { slug: string; name: string } 
  } | null;
};

interface InboxViewProps {
  receivedMessages: MessageWithDetails[];
  sentMessages: MessageWithDetails[];
  currentUserId: string;
}

export function InboxView({ receivedMessages, sentMessages, currentUserId }: InboxViewProps) {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [readState, setReadState] = useState<Record<string, boolean>>({});

  const unreadCount = receivedMessages.filter(m => !m.isRead && !readState[m.id]).length;

  const handleExpandMessage = async (message: MessageWithDetails) => {
    // Only mark as read if it's received and currently unread
    if (activeTab === 'received' && !message.isRead && !readState[message.id]) {
      setReadState(prev => ({ ...prev, [message.id]: true }));
      await markAsRead(message.id);
    }
    
    // Toggle reply form
    if (replyingTo === message.id) {
      setReplyingTo(null);
    } else {
      setReplyingTo(message.id);
      setReplyContent('');
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, message: MessageWithDetails) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('receiverId', message.senderId);
    if (message.listingId) {
      formData.append('listingId', message.listingId);
    }
    formData.append('content', replyContent);
    
    const result = await sendMessage(formData);
    
    setIsSubmitting(false);
    
    if (result.success) {
      setReplyingTo(null);
      setReplyContent('');
      // Server action revalidates the path, so messages list updates automatically
      alert('Reply sent successfully!');
    } else {
      alert(result.error || 'Failed to send reply');
    }
  };

  const renderMessageCard = (message: MessageWithDetails, isReceived: boolean) => {
    const otherParty = isReceived ? message.sender : message.receiver;
    const isMessageUnread = isReceived && !message.isRead && !readState[message.id];

    return (
      <Card key={message.id} style={{ padding: '1.5rem', borderLeft: isMessageUnread ? '4px solid var(--primary-color)' : '1px solid var(--border-color)' }} className="fade-in-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#e2e8f0', borderRadius: '50%', overflow: 'hidden' }}>
              {otherParty?.image ? (
                <img src={otherParty.image} alt={otherParty.name || 'User'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  {(otherParty?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div style={{ fontWeight: isMessageUnread ? 700 : 600 }}>
                {isReceived ? (otherParty?.name || 'Anonymous User') : `To: ${otherParty?.name || 'User'}`}
                {isMessageUnread && <span style={{ marginLeft: '8px', width: '8px', height: '8px', backgroundColor: 'var(--primary-color)', borderRadius: '50%', display: 'inline-block' }}></span>}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {new Date(message.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
          {message.listing && (
            <Link href={`/${message.listing.island?.slug || 'all'}/${message.listing.id}`} style={{ fontSize: '0.875rem', color: 'var(--primary-color)' }}>
              Re: {message.listing.name}
            </Link>
          )}
        </div>
        
        <p style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)', fontWeight: isMessageUnread ? 500 : 400 }}>
          {message.content}
        </p>

        {isReceived && (
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <Button variant="secondary" onClick={() => handleExpandMessage(message)}>
              {replyingTo === message.id ? 'Cancel Reply' : 'Reply'}
            </Button>
          </div>
        )}

        {replyingTo === message.id && isReceived && (
          <form onSubmit={(e) => handleReplySubmit(e, message)} style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type your reply..."
              required
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontFamily: 'inherit',
                resize: 'vertical',
                marginBottom: '0.75rem'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <Button type="button" variant="secondary" onClick={() => setReplyingTo(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Reply'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    );
  };

  const activeMessages = activeTab === 'received' ? receivedMessages : sentMessages;

  return (
    <div>
      <div className="tab-list">
        <button 
          className={`tab-btn ${activeTab === 'received' ? 'tab-active' : ''}`}
          onClick={() => { setActiveTab('received'); setReplyingTo(null); }}
        >
          Received
          {unreadCount > 0 && <span className="badge-unread">{unreadCount}</span>}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'sent' ? 'tab-active' : ''}`}
          onClick={() => { setActiveTab('sent'); setReplyingTo(null); }}
        >
          Sent
        </button>
      </div>

      {activeMessages.length === 0 ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            {activeTab === 'received' ? "You don't have any messages yet." : "You haven't sent any messages yet."}
          </p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activeMessages.map(message => renderMessageCard(message, activeTab === 'received'))}
        </div>
      )}
    </div>
  );
}

```

## File: src/components/features/IslandCard.tsx
```tsx
import Link from 'next/link';
import { Island } from '@prisma/client';

interface IslandCardProps {
  island: Island;
}

export function IslandCard({ island }: IslandCardProps) {
  // Use specific images based on the island slug for better visual appeal
  const islandImages: Record<string, string> = {
    'koh-samui': 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'koh-phangan': 'https://images.unsplash.com/photo-1588636184966-2679c13b190c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'koh-tao': 'https://images.unsplash.com/photo-1544917571-067cd1ee2351?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };

  const imageUrl = islandImages[island.slug] || 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  return (
    <Link href={`/${island.slug}`} style={{ textDecoration: 'none' }} className="island-card-link">
      <div 
        style={{ 
          height: '280px',
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div 
          style={{ 
            height: '100%',
            width: '100%',
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="island-bg"
        ></div>
        
        {/* Gradient Overlay */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.2) 50%, transparent 100%)',
          zIndex: 1,
          transition: 'background 0.3s ease'
        }} className="island-overlay"></div>

        <div style={{ 
          position: 'absolute', 
          bottom: '0', 
          left: '0', 
          padding: '2rem', 
          color: 'white',
          zIndex: 2,
          width: '100%'
        }}>
          <h3 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 800, 
            marginBottom: '0.25rem', 
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            transition: 'transform 0.3s ease'
          }} className="island-title">
            {island.name}
          </h3>
          <p style={{ 
            opacity: 0.9, 
            fontSize: '1rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            transform: 'translateY(10px)',
            transition: 'all 0.3s ease',
            color: '#e2e8f0'
          }} className="island-subtitle">
            Explore Directory <span style={{ transition: 'transform 0.3s ease' }} className="island-arrow">→</span>
          </p>
        </div>
      </div>
      <style>{`
        .island-card-link:hover .island-bg {
          transform: scale(1.1);
        }
        .island-card-link:hover .island-overlay {
          background: linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.3) 60%, transparent 100%);
        }
        .island-card-link:hover .island-title {
          transform: translateY(-4px);
        }
        .island-card-link:hover .island-subtitle {
          transform: translateY(0);
          opacity: 1;
        }
        .island-card-link:hover .island-arrow {
          transform: translateX(4px);
        }
      `}</style>
    </Link>
  );
}

```

## File: src/components/features/ListingCard.tsx
```tsx
import Link from 'next/link';
import { Listing, Category, Island } from '@prisma/client';
import { Card } from '@/components/ui/Card';
import { FavoriteToggle } from '@/components/features/FavoriteToggle';

type BusinessWithRelations = Listing & { category?: Category, island?: Island, isFavorited?: boolean };

interface ListingCardProps {
  business: BusinessWithRelations;
}

export function ListingCard({ business }: ListingCardProps) {
  return (
    <div style={{ position: 'relative', height: '100%' }} className="listing-card-container">
      <FavoriteToggle listingId={business.id} initialIsFavorited={!!business.isFavorited} />
      <Link href={`/listing/${business.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
        <Card 
          style={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: 'none',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            padding: 0,
            borderRadius: '16px',
            backgroundColor: '#ffffff'
          }} 
        >
          <div style={{ position: 'relative', height: '160px', width: '100%', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%',
                width: '100%',
                backgroundImage: `url(${business.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
              }}
            ></div>
            
            {/* Category Badge */}
            <span style={{ 
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              backgroundColor: 'rgba(0, 0, 0, 0.5)', 
              color: 'white', 
              fontSize: '0.75rem', 
              padding: '0.2rem 0.6rem', 
              borderRadius: '9999px', 
              zIndex: 2,
            }}>
              {business.category?.name || 'Uncategorized'}
            </span>
          </div>

          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Title and Rating Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#0f172a', fontWeight: 800 }}>
                {business.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.85rem', fontWeight: 700 }}>
                {business.averageRating.toFixed(1)} <span style={{ color: '#facc15' }}>★</span>
              </div>
            </div>
            
            {/* Provider Name */}
            <div style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
              Provider Name
            </div>

            {/* Location and Reviews */}
            <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ color: '#94a3b8' }}>📍</span> Samui - {business.reviewCount} reviews
            </div>
            
            {/* Price */}
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
              from 800 THB/hr
            </div>

            {/* Button */}
            <div style={{ marginTop: 'auto' }}>
              <button 
                style={{ 
                  width: '100%', 
                  fontSize: '0.8rem', 
                  padding: '0.6rem 1rem',
                  backgroundColor: '#06b6d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                VIEW PROFILE
              </button>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}

```

## File: src/components/features/ListingsMap.tsx
```tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Listing, Category } from '@prisma/client';
import Link from 'next/link';

// Fix for default marker icons in Leaflet with Webpack/Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type BusinessWithRelations = Listing & { category?: Category };

interface ListingsMapProps {
  businesses: BusinessWithRelations[];
  center?: [number, number]; // [lat, lng]
  zoom?: number;
}

export default function ListingsMap({ businesses, center = [9.5120, 100.0136], zoom = 11 }: ListingsMapProps) {
  // Center defaults to Koh Samui
  
  // Filter out businesses without coordinates
  const markers = businesses.filter(b => b.lat && b.lng);

  return (
    <div style={{ height: '500px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((business) => (
          <Marker 
            key={business.id} 
            position={[business.lat!, business.lng!]} 
            icon={icon}
          >
            <Popup>
              <div style={{ padding: '0.5rem', minWidth: '200px' }}>
                {business.image && (
                  <img src={business.image} alt={business.name} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.5rem' }} />
                )}
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{business.name}</h4>
                <div style={{ color: 'var(--primary-color)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {business.category?.name || 'Uncategorized'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--accent-color)' }}>★ {business.averageRating.toFixed(1)}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({business.reviewCount})</span>
                </div>
                <Link href={`/listing/${business.id}`} style={{ display: 'block', textAlign: 'center', backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.4rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem' }}>
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

```

## File: src/components/features/MessageForm.tsx
```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { sendMessage } from '@/app/actions/messages';

interface MessageFormProps {
  receiverId: string;
  listingId?: string;
}

export function MessageForm({ receiverId, listingId }: MessageFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    formData.append('receiverId', receiverId);
    if (listingId) {
      formData.append('listingId', listingId);
    }
    
    const result = await sendMessage(formData);
    
    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => {
        setSuccess(false);
        setShowForm(false);
      }, 3000);
    }
    
    setLoading(false);
  };

  if (!showForm) {
    return (
      <Button 
        fullWidth 
        style={{ marginTop: '1rem', padding: '1rem' }}
        onClick={() => setShowForm(true)}
      >
        Message Business
      </Button>
    );
  }

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#f8fafc' }}>
      <h4 style={{ marginBottom: '0.75rem', marginTop: 0, fontSize: '1rem' }}>Send a Message</h4>
      
      {success ? (
        <div style={{ padding: '1rem', backgroundColor: '#ecfdf5', color: '#065f46', borderRadius: 'var(--radius-sm)' }}>
          Message sent successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <textarea 
            name="content" 
            required 
            rows={3}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            placeholder="Type your message here..."
          />

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

```

## File: src/components/features/ReviewForm.tsx
```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { submitReview } from '@/app/actions/reviews';

interface ReviewFormProps {
  listingId: string;
}

export function ReviewForm({ listingId }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    formData.append('rating', rating.toString());
    formData.append('listingId', listingId);
    
    const result = await submitReview(formData);
    
    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ padding: '1.5rem', backgroundColor: '#ecfdf5', color: '#065f46', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
        Thank you for submitting your review!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Leave a Review</h3>
      
      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      )}

      <div>
        <div style={{ marginBottom: '0.5rem' }}>Rating</div>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: star <= rating ? 'var(--accent-color)' : '#d1d5db'
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" style={{ display: 'block', marginBottom: '0.5rem' }}>Comment</label>
        <textarea 
          id="comment"
          name="comment" 
          required 
          rows={4}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            fontFamily: 'inherit'
          }}
          placeholder="Share your experience..."
        />
      </div>

      <Button type="submit" variant="primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}

```

## File: src/components/features/ServiceFilter.tsx
```tsx
'use client';

import { Category } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface ServiceFilterProps {
  categories: Category[];
}

export function ServiceFilter({ categories }: ServiceFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSelect = (slug: string) => {
    const isCurrentlyActive = activeCategory === slug;
    router.push(`/?${createQueryString('category', isCurrentlyActive ? '' : slug)}`, { scroll: false });
  };

  return (
    <div style={{ width: '100%', paddingRight: '1rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a' }}>Categories</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {categories.map(cat => {
            const isActive = activeCategory === cat.slug;
            return (
              <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', color: '#334155' }}>
                <input 
                  type="checkbox" 
                  checked={isActive}
                  onChange={() => handleSelect(cat.slug)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#06b6d4', borderRadius: '4px' }} 
                /> 
                {cat.name}
              </label>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
         <h3 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a' }}>Location</h3>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#334155' }}>
            {['Chaweng', 'Lamai', 'Bophut', 'Maenam', 'Nathon'].map(loc => (
              <label key={loc} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                 <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#06b6d4', borderRadius: '4px' }} /> {loc}
              </label>
            ))}
         </div>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
         <h3 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a' }}>Rating</h3>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#334155' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
               <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#06b6d4', borderRadius: '4px' }} /> 
               <span style={{ color: '#facc15' }}>★★★★★</span> & Up <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '0.8rem' }}>(120)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
               <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#06b6d4', borderRadius: '4px' }} /> 
               <span style={{ color: '#facc15' }}>★★★★</span><span style={{ color: '#cbd5e1' }}>★</span> <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '0.8rem' }}>(98)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
               <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#06b6d4', borderRadius: '4px' }} /> 
               <span style={{ color: '#facc15' }}>★★★</span><span style={{ color: '#cbd5e1' }}>★★</span> <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '0.8rem' }}>(45)</span>
            </label>
         </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
         <h3 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0f172a' }}>Price</h3>
         <div style={{ display: 'flex', alignItems: 'center', height: '24px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #cbd5e1', background: 'white', zIndex: 2 }}></div>
            <div style={{ flex: 1, height: '4px', background: '#06b6d4', margin: '0 -2px', zIndex: 1 }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #cbd5e1', background: 'white', zIndex: 2 }}></div>
         </div>
      </div>
      
    </div>
  );
}

```

## File: src/components/layout/Footer.tsx
```tsx
export function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--bg-card)', padding: '2rem 0', borderTop: '1px solid var(--border-color)', marginTop: '4rem' }}>
      <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Samui Services. All rights reserved.</p>
      </div>
    </footer>
  );
}

```

## File: src/components/layout/Navbar.tsx
```tsx
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="glass-nav">
      <div className="container nav-container" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--primary-color)' }}>
          Samui Services
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {session ? (
            <Link href="/dashboard">
              <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {session.user?.image && <img src={session.user.image} alt="Avatar" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />}
                Dashboard
              </button>
            </Link>
          ) : (
            <Link href="/dashboard">
              <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Login</button>
            </Link>
          )}
          <Link href="/add-listing">
            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Add Business</button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

```

## File: src/components/ui/Button.test.tsx
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('btn', 'btn-primary') // default variant
  })

  it('applies the secondary variant class', () => {
    render(<Button variant="secondary">Cancel</Button>)
    const button = screen.getByRole('button', { name: /cancel/i })
    
    expect(button).toHaveClass('btn-secondary')
  })

  it('applies fullWidth style when fullWidth is true', () => {
    render(<Button fullWidth>Block Button</Button>)
    const button = screen.getByRole('button', { name: /block button/i })
    
    expect(button).toHaveStyle({ width: '100%' })
  })

  it('handles onClick events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Clickable</Button>)
    const button = screen.getByRole('button', { name: /clickable/i })
    
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('passes additional props to the button element', () => {
    render(<Button disabled data-testid="custom-btn">Disabled</Button>)
    const button = screen.getByTestId('custom-btn')
    
    expect(button).toBeDisabled()
  })
})

```

## File: src/components/ui/Button.tsx
```tsx
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  style = {},
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyle = fullWidth ? { width: '100%', ...style } : style;
  
  return (
    <button 
      className={`btn btn-${variant} ${className}`}
      style={baseStyle}
      {...props}
    >
      {children}
    </button>
  );
}

```

## File: src/components/ui/Card.tsx
```tsx
import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = '', style = {}, ...props }: CardProps) {
  return (
    <div 
      className={`card ${className}`} 
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

```

## File: src/components/ui/Input.tsx
```tsx
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Input({ 
  label, 
  error, 
  fullWidth = false, 
  style = {},
  className = '',
  ...props 
}: InputProps) {
  const baseStyle = fullWidth ? { width: '100%', ...style } : style;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.875rem' }}>
          {label}
        </label>
      )}
      <input 
        className={`input-field ${className}`}
        style={{
          ...baseStyle,
          borderColor: error ? 'var(--error-color, #ef4444)' : 'var(--border-color)',
        }}
        {...props}
      />
      {error && (
        <span style={{ color: 'var(--error-color, #ef4444)', fontSize: '0.75rem' }}>
          {error}
        </span>
      )}
    </div>
  );
}

```

## File: src/lib/auth.ts
```ts
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { PrismaClient } from "@prisma/client"
let _prismaClient: PrismaClient | null = null;

function initPrismaClient(): PrismaClient {
  if (_prismaClient) return _prismaClient;

  if (process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_TEST_MODE === "true") {
    // Hide native modules from bundlers by using eval to prevent Cloudflare WebAssembly/Native errors
    const req = eval('require');
    const { PrismaBetterSqlite3 } = req("@prisma/adapter-better-sqlite3");
    const { PrismaClient: LocalClient } = req("@prisma/client");
    const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || "file:./dev.db" });
    _prismaClient = new LocalClient({ adapter, log: ["query"] });
  } else {
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const { env } = getCloudflareContext();
    if (!env || !env.DB) throw new Error("Cloudflare DB binding not found");
    const { PrismaD1 } = require("@prisma/adapter-d1");
    // Use the Edge client to prevent WASM compilation errors on Cloudflare
    const { PrismaClient: EdgeClient } = require("@prisma/client/edge");
    const adapter = new PrismaD1(env.DB);
    _prismaClient = new EdgeClient({ adapter, log: ["query"] });
  }
  return _prismaClient!;
}

export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    const client = initPrismaClient();
    const value = Reflect.get(client, prop);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  }
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "MOCK_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MOCK_CLIENT_SECRET",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (user.email === 'dmytro@apex-root.com') {
        try {
          await prisma.user.update({
            where: { email: 'dmytro@apex-root.com' },
            data: { role: 'ADMIN' }
          });
        } catch (e) {}
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session
    },
  },
}

if (process.env.NEXT_PUBLIC_TEST_MODE === "true" || process.env.ADMIN_TEST_PASSWORD) {
  authOptions.providers.push(
    CredentialsProvider({
      name: "Test Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password (for remote testing)", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        console.log("--- AUTHORIZE ATTEMPT ---");
        console.log("Email:", credentials.email);
        console.log("Password provided:", credentials.password ? "***" : "none");
        
        let adminPassword = process.env.ADMIN_TEST_PASSWORD;
        console.log("process.env.ADMIN_TEST_PASSWORD exists:", !!adminPassword);

        if (process.env.NODE_ENV === "production") {
          try {
            const { getCloudflareContext } = require("@opennextjs/cloudflare");
            const { env } = getCloudflareContext();
            console.log("Cloudflare env object exists:", !!env);
            console.log("env.ADMIN_TEST_PASSWORD exists:", !!env?.ADMIN_TEST_PASSWORD);
            // Always prefer runtime Cloudflare env over process.env which might be baked in
            if (env?.ADMIN_TEST_PASSWORD) {
              adminPassword = env.ADMIN_TEST_PASSWORD;
            }
          } catch (e) {
            console.error("Failed to get Cloudflare context for secrets", e);
          }
        }

        console.log("Final adminPassword set:", !!adminPassword);

        // If not in local test mode, enforce password check
        if (process.env.NEXT_PUBLIC_TEST_MODE !== "true") {
          console.log("Provided password length:", credentials.password?.length);
          console.log("Admin password length:", adminPassword?.length);
          
          if (!credentials.password || credentials.password.trim() !== adminPassword?.trim()) {
            console.log("Password mismatch! (Even after trim)");
            return null;
          }
        }
        
        console.log("Password matched or bypassed. Finding user...");
        
        let user = await prisma.user.findUnique({ where: { email: credentials.email } });
        
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: "Test User",
              role: (credentials.email.includes('admin') || credentials.email === 'dmytro@apex-root.com') ? 'ADMIN' : 'USER'
            }
          });
        } else if (credentials.email === 'dmytro@apex-root.com' && user.role !== 'ADMIN') {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { role: 'ADMIN' }
          });
        }
        return user;
      }
    })
  );
}

```

## File: src/lib/db.ts
```ts
import { prisma } from './auth';

export async function getBusinessesByIsland(islandSlug: string, categorySlugs?: string[], query?: string, currentUserId?: string) {
  const whereClause: any = {};
  
  if (islandSlug !== 'all') {
    whereClause.island = { slug: islandSlug };
  }
  
  if (categorySlugs && categorySlugs.length > 0) {
    whereClause.category = { slug: { in: categorySlugs } };
  }

  if (query) {
    whereClause.name = { contains: query };
  }

  const listings = await prisma.listing.findMany({
    where: whereClause,
    include: {
      category: true,
      island: true,
      favorites: currentUserId ? {
        where: { userId: currentUserId }
      } : false
    },
    orderBy: [
      { isPremium: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  return listings.map(listing => ({
    ...listing,
    isFavorited: listing.favorites && listing.favorites.length > 0
  }));
}

export async function getAllIslands() {
  return prisma.island.findMany();
}

export async function getAllCategories() {
  return prisma.category.findMany();
}

export async function getBusinessById(id: string) {
  return prisma.listing.findUnique({
    where: { id },
    include: {
      category: true,
      island: true,
      user: {
        select: {
          name: true,
          image: true,
          createdAt: true
        }
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
}

```

## File: src/mocks/browser.ts
```ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

```

## File: src/mocks/handlers.ts
```ts
import { http, HttpResponse } from 'msw'

// Mock Data
const mockBusinesses: any[] = [
  {
    id: '1',
    name: 'Samui Builders Pro',
    category: 'construction',
    island: 'koh-samui',
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1541888081-3677b10214c7?auto=format&fit=crop&w=800&q=80',
    description: 'Professional construction and renovation services across Koh Samui.'
  }
]

const mockIslands: any[] = [
  { name: 'Koh Samui', slug: 'koh-samui' },
  { name: 'Koh Phangan', slug: 'koh-phangan' },
  { name: 'Koh Tao', slug: 'koh-tao' }
]

const mockCategories: any[] = [
  { name: 'Construction & Repair', slug: 'construction' },
  { name: 'Cleaning Services', slug: 'cleaning' }
]

export const handlers = [
  http.get('/api/businesses', ({ request }) => {
    const url = new URL(request.url)
    const island = url.searchParams.get('island')
    const category = url.searchParams.get('category')
    
    let filtered = [...mockBusinesses]
    if (island) filtered = filtered.filter(b => b.island === island)
    if (category) filtered = filtered.filter(b => b.category === category)
      
    return HttpResponse.json(filtered)
  }),

  http.get('/api/businesses/:id', ({ params }) => {
    const business = mockBusinesses.find(b => b.id === params.id)
    if (!business) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(business)
  }),

  http.get('/api/islands', () => {
    return HttpResponse.json(mockIslands)
  }),

  http.get('/api/categories', () => {
    return HttpResponse.json(mockCategories)
  })
]

```

## File: src/mocks/server.ts
```ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

```

## File: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}

```

## File: types/next-auth.d.ts
```ts
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string
    } & DefaultSession["user"]
  }
}

```

## File: vitest.config.ts
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    exclude: ['node_modules', 'e2e/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})

```

## File: vitest.setup.ts
```ts
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})

// MSW Setup for Integration Tests
import { server } from './src/mocks/server'
import { beforeAll, afterAll } from 'vitest'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

```

## File: wrangler.jsonc
```jsonc
{
	"$schema": "node_modules/wrangler/config-schema.json",
	"main": ".open-next/worker.js",
	"name": "samuiservices",
	"compatibility_date": "2026-06-25",
	"compatibility_flags": [
		"nodejs_compat",
		"global_fetch_strictly_public"
	],
	"routes": [
		{
			"pattern": "samuiservices.com",
			"custom_domain": true
		}
	],
	"assets": {
		"directory": ".open-next/assets",
		"binding": "ASSETS"
	},
	"services": [
		{
			// Self-reference service binding, the service name must match the worker name
			// see https://opennext.js.org/cloudflare/caching
			"binding": "WORKER_SELF_REFERENCE",
			"service": "samuiservices"
		}
	],
	"r2_buckets": [
		// Use R2 incremental cache
		// See https://opennext.js.org/cloudflare/caching
		{
			"binding": "NEXT_INC_CACHE_R2_BUCKET",
			// Create the bucket before deploying
			// You can change the bucket name if you want
			// See https://developers.cloudflare.com/workers/wrangler/commands/#r2-bucket-create
			"bucket_name": "samuiservices-opennext-cache"
		}
	],
	"images": {
		// Enable image optimization
		// see https://opennext.js.org/cloudflare/howtos/image
		"binding": "IMAGES"
	},
	"d1_databases": [
		{
			"binding": "DB",
			"database_name": "samui-services-db",
			"database_id": "94aac009-4da3-4193-952a-f817eb9936e2"
		}
	],
	"observability": {
		"enabled": true,
		"head_sampling_rate": 1,
		"logs": {
			"enabled": true,
			"head_sampling_rate": 1,
			"persist": true,
			"invocation_logs": true
		},
		"traces": {
			"enabled": false,
			"persist": true,
			"head_sampling_rate": 1
		}
	}
}
```

