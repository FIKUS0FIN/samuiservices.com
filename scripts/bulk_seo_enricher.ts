import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from "@prisma/adapter-libsql";
import fs from 'fs';

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaLibSql({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const prisma = new PrismaClient({
  adapter
});

// Local Ollama configuration
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'phi4-mini';

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
    
    Output ONLY the rewritten Markdown description. Do not include any other conversational text or surrounding quotes.
  `;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5 * 60 * 1000); // 5 min timeout

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: controller.signal,
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.7,
        num_ctx: 4096,  // Match the 4k context we set in Ollama settings
      }
    })
  });
  clearTimeout(timeout);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama API Error: ${errorText}`);
  }

  const data = await response.json() as any;
  return data.response.trim();
};

async function main() {
  console.log(`Connecting to local Ollama at ${OLLAMA_URL} using model ${OLLAMA_MODEL}...`);
  
  // Verify Ollama connection
  try {
    const checkRes = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!checkRes.ok) throw new Error(`Ollama returned status ${checkRes.status}`);
  } catch (e) {
    console.error(`Error: Could not connect to local Ollama server at ${OLLAMA_URL}. Make sure Ollama is running.`);
    process.exit(1);
  }

  console.log("Fetching listings from local database...");
  
  // Batch configuration (defaults to 50, customizable via LIMIT env var)
  const limit = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : 50;
  
  // Use raw SQL to precisely target stub descriptions:
  //   - Empty or null descriptions
  //   - Descriptions that START with "## Top Reviews" AND are short (< 500 chars)
  //     → true placeholder stubs, not AI-generated content that uses "## Top Reviews" as a heading
  const rawListings = await prisma.$queryRawUnsafe<any[]>(`
    SELECT l.id, l.name, l.description, l.slug,
           c.name as categoryName,
           i.name as islandName
    FROM Listing l
    JOIN Category c ON l.categoryId = c.id
    JOIN Island i ON l.islandId = i.id
    WHERE l.description IS NULL
       OR l.description = ''
       OR (l.description LIKE '## Top Reviews%' AND LENGTH(l.description) < 500)
    LIMIT ${limit}
  `);

  // Shape into the same structure the rest of the script expects
  const listings = rawListings.map((r: any) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    slug: r.slug,
    category: { name: r.categoryName },
    island: { name: r.islandName },
  }));

  if (listings.length === 0) {
    console.log("No listings found that require SEO description enrichment.");
    return;
  }

  console.log(`Found ${listings.length} listings to process (Batch Limit: ${limit}).`);
  
  const migrationFile = 'seo_migration.sql';
  // If there's an existing migration file, we append to it or keep it clean
  fs.writeFileSync(migrationFile, '-- Generated SEO Migrations with Local AI\n\n');

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
      // Give a tiny breather to the local CPU/GPU running Ollama
      await new Promise(resolve => setTimeout(resolve, 100));
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
