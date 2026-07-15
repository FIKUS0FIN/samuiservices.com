import "dotenv/config";
import { execSync } from 'child_process';
import fs from 'fs';

// Local Ollama configuration
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b'; // Qwen2.5 is excellent for structured JSON output

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Listing {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName?: string;
}

const generateSEOContent = async (listing: Listing, categories: Category[]) => {
  const categoryOptions = categories.map(c => `- ${c.name} (Slug: ${c.slug}, ID: ${c.id})`).join('\n');
  
  const prompt = `
You are an expert SEO Content Writer and Keyword Strategist for a business directory in Koh Samui, Thailand.

Business Name: ${listing.name}
Current Description: ${listing.description || 'No description provided.'}

Your task is to:
1. Rewrite the business description to be highly appealing, error-free, and informative. Ensure it is unique for Google search optimization. Use Markdown (headings, bold, bullet points if necessary). Include E-E-A-T signals.
2. Determine the best PRIMARY category for this business from the list provided below.
3. Determine any SECONDARY categories if the business fits multiple categories (e.g. a "Spa and Resort" would have a primary of "Resorts" and secondary of "Spas & Massage"). Use the slugs of the categories.

Available Categories:
${categoryOptions}

Respond ONLY with a raw valid JSON object (no markdown code blocks, no other text). The JSON must have this exact structure:
{
  "description": "Your SEO optimized markdown description here...",
  "primaryCategoryId": "the exact ID of the primary category",
  "secondaryCategorySlugs": "comma,separated,slugs,if,any,otherwise,empty,string"
}
`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2 * 60 * 1000); // 2 min timeout

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: controller.signal,
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: prompt,
      stream: false,
      format: "json", // Enforce JSON format for Ollama
      options: {
        temperature: 0.3,
        num_ctx: 4096,
      }
    })
  });
  clearTimeout(timeout);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama API Error: ${errorText}`);
  }

  const data = await response.json() as any;
  return JSON.parse(data.response.trim());
};

async function main() {
  console.log(`Connecting to local Ollama at ${OLLAMA_URL} using model ${OLLAMA_MODEL}...`);
  
  try {
    const checkRes = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!checkRes.ok) throw new Error(`Ollama returned status ${checkRes.status}`);
  } catch (e) {
    console.error(`Error: Could not connect to local Ollama server at ${OLLAMA_URL}.`);
    process.exit(1);
  }

  console.log("Fetching Categories from D1...");
  const catOutput = execSync('npx wrangler d1 execute samui-services-db --remote --command "SELECT id, name, slug FROM Category" --json', { maxBuffer: 50 * 1024 * 1024 }).toString();
  const categories: Category[] = JSON.parse(catOutput)[0].results;
  console.log(`Found ${categories.length} categories.`);

  console.log("Fetching Listings from D1...");
  // You can modify the WHERE clause or LIMIT to process a subset if needed.
  // We'll exclude those that already have a secondaryCategories field set if we run this multiple times.
  const limit = process.env.LIMIT || 10; // Processing 10 by default to be safe, you can adjust
  const query = `SELECT id, name, description, categoryId FROM Listing WHERE secondaryCategories IS NULL LIMIT ${limit}`;
  const listOutput = execSync(`npx wrangler d1 execute samui-services-db --remote --command "${query}" --json`, { maxBuffer: 50 * 1024 * 1024 }).toString();
  
  if (!listOutput || listOutput.trim() === '') {
    console.error("D1 returned empty output");
    return;
  }
  
  const parsedOutput = JSON.parse(listOutput);
  if (parsedOutput.length === 0 || !parsedOutput[0].results) {
    console.log("No listings found that need categorization.");
    return;
  }
  const listings: Listing[] = parsedOutput[0].results;

  if (listings.length === 0) {
    console.log("No listings found that need categorization.");
    return;
  }
  console.log(`Found ${listings.length} listings to process.`);

  const migrationFile = 'seo_categorization_migration.sql';
  // Add the schema update to the top of the migration if it doesn't exist
  if (!fs.existsSync(migrationFile)) {
    fs.writeFileSync(migrationFile, '-- Generated SEO Migrations\n\n');
  }

  let successCount = 0;
  
  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i];
    console.log(`\\nProcessing [${i + 1}/${listings.length}]: ${listing.name}`);
    
    try {
      const result = await generateSEOContent(listing, categories);
      
      const newDescription = result.description.replace(/'/g, "''");
      const newPrimary = result.primaryCategoryId;
      const newSecondary = result.secondaryCategorySlugs || '';

      const updateSql = `UPDATE Listing SET description = '${newDescription}', categoryId = '${newPrimary}', secondaryCategories = '${newSecondary}' WHERE id = '${listing.id}';\n`;
      fs.appendFileSync(migrationFile, updateSql);
      
      successCount++;
      console.log(` -> Assigned Primary: ${newPrimary}`);
      console.log(` -> Assigned Secondary: ${newSecondary}`);
      
      // Give local GPU a tiny breather
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      console.error(`Failed to process ${listing.name}:`, error.message);
    }
  }

  console.log(`\\nSuccessfully processed ${successCount}/${listings.length} listings.`);
  console.log(`Migration script saved to ${migrationFile}`);
  console.log(`To apply to production run: npx wrangler d1 execute samui-services-db --remote --file=${migrationFile}`);
}

main().catch(console.error);
