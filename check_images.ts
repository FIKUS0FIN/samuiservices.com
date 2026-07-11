import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const listing = await prisma.listing.findUnique({ where: { slug: 'shasa-resort-residences' } });
  if (listing && listing.galleryImages) {
    const images = JSON.parse(listing.galleryImages);
    console.log(`Shasa Resort images (${images.length}):`);
    images.forEach((img: string, i: number) => console.log(`${i}: ${img}`));
  }
}
main().finally(() => prisma.$disconnect());
