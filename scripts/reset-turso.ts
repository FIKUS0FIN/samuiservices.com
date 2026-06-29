import { createClient } from '@libsql/client';
import fs from 'fs';

const client = createClient({
  url: 'libsql://samuiservice-sqldb-render-test-ds-root.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODI0NTk5NjksImlkIjoiMDE5ZjAyZTQtNjYwMS03NzRhLTk5MTctNTBmMzI2MDBhMjZlIiwicmlkIjoiNDVkMDQxN2YtNTBiZS00Y2ZkLTgwMGUtMDczNDdkN2YxZWVmIn0.1QEgz3T6dRjM_SgtdU4C_SpAVwnwFXH33kRo3PzkqNvWGc6TH96g6D2QXuszrFnhTrODKzM-JoGnFPIsWjOWBg'
});

async function main() {
  try {
    // 1. Drop all tables
    const res = await client.execute(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`);
    const tables = res.rows.map(row => row.name as string);
    console.log("Dropping tables:", tables);
    
    // 2. Read full_schema.sql
    const schemaSql = fs.readFileSync('full_schema.sql', 'utf-8');
    
    // 3. Build single script
    let fullScript = `PRAGMA foreign_keys = OFF;\n`;
    for (const table of tables) {
      fullScript += `DROP TABLE IF EXISTS "${table}";\n`;
    }
    fullScript += schemaSql;
    
    // 4. Execute all at once
    await client.executeMultiple(fullScript);
    
    console.log("Schema successfully applied to Turso!");
  } catch (err) {
    console.error(err);
  }
}

main();
