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


  // Sample Companies
    const islands = [samui, phangan, tao];
  const sampleListings = Array.from({ length: 100 }).map(() => {
    const randomCategory = createdCategories[Math.floor(Math.random() * createdCategories.length)];
    const randomIsland = islands[Math.floor(Math.random() * islands.length)];

    return {
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      image: faker.image.url(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
      averageRating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
      reviewCount: faker.number.int({ min: 0, max: 500 }),
      isPremium: faker.datatype.boolean(),
      isClaimed: faker.datatype.boolean(),
      website: faker.internet.url(),
      hours: 'Mon-Fri 9AM-5PM',
      categoryId: randomCategory.id,
      islandId: randomIsland.id,
      userId: adminUser.id,
    };
  });

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
