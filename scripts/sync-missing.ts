import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { execSync } from 'child_process';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./dev.db', authToken: process.env.TURSO_AUTH_TOKEN });
const prisma = new PrismaClient({ adapter });

async function run() {
  const categories = [
    'tattoo-studios', 'weddings-events', 'pet-services-vets', 
    'legal-visa-services', 'education-classes', 'travel-luggage', 
    'photography-media', 'beauty-health'
  ];
  
  for (const slug of categories) {
    console.log(`Fetching category ${slug} from D1...`);
    const catOutput = execSync(`npx wrangler d1 execute samui-services-db --remote --command "SELECT * FROM Category WHERE slug = '${slug}'" --json`).toString();
    const catRows = JSON.parse(catOutput)[0].results;
    
    if (catRows.length > 0) {
      const cat = catRows[0];
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, parentId: null, icon: cat.icon, order: cat.order },
        create: { id: cat.id, name: cat.name, slug: cat.slug, parentId: null, icon: cat.icon, order: cat.order }
      });
      console.log(`Synced category ${slug}`);
      
      console.log(`Fetching listings for ${slug} from D1...`);
      const listOutput = execSync(`npx wrangler d1 execute samui-services-db --remote --command "SELECT * FROM Listing WHERE categoryId = '${cat.id}'" --json`).toString();
      const listRows = JSON.parse(listOutput)[0].results;
      
      for (const row of listRows) {
        row.isPremium = Boolean(row.isPremium);
        row.isClaimed = Boolean(row.isClaimed);
        if (row.createdAt) row.createdAt = new Date(row.createdAt);
        if (row.updatedAt) row.updatedAt = new Date(row.updatedAt);
        
        row.userId = 'cmqyzwjmd0000iuxdbv41llnf';
        row.islandId = 'cmqyzwjn00001iuxd3slf0go3';
        
        await prisma.listing.upsert({
          where: { slug: row.slug },
          update: row,
          create: row
        });
      }
      console.log(`Synced ${listRows.length} listings for ${slug}`);
    }
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
