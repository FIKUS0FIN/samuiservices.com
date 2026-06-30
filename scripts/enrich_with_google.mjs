import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';
import https from 'https';

const API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyC1ETrImW9Q_lOxGsHwPqoDCoWfmqJM8SU';
const CATALOG_DIR = path.join(process.cwd(), 'SamuiBusinesCatalog', 'Koh Samui');

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', (err) => fs.unlink(filepath, () => reject(err)));
    }).on('error', reject);
  });
}

async function findPlaceId(businessName) {
  const query = encodeURIComponent(`${businessName} Koh Samui`);
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id&key=${API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  if (data.status === 'OK' && data.candidates && data.candidates.length > 0) {
    return data.candidates[0].place_id;
  }
  return null;
}

async function getPlaceDetails(placeId) {
  const fields = 'name,rating,formatted_phone_number,formatted_address,opening_hours,website,photos,reviews,url,price_level,types,user_ratings_total,editorial_summary';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;
  
  const response = await fetch(url);
  return await response.json();
}

async function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  const content = await fsPromises.readFile(filePath, 'utf-8');
  
  const nameMatch = content.match(/^# (.*)$/m);
  if (!nameMatch) return;
  const businessName = nameMatch[1].trim();
  
  // Clean old enriched data if we want to overwrite, but let's just skip if already enriched
  if (content.includes('## Google Maps Data')) {
    console.log(`  Already enriched. Skipping.`);
    return;
  }
  
  const placeId = await findPlaceId(businessName);
  if (!placeId) {
    console.log(`  Place not found on Google for ${businessName}.`);
    return;
  }
  
  const data = await getPlaceDetails(placeId);
  if (data.status !== 'OK') {
    console.log(`  Failed to get details for Place ID ${placeId}.`);
    return;
  }
  
  const place = data.result;
  
  let googleSection = `\n## Google Maps Data\n`;
  
  if (place.editorial_summary && place.editorial_summary.overview) {
    googleSection += `**Description:** ${place.editorial_summary.overview}\n\n`;
  }
  
  if (place.formatted_address) googleSection += `**Address:** ${place.formatted_address}\n`;
  if (place.formatted_phone_number) googleSection += `**Phone:** ${place.formatted_phone_number}\n`;
  if (place.website) googleSection += `**Website:** ${place.website}\n`;
  if (place.rating) googleSection += `**Rating:** ${place.rating}/5.0 (${place.user_ratings_total} reviews)\n`;
  
  if (place.price_level !== undefined) {
    const priceIndicator = '$'.repeat(place.price_level + 1); // 0 = $, 1 = $$, 2 = $$$, etc.
    googleSection += `**Price Level:** ${priceIndicator}\n`;
  }
  
  if (place.types && place.types.length > 0) {
    const categories = place.types.filter(t => t !== 'point_of_interest' && t !== 'establishment').join(', ').replace(/_/g, ' ');
    if (categories) googleSection += `**Services & Categories:** ${categories}\n`;
  }
  
  if (place.url) googleSection += `**Google Maps Link:** ${place.url}\n`;
  
  if (place.opening_hours && place.opening_hours.weekday_text) {
    googleSection += `\n### Working Hours\n`;
    for (const day of place.opening_hours.weekday_text) {
      googleSection += `- ${day}\n`;
    }
  }
  
  if (place.reviews && place.reviews.length > 0) {
    googleSection += `\n### Top Reviews\n`;
    for (const review of place.reviews.slice(0, 3)) { 
      const rating = review.rating || 'N/A';
      const author = review.author_name || 'Anonymous';
      const text = review.text ? review.text.replace(/\n/g, ' ') : '';
      if (text) {
        googleSection += `- **${author}** (${rating}/5): "${text}"\n`;
      }
    }
  }
  
  if (place.photos && place.photos.length > 0) {
    const imagesDir = path.join(path.dirname(filePath), 'images');
    await fsPromises.mkdir(imagesDir, { recursive: true });
    
    googleSection += `\n### Gallery\n`;
    
    // Download top 2 photos and embed local links to protect API key
    for (let i = 0; i < Math.min(2, place.photos.length); i++) {
      const photoRef = place.photos[i].photo_reference;
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${API_KEY}`;
      const safeName = businessName.replace(/[/\\?%*:|"<>]/g, '-');
      const filename = `${safeName}_google_${i+1}.jpg`;
      const localPath = path.join(imagesDir, filename);
      
      try {
        await downloadImage(photoUrl, localPath);
        googleSection += `![Google Photo ${i+1}](images/${filename})\n`;
      } catch (err) {
        console.error(`  Failed to download photo ${i+1}: ${err.message}`);
      }
    }
  }
  
  const newContent = content + googleSection;
  await fsPromises.writeFile(filePath, newContent);
  console.log(`  Enriched ${businessName} successfully!`);
}

async function run() {
  const targetDistrict = process.argv[2];
  
  if (targetDistrict) {
    const dirPath = path.join(CATALOG_DIR, targetDistrict);
    const files = await fsPromises.readdir(dirPath);
    for (const file of files) {
      if (file.endsWith('.md')) {
        await processFile(path.join(dirPath, file));
        await new Promise(r => setTimeout(r, 500));
      }
    }
  } else {
    const districts = await fsPromises.readdir(CATALOG_DIR);
    for (const district of districts) {
      const dirPath = path.join(CATALOG_DIR, district);
      const stat = await fsPromises.stat(dirPath);
      if (stat.isDirectory()) {
        const files = await fsPromises.readdir(dirPath);
        for (const file of files) {
          if (file.endsWith('.md')) {
            await processFile(path.join(dirPath, file));
            await new Promise(r => setTimeout(r, 500));
          }
        }
      }
    }
  }
  console.log('Done!');
}

run().catch(console.error);
