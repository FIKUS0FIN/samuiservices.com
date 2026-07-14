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
  const categorySlug = process.argv[2];
  if (!categorySlug) {
    console.error("Please provide a category slug, e.g. npx tsx scripts/crawl-category.ts bars--nightlife");
    process.exit(1);
  }

  console.log(`Querying all listings for category: ${categorySlug}...`);
  const listings = await prisma.listing.findMany({
    where: {
      category: {
        slug: categorySlug
      }
    },
    select: {
      slug: true,
      name: true,
      description: true
    },
    orderBy: {
      name: 'asc'
    }
  });

  console.log(`Found ${listings.length} total businesses in ${categorySlug}.`);

  // Filter listings that need enrichment
  const remainingListings = listings.filter(l => {
    const isEnriched = l.description && l.description.length > 100 && !l.description.startsWith('## Top Reviews');
    return !isEnriched;
  });

  console.log(`Already enriched: ${listings.length - remainingListings.length}`);
  console.log(`Remaining to process: ${remainingListings.length}`);

  if (remainingListings.length === 0) {
    console.log("All businesses are already enriched! Exiting.");
    return;
  }

  for (let idx = 0; idx < remainingListings.length; idx++) {
    const listing = remainingListings[idx];
    console.log(`\n==================================================`);
    console.log(`[Business ${idx + 1}/${remainingListings.length}] Processing: ${listing.name} (slug: ${listing.slug})`);
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

    // Delay between businesses to avoid rate-limiting
    console.log("Waiting 5 seconds before next business...");
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  console.log(`\nFinished processing all remaining businesses in ${categorySlug}!`);
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
