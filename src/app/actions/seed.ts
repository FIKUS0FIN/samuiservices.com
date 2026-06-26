'use server';

import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { faker } from '@faker-js/faker';

async function seedCategories() {
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
    ];

  await Promise.all(categories.map(cat =>
    prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon },
      create: cat,
    })
  ));
}

async function seedIslands() {
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
}

async function seedSampleListings(userId: string) {
  const samui = await prisma.island.findUnique({ where: { slug: 'samui' } });
  const phangan = await prisma.island.findUnique({ where: { slug: 'phangan' } });
  const tao = await prisma.island.findUnique({ where: { slug: 'tao' } });

  if (!samui || !phangan || !tao) {
    throw new Error('Required references missing during seed.');
  }

  const createdCategories = await prisma.category.findMany();
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
      userId,
    };
  });

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
  return seededCount;
}

export async function seedDatabase() {
  const session = await getServerSession(authOptions);

  try {
    if (!session || !session.user || !session.user.id) {
      throw new Error('You must be logged in to seed the database.');
    }

    await seedCategories();
    await seedIslands();
    const seededCount = await seedSampleListings(session.user.id);

    return { success: true, message: `Successfully seeded categories, islands and ${seededCount} new listings!` };
  } catch (error: unknown) {
    console.error('Seed error:', error);
    return { success: false, message: (error as Error).message || 'Unknown error' };
  }
}
