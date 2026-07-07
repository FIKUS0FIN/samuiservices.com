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

async function run() {
  const subdirs = await fsPromises.readdir(SAMUI_DIR);
  const filePaths = [];
  
  for (const dir of subdirs) {
    const pagePath = path.join(SAMUI_DIR, dir, 'page.tsx');
    try {
      await fsPromises.access(pagePath);
      filePaths.push(pagePath);
    } catch (e) {
      // Ignore
    }
  }
  
  const r2Urls = new Set();
  
  for (const filePath of filePaths) {
    const content = await fsPromises.readFile(filePath, 'utf-8');
    const matches = content.match(/https:\/\/pub-3433478e81804444ae052b8316ad0d83\.r2\.dev\/images\/explore\/[a-zA-Z0-9_-]+\.jpg/g) || [];
    for (const match of matches) {
      r2Urls.add(match);
    }
  }
  
  const urlsList = Array.from(r2Urls);
  console.log(`Found ${urlsList.length} R2 URLs to update cache headers for.`);
  
  for (const url of urlsList) {
    try {
      const urlObj = new URL(url);
      const key = urlObj.pathname.substring(1); // remove leading slash
      
      console.log(`Downloading ${url} ...`);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      console.log(`Uploading back to R2 with Cache-Control: ${key} ...`);
      await S3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg',
        CacheControl: 'public, max-age=31536000, immutable',
      }));
      console.log(`Updated successfully!`);
    } catch (err) {
      console.error(`Failed for ${url}:`, err);
    }
  }
  
  console.log('Finished updating all image cache headers on Cloudflare R2!');
}

run().catch(console.error);
