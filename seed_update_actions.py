import re

with open('src/app/actions/seed.ts', 'r') as f:
    content = f.read()

# Replace category seeding in src/app/actions/seed.ts
seed_category = """
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
"""
content = re.sub(r"    // 1\. Seed Categories\n.*?(?=    // Ensure Islands Exist)", seed_category, content, flags=re.DOTALL)

# Replace fetching required refs
refs_replacement = """
    // 2. Fetch required refs
    const samui = await prisma.island.findUnique({ where: { slug: 'samui' } });
    const phangan = await prisma.island.findUnique({ where: { slug: 'phangan' } });
    const restaurantsCat = await prisma.category.findUnique({ where: { slug: 'restaurants' } });
    const hotelsCat = await prisma.category.findUnique({ where: { slug: 'hotels' } });
    const toursCat = await prisma.category.findUnique({ where: { slug: 'tours' } });

    if (!samui || !phangan || !restaurantsCat || !hotelsCat || !toursCat) {
      throw new Error('Required references missing during seed.');
    }
"""
content = re.sub(r"    // 2\. Fetch required refs\n.*?(?=    // 3\. Seed Sample Listings)", refs_replacement, content, flags=re.DOTALL)

# Replace sample listings
listings_replacement = """
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
"""
content = re.sub(r"    // 3\. Seed Sample Listings\n.*?(?=    let seededCount = 0;)", listings_replacement, content, flags=re.DOTALL)

with open('src/app/actions/seed.ts', 'w') as f:
    f.write(content)
