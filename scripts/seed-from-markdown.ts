import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from "@prisma/adapter-libsql"
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
// @ts-ignore
import matter from 'gray-matter'

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaLibSql({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const prisma = new PrismaClient({ adapter })

async function main() {
  const seedDir = path.join(process.cwd(), 'SamuiBusinessSiteSeed', 'content', 'businesses');
  const files = await fsPromises.readdir(seedDir);
  
  let admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: 'admin@admesamui.local',
        name: 'Admin User',
        role: 'ADMIN',
      }
    });
  }

  // Clear existing listings to avoid conflicts (optional but recommended if it's a fresh seed)
  await prisma.listing.deleteMany();
  console.log('Cleared existing listings.');

  let count = 0;
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    const filePath = path.join(seedDir, file);
    const fileContent = await fsPromises.readFile(filePath, 'utf-8');
    const parsed = matter(fileContent);
    const data = parsed.data;
    const body = parsed.content;

    if (!data.title) continue;

    // Resolve Category
    const categoryName = data.category || 'Uncategorized';
    let category = await prisma.category.findFirst({ where: { name: categoryName } });
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryName,
          slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random()*1000),
          icon: 'home'
        }
      });
    }

    // Resolve Island/District
    const districtName = data.district || 'Koh Samui';
    let island = await prisma.island.findFirst({ where: { name: districtName } });
    if (!island) {
      island = await prisma.island.create({
        data: {
          name: districtName,
          slug: districtName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random()*1000)
        }
      });
    }

    // Prepare JSON arrays
    const images = Array.isArray(data.images) ? JSON.stringify(data.images) : null;
    const firstImage = Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : null;
    const services = Array.isArray(data.services) ? JSON.stringify(data.services) : null;
    const hours = Array.isArray(data.hours) ? JSON.stringify(data.hours) : null;

    try {
      await prisma.listing.create({
        data: {
          slug: data.slug,
          name: data.title,
          description: body.trim() || data.metaDescription || "No description provided.",
          image: firstImage,
          galleryImages: images,
          phone: data.phone || null,
          address: data.address || null,
          averageRating: data.rating ? parseFloat(data.rating) : 0,
          reviewCount: data.reviewsCount ? parseInt(data.reviewsCount) : 0,
          isPremium: false,
          isClaimed: false,
          website: data.website || null,
          hours: hours,
          priceLevel: data.price || null,
          mapLink: data.mapLink || null,
          services: services,
          categoryId: category.id,
          islandId: island.id,
          userId: admin.id,
        }
      });
      count++;
    } catch (e: any) {
      console.error(`Error inserting ${data.slug}:`, e.message);
    }
  }

  console.log(`Finished seeding ${count} businesses from Markdown!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
