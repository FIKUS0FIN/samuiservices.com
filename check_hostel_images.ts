import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const category = await prisma.category.findUnique({ where: { slug: 'hostels' } });
  const listings = await prisma.listing.findMany({ where: { categoryId: category!.id }, take: 2 });
  for (const listing of listings) {
    if (listing.galleryImages) {
      console.log(`\n${listing.name}:`);
      JSON.parse(listing.galleryImages).forEach((img: string, i: number) => console.log(`${i}: ${img}`));
    }
  }
}
main().finally(() => prisma.$disconnect());
