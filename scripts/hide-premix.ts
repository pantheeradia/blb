/**
 * Hide all instant-premix products to test the Coming Soon banner
 * Run: npx tsx scripts/hide-premix.ts
 */

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import { products } from "../src/db/schema";

const libsql = createClient({ url: "file:./local.db" });
const db = drizzle(libsql, { schema: { products } });

async function main() {
  console.log("Hiding all instant-premix products...");

  const result = await db
    .update(products)
    .set({ visible: false })
    .where(eq(products.category, "instant-premix"))
    .returning();

  console.log(`✅ Hidden ${result.length} instant-premix products`);
  libsql.close();
}

main().catch((e) => {
  console.error("❌ Failed:", e);
  process.exit(1);
});
