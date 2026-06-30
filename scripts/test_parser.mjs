import fsPromises from 'fs/promises';
import path from 'path';

async function testParse() {
  const filePath = '/Users/dimasymonenko/AdMeSamui/SamuiBusinesCatalog/Koh Samui/Ban Tai/Cape Away Beach Bar.md';
  const content = await fsPromises.readFile(filePath, 'utf-8');
  
  // Basic Regex parsing
  const nameMatch = content.match(/^# (.*)$/m);
  const categoryMatch = content.match(/\*\*Category:\*\* (.*)$/m);
  const districtMatch = content.match(/\*\*District:\*\* (.*)$/m);
  const phoneMatch = content.match(/\*\*Phone:\*\* (.*)$/m); // There are two phones sometimes, take the Google one if it exists
  const addressMatch = content.match(/\*\*Address:\*\* (.*)$/m);
  const ratingMatch = content.match(/\*\*Rating:\*\* (.*)$/m);
  const images = [...content.matchAll(/!\[.*?\]\((.*?)\)/g)].map(m => m[1]);
  
  const data = {
    name: nameMatch ? nameMatch[1] : null,
    category: categoryMatch ? categoryMatch[1] : null,
    district: districtMatch ? districtMatch[1] : null,
    address: addressMatch ? addressMatch[1] : null,
    phone: phoneMatch ? phoneMatch[1] : null,
    rating: ratingMatch ? ratingMatch[1] : null,
    images: images
  };
  
  console.log(data);
}
testParse();
