import { createClient } from "@libsql/client";
import fs from "fs";

const dbUrl = "libsql://samuiservice-sqldb-render-test-ds-root.aws-us-east-2.turso.io";
const token = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODI0NTk5NjksImlkIjoiMDE5ZjAyZTQtNjYwMS03NzRhLTk5MTctNTBmMzI2MDBhMjZlIiwicmlkIjoiNDVkMDQxN2YtNTBiZS00Y2ZkLTgwMGUtMDczNDdkN2YxZWVmIn0.1QEgz3T6dRjM_SgtdU4C_SpAVwnwFXH33kRo3PzkqNvWGc6TH96g6D2QXuszrFnhTrODKzM-JoGnFPIsWjOWBg";

const client = createClient({
  url: dbUrl,
  authToken: token
});

async function main() {
  console.log("Reading migration SQL...");
  const sql = fs.readFileSync("./prisma/migrations/0001_create_tables.sql", "utf8");
  
  console.log("Applying schema to Turso...");
  await client.executeMultiple(sql);
  
  console.log("Schema applied successfully!");
}

main().catch(e => {
  console.error("Error applying schema:", e);
  process.exit(1);
});
