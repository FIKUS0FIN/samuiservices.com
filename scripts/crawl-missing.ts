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

async function main() {
  const categorySlug = "restaurants";
  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) { console.log(`Category ${categorySlug} not found`); return; }
  
  const listings = await prisma.listing.findMany({
    where: {
      categoryId: category.id
    },
    select: { slug: true, name: true, googlePlaceId: true, updatedAt: true },
    orderBy: { name: 'asc' }
  });
  
  // Businesses that haven't been successfully enriched with the new script
  const notUpdated = listings.filter(l => !(l.updatedAt > new Date("2026-07-11T00:00:00Z") && l.googlePlaceId !== null));
  
  console.log(`Found ${notUpdated.length} missing businesses to process in ${categorySlug}.`);

  for (let idx = 0; idx < notUpdated.length; idx++) {
    const listing = notUpdated[idx];
    console.log(`\n==================================================`);
    console.log(`[Business ${idx + 1}/${notUpdated.length}] Processing: ${listing.name} (slug: ${listing.slug})`);
    console.log(`==================================================`);

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

  console.log(`\nFinished processing all missing businesses in ${categorySlug}!`);
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
