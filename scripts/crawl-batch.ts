import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { spawn } from 'child_process';

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaLibSql({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const prisma = new PrismaClient({ adapter });

async function runCommand(command: string, args: string[]): Promise<boolean> {
  return new Promise((resolve) => {
    console.log(`Executing: ${command} ${args.join(' ')}`);
    const proc = spawn(command, args, { stdio: 'inherit' });
    proc.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

async function processCategory(categorySlug: string) {
  console.log(`\n==================================================`);
  console.log(`Starting category: ${categorySlug}`);
  console.log(`==================================================\n`);

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) { 
    console.log(`Category ${categorySlug} not found in database.`); 
    return; 
  }
  
  const listings = await prisma.listing.findMany({
    where: {
      categoryId: category.id
    },
    select: { slug: true, name: true, googlePlaceId: true, updatedAt: true },
    orderBy: { name: 'asc' }
  });
  
  // Businesses that haven't been successfully enriched with the new script
  const notUpdated = listings.filter(l => !(l.updatedAt > new Date("2026-07-11T00:00:00Z") && l.googlePlaceId !== null));
  
  console.log(`Found ${notUpdated.length} total businesses to process in ${categorySlug} (out of ${listings.length} total).`);

  for (let idx = 0; idx < notUpdated.length; idx++) {
    const listing = notUpdated[idx];
    console.log(`\n--------------------------------------------------`);
    console.log(`[Category: ${categorySlug}] [Business ${idx + 1}/${notUpdated.length}] Processing: ${listing.name} (slug: ${listing.slug})`);
    console.log(`--------------------------------------------------`);

    try {
      const success = await runCommand('npx', ['tsx', 'scripts/crawl-hotels.ts', '--slug', listing.slug, '--production']);
      if (success) {
        console.log(`[SUCCESS] Finished processing: ${listing.name}`);
      } else {
        console.log(`[WARNING] Failed to process: ${listing.name} (script exited with non-zero code)`);
      }
    } catch (e: any) {
      console.error(`[ERROR] Exception processing ${listing.name}: ${e.message}`);
    }

    console.log("Waiting 5 seconds before next business...");
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  console.log(`\nFinished processing all businesses in category: ${categorySlug}!`);
}

async function main() {
  const categoriesToProcess = [
    "car-rental", "scooter-rental", "taxis", "contractors", 
    "cleaning-services", "pest-control", "real-estate", "home-garden", 
    "supermarkets", "electronics", "souvenirs", "boutiques"
  ];
  
  for (const slug of categoriesToProcess) {
    await processCategory(slug);
  }
  
  console.log(`\n🎉 FINISHED ALL CATEGORIES 🎉`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
