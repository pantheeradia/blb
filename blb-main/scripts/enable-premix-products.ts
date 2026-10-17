/**
 * Enable visibility for all premix products
 * Run: npx tsx scripts/enable-premix-products.ts
 */

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { products } from "../src/db/schema";
import { eq } from "drizzle-orm";

const libsql = createClient({ url: process.env.TURSO_DATABASE_URL ?? "file:./local.db", authToken: process.env.TURSO_AUTH_TOKEN });
const db = drizzle(libsql, { schema: { products } });

async function main() {
  const premixCategories = ["instant-premix", "non-milk-tea", "milk-tea", "matcha-tea", "malt-protein"];
  
  for (const category of premixCategories) {
    await db
      .update(products)
      .set({ visible: true })
      .where(eq(products.category, category));
    
    console.log(`Updated ${category} products to visible`);
  }
  
  console.log("Done! All premix products are now visible.");
  libsql.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
