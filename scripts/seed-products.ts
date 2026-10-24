/**
 * One-time seed: static products.ts → SQLite products table
 * Run: npx tsx scripts/seed-products.ts
 * Safe to re-run - skips products that already exist (by slug).
 * Updates options field for existing instant-premix products if needed.
 */

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq, sql } from "drizzle-orm";
import { products } from "../src/db/schema";

interface SeedProduct {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  price: number;
  regularPrice: number | null;
  weight: string | null;
  images: string[];
  tags: string[];
  notes: string[];
  roast: string | null;
  blend: string | null;
  inStock: boolean;
  featured: boolean;
  options?: { productType: string; variants: Array<{ name: string; weight: string; sellingPrice: number; regularPrice: number }> };
}

const libsql = createClient({ url: process.env.TURSO_DATABASE_URL ?? "file:./local.db" });
const db = drizzle(libsql, { schema: { products } });

const seed: SeedProduct[] = [
  // Ground Coffee (keep existing)
  {
    slug: "house-brew", name: "House Brew", category: "ground-coffee" as const,
    shortDescription: "South Indian filter blend with Caramel & Chocolate notes",
    description: "House Brew is a House blend of Roasted and Ground Coffee and Roasted Chicory to brew a rich and smooth cup of south Indian filter coffee. Coffee beans are sourced from award winning estates of Coorg & Chikmagalur regions of Karnataka and grown at altitudes of 3100-4000 ft. The beans are freshly profile roasted in a state-of-the-art coffee roaster, blended, ground & mixed with high quality roasted and ground chicory powder.",
    price: 304, regularPrice: null, weight: "250g",
    images: ["/images/2-3.webp", "/images/HB_01.webp", "/images/HB_02.webp"],
    tags: ["filter coffee", "chicory", "south indian"],
    notes: ["Caramel", "Chocolate"], roast: "Medium-Dark", blend: "Roasted Coffee (80%) - Chicory (20%)",
    inStock: true, featured: false,
  },
  {
    slug: "deja-brew", name: "Déjà Brew", category: "ground-coffee" as const,
    shortDescription: "100% Arabica single origin with Sweet & Citrus notes",
    description: "Déjà Brew is an Exotic single origin 100% Arabica coffee with an intense aroma and a fine sweetish flavour with citrus notes. Sourced from award winning estates of Coorg / Chikmagalur regions of Karnataka and grown at altitudes of 3500-4000 ft. The beans are freshly profile roasted in a state-of-the-art coffee roaster and immediately packed to preserve the aroma and freshness of coffee.",
    price: 387, regularPrice: null, weight: "250g",
    images: ["/images/1-3.webp", "/images/DB_Beans_01.webp"],
    tags: ["arabica", "single origin", "citrus"],
    notes: ["Sweet", "Citrus"], roast: "Medium", blend: "100% Pure Coffee",
    inStock: true, featured: true,
  },
  {
    slug: "morning-buzz", name: "Morning Buzz", category: "ground-coffee" as const,
    shortDescription: "Arabica & Robusta blend with Vanilla & Dark Chocolate notes",
    description: "Morning Buzz is a Unique blend of Arabica and Robusta Coffee beans with hints of Vanilla and Dark Chocolate notes. Sourced from award winning estates of Coorg / Chikmagalur regions of Karnataka and grown at altitudes of 3100-4000 ft. The beans are freshly profile roasted in a state-of-the-art coffee roaster and immediately packed to preserve the aroma and freshness of the coffee.",
    price: 360, regularPrice: null, weight: "250g",
    images: ["/images/3-3.webp", "/images/MB_Beans_01.webp"],
    tags: ["arabica", "robusta", "dark chocolate", "vanilla"],
    notes: ["Vanilla", "Dark Chocolate"], roast: "Medium-Dark", blend: "100% Pure Coffee",
    inStock: true, featured: true,
  },
  {
    slug: "golden-crema", name: "Golden Crema", category: "ground-coffee" as const,
    shortDescription: "Premium Arabica & Robusta blend with aromatic Caramel notes",
    description: "Golden Crema is an Exquisite blend of Arabica and Robusta Coffee beans to brew a rich and smooth cup of coffee with an aromatic Caramel and Chocolate notes. Sourced from award winning estates of Coorg & Chikmagalur regions of Karnataka and grown at altitudes of 3100-3700 ft. The beans are freshly profile roasted in a state-of-the-art coffee roaster and immediately packed to preserve the aroma and freshness of the coffee.",
    price: 360, regularPrice: null, weight: "250g",
    images: ["/images/4-2.webp", "/images/GC_Beans_01.webp"],
    tags: ["arabica", "robusta", "caramel"],
    notes: ["Caramel", "Chocolate"], roast: "Dark", blend: "100% Pure Coffee",
    inStock: true, featured: true,
  },
  {
    slug: "traditional-south", name: "Traditional South", category: "ground-coffee" as const,
    shortDescription: "Classic South Indian filter coffee - Coffee & Chicory blend",
    description: "Traditional South is Roasted and Ground Coffee Chicory blend crafted to deliver an authentic South Indian filter coffee experience. Sourced from award-winning estates in Coorg & Chikmagalur, Karnataka, our coffee is grown at elevations of 3,100-4,000 ft, ensuring rich flavors and superior quality.",
    price: 286, regularPrice: null, weight: "250g",
    images: ["/images/5-3.webp", "/images/traditional.webp"],
    tags: ["filter coffee", "chicory", "south indian", "traditional"],
    notes: ["Caramel", "Chocolate"], roast: "Medium-Dark", blend: "Coffee & Chicory",
    inStock: true, featured: false,
  },
  // Whole Bean (keep existing)
  {
    slug: "whole-bean-morning-buzz", name: "Whole Bean Morning Buzz", category: "whole-bean" as const,
    shortDescription: "Whole bean Arabica & Robusta — grind fresh every morning",
    description: "The whole bean version of our bestselling Morning Buzz blend. Arabica and Robusta beans with hints of Vanilla and Dark Chocolate, sourced from award winning estates of Coorg / Chikmagalur. Grind fresh for maximum aroma and flavour.",
    price: 360, regularPrice: null, weight: "250g",
    images: ["/images/3-3.webp", "/images/MB_Beans_01.webp"],
    tags: ["whole bean", "arabica", "robusta", "vanilla", "dark chocolate"],
    notes: ["Vanilla", "Dark Chocolate"], roast: "Medium-Dark", blend: "100% Pure Coffee",
    inStock: true, featured: false,
  },
  {
    slug: "whole-bean-golden-crema", name: "Whole Bean Golden Crema", category: "whole-bean" as const,
    shortDescription: "Whole bean premium blend for a rich crema every time",
    description: "The whole bean version of our Golden Crema blend. Arabica and Robusta beans with Caramel and Chocolate notes, sourced from estates in Coorg & Chikmagalur, Karnataka. Perfect for espresso and moka pot.",
    price: 360, regularPrice: null, weight: "250g",
    images: ["/images/4-2.webp", "/images/GC_Beans_01.webp"],
    tags: ["whole bean", "arabica", "robusta", "caramel", "espresso"],
    notes: ["Caramel", "Chocolate"], roast: "Dark", blend: "100% Pure Coffee",
    inStock: true, featured: false,
  },
  {
    slug: "whole-bean-deja-brew", name: "Whole Bean Déjà Brew", category: "whole-bean" as const,
    shortDescription: "Single origin 100% Arabica whole bean — sweet & citrus",
    description: "The whole bean version of our exotic Déjà Brew. Single origin 100% Arabica from Coorg / Chikmagalur, grown at 3500-4000 ft. Sweet and citrus notes that shine brightest when freshly ground.",
    price: 387, regularPrice: null, weight: "250g",
    images: ["/images/1-3.webp", "/images/DB_Beans_01.webp"],
    tags: ["whole bean", "arabica", "single origin", "citrus"],
    notes: ["Sweet", "Citrus"], roast: "Medium", blend: "100% Pure Coffee",
    inStock: true, featured: false,
  },
  // ============================================================================
  // INSTANT PREMIX - 13 REQUIRED VARIANTS
  // ============================================================================
  
  // Non Milk Tea - Black Tea (4 variants)
  {
    slug: "black-tea-lemon", name: "Black Tea Premix - Classic Lemon", category: "instant-premix" as const,
    shortDescription: "Fruit-infused black tea with natural lemon — refreshing & healthy",
    description: "Discover the uniquely crafted Black Tea Fruit Infused Instant Premix Classic - Lemon at Bean Leaf Brew. No added preservatives, colors, or flavors, sweetened with natural fruit sugar, making it low in glycemic index.",
    price: 378, regularPrice: 440, weight: "10 sachets",
    images: ["/images/a32a5f_5b2ce5c04c6a4bb8833aeee47f1e6c53mv2.webp", "/images/DSC5452.webp"],
    tags: ["instant", "tea", "lemon", "vitamin c", "antioxidants"],
    notes: [], roast: null, blend: null,
    inStock: true, featured: false,
    options: { productType: "non-milk-tea-black-tea", variants: [{ name: "Black Tea Premix - Classic Lemon", weight: "10 sachets", sellingPrice: 378, regularPrice: 440 }] },
  },
  {
    slug: "black-tea-peach-lemon", name: "Instant Black Tea Peach Lemon", category: "instant-premix" as const,
    shortDescription: "Black tea with peach and lemon — refreshing fruit infusion",
    description: "Instant Black Tea Peach Lemon is a fruit-infused black tea instant premix. Sweetened with natural fruit sugar, low in glycemic index, with no added preservatives, colours, or flavours. Rich in antioxidants and Vitamin C.",
    price: 9999, regularPrice: 9999, weight: "10 x 20g packs",
    images: [], tags: ["instant", "tea", "peach", "lemon", "antioxidants", "vitamin c", "low gi"],
    notes: [], roast: null, blend: null,
    inStock: true, featured: false,
    options: { productType: "non-milk-tea-black-tea", variants: [{ name: "Instant Black Tea Peach Lemon", weight: "10 x 20g packs", sellingPrice: 9999, regularPrice: 9999 }] },
  },
  {
    slug: "black-tea-blueberry", name: "Instant Black Tea Blueberry", category: "instant-premix" as const,
    shortDescription: "Black tea with blueberry — antioxidant-rich fruit infusion",
    description: "Instant Black Tea Blueberry is a fruit-infused black tea instant premix. Sweetened with natural fruit sugar, low in glycemic index, with no added preservatives, colours, or flavours. Rich in antioxidants.",
    price: 9999, regularPrice: 9999, weight: "10 x 20g packs",
    images: [], tags: ["instant", "tea", "blueberry", "antioxidants", "low gi"],
    notes: [], roast: null, blend: null,
    inStock: true, featured: false,
    options: { productType: "non-milk-tea-black-tea", variants: [{ name: "Instant Black Tea Blueberry", weight: "10 x 20g packs", sellingPrice: 9999, regularPrice: 9999 }] },
  },
  {
    slug: "black-tea-masala", name: "Instant Black Tea Masala", category: "instant-premix" as const,
    shortDescription: "Spiced black tea premix with traditional masala blend",
    description: "Instant Black Tea Masala is a spiced black tea instant premix with traditional Indian masala spices. Easy to prepare whether at home, in the office, or on the go.",
    price: 9999, regularPrice: 9999, weight: "10 x 20g packs",
    images: [], tags: ["instant", "tea", "masala", "spiced", "traditional"],
    notes: [], roast: null, blend: null,
    inStock: true, featured: false,
    options: { productType: "non-milk-tea-black-tea", variants: [{ name: "Instant Black Tea Masala", weight: "10 x 20g packs", sellingPrice: 9999, regularPrice: 9999 }] },
  },
  
  // Non Milk Tea - Green Tea (3 variants)
  {
    slug: "green-tea-masala", name: "Instant Green Tea Masala", category: "instant-premix" as const,
    shortDescription: "Spiced green tea premix with traditional masala blend",
    description: "Instant Green Tea Masala is a spiced green tea instant premix with traditional Indian masala spices. Rich in catechins and antioxidants. Easy to prepare whether at home, in the office, or on the go.",
    price: 9999, regularPrice: 9999, weight: "10 x 20g packs",
    images: [], tags: ["instant", "green tea", "masala", "spiced", "catechins", "antioxidants"],
    notes: [], roast: null, blend: null,
    inStock: true, featured: false,
    options: { productType: "non-milk-tea-green-tea", variants: [{ name: "Instant Green Tea Masala", weight: "10 x 20g packs", sellingPrice: 9999, regularPrice: 9999 }] },
  },
  {
    slug: "green-tea-cardamom", name: "Instant Green Tea Cardamom", category: "instant-premix" as const,
    shortDescription: "Green tea with aromatic cardamom — refreshing and healthy",
    description: "Instant Green Tea Cardamom is a green tea instant premix infused with aromatic cardamom. Rich in catechins and antioxidants. No added preservatives, colours, or flavours.",
    price: 9999, regularPrice: 9999, weight: "10 x 20g packs",
    images: [], tags: ["instant", "green tea", "cardamom", "catechins", "antioxidants"],
    notes: [], roast: null, blend: null,
    inStock: true, featured: false,
    options: { productType: "non-milk-tea-green-tea", variants: [{ name: "Instant Green Tea Cardamom", weight: "10 x 20g packs", sellingPrice: 9999, regularPrice: 9999 }] },
  },
  {
    slug: "green-tea-lemon", name: "Instant Green Tea Lemon", category: "instant-premix" as const,
    shortDescription: "Green tea with lemon — antioxidants and Vitamin C boost",
    description: "Instant Green Tea Lemon is a green tea instant premix with refreshing lemon. Rich in catechins, antioxidants, and Vitamin C. No added preservatives, colours, or flavours.",
    price: 9999, regularPrice: 9999, weight: "10 x 20g packs",
    images: [], tags: ["instant", "green tea", "lemon", "catechins", "antioxidants", "vitamin c"],
    notes: [], roast: null, blend: null,
    inStock: true, featured: false,
    options: { productType: "non-milk-tea-green-tea", variants: [{ name: "Instant Green Tea Lemon", weight: "10 x 20g packs", sellingPrice: 9999, regularPrice: 9999 }] },
  },
  
  // Milk Tea (3 variants)
  {
    slug: "milk-tea-ginger", name: "Milk Tea 3-in-1 Ginger Infused", category: "instant-premix" as const,
    shortDescription: "Classic chai with natural ginger goodness",
    description: "Discover the uniquely crafted Milk Tea 3-in-1 Ginger Infused Instant Premix at Bean Leaf Brew. Easy to prepare, whether at home, in the office, or on the go.",
    price: 324, regularPrice: 390, weight: "10 sachets",
    images: ["/images/ginger.webp", "/images/DSC5476.webp"],
    tags: ["instant", "milk tea", "ginger", "chai", "traditional"],
    notes: [], roast: null, blend: null,
    inStock: true, featured: false,
    options: { productType: "milk-tea", variants: [{ name: "Milk Tea 3-in-1 Ginger Infused", weight: "10 sachets", sellingPrice: 324, regularPrice: 390 }] },
  },
  {
    slug: "milk-tea-masala", name: "Instant Premix Milk Tea Masala", category: "instant-premix" as const,
    shortDescription: "Classic milk tea with traditional masala spices",
    description: "Instant Premix Milk Tea Masala is a classic milk tea instant premix infused with traditional Indian masala spices. Easy to prepare whether at home, in the office, or on the go.",
    price: 9999, regularPrice: 9999, weight: "10 x 20g packs",
    images: [], tags: ["instant", "milk tea", "masala", "spiced", "chai", "traditional"],
    notes: [], roast: null, blend: null,
    inStock: true, featured: false,
    options: { productType: "milk-tea", variants: [{ name: "Instant Premix MILK TEA MASALA", weight: "10 x 20g packs", sellingPrice: 9999, regularPrice: 9999 }] },
  },
  {
    slug: "milk-tea-cardamom", name: "Instant Premix Milk Tea Cardamom", category: "instant-premix" as const,
    shortDescription: "Classic milk tea with aromatic cardamom",
    description: "Instant Premix Milk Tea Cardamom is a classic milk tea instant premix infused with aromatic cardamom. Easy to prepare whether at home, in the office, or on the go.",
    price: 9999, regularPrice: 9999, weight: "10 x 20g packs",
    images: [], tags: ["instant", "milk tea", "cardamom", "chai", "traditional"],
    notes: [], roast: null, blend: null,
    inStock: true, featured: false,
    options: { productType: "milk-tea", variants: [{ name: "Instant Premix MILK TEA CARDAMOM", weight: "10 x 20g packs", sellingPrice: 9999, regularPrice: 9999 }] },
  },
  
  // Matcha Tea (1 variant)
  {
    slug: "matcha-latte", name: "Matcha Latte Classic 3-in-1", category: "instant-premix" as const,
    shortDescription: "Classic matcha latte instant premix — rich, smooth & healthy",
    description: "Experience the exquisite blend of taste and wellness with Matcha Latte Classic 3-in-1 instant premix at Bean Leaf Brew. Easy to prepare whether at home, in the office, or on the go.",
    price: 378, regularPrice: 440, weight: "10 sachets",
    images: ["/images/a32a5f_b6149460f45447a5b871bb1e66f622e0mv2.webp", "/images/DSC5466.webp"],
    tags: ["instant", "matcha", "latte", "green tea", "catechins"],
    notes: [], roast: null, blend: null,
    inStock: true, featured: false,
    options: { productType: "matcha-tea", variants: [{ name: "Matcha Latte Classic 3-in-1", weight: "10 sachets", sellingPrice: 378, regularPrice: 440 }] },
  },
  
  // Malt Protein (2 variants)
  {
    slug: "malt-protein-choco-hazelnut", name: "Instant Premix Malt Choco-Hazelnut", category: "instant-premix" as const,
    shortDescription: "Protein-rich malt with real cocoa and hazelnuts — 15g protein per serve",
    description: "Instant Premix Malt Choco-Hazelnut is a protein-rich malt premix with real cocoa and hazelnuts. Contains 15g protein per serving (30% of RDA), non-caloric natural sweetener Allulose, supports sustained release of amino acids, and is a source of fiber. Allergens: Contains Milk, Gluten, Nuts.",
    price: 9999, regularPrice: 9999, weight: "5 x 40g packs",
    images: [], tags: ["instant", "malt", "protein", "chocolate", "hazelnut", "high protein"],
    notes: [], roast: null, blend: null,
    inStock: true, featured: false,
    options: { productType: "malt-protein", variants: [{ name: "Instant Premix MALT-CHOCO-HAZELNUT", weight: "5 x 40g packs", sellingPrice: 9999, regularPrice: 9999 }] },
  },
  {
    slug: "malt-protein-kesar-badam", name: "Instant Premix Malt Kesar Badam", category: "instant-premix" as const,
    shortDescription: "Protein-rich malt with saffron and almonds — 15g protein per serve",
    description: "Instant Premix Malt Kesar Badam is a protein-rich malt premix with saffron (kesar) and almonds. Contains 15g protein per serving (30% of RDA), non-caloric natural sweetener Allulose, supports sustained release of amino acids, and is a source of fiber. Allergens: Contains Milk, Gluten, Nuts.",
    price: 9999, regularPrice: 9999, weight: "5 x 40g packs",
    images: [], tags: ["instant", "malt", "protein", "kesar", "badam", "almond", "high protein"],
    notes: [], roast: null, blend: null,
    inStock: true, featured: false,
    options: { productType: "malt-protein", variants: [{ name: "Instant Premix MALT KESAR BADAM", weight: "5 x 40g packs", sellingPrice: 9999, regularPrice: 9999 }] },
  },
];

async function main() {
  let inserted = 0;
  let skipped = 0;
  let updated = 0;

  for (const p of seed) {
    const existing = await db.select().from(products).where(eq(products.slug, p.slug)).limit(1);
    
    if (existing.length > 0) {
      const existingProduct = existing[0];
      
      // If product exists and has options in seed, update the options field
      if (p.options) {
        const existingOptions = existingProduct.options as string;
        const newOptions = JSON.stringify(p.options);
        
        // Only update if options are different
        if (existingOptions !== newOptions) {
          await db.update(products)
            .set({ options: newOptions, updatedAt: sql`(datetime('now'))` })
            .where(eq(products.slug, p.slug));
          updated++;
          console.log(`Updated options for: ${p.slug}`);
        } else {
          skipped++;
        }
      } else {
        skipped++;
      }
      continue;
    }

    // Insert new product
    await db.insert(products).values({
      slug: p.slug,
      name: p.name,
      category: p.category,
      shortDescription: p.shortDescription,
      description: p.description,
      price: p.price,
      regularPrice: p.regularPrice ?? null,
      weight: p.weight ?? null,
      images: JSON.stringify(p.images),
      tags: JSON.stringify(p.tags),
      notes: JSON.stringify(p.notes),
      roast: p.roast ?? null,
      blend: p.blend ?? null,
      inStock: p.inStock,
      featured: p.featured,
      options: p.options ? JSON.stringify(p.options) : "{}",
    });
    inserted++;
  }

  console.log(`Done! Inserted: ${inserted}, Updated: ${updated}, Skipped: ${skipped}`);
  libsql.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
