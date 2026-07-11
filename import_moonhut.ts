import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from "@prisma/adapter-libsql";
import fs from "fs";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const data = JSON.parse(fs.readFileSync('moonhut.json', 'utf-8'))[0].results[0];
  data.slug = 'moonhut-beach-restaurant';
  data.isPremium = data.isPremium === 1;
  data.isClaimed = data.isClaimed === 1;
  
  await prisma.listing.create({
    data: data
  });
  console.log("Imported successfully to local DB.");
}
main().finally(() => prisma.$disconnect());
