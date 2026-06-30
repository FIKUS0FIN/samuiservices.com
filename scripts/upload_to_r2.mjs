import fsPromises from 'fs/promises';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const ACCOUNT_ID = '724aeb58ccc92105246f69ce2b9b0ff0';
const ACCESS_KEY_ID = '4120193192aa0fae1a3d3198325474c7';
const SECRET_ACCESS_KEY = '1fd50b47379461e42feaf21f7c4adeaf7d17a184f6d991663e546a00963bb69f';
const BUCKET_NAME = 'samuiservices-media';

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

const IMAGE_DIR = path.join(process.cwd(), 'SamuiBusinessSiteSeed', 'public', 'images', 'businesses');

async function uploadFile(filePath, key) {
  const fileContent = await fsPromises.readFile(filePath);
  
  const ext = path.extname(filePath).toLowerCase();
  let contentType = 'application/octet-stream';
  if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.gif') contentType = 'image/gif';
  else if (ext === '.webp') contentType = 'image/webp';

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
  });

  try {
    await S3.send(command);
    return true;
  } catch (err) {
    console.error(`Error uploading ${key}:`, err);
    return false;
  }
}

async function run() {
  const files = await fsPromises.readdir(IMAGE_DIR);
  let count = 0;
  
  const BATCH_SIZE = 50;
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async (file) => {
      const filePath = path.join(IMAGE_DIR, file);
      // Ensure the path in R2 matches the URL structure we want
      const key = `images/businesses/${file}`;
      await uploadFile(filePath, key);
      count++;
    });
    
    await Promise.all(promises);
    console.log(`Uploaded ${count} / ${files.length} images...`);
  }
  
  console.log('Finished uploading all images to Cloudflare R2!');
}

run().catch(console.error);
