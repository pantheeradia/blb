/**
 * Applies migration 005 (seed instant premix products) to the configured Turso DB.
 *
 * Idempotent: uses INSERT OR REPLACE, so it is safe to run multiple times.
 * Mirrors scripts/migrations/005-seed-instant-premix-products.sql.
 *
 * Run:
 *   npx tsx scripts/apply-migration-005.ts
 */

import { createClient } from "@libsql/client";
import { readFileSync, existsSync } from "fs";
import path from "path";

// Tolerant .env loader (same pattern as other scripts).
function loadEnv(file: string) {
  if (!existsSync(file)) return;
  const content = readFileSync(file, "utf8");
  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadEnv(path.join(process.cwd(), ".env"));
loadEnv(path.join(process.cwd(), ".env.local"));

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "file:./local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  console.log("Target DB:", process.env.TURSO_DATABASE_URL ?? "file:./local.db");

  // Read the SQL migration file
  const migrationPath = path.join(process.cwd(), "scripts/migrations/005-seed-instant-premix-products.sql");
  const sql = readFileSync(migrationPath, "utf-8");

  // Remove comment lines and split by semicolon
  const lines = sql.split("\n")
    .filter(line => !line.trim().startsWith("--"))
    .join("\n");

  const statements = lines
    .split(";")
    .map(s => s.trim())
    .filter(s => s.length > 0);

  let executed = 0;
  for (const statement of statements) {
    try {
      await client.execute(statement);
      executed++;
    } catch (err) {
      console.error("❌ Failed to execute statement:", err);
      console.error("Statement:", statement.substring(0, 200) + "...");
      throw err;
    }
  }

  console.log(`✅ Migration 005 complete: ${executed} products inserted/updated`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Migration 005 failed:", err);
    process.exit(1);
  });
