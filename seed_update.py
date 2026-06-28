import re

# Update prisma/seed.ts
with open('prisma/seed.ts', 'r') as f:
    content = f.read()

# Replace category seeding
seed_category = """
  // Categories (Parent & Child)
  const categoriesData = [
    { name: 'Gastronomy', slug: 'gastronomy', icon: 'utensils' },
    { name: 'Lodging', slug: 'lodging', icon: 'home' },
    { name: 'Experiences', slug: 'experiences', icon: 'star' },
    { name: 'Transportation', slug: 'transportation', icon: 'car' },
  ]

  const createdParents = {}
  for (const cat of categoriesData) {
    createdParents[cat.slug] = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  const childCategories = [
    { name: 'Restaurants', slug: 'restaurants', icon: 'utensils', parentId: createdParents['gastronomy'].id },
    { name: 'Cafes', slug: 'cafes', icon: 'coffee', parentId: createdParents['gastronomy'].id },
    { name: 'Hotels', slug: 'hotels', icon: 'building', parentId: createdParents['lodging'].id },
    { name: 'Villas', slug: 'villas', icon: 'home', parentId: createdParents['lodging'].id },
    { name: 'Tours', slug: 'tours', icon: 'map', parentId: createdParents['experiences'].id },
    { name: 'Water Sports', slug: 'water-sports', icon: 'waves', parentId: createdParents['experiences'].id },
    { name: 'Car Rental', slug: 'car-rental', icon: 'car', parentId: createdParents['transportation'].id },
    { name: 'Scooter Rental', slug: 'scooter-rental', icon: 'bike', parentId: createdParents['transportation'].id },
    // Also add original categories back if needed, but the prompt says to add these to match the mockup.
  ]

  const createdCategories = await Promise.all(
    childCategories.map(cat =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: { parentId: cat.parentId },
        create: cat,
      })
    )
  )

  const restaurantsCat = createdCategories.find(c => c.slug === 'restaurants')!
  const hotelsCat = createdCategories.find(c => c.slug === 'hotels')!
  const toursCat = createdCategories.find(c => c.slug === 'tours')!
  const carsCat = createdCategories.find(c => c.slug === 'car-rental')!
"""

content = re.sub(r"  // Categories\n.*?(?=  // Sample Companies)", seed_category, content, flags=re.DOTALL)

# Update sample listings in seed.ts
listings_replacement = """
  // Sample Companies
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
      userId: adminUser.id,
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
      categoryId: hotelsCat.id,
      islandId: samui.id,
      userId: adminUser.id,
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
      userId: adminUser.id,
    },
    {
      name: 'Easy Drive Car Rentals',
      description: 'Affordable and reliable cars for your vacation.',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      address: 'Sairee Beach, Koh Tao',
      lat: 10.0950,
      lng: 99.8285,
      averageRating: 4.5,
      reviewCount: 340,
      isPremium: true,
      categoryId: carsCat.id,
      islandId: tao.id,
      userId: adminUser.id,
    }
  ]
"""
content = re.sub(r"  // Sample Companies\n.*?(?=  for \(const listing of sampleListings\))", listings_replacement, content, flags=re.DOTALL)

with open('prisma/seed.ts', 'w') as f:
    f.write(content)
