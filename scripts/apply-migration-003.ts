/**
 * Applies migration 003 (add premix subcategories) to the configured Turso DB.
 *
 * Updates the products table category CHECK constraint to include:
 *   non-milk-tea, milk-tea, matcha-tea, malt-protein, filter-coffee-decoction, merchandise-accessories
 *
 * Idempotent: checks if the constraint already allows these categories.
 *
 * Run:
 *   npx tsx scripts/apply-migration-003.ts
 */

import { createClient } from "@libsql/client";
import { readFileSync, existsSync } from "fs";
import path from "path";

// Tolerant .env loader
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

  // Check if the constraint already includes the new categories
  const schemaResult = await client.execute({
    sql: `SELECT sql FROM sqlite_master WHERE type='table' AND name='products'`,
  });

  if (schemaResult.rows.length === 0) {
    console.error("❌ Products table not found");
    process.exit(1);
  }

  const currentSchema = schemaResult.rows[0].sql as string;
  console.log("Current schema check:", currentSchema);

  // Check if the new categories are already in the constraint
  const hasNewCategories =
    currentSchema.includes("non-milk-tea") &&
    currentSchema.includes("milk-tea") &&
    currentSchema.includes("matcha-tea") &&
    currentSchema.includes("malt-protein");

  if (hasNewCategories) {
    console.log("ℹ️  Premix categories already added, skipping migration");
    process.exit(0);
  }

  console.log("⚠️  This migration will recreate the products table.");
  console.log("Please ensure you have a backup of your database.");
  console.log("Proceed? (y/n)");

  // For automated execution, we'll proceed. For manual, you'd want to add confirmation logic.
  console.log("Proceeding with migration...");

  try {
    await client.execute("BEGIN TRANSACTION");

    // Create new table with updated constraint
    await client.execute(`
      CREATE TABLE products_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        short_description TEXT NOT NULL DEFAULT '',
        description TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL CHECK (category IN ('ground-coffee','whole-bean','instant-premix','non-milk-tea','milk-tea','matcha-tea','malt-protein','filter-coffee-decoction','merchandise-accessories')),
        price REAL NOT NULL,
        regular_price REAL,
        images TEXT NOT NULL DEFAULT '[]',
        tags TEXT NOT NULL DEFAULT '[]',
        in_stock INTEGER NOT NULL DEFAULT 1,
        weight TEXT,
        weight_options TEXT NOT NULL DEFAULT '[]',
        brewing_equipment_options TEXT NOT NULL DEFAULT '[]',
        notes TEXT NOT NULL DEFAULT '[]',
        roast TEXT,
        blend TEXT,
        featured INTEGER NOT NULL DEFAULT 0,
        visible INTEGER NOT NULL DEFAULT 1,
        ean TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // Copy data
    await client.execute("INSERT INTO products_new SELECT * FROM products");

    // Drop old table
    await client.execute("DROP TABLE products");

    // Rename new table
    await client.execute("ALTER TABLE products_new RENAME TO products");

    // Recreate indexes
    await client.execute("CREATE INDEX idx_products_category ON products (category)");
    await client.execute("CREATE INDEX idx_products_featured ON products (featured)");

    await client.execute("COMMIT");

    console.log("✅ Migration 003 complete - premix categories added");
  } catch (error) {
    await client.execute("ROLLBACK");
    console.error("❌ Migration 003 failed:", error);
    process.exit(1);
  }

  client.close();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  });
