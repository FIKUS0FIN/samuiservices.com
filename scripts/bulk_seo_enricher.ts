import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

// Ensure you have OPENAI_API_KEY set in your environment variables.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("Please set OPENAI_API_KEY environment variable before running this script.");
  process.exit(1);
}

const generateSEOContent = async (businessName: string, categoryName: string, islandName: string, currentDescription: string) => {
  const prompt = `
    You are an expert SEO Content Writer and Keyword Strategist.
    
    Business Name: ${businessName}
    Category: ${categoryName}
    Location: ${islandName}, Koh Samui, Thailand
    Current Description: ${currentDescription || 'No description provided.'}
    
    Your task is to rewrite the business description based on these guidelines:
    1. Hook the reader immediately and state the value proposition.
    2. Write comprehensive, engaging body content using natural keyword integration (aim for 0.5-1.5% density for primary keywords like the category and location).
    3. Include E-E-A-T signals (e.g., mention expertise, reliability, and local presence in Koh Samui).
    4. Use Markdown formatting. Include clear subheadings (H2/H3), bullet points for scannability, and bold text for emphasis.
    5. Conclude with a strong call-to-action (e.g., inviting them to visit or contact).
    6. Ensure the tone is professional, welcoming, and helpful to tourists and expats in Koh Samui.
    
    Output ONLY the rewritten Markdown description. Do not include any other conversational text.
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API Error: ${errorText}`);
  }

  const data = await response.json() as any;
  return data.choices[0].message.content.trim();
};

async function main() {
  console.log("Fetching listings from local database...");
  // You can limit this or add a where clause if you want to process in batches
  const listings = await prisma.listing.findMany({
    include: {
      category: true,
      island: true,
    }
  });

  console.log(`Found ${listings.length} listings to process.`);
  
  const migrationFile = 'seo_migration.sql';
  fs.writeFileSync(migrationFile, '-- Generated SEO Migrations\n\n');

  let successCount = 0;
  
  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i];
    console.log(`Processing [${i + 1}/${listings.length}]: ${listing.name}...`);
    
    try {
      const newDescription = await generateSEOContent(
        listing.name,
        listing.category.name,
        listing.island.name,
        listing.description || ''
      );

      // Save to local DB
      await prisma.listing.update({
        where: { id: listing.id },
        data: { description: newDescription }
      });

      // Append to migration file for remote D1 execution
      const escapedDescription = newDescription.replace(/'/g, "''");
      fs.appendFileSync(migrationFile, `UPDATE Listing SET description = '${escapedDescription}' WHERE id = '${listing.id}';\n`);
      
      successCount++;
      // Sleep slightly to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to process ${listing.name}:`, error);
    }
  }

  console.log(`\nSuccessfully enriched ${successCount}/${listings.length} listings.`);
  console.log(`Migration script saved to ${migrationFile}`);
  console.log(`Run: npx wrangler d1 execute samui-services-db --remote --file=${migrationFile}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
