import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const listing = await prisma.listing.findUnique({
    where: { slug: 'cmqtdcyps0000psp7czaphbsh' }
  });
  console.log('Listing slug:', listing?.slug);
  
  const listingById = await prisma.listing.findUnique({
      where: { id: 'cmqtdcyps0000psp7czaphbsh' }
  });
  console.log('Listing by ID:', listingById?.slug);
}

main().catch(console.error).finally(() => prisma.$disconnect());
