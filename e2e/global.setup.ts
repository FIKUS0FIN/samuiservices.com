import { execSync } from 'child_process';
import path from 'path';

export default async function globalSetup() {
  console.log('Resetting and seeding test database...');
  process.env.DATABASE_URL = 'file:./test.db';
  
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });

  // Seed the test database
  const { PrismaClient } = require('@prisma/client');
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
  
  const adapter = new PrismaBetterSqlite3({ url: 'file:./test.db' });
  const prisma = new PrismaClient({ adapter });

  // Clear existing data just in case
  await prisma.claimRequest.deleteMany();
  await prisma.message.deleteMany();
  await prisma.review.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.category.deleteMany();
  await prisma.island.deleteMany();
  await prisma.user.deleteMany();

  // Seed required categories and islands
  await prisma.category.create({ data: { id: 'cat-1', name: 'Restaurants', slug: 'restaurants', icon: 'utensils' } });
  await prisma.category.create({ data: { id: 'cat-2', name: 'Hotels', slug: 'hotels', icon: 'bed' } });
  
  await prisma.island.create({ data: { id: 'isl-1', name: 'Koh Samui', slug: 'koh-samui' } });
  await prisma.island.create({ data: { id: 'isl-2', name: 'Koh Phangan', slug: 'koh-phangan' } });

  // Create an unclaimed listing
  const sysUser = await prisma.user.create({ data: { id: 'sys-user', name: 'System', email: 'system@example.com' } });
  
  await prisma.listing.create({
    data: {
      name: 'Unclaimed Test Business',
      description: 'This business is imported and unclaimed.',
      categoryId: 'cat-1',
      islandId: 'isl-1',
      userId: sysUser.id,
      isClaimed: false
    }
  });

  await prisma.$disconnect();
}
