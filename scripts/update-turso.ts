import { createClient } from '@libsql/client';

const client = createClient({
  url: 'libsql://samuiservice-sqldb-render-test-ds-root.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODI0NTk5NjksImlkIjoiMDE5ZjAyZTQtNjYwMS03NzRhLTk5MTctNTBmMzI2MDBhMjZlIiwicmlkIjoiNDVkMDQxN2YtNTBiZS00Y2ZkLTgwMGUtMDczNDdkN2YxZWVmIn0.1QEgz3T6dRjM_SgtdU4C_SpAVwnwFXH33kRo3PzkqNvWGc6TH96g6D2QXuszrFnhTrODKzM-JoGnFPIsWjOWBg'
});

async function main() {
  try {
    const res = await client.execute(`ALTER TABLE "Category" ADD COLUMN "parentId" TEXT REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;`);
    console.log("Success:", res);
  } catch (err) {
    console.error(err);
  }
}

main();
