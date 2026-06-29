import { createClient } from '@libsql/client';

const client = createClient({
  url: 'libsql://samuiservice-sqldb-render-test-ds-root.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODI0NTk5NjksImlkIjoiMDE5ZjAyZTQtNjYwMS03NzRhLTk5MTctNTBmMzI2MDBhMjZlIiwicmlkIjoiNDVkMDQxN2YtNTBiZS00Y2ZkLTgwMGUtMDczNDdkN2YxZWVmIn0.1QEgz3T6dRjM_SgtdU4C_SpAVwnwFXH33kRo3PzkqNvWGc6TH96g6D2QXuszrFnhTrODKzM-JoGnFPIsWjOWBg'
});

async function main() {
  try {
    // Let's see the schema of Category
    const res = await client.execute(`PRAGMA table_info("Category");`);
    console.log("Category columns:", res.rows);
  } catch (err) {
    console.error(err);
  }
}

main();
