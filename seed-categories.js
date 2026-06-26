const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

async function main() {
  console.log('Seeding categories...');
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon },
      create: { name: cat.name, slug: cat.slug, icon: cat.icon }
    });
  }

  const oldSlugs = ['stays', 'dining', 'activities', 'experiences', 'restaurants'];
  for (const slug of oldSlugs) {
    try {
      await prisma.category.delete({ where: { slug } });
      console.log(`Deleted old category: ${slug}`);
    } catch (e) {
      // ignore
    }
  }
  
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
