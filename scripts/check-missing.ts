import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaLibSql({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const category = await prisma.category.findUnique({ where: { slug: "restaurants" } });
  if (!category) { console.log("Category restaurants not found"); return; }
  
  const listings = await prisma.listing.findMany({
    where: {
      categoryId: category.id
    },
    select: { slug: true, name: true, googlePlaceId: true, updatedAt: true }
  });
  
  const updated = listings.filter(l => l.updatedAt > new Date("2026-07-11T00:00:00Z") && l.googlePlaceId !== null);
  const notUpdated = listings.filter(l => !(l.updatedAt > new Date("2026-07-11T00:00:00Z") && l.googlePlaceId !== null));
  
  console.log("Total listings in category:", listings.length);
  console.log("Updated listings:", updated.length);
  console.log("Not updated listings:", notUpdated.length);
  if (notUpdated.length > 0) {
    console.log("Not updated samples:", notUpdated.map(l => l.slug).join(", "));
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
