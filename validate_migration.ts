import fs from 'fs';
import { execSync } from 'child_process';

console.log("Fetching Categories from D1...");
const catOutput = execSync('npx wrangler d1 execute samui-services-db --remote --command "SELECT id FROM Category" --json', { maxBuffer: 50 * 1024 * 1024 }).toString();
const categories = JSON.parse(catOutput)[0].results;
const validIds = new Set(categories.map((c: any) => c.id));

const sql = fs.readFileSync('seo_categorization_migration.sql', 'utf8');
const statements = sql.split(';\n').filter(s => s.trim().length > 0);

console.log(`Checking ${statements.length} statements...`);

let invalidCount = 0;
const invalidIds = new Set<string>();

const newStatements: string[] = [];

for (const stmt of statements) {
  const match = stmt.match(/categoryId = '([^']+)'/);
  if (match) {
    const cid = match[1];
    if (!validIds.has(cid)) {
      console.log(`Invalid categoryId found: ${cid}`);
      invalidIds.add(cid);
      invalidCount++;
      continue; // Skip this statement
    }
  }
  newStatements.push(stmt + ';\n');
}

console.log(`Found ${invalidCount} invalid statements out of ${statements.length}`);

fs.writeFileSync('seo_categorization_migration.sql', newStatements.join(''));
console.log("Cleaned migration file.");
