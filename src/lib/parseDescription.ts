export interface ScrapedReview {
  text: string;
  author: string;
  rating: number;
}

export function parseDescriptionAndReviews(
  rawText: string | null | undefined, 
  businessName: string, 
  categoryName: string, 
  islandName: string
): { description: string, reviews: ScrapedReview[] } {
  const defaultDesc = `${businessName} is a top-rated ${categoryName?.toLowerCase() || 'local business'} located in ${islandName}, Koh Samui. Explore our services, photos, and reviews, and get in touch today!`;
  
  if (!rawText) {
    return { description: defaultDesc, reviews: [] };
  }

  const parts = rawText.split('## Top Reviews');
  let description = parts[0].trim();
  
  if (!description) {
    description = defaultDesc;
  }

  const reviewsText = parts.length > 1 ? parts[1].trim() : '';
  const reviews: ScrapedReview[] = [];

  if (reviewsText) {
    // Each review is formatted like:
    // > "review text"
    // > **- Author Name (4/5/5)**
    const blocks = reviewsText.split('\n\n');
    
    for (const block of blocks) {
      if (!block.trim()) continue;
      
      const textMatch = block.match(/>\s*"([\s\S]*?)"/);
      const authorMatch = block.match(/>\s*\*\*\s*-\s*([\s\S]*?)\s*(?:\(([\s\S]*?)\))?\*\*/);
      
      if (textMatch) {
        let text = textMatch[1].trim();
        let author = authorMatch ? authorMatch[1].trim() : 'Guest';
        let rating = 5; // default to 5
        
        if (authorMatch && authorMatch[2]) {
          // Parse rating from format like "4/5/5" -> take first number
          const num = parseInt(authorMatch[2].split('/')[0], 10);
          if (!isNaN(num) && num >= 1 && num <= 5) {
            rating = num;
          }
        }
        
        // Sometimes author might include the rating if regex missed it, clean it up
        author = author.replace(/\(\d+\/\d+\/\d+\)/g, '').trim();

        reviews.push({ text, author, rating });
      }
    }
  }

  return { description, reviews };
}
