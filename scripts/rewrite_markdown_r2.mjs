import fsPromises from 'fs/promises';
import path from 'path';

const PUBLIC_URL = 'https://pub-3433478e81804444ae052b8316ad0d83.r2.dev';
const SEED_CONTENT_DIR = path.join(process.cwd(), 'SamuiBusinessSiteSeed', 'content', 'businesses');

async function run() {
  const files = await fsPromises.readdir(SEED_CONTENT_DIR);
  
  let count = 0;
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const filePath = path.join(SEED_CONTENT_DIR, file);
    let content = await fsPromises.readFile(filePath, 'utf-8');
    
    // We are replacing local paths in frontmatter:
    // - "/images/businesses/X.jpg" -> - "https://pub-...r2.dev/images/businesses/X.jpg"
    const updatedContent = content.replace(/- "\/images\/businesses\//g, `- "${PUBLIC_URL}/images/businesses/`);
    
    if (content !== updatedContent) {
      await fsPromises.writeFile(filePath, updatedContent);
      count++;
    }
  }
  
  console.log(`Rewrote ${count} markdown files to use Cloudflare R2 URLs!`);
}

run().catch(console.error);
