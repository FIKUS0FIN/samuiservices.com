'use server';

import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { seedBusinesses } from './seed-data';


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

    // 1. Seed Categories
    const categoriesData = [
      { name: 'Gastronomy', slug: 'gastronomy', icon: 'utensils' },
      { name: 'Lodging', slug: 'lodging', icon: 'home' },
      { name: 'Experiences', slug: 'experiences', icon: 'star' },
      { name: 'Transportation', slug: 'transportation', icon: 'car' },
    ];

    for (const cat of categoriesData) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      });
    }

    const parents = await prisma.category.findMany({ where: { slug: { in: ['gastronomy', 'lodging', 'experiences', 'transportation'] } }});
    const parentMap = parents.reduce((acc, p) => ({ ...acc, [p.slug]: p.id }), {} as Record<string, string>);

    const childCategories = [
      { name: 'Restaurants', slug: 'restaurants', icon: 'utensils', parentId: parentMap['gastronomy'] },
      { name: 'Cafes', slug: 'cafes', icon: 'coffee', parentId: parentMap['gastronomy'] },
      { name: 'Hotels', slug: 'hotels', icon: 'building', parentId: parentMap['lodging'] },
      { name: 'Villas', slug: 'villas', icon: 'home', parentId: parentMap['lodging'] },
      { name: 'Tours', slug: 'tours', icon: 'map', parentId: parentMap['experiences'] },
      { name: 'Water Sports', slug: 'water-sports', icon: 'waves', parentId: parentMap['experiences'] },
      { name: 'Car Rental', slug: 'car-rental', icon: 'car', parentId: parentMap['transportation'] },
      { name: 'Scooter Rental', slug: 'scooter-rental', icon: 'bike', parentId: parentMap['transportation'] },
    ];

    for (const cat of childCategories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { parentId: cat.parentId },
        create: cat,
      });
    }
    // Ensure Islands Exist
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


    // 2. Fetch required refs
    const samui = await prisma.island.findUnique({ where: { slug: 'samui' } });
    const phangan = await prisma.island.findUnique({ where: { slug: 'phangan' } });
    const restaurantsCat = await prisma.category.findUnique({ where: { slug: 'restaurants' } });
    const hotelsCat = await prisma.category.findUnique({ where: { slug: 'hotels' } });
    const toursCat = await prisma.category.findUnique({ where: { slug: 'tours' } });

    if (!samui || !phangan || !restaurantsCat || !hotelsCat || !toursCat) {
      throw new Error('Required references missing during seed.');
    }

    // 3. Seed Sample Listings
    const sampleListings = [
      {
        name: 'Fisherman Village Seafood',
        description: 'The best local seafood by the beach.',
        image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        address: 'Bophut, Koh Samui',
        lat: 9.5530,
        lng: 100.0245,
        averageRating: 4.8,
        reviewCount: 24,
        isPremium: true,
        categoryId: restaurantsCat.id,
        islandId: samui.id,
        userId: currentUser.id,
      },
      {
        name: 'Samui Seaside Villa',
        description: 'Luxury beachfront villa with infinity pool.',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        address: 'Chaweng, Koh Samui',
        lat: 9.5310,
        lng: 100.0610,
        averageRating: 4.9,
        reviewCount: 112,
        isPremium: false,
        categoryId: hotelsCat.id,
        islandId: samui.id,
        userId: currentUser.id,
      },
      {
        name: 'Jungle Safari Tour',
        description: 'Experience the wild side of the island with our guided tours.',
        image: 'https://images.unsplash.com/photo-1534777367038-f4023e5eaa63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        address: 'Thong Sala, Koh Phangan',
        lat: 9.7125,
        lng: 99.9880,
        averageRating: 4.7,
        reviewCount: 56,
        isPremium: true,
        categoryId: toursCat.id,
        islandId: phangan.id,
        userId: currentUser.id,
      }
    ];
    let seededCount = 0;
    for (const listing of sampleListings) {
      const slug = listing.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const existing = await prisma.listing.findFirst({
        where: { slug }
      });

      if (!existing) {
        await prisma.listing.create({
          data: { ...listing, slug }
        });
        seededCount++;
      }
    }

    
    const allCategories = await prisma.category.findMany();
    let importedCount = 0;
    
    for (const b of seedBusinesses) {
      let categorySlug = 'hotels-resorts'; // default
      if (b.category.includes('restaurant')) categorySlug = 'restaurants';
      else if (b.category.includes('cafe')) categorySlug = 'cafes';
      else if (b.category.includes('spa')) categorySlug = 'spas-wellness';
      else if (b.category.includes('bar')) categorySlug = 'bars-nightlife';
      else if (b.category.includes('hotel') || b.category.includes('resort')) categorySlug = 'hotels-resorts';
      
      const dbCategory = allCategories.find(c => c.slug === categorySlug) || allCategories[0];
      
      const slug = b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const existing = await prisma.listing.findFirst({
        where: { slug }
      });

      if (!existing) {
        const productsData = (b as any).extracted?.products?.map((p: any) => ({
          name: p.name,
          description: p.description,
          price: p.price || 0,
        })) || [];
        
        let extraDescription = b.description;
        if ((b as any).extracted?.emails?.length > 0) {
          extraDescription += '\n\nEmails: ' + (b as any).extracted.emails.join(', ');
        }
        if ((b as any).extracted?.socials?.facebook) {
          extraDescription += '\nFacebook: ' + (b as any).extracted.socials.facebook;
        }
        if ((b as any).extracted?.socials?.instagram) {
          extraDescription += '\nInstagram: ' + (b as any).extracted.socials.instagram;
        }

        await prisma.listing.create({
          data: {
            name: b.name,
            slug: slug,
            description: extraDescription,
            image: b.image,
            phone: b.phone,
            website: b.website,
            address: b.address,
            lat: b.lat,
            lng: b.lng,
            averageRating: Math.floor(Math.random() * (5 - 3 + 1) + 3) + Math.random(),
            reviewCount: Math.floor(Math.random() * 100) + 1,
            isPremium: Math.random() > 0.8,
            categoryId: dbCategory.id,
            islandId: samui.id,
            userId: currentUser.id,
            products: {
              create: productsData
            }
          }
        });
        importedCount++;
      }
    }
    
    seededCount += importedCount;

    return { success: true, message: `Successfully seeded categories and ${seededCount} new listings!` };
  } catch (error: unknown) {
    console.error('Seed error:', error);
    return { success: false, message: error instanceof Error ? (error as Error).message : 'Unknown error' };
  }
}
