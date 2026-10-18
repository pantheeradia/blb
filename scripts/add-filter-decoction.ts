/**
 * Add Filter Coffee Decoction product to the database
 * Run: npx tsx scripts/add-filter-decoction.ts
 */

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import { products } from "../src/db/schema";

const libsql = createClient({ url: "file:./local.db" });
const db = drizzle(libsql, { schema: { products } });

const filterDecoctionProduct = {
  slug: "south---indian---filter--coffee--decoction",
  name: "SOUTH INDIAN FILTER COFFEE DECOCTION",
  category: "filter-coffee-decoction" as const,
  shortDescription: "Authentic blend of Coffee 80% - Chicory 20% | Traditional Recipe | Ready to use liquid concentrate",
  description: "Authentic South Indian Filter Coffee Decoction - a traditional recipe ready to use liquid concentrate. Made with an authentic blend of 80% Coffee and 20% Chicory, this decoction delivers the classic South Indian coffee experience. Perfect for brewing filter coffee at home or in your cafe. Easy to use - just dilute with hot water or milk for a rich, aromatic cup of filter coffee.",
  price: 179,
  regularPrice: 199,
  weight: "200ml",
  images: ["/images/traditional.webp"],
  tags: ["filter coffee", "decoction", "chicory", "traditional", "ready to use"],
  notes: [],
  roast: null,
  blend: "Coffee 80% - Chicory 20%",
  inStock: true,
  featured: false,
};

async function main() {
  console.log("Adding Filter Coffee Decoction product...");

  // Check if product already exists
  const existing = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, filterDecoctionProduct.slug))
    .limit(1);

  if (existing.length > 0) {
    console.log("ℹ️  Product already exists, skipping");
    libsql.close();
    return;
  }

  await db.insert(products).values({
    slug: filterDecoctionProduct.slug,
    name: filterDecoctionProduct.name,
    category: filterDecoctionProduct.category,
    shortDescription: filterDecoctionProduct.shortDescription,
    description: filterDecoctionProduct.description,
    price: filterDecoctionProduct.price,
    regularPrice: filterDecoctionProduct.regularPrice,
    weight: filterDecoctionProduct.weight,
    images: JSON.stringify(filterDecoctionProduct.images),
    tags: JSON.stringify(filterDecoctionProduct.tags),
    notes: JSON.stringify(filterDecoctionProduct.notes),
    roast: filterDecoctionProduct.roast,
    blend: filterDecoctionProduct.blend,
    inStock: filterDecoctionProduct.inStock,
    featured: filterDecoctionProduct.featured,
  });

  console.log("✅ Added Filter Coffee Decoction product");
  libsql.close();
}

main().catch((e) => {
  console.error("❌ Failed:", e);
  process.exit(1);
});
