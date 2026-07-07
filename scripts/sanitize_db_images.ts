import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from "@prisma/adapter-libsql"
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import crypto from 'crypto'

const ACCOUNT_ID = '724aeb58ccc92105246f69ce2b9b0ff0';
const ACCESS_KEY_ID = '4120193192aa0fae1a3d3198325474c7';
const SECRET_ACCESS_KEY = '1fd50b47379461e42feaf21f7c4adeaf7d17a184f6d991663e546a00963bb69f';
const BUCKET_NAME = 'samuiservices-media';
const PUBLIC_URL = 'https://pub-3433478e81804444ae052b8316ad0d83.r2.dev';

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaLibSql({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const prisma = new PrismaClient({
  adapter
});

async function uploadToR2(url: string): Promise<string | null> {
  if (!url || url.includes(PUBLIC_URL)) return url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return url;
  
  try {
    console.log(`Downloading ${url} ...`);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const ext = contentType.split('/')[1] || 'jpg';
    const fileKey = `db-images/${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
    
    console.log(`Uploading to R2: ${fileKey} ...`);
    await S3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }));
    
    return `${PUBLIC_URL}/${fileKey}`;
  } catch (err) {
    console.error(`Failed to upload ${url} to R2:`, err);
    return null;
  }
}

async function main() {
  console.log('Sanitizing database images to R2...');
  
  // 1. Sanitize Listing images
  const listings = await prisma.listing.findMany();
  console.log(`Checking ${listings.length} listings...`);
  
  for (const listing of listings) {
    let updated = false;
    let newImage = listing.image;
    
    // Check main image
    if (listing.image && !listing.image.includes(PUBLIC_URL)) {
      const r2Url = await uploadToR2(listing.image);
      if (r2Url) {
        newImage = r2Url;
        updated = true;
      }
    }
    
    // Check galleryImages
    let newGallery = listing.galleryImages;
    if (listing.galleryImages) {
      try {
        const gallery = JSON.parse(listing.galleryImages);
        if (Array.isArray(gallery)) {
          const newGalleryArray = [];
          for (const img of gallery) {
            if (img && !img.includes(PUBLIC_URL)) {
              const r2Url = await uploadToR2(img);
              newGalleryArray.push(r2Url || img);
              updated = true;
            } else {
              newGalleryArray.push(img);
            }
          }
          newGallery = JSON.stringify(newGalleryArray);
        }
      } catch (e) {
        console.error(`Failed parsing galleryImages for listing ${listing.id}`, e);
      }
    }
    
    if (updated) {
      await prisma.listing.update({
        where: { id: listing.id },
        data: {
          image: newImage,
          galleryImages: newGallery,
        }
      });
      console.log(`Updated listing ${listing.name} (${listing.id})`);
    }
  }
  
  // 2. Sanitize Product images
  const products = await prisma.product.findMany();
  console.log(`Checking ${products.length} products...`);
  
  for (const product of products) {
    if (product.image && !product.image.includes(PUBLIC_URL)) {
      const r2Url = await uploadToR2(product.image);
      if (r2Url) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            image: r2Url
          }
        });
        console.log(`Updated product ${product.name} (${product.id})`);
      }
    }
  }
  
  console.log('Sanitization complete!');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
