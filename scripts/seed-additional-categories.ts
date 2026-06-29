import { prisma } from '../src/lib/auth';

const newCategories = [
  { name: 'Real Estate agencies', slug: 'real-estate', icon: 'building' },
  { name: 'Transportation and Delivery Service', slug: 'transportation-delivery', icon: 'truck' },
  { name: 'Electronics Repair Service', slug: 'electronics-repair', icon: 'wrench' },
  { name: 'Construction & Repair Service', slug: 'construction-repair', icon: 'hammer' },
  { name: 'Children\'s Interactions Services', slug: 'children-services', icon: 'smile' },
  { name: 'Home & Garden Services', slug: 'home-garden', icon: 'leaf' },
  { name: 'Clothing & Accessories Shops', slug: 'clothing-accessories', icon: 'shopping-bag' },
  { name: 'Gift & Souvenir Shops', slug: 'gift-souvenir', icon: 'gift' },
  { name: 'Furniture & Interior Shops', slug: 'furniture-interior', icon: 'armchair' },
  { name: 'Tour Providers', slug: 'tour-providers', icon: 'map' },
  { name: 'Beauty & Health Services', slug: 'beauty-health', icon: 'heart' },
  { name: 'Hobbies & Sports Service', slug: 'hobbies-sports', icon: 'activity' },
  { name: 'Business Service', slug: 'business-service', icon: 'briefcase' },
];

async function main() {
  console.log('Seeding additional categories...');
  
  // Ensure samui island exists
  let samui = await prisma.island.findUnique({ where: { slug: 'samui' } });
  if (!samui) {
    samui = await prisma.island.create({ data: { name: 'Koh Samui', slug: 'samui' } });
  }

  // Ensure admin user exists
  let adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@samuiservices.com',
        role: 'ADMIN',
      }
    });
  }

  for (const cat of newCategories) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug, icon: cat.icon },
    });
    console.log(`✅ Category seeded: ${createdCat.name}`);

    // Create a mock provider for this category
    const providerSlug = `mock-${cat.slug}-provider`;
    const existingProvider = await prisma.listing.findUnique({ where: { slug: providerSlug } });
    
    if (!existingProvider) {
      // Pick a layout for variety
      const layouts = ['modern', 'classic', 'featured'];
      const randomLayout = layouts[Math.floor(Math.random() * layouts.length)];
      
      await prisma.listing.create({
        data: {
          slug: providerSlug,
          name: `Premium ${cat.name} Provider`,
          description: `This is a sample provider profile for the ${cat.name} category. It demonstrates the ${randomLayout} layout style aligned with MD3 guidelines.`,
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          phone: '+66 88 888 8888',
          website: 'https://example.com',
          address: 'Koh Samui, Thailand',
          lat: 9.5120,
          lng: 100.0136,
          averageRating: 4.8,
          reviewCount: Math.floor(Math.random() * 50) + 10,
          isPremium: Math.random() > 0.5,
          layout: randomLayout,
          categoryId: createdCat.id,
          islandId: samui.id,
          userId: adminUser.id,
          products: {
            create: [
              { name: 'Standard Consultation', price: 50, description: 'Basic consultation service.' },
              { name: 'Premium Package', price: 150, description: 'Full comprehensive service package.' }
            ]
          }
        }
      });
      console.log(`✅ Provider seeded: Premium ${cat.name} Provider (${randomLayout} layout)`);
    }
  }

  console.log('✅ Finished seeding additional categories and mock providers.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
