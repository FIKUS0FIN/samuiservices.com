import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const listing = await prisma.listing.findUnique({ where: { slug: 'villa-cima' } });
  console.log(listing?.description);
}
main().finally(() => prisma.$disconnect());
