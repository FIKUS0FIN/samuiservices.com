import fsPromises from 'fs/promises';
import path from 'path';

const SAMUI_DIR = path.join(process.cwd(), 'src', 'app', 'samui');

async function processFile(filePath) {
  let content = await fsPromises.readFile(filePath, 'utf-8');
  
  // Split the file by '<Image' to process each Image element
  const parts = content.split('<Image');
  if (parts.length <= 1) return; // No Image tags found
  
  let newContent = parts[0];
  
  for (let i = 1; i < parts.length; i++) {
    let part = parts[i];
    
    // Find the end of this Image tag (closing '/>')
    const tagEndIndex = part.indexOf('/>');
    if (tagEndIndex === -1) {
      newContent += '<Image' + part;
      continue;
    }
    
    let tagContent = part.substring(0, tagEndIndex);
    const restContent = part.substring(tagEndIndex);
    
    // Determine if this is the first Image tag (Hero image)
    const isHero = (i === 1);
    
    // Add sizes attribute if not present
    if (!tagContent.includes('sizes=')) {
      const sizesAttr = isHero 
        ? ' sizes="(max-width: 768px) 100vw, 1200px"' 
        : ' sizes="(max-width: 768px) 100vw, 400px"';
      
      // Insert sizes before className or src or alt or at the end
      tagContent = tagContent.trimEnd() + sizesAttr;
    }
    
    // Add priority to hero image if not present
    if (isHero && !tagContent.includes('priority')) {
      tagContent = tagContent.trimEnd() + ' priority';
    }
    
    newContent += '<Image' + tagContent + restContent;
  }
  
  if (content !== newContent) {
    await fsPromises.writeFile(filePath, newContent, 'utf-8');
    console.log(`Optimized Image tags in ${path.relative(process.cwd(), filePath)}`);
  }
}

async function run() {
  const subdirs = await fsPromises.readdir(SAMUI_DIR);
  for (const dir of subdirs) {
    const pagePath = path.join(SAMUI_DIR, dir, 'page.tsx');
    try {
      await fsPromises.access(pagePath);
      await processFile(pagePath);
    } catch (e) {
      // Ignore directories or files that don't exist
    }
  }
  console.log('Finished optimizing image sizes on all pages!');
}

run().catch(console.error);
