import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.findUnique({ where: { slug: 'hostels' } });
  if (!category) return console.log('Category not found');

  const listings = await prisma.listing.findMany({
    where: { categoryId: category.id }
  });

  for (const listing of listings) {
    if (listing.galleryImages) {
      try {
        const gallery = JSON.parse(listing.galleryImages);
        if (Array.isArray(gallery)) {
          // Deduplicate
          const uniqueGallery = Array.from(new Set(gallery));
          
          if (uniqueGallery.length !== gallery.length) {
            console.log(`Fixing ${listing.name} (had ${gallery.length}, now ${uniqueGallery.length})`);
            await prisma.listing.update({
              where: { id: listing.id },
              data: { galleryImages: JSON.stringify(uniqueGallery) }
            });
          }
        }
      } catch (e) {
        console.error(`Error on ${listing.name}:`, e);
      }
    }
  }
}

main().finally(() => prisma.$disconnect());
