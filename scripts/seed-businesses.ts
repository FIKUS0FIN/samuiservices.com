import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { PrismaLibSql } from "@prisma/adapter-libsql"

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaLibSql({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const prisma = new PrismaClient({
  adapter
})

async function main() {
  console.log('Seeding 100 businesses...');

  // 1. Get references
  const islands = await prisma.island.findMany();
  const categories = await prisma.category.findMany();
  let admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: 'admin@admesamui.local',
        name: 'Admin User',
        role: 'ADMIN',
      }
    });
  }

  if (islands.length === 0 || categories.length === 0) {
    console.error('Please run the initial seed first to populate islands and categories.');
    process.exit(1);
  }

  // 2. Generate 100 listings
  for (let i = 0; i < 100; i++) {
    const randomIsland = islands[Math.floor(Math.random() * islands.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    // Bounds roughly around Samui/Phangan/Tao
    const lat = faker.location.latitude({ max: 10.15, min: 9.4 });
    const lng = faker.location.longitude({ max: 100.1, min: 99.8 });

    const companyName = faker.company.name();

    const listing = await prisma.listing.create({
      data: {
        name: companyName,
        slug: faker.helpers.slugify(companyName).toLowerCase() + '-' + faker.string.alphanumeric(4),
        description: faker.company.catchPhrase() + '. ' + faker.lorem.paragraph(),
        image: faker.image.urlLoremFlickr({ category: 'business' }),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        website: faker.internet.url(),
        hours: 'Mon-Fri 9AM-5PM',
        lat,
        lng,
        averageRating: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
        reviewCount: faker.number.int({ min: 5, max: 150 }),
        isPremium: faker.datatype.boolean({ probability: 0.3 }), // 30% chance
        isClaimed: faker.datatype.boolean({ probability: 0.8 }),
        layout: faker.datatype.boolean({ probability: 0.2 }) ? 'premium' : 'standard',
        categoryId: randomCategory.id,
        islandId: randomIsland.id,
        userId: admin.id,
      }
    });

    // 3. Mock scraper data: Generate 1-3 products for this listing
    const numProducts = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < numProducts; j++) {
      await prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
          image: faker.image.urlLoremFlickr({ category: 'product' }),
          listingId: listing.id
        }
      });
    }
  }

  console.log('Finished seeding 100 businesses and their products!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
