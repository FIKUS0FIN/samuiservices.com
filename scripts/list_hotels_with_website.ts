import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaLibSql({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { slug: 'hotels' },
        { slug: 'accommodation-827' }
      ]
    }
  });

  const categoryIds = categories.map(c => c.id);
  const listings = await prisma.listing.findMany({
    where: { 
      categoryId: { in: categoryIds },
      website: { not: null }
    },
    select: { name: true, slug: true, website: true },
    orderBy: { name: 'asc' }
  });

  console.log(`Found ${listings.length} hotel listings with websites:`);
  console.log(JSON.stringify(listings, null, 2));
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
