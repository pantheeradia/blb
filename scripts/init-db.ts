/**
 * Initialize database by running the DDL script
 * Run: npx tsx scripts/init-db.ts
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import path from "path";

const client = createClient({
  url: "file:./local.db",
});

async function main() {
  console.log("Initializing database...");

  const ddlPath = path.join(process.cwd(), "scripts", "turso-ddl.sql");
  const ddl = readFileSync(ddlPath, "utf8");

  // Split by semicolon and execute each statement
  const statements = ddl
    .split(";")
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith("--"));

  for (const stmt of statements) {
    try {
      await client.execute(stmt);
    } catch (error) {
      // Ignore errors for "already exists" or duplicate inserts
      if (!String(error).includes("already exists") && !String(error).includes("UNIQUE")) {
        console.error("Error executing statement:", stmt.substring(0, 100));
        console.error(error);
      }
    }
  }

  console.log("✅ Database initialized");
  client.close();
}

main().catch((e) => {
  console.error("❌ Failed:", e);
  process.exit(1);
});
