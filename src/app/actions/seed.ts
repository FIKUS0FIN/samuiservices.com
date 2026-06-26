'use server';

import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';

async function seedCategories() {
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
  const constructionCat = await prisma.category.findUnique({ where: { slug: 'construction-builders' } });
  const cleaningCat = await prisma.category.findUnique({ where: { slug: 'cleaning-housekeeping' } });
  const deliveriesCat = await prisma.category.findUnique({ where: { slug: 'deliveries-moving' } });

  if (!samui || !phangan || !constructionCat || !cleaningCat || !deliveriesCat) {
    throw new Error('Required references missing during seed.');
  }

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
      userId,
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
      userId,
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
      userId,
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
  return seededCount;
}

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
    await seedCategories();
    await seedIslands();
    const seededCount = await seedSampleListings(currentUser.id);

    return { success: true, message: `Successfully seeded categories and ${seededCount} new listings!` };

  } catch (error: unknown) {
    console.error('Seed error:', error);
    return { success: false, message: (error as Error).message || 'Unknown error' };
  }
}
