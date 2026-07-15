import fs from 'fs';
import { execSync } from 'child_process';

const sql = fs.readFileSync('seo_categorization_migration.sql', 'utf8');
const statements = sql.split(';\n').filter(s => s.trim().length > 0);

console.log(`Found ${statements.length} statements.`);

const BATCH_SIZE = 20;
let batchCount = 0;

for (let i = 0; i < statements.length; i += BATCH_SIZE) {
  const batch = statements.slice(i, i + BATCH_SIZE).map(s => s + ';').join('\n');
  const filename = `temp_migration_batch_${batchCount}.sql`;
  fs.writeFileSync(filename, batch);
  console.log(`Executing batch ${batchCount} (Statements ${i} to ${i + batch.length - 1})...`);
  try {
    execSync(`npx wrangler d1 execute samui-services-db --remote --file=${filename}`, { stdio: 'inherit' });
    console.log(`Successfully executed batch ${batchCount}`);
  } catch (e) {
    console.error(`Failed on batch ${batchCount}`);
    process.exit(1);
  }
  fs.unlinkSync(filename);
  batchCount++;
}

console.log('All migrations applied successfully!');
