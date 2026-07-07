import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';

const CATALOG_DIR = path.join(process.cwd(), 'SamuiBusinesCatalog', 'Koh Samui');
const SEED_DIR = path.join(process.cwd(), 'SamuiBusinessSiteSeed');
const SEED_CONTENT_DIR = path.join(SEED_DIR, 'content', 'businesses');
const SEED_IMAGE_DIR = path.join(SEED_DIR, 'public', 'images', 'businesses');

// Keep track of slugs to handle duplicates
const slugRegistry = new Map();

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

function truncateString(str, num) {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
}

function escapeYaml(str) {
  if (!str) return '';
  return str.replace(/"/g, '\\"').replace(/\n/g, ' ');
}

async function parseMarkdown(filePath) {
  const content = await fsPromises.readFile(filePath, 'utf-8');
  
  const nameMatch = content.match(/^# (.*)$/m);
  const categoryMatch = content.match(/\*\*Category:\*\* (.*)$/m);
  const districtMatch = content.match(/\*\*District:\*\* (.*)$/m);
  const phoneMatch = content.match(/\*\*Phone:\*\* (.*)$/m); 
  const addressMatch = content.match(/\*\*Address:\*\* (.*)$/m);
  const ratingMatch = content.match(/\*\*Rating:\*\* ([0-9.]+)/m);
  const reviewsCountMatch = content.match(/\*\*Rating:\*\* .* \(([0-9,]+) reviews\)/m);
  const priceMatch = content.match(/\*\*Price Level:\*\* (.*)$/m);
  const servicesMatch = content.match(/\*\*Services & Categories:\*\* (.*)$/m);
  const websiteMatch = content.match(/\*\*Website:\*\* (.*)$/m);
  const mapLinkMatch = content.match(/\*\*Google Maps Link:\*\* (.*)$/m);
  const descMatch = content.match(/\*\*Description:\*\* (.*)$/m);
  const latMatch = content.match(/\*\*Latitude:\*\* (.*)$/m);
  const lngMatch = content.match(/\*\*Longitude:\*\* (.*)$/m);
  
  const images = [...content.matchAll(/!\[.*?\]\((.*?)\)/g)].map(m => m[1]);

  // Extract Working Hours
  let hours = [];
  const hoursSection = content.split('### Working Hours');
  if (hoursSection.length > 1) {
    const hoursPart = hoursSection[1].split('###')[0];
    const hourLines = hoursPart.match(/- (.*)/g);
    if (hourLines) {
      hours = hourLines.map(l => l.replace('- ', '').trim());
    }
  }

  // Extract Reviews
  let topReviews = [];
  const reviewsSection = content.split('### Top Reviews');
  if (reviewsSection.length > 1) {
    const reviewPart = reviewsSection[1].split('###')[0];
    const reviewLines = reviewPart.match(/- \*\*(.*?)\*\* \((.*?)\): "(.*?)"/g);
    if (reviewLines) {
      for (const line of reviewLines) {
        const m = line.match(/- \*\*(.*?)\*\* \((.*?)\): "(.*?)"/);
        if (m) {
          topReviews.push({ author: m[1], rating: m[2], text: m[3] });
        }
      }
    }
  }

  return {
    name: nameMatch ? nameMatch[1].trim() : 'Unknown',
    category: categoryMatch ? categoryMatch[1].trim() : '',
    district: districtMatch ? districtMatch[1].trim() : '',
    address: addressMatch ? addressMatch[1].trim() : '',
    phone: phoneMatch ? phoneMatch[1].trim() : '',
    rating: ratingMatch ? parseFloat(ratingMatch[1]) : null,
    reviewsCount: reviewsCountMatch ? parseInt(reviewsCountMatch[1].replace(/,/g, '')) : 0,
    price: priceMatch ? priceMatch[1].trim() : '',
    services: servicesMatch ? servicesMatch[1].trim().split(', ').map(s => s.trim()) : [],
    website: websiteMatch ? websiteMatch[1].trim() : '',
    mapLink: mapLinkMatch ? mapLinkMatch[1].trim() : '',
    description: descMatch ? descMatch[1].trim() : '',
    lat: latMatch ? parseFloat(latMatch[1]) : null,
    lng: lngMatch ? parseFloat(lngMatch[1]) : null,
    hours: hours,
    topReviews: topReviews,
    originalImages: images,
    originalFilePath: filePath
  };
}

async function generateSiteSeed() {
  await fsPromises.mkdir(SEED_CONTENT_DIR, { recursive: true });
  await fsPromises.mkdir(SEED_IMAGE_DIR, { recursive: true });

  const districts = await fsPromises.readdir(CATALOG_DIR);
  let processedCount = 0;
  
  for (const district of districts) {
    const dirPath = path.join(CATALOG_DIR, district);
    const stat = await fsPromises.stat(dirPath);
    if (!stat.isDirectory()) continue;
    
    const files = await fsPromises.readdir(dirPath);
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      const filePath = path.join(dirPath, file);
      const data = await parseMarkdown(filePath);
      
      if (data.name === 'Unknown') continue;

      // 1. URL Collision Handling
      let slug = slugify(data.name);
      if (slugRegistry.has(slug)) {
        slug = slugify(`${data.name}-${data.district}`);
        if (slugRegistry.has(slug)) {
           // Extreme edge case (same name in same district)
           slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
        }
      }
      slugRegistry.set(slug, true);

      // 2. Programmatic SEO Generation
      const categoryText = data.category ? data.category.replace(/&/g, 'and') : 'Business';
      const metaTitle = `${data.name} - Top ${categoryText} in ${data.district} | Koh Samui`;
      
      let metaDesc = data.description;
      if (!metaDesc && data.topReviews.length > 0) {
        metaDesc = data.topReviews[0].text;
      }
      if (!metaDesc) metaDesc = `Discover ${data.name}, a premier ${categoryText} located in ${data.district}, Koh Samui. Find reviews, hours, and contact information.`;
      metaDesc = truncateString(metaDesc, 155); // SEO max length

      // 3. Handle Images
      const newImages = [];
      let existingImages = [];
      const destFilePath = path.join(SEED_CONTENT_DIR, `${slug}.md`);
      if (fs.existsSync(destFilePath)) {
        try {
          const destContent = fs.readFileSync(destFilePath, 'utf-8');
          const lines = destContent.split(/\r?\n/);
          const imgIndex = lines.findIndex(line => line.trim().startsWith('images:'));
          if (imgIndex !== -1) {
            for (let idx = imgIndex + 1; idx < lines.length; idx++) {
              const line = lines[idx].trim();
              if (line.startsWith('-') && !line.startsWith('---')) {
                existingImages.push(line.replace(/^-\s*["']?|["']?$/g, '').trim());
              } else {
                break;
              }
            }
          }
        } catch (e) {
          console.error("Error reading existing images for", slug, e);
        }
      }

      if (existingImages.length > 0) {
        newImages.push(...existingImages.map(img => {
          if (img.startsWith('http')) return img;
          const cleanPath = img.startsWith('/') ? img : `/${img}`;
          return `https://pub-3433478e81804444ae052b8316ad0d83.r2.dev${cleanPath}`;
        }));
      } else {
        for (const imgRelPath of data.originalImages) {
          // e.g. "images/Business_name.jpg" or "https://..."
          if (!imgRelPath.startsWith('http')) {
             const srcPath = path.join(dirPath, imgRelPath);
             if (fs.existsSync(srcPath)) {
               const ext = path.extname(srcPath);
               const newImgName = `${slug}-${newImages.length + 1}${ext}`;
               const destPath = path.join(SEED_IMAGE_DIR, newImgName);
               await fsPromises.copyFile(srcPath, destPath);
               newImages.push(`https://pub-3433478e81804444ae052b8316ad0d83.r2.dev/images/businesses/${newImgName}`);
             }
          } else {
             newImages.push(imgRelPath);
          }
        }
      }

      // 4. Generate Frontmatter YAML
      let frontmatter = `---\n`;
      frontmatter += `title: "${escapeYaml(data.name)}"\n`;
      frontmatter += `slug: "${slug}"\n`;
      frontmatter += `category: "${escapeYaml(data.category)}"\n`;
      frontmatter += `district: "${escapeYaml(data.district)}"\n`;
      frontmatter += `metaTitle: "${escapeYaml(metaTitle)}"\n`;
      frontmatter += `metaDescription: "${escapeYaml(metaDesc)}"\n`;
      
      if (data.address) frontmatter += `address: "${escapeYaml(data.address)}"\n`;
      if (data.phone) frontmatter += `phone: "${escapeYaml(data.phone)}"\n`;
      if (data.website) frontmatter += `website: "${escapeYaml(data.website)}"\n`;
      if (data.mapLink) frontmatter += `mapLink: "${escapeYaml(data.mapLink)}"\n`;
      if (data.lat) frontmatter += `lat: ${data.lat}\n`;
      if (data.lng) frontmatter += `lng: ${data.lng}\n`;
      if (data.rating) frontmatter += `rating: ${data.rating}\n`;
      if (data.reviewsCount) frontmatter += `reviewsCount: ${data.reviewsCount}\n`;
      if (data.price) frontmatter += `price: "${escapeYaml(data.price)}"\n`;
      
      if (data.services.length > 0) {
        frontmatter += `services:\n`;
        for (const s of data.services) frontmatter += `  - "${escapeYaml(s)}"\n`;
      }
      
      if (data.hours.length > 0) {
        frontmatter += `hours:\n`;
        for (const h of data.hours) frontmatter += `  - "${escapeYaml(h)}"\n`;
      }

      if (newImages.length > 0) {
        frontmatter += `images:\n`;
        for (const img of newImages) frontmatter += `  - "${img}"\n`;
      }
      
      frontmatter += `---\n\n`;

      // 5. Generate Body Content
      let bodyContent = ``;
      if (data.description) {
        bodyContent += `## About ${data.name}\n${data.description}\n\n`;
      }
      
      if (data.topReviews.length > 0) {
        bodyContent += `## Top Reviews\n`;
        for (const rev of data.topReviews) {
           bodyContent += `> "${rev.text}"\n> **- ${rev.author} (${rev.rating}/5)**\n\n`;
        }
      }

      const finalMarkdown = frontmatter + bodyContent;
      const finalPath = path.join(SEED_CONTENT_DIR, `${slug}.md`);
      
      await fsPromises.writeFile(finalPath, finalMarkdown);
      processedCount++;
      if (processedCount % 100 === 0) {
        console.log(`Processed ${processedCount} businesses...`);
      }
    }
  }
  
  console.log(`Successfully generated site seed with ${processedCount} business pages!`);
}

generateSiteSeed().catch(console.error);
