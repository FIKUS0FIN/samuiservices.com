import "dotenv/config"
import { PrismaClient } from '@prisma/client'
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

  const constructionCat = createdCategories.find(c => c.slug === 'construction')!
  const cleaningCat = createdCategories.find(c => c.slug === 'cleaning')!
  const foodCat = createdCategories.find(c => c.slug === 'food-delivery')!
  const healthCat = createdCategories.find(c => c.slug === 'health-beauty')!
  const toursCat = createdCategories.find(c => c.slug === 'tours')!

  // Sample Companies
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
      userId: adminUser.id,
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
      categoryId: cleaningCat.id,
      islandId: samui.id,
      userId: adminUser.id,
    },
    {
      name: 'Phangan Fresh Delivery',
      description: 'The quickest food delivery on the island. Local Thai and international cuisine delivered to your door.',
      image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Thong Sala, Koh Phangan',
      lat: 9.7125,
      lng: 99.9880,
      averageRating: 4.9,
      reviewCount: 112,
      isPremium: true,
      categoryId: foodCat.id,
      islandId: phangan.id,
      userId: adminUser.id,
    },
    {
      name: 'Tao Diving Masters',
      description: 'PADI certified diving courses and tours around the best spots in Koh Tao.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Sairee Beach, Koh Tao',
      lat: 10.0950,
      lng: 99.8285,
      averageRating: 5.0,
      reviewCount: 340,
      isPremium: true,
      categoryId: toursCat.id,
      islandId: tao.id,
      userId: adminUser.id,
    },
    {
      name: 'Lotus Wellness Spa',
      description: 'Traditional Thai massage and modern wellness treatments.',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Lamai, Koh Samui',
      lat: 9.4700,
      lng: 100.0485,
      averageRating: 4.7,
      reviewCount: 56,
      categoryId: healthCat.id,
      islandId: samui.id,
      userId: adminUser.id,
    },
    {
      name: 'Island Handyman Services',
      description: 'Quick fixes, plumbing, and electrical work. Available 24/7.',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Maenam, Koh Samui',
      lat: 9.5700,
      lng: 99.9985,
      averageRating: 4.3,
      reviewCount: 12,
      categoryId: constructionCat.id,
      islandId: samui.id,
      userId: adminUser.id,
    },
    {
      name: 'Vegan Bites Delivery',
      description: 'Healthy, plant-based meals delivered anywhere in Koh Phangan.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Sri Thanu, Koh Phangan',
      lat: 9.7560,
      lng: 99.9650,
      averageRating: 4.8,
      reviewCount: 89,
      categoryId: foodCat.id,
      islandId: phangan.id,
      userId: adminUser.id,
    },
    {
      name: 'Samui Safari Tours',
      description: 'Jungle safaris, waterfall visits, and elephant sanctuary tours.',
      image: 'https://images.unsplash.com/photo-1534777367038-f4023e5eaa63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Nathon, Koh Samui',
      lat: 9.5350,
      lng: 99.9350,
      averageRating: 4.6,
      reviewCount: 145,
      categoryId: toursCat.id,
      islandId: samui.id,
      userId: adminUser.id,
    },
    {
      name: 'Crystal Clear Pools',
      description: 'Pool maintenance, cleaning, and chemical balancing services.',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Choeng Mon, Koh Samui',
      lat: 9.5700,
      lng: 100.0750,
      averageRating: 4.9,
      reviewCount: 33,
      categoryId: cleaningCat.id,
      islandId: samui.id,
      userId: adminUser.id,
    },
    {
      name: 'Yoga Retreat Tao',
      description: 'Daily yoga classes and wellness retreats by the ocean.',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Chalok Baan Kao, Koh Tao',
      lat: 10.0650,
      lng: 99.8250,
      averageRating: 5.0,
      reviewCount: 210,
      isPremium: true,
      categoryId: healthCat.id,
      islandId: tao.id,
      userId: adminUser.id,
    }
  ]

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
