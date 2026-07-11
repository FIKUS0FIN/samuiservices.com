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
  console.log("Querying all resort listings...");
  const listings = await prisma.listing.findMany({
    where: {
      category: {
        slug: "resorts"
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

  console.log(`Found ${listings.length} total resorts.`);

  // Filter listings that need enrichment
  const remainingListings = listings.filter(l => {
    const isEnriched = l.description && l.description.length > 100 && !l.description.startsWith('## Top Reviews');
    return !isEnriched;
  });

  console.log(`Already enriched: ${listings.length - remainingListings.length}`);
  console.log(`Remaining to process: ${remainingListings.length}`);

  if (remainingListings.length === 0) {
    console.log("All resorts are already enriched! Exiting.");
    return;
  }

  for (let idx = 0; idx < remainingListings.length; idx++) {
    const listing = remainingListings[idx];
    console.log(`\n==================================================`);
    console.log(`[Resort ${idx + 1}/${remainingListings.length}] Processing: ${listing.name} (slug: ${listing.slug})`);
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

    // Delay between resorts to avoid rate-limiting
    console.log("Waiting 5 seconds before next resort...");
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  console.log("\nFinished processing all remaining resorts!");
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
