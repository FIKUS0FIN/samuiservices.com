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
      try {
        const gallery = JSON.parse(listing.galleryImages);
        if (Array.isArray(gallery)) {
          const cleanGallery = gallery.filter((url: string) => {
            const lower = url.toLowerCase();
            const isLegacy = lower.match(/-[0-9]+\.(jpg|jpeg|png|webp)$/) !== null && !lower.includes('-google-') && !lower.includes('-site-');
            return !isLegacy;
          });
          if (cleanGallery.length !== gallery.length) {
            console.log(`Fixing ${listing.slug}: ${gallery.length} -> ${cleanGallery.length}`);
            sql += `UPDATE "Listing" SET "galleryImages" = '${JSON.stringify(cleanGallery)}' WHERE "id" = '${listing.id}';\n`;
            await prisma.listing.update({
              where: { id: listing.id },
              data: { galleryImages: JSON.stringify(cleanGallery) }
            });
          }
        }
      } catch(e) {}
    }
  }
  
  if (sql.length > 0) {
    fs.writeFileSync('fix_images.sql', sql);
    console.log(`Generated fix_images.sql.`);
  } else {
    console.log("No duplicates found.");
  }
}
main().finally(() => prisma.$disconnect());
