import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from "@prisma/adapter-libsql";
import fs from "fs";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const listings = await prisma.listing.findMany();
  
  let sql = "";
  for (const listing of listings) {
    if (listing.galleryImages) {
      sql += `UPDATE Listing SET galleryImages = '${listing.galleryImages}' WHERE slug = '${listing.slug}';\n`;
    }
  }
  
  if (sql.length > 0) {
    fs.writeFileSync('fix_images_slug.sql', sql);
    console.log(`Generated fix_images_slug.sql.`);
  } else {
    console.log("No images found.");
  }
}
main().finally(() => prisma.$disconnect());
