/**
 * Applies migration 004 (rename instant_premix_options to options) to the configured Turso DB.
 *
 * Idempotent: checks pragma_table_info before each ALTER, so it is safe to
 * run multiple times. Mirrors scripts/migrations/004-rename-instant-premix-options-to-options.sql.
 *
 * Run:
 *   npx tsx scripts/apply-migration-004.ts
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

async function hasColumn(table: string, column: string): Promise<boolean> {
  const res = await client.execute({
    sql: `SELECT name FROM pragma_table_info(?) WHERE name = ?`,
    args: [table, column],
  });
  return res.rows.length > 0;
}

async function renameColumn(table: string, oldColumn: string, newColumn: string) {
  // Check if old column exists
  if (!(await hasColumn(table, oldColumn))) {
    console.log(`ℹ️  ${table}.${oldColumn} does not exist, skipping rename`);
    return;
  }
  // Check if new column already exists (to avoid duplicate rename)
  if (await hasColumn(table, newColumn)) {
    console.log(`ℹ️  ${table}.${newColumn} already exists, skipping rename`);
    return;
  }
  await client.execute(`ALTER TABLE ${table} RENAME COLUMN ${oldColumn} TO ${newColumn}`);
  console.log(`✅ Renamed ${table}.${oldColumn} to ${table}.${newColumn}`);
}

async function main() {
  console.log("Target DB:", process.env.TURSO_DATABASE_URL ?? "file:./local.db");
  await renameColumn("products", "instant_premix_options", "options");
  console.log("✅ Migration 004 complete");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Migration 004 failed:", err);
    process.exit(1);
  });
