import { execSync } from 'child_process';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

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

function runD1Query(query) {
  const command = `npx wrangler d1 execute samui-services-db --remote --command ${JSON.stringify(query)} --json`;
  const output = execSync(command, { encoding: 'utf-8' });
  const data = JSON.parse(output);
  return data[0].results;
}

function runD1Execute(query) {
  const command = `npx wrangler d1 execute samui-services-db --remote --command ${JSON.stringify(query)}`;
  execSync(command);
}

async function uploadToR2(url) {
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
  console.log('Sanitizing remote D1 database images to R2...');
  
  // 1. Sanitize Listing images
  const listings = runD1Query("SELECT id, name, image, galleryImages FROM Listing;");
  console.log(`Checking ${listings.length} listings in production...`);
  
  for (const listing of listings) {
    let updated = false;
    let newImage = listing.image;
    
    // Check main image
    if (listing.image && !listing.image.includes(PUBLIC_URL) && (listing.image.startsWith('http://') || listing.image.startsWith('https://'))) {
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
          let galleryUpdated = false;
          for (const img of gallery) {
            if (img && !img.includes(PUBLIC_URL) && (img.startsWith('http://') || img.startsWith('https://'))) {
              const r2Url = await uploadToR2(img);
              newGalleryArray.push(r2Url || img);
              galleryUpdated = true;
            } else {
              newGalleryArray.push(img);
            }
          }
          if (galleryUpdated) {
            newGallery = JSON.stringify(newGalleryArray);
            updated = true;
          }
        }
      } catch (e) {
        console.error(`Failed parsing galleryImages for listing ${listing.id}`, e);
      }
    }
    
    if (updated) {
      const sqlEscapedImage = newImage ? newImage.replace(/'/g, "''") : null;
      const sqlEscapedGallery = newGallery ? newGallery.replace(/'/g, "''") : null;
      
      const sql = `UPDATE Listing SET image = ${sqlEscapedImage ? `'${sqlEscapedImage}'` : 'NULL'}, galleryImages = ${sqlEscapedGallery ? `'${sqlEscapedGallery}'` : 'NULL'} WHERE id = '${listing.id}';`;
      console.log(`Running update query for listing: ${listing.name}`);
      runD1Execute(sql);
    }
  }
  
  // 2. Sanitize Product images
  const products = runD1Query("SELECT id, name, image FROM Product;");
  console.log(`Checking ${products.length} products in production...`);
  
  for (const product of products) {
    if (product.image && !product.image.includes(PUBLIC_URL) && (product.image.startsWith('http://') || product.image.startsWith('https://'))) {
      const r2Url = await uploadToR2(product.image);
      if (r2Url) {
        const sqlEscapedImage = r2Url.replace(/'/g, "''");
        const sql = `UPDATE Product SET image = '${sqlEscapedImage}' WHERE id = '${product.id}';`;
        console.log(`Running update query for product: ${product.name}`);
        runD1Execute(sql);
      }
    }
  }
  
  console.log('Sanitization complete!');
}

main().catch(console.error);
