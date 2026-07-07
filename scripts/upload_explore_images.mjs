import fsPromises from 'fs/promises';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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

const SAMUI_DIR = path.join(process.cwd(), 'src', 'app', 'samui');

async function uploadImageToR2(url) {
  try {
    // Extract photo ID
    const urlObj = new URL(url);
    const pathnameParts = urlObj.pathname.split('/');
    const lastPart = pathnameParts[pathnameParts.length - 1];
    const photoId = lastPart.split('?')[0];
    const key = `images/explore/${photoId}.jpg`;
    
    console.log(`Downloading ${url} ...`);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`Uploading to R2: ${key} ...`);
    await S3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg',
      CacheControl: 'public, max-age=31536000, immutable',
    }));
    
    const finalUrl = `${PUBLIC_URL}/${key}`;
    console.log(`Uploaded successfully: ${finalUrl}`);
    return { original: url, r2Url: finalUrl };
  } catch (err) {
    console.error(`Failed to process ${url}:`, err);
    return null;
  }
}

async function run() {
  const subdirs = await fsPromises.readdir(SAMUI_DIR);
  const filePaths = [];
  
  for (const dir of subdirs) {
    const pagePath = path.join(SAMUI_DIR, dir, 'page.tsx');
    try {
      await fsPromises.access(pagePath);
      filePaths.push(pagePath);
    } catch (e) {
      // Not a directory or page.tsx doesn't exist
    }
  }
  
  console.log(`Found ${filePaths.length} page.tsx files to check.`);
  
  // Find all Unsplash URLs
  const unsplashUrls = new Set();
  const fileContentsMap = new Map();
  
  for (const filePath of filePaths) {
    const content = await fsPromises.readFile(filePath, 'utf-8');
    fileContentsMap.set(filePath, content);
    
    // Find all matches for Unsplash URLs
    const matches = content.match(/https:\/\/images\.unsplash\.com\/photo-[^"'\s>?]+/g) || [];
    for (const match of matches) {
      unsplashUrls.add(match);
    }
  }
  
  const urlsList = Array.from(unsplashUrls);
  console.log(`Found ${urlsList.length} unique Unsplash URLs.`);
  
  // Upload all to R2
  const replacementMap = new Map();
  for (const url of urlsList) {
    const result = await uploadImageToR2(url);
    if (result) {
      replacementMap.set(result.original, result.r2Url);
    }
  }
  
  // Rewrite files
  let rewrittenCount = 0;
  for (const [filePath, content] of fileContentsMap.entries()) {
    let updatedContent = content;
    let replaced = false;
    
    for (const [original, r2Url] of replacementMap.entries()) {
      if (updatedContent.includes(original)) {
        updatedContent = updatedContent.replaceAll(original, r2Url);
        replaced = true;
      }
    }
    
    if (replaced) {
      await fsPromises.writeFile(filePath, updatedContent, 'utf-8');
      console.log(`Updated images in ${path.relative(process.cwd(), filePath)}`);
      rewrittenCount++;
    }
  }
  
  console.log(`Done! Updated images in ${rewrittenCount} files.`);
}

run().catch(console.error);
