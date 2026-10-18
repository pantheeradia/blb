/**
 * Update Filter Coffee Decoction product image
 * Run: npx tsx scripts/update-filter-decoction.ts
 */

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import { products } from "../src/db/schema";

const libsql = createClient({ url: "file:./local.db" });
const db = drizzle(libsql, { schema: { products } });

async function main() {
  console.log("Updating Filter Coffee Decoction product image...");

  const result = await db
    .update(products)
    .set({ images: JSON.stringify(["/images/traditional.webp"]) })
    .where(eq(products.slug, "south---indian---filter--coffee--decoction"))
    .returning();

  console.log(`✅ Updated ${result.length} product(s)`);
  libsql.close();
}

main().catch((e) => {
  console.error("❌ Failed:", e);
  process.exit(1);
});
