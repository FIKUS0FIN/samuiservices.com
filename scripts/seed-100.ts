import "dotenv/config";
import { faker } from "@faker-js/faker";
import { prisma } from "../src/lib/auth";

const LAYOUTS = ["standard", "premium", "minimalist"];
const IMAGES = [
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1534777367038-f4023e5eaa63?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40eb0f8d4d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80"
];

// Product images based on possible categories
const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=400&q=80"
];

const ISLANDS = [
  { name: 'Koh Samui', slug: 'samui', lat: { min: 9.4, max: 9.6 }, lng: { min: 99.9, max: 100.1 } },
  { name: 'Koh Phangan', slug: 'phangan', lat: { min: 9.65, max: 9.75 }, lng: { min: 99.95, max: 100.05 } },
  { name: 'Koh Tao', slug: 'tao', lat: { min: 10.05, max: 10.15 }, lng: { min: 99.8, max: 99.85 } }
];

async function main() {
  console.log("Starting full DB wipe and seed of 100 realistic entries...");

  // Clear existing to avoid duplicates in this run
  await prisma.product.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.category.deleteMany();
  await prisma.island.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create a dummy admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@admesamui.local',
      role: 'ADMIN',
    }
  });

  // 2. Create Islands
  const createdIslands = await Promise.all(
    ISLANDS.map(i => prisma.island.create({ data: { name: i.name, slug: i.slug } }))
  );

  // 3. Create Detailed Categories
  const categoriesData = [
    { name: 'Gastronomy', slug: 'gastronomy', icon: 'utensils', children: ['Restaurants', 'Cafes', 'Bars & Nightlife', 'Street Food'] },
    { name: 'Lodging', slug: 'lodging', icon: 'home', children: ['Hotels', 'Resorts', 'Villas', 'Hostels'] },
    { name: 'Experiences', slug: 'experiences', icon: 'star', children: ['Tours', 'Water Sports', 'Diving', 'Yoga & Retreats'] },
    { name: 'Health & Wellness', slug: 'wellness', icon: 'heart', children: ['Spas & Massage', 'Gyms', 'Clinics', 'Dentists'] },
    { name: 'Transportation', slug: 'transportation', icon: 'car', children: ['Car Rental', 'Scooter Rental', 'Taxis', 'Ferry Services'] },
    { name: 'Home & Construction', slug: 'home-construction', icon: 'hammer', children: ['Contractors', 'Plumbers', 'Electricians', 'Cleaning Services'] },
    { name: 'Shopping', slug: 'shopping', icon: 'shopping-bag', children: ['Supermarkets', 'Boutiques', 'Electronics', 'Souvenirs'] },
  ];

  const allChildCategories = [];

  for (const cat of categoriesData) {
    const parent = await prisma.category.create({
      data: { name: cat.name, slug: cat.slug, icon: cat.icon }
    });

    for (const childName of cat.children) {
      const child = await prisma.category.create({
        data: {
          name: childName,
          slug: faker.helpers.slugify(childName).toLowerCase(),
          icon: cat.icon,
          parentId: parent.id
        }
      });
      allChildCategories.push(child);
    }
  }

  // 4. Create 100 Businesses
  const BATCH_SIZE = 100;
  
  for (let i = 0; i < BATCH_SIZE; i++) {
    const randomCategory = allChildCategories[faker.number.int({ min: 0, max: allChildCategories.length - 1 })];
    
    // Pick island based on a weighted random (Samui is biggest)
    const islandIndex = faker.number.int({ min: 0, max: 100 });
    let islandConf;
    if (islandIndex < 60) islandConf = ISLANDS[0]; // 60% Samui
    else if (islandIndex < 85) islandConf = ISLANDS[1]; // 25% Phangan
    else islandConf = ISLANDS[2]; // 15% Tao

    const randomIsland = createdIslands.find(is => is.slug === islandConf.slug)!;
    const layout = LAYOUTS[faker.number.int({ min: 0, max: LAYOUTS.length - 1 })];
    const isPremium = faker.datatype.boolean({ probability: 0.3 });
    const image = IMAGES[faker.number.int({ min: 0, max: IMAGES.length - 1 })];
    
    // Generate 3-8 products/services for this business
    const numProducts = faker.number.int({ min: 3, max: 8 });
    const products = Array.from({ length: numProducts }).map(() => ({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      image: PRODUCT_IMAGES[faker.number.int({ min: 0, max: PRODUCT_IMAGES.length - 1 })],
    }));

    const businessName = faker.company.name() + (randomCategory.name.includes('Restaurant') ? ' Restaurant' : '');
    const slug = faker.helpers.slugify(businessName).toLowerCase() + '-' + faker.string.alphanumeric(4);

    try {
      await prisma.listing.create({
        data: {
          name: businessName,
          slug: slug,
          description: faker.company.catchPhrase() + '.\n\n' + faker.lorem.paragraphs(2),
          image: image,
          phone: faker.phone.number(),
          address: faker.location.streetAddress() + ', ' + randomIsland.name,
          lat: faker.location.latitude({ max: islandConf.lat.max, min: islandConf.lat.min }),
          lng: faker.location.longitude({ max: islandConf.lng.max, min: islandConf.lng.min }),
          averageRating: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
          reviewCount: faker.number.int({ min: 10, max: 800 }),
          isPremium: isPremium,
          isClaimed: true,
          website: faker.internet.url(),
          hours: '9:00 AM - 6:00 PM',
          layout: layout,
          categoryId: randomCategory.id,
          islandId: randomIsland.id,
          userId: admin.id,
          products: {
            create: products
          }
        }
      });
      console.log(`Created ${i + 1}/${BATCH_SIZE}: ${businessName} on ${randomIsland.name} (${layout} layout)`);
    } catch (e) {
      console.error(`Failed to create listing ${i + 1}: ${businessName}`, e);
    }
  }

  console.log("Successfully seeded 100 listings with products and diverse layouts!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
