import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminAuth";
import { db } from "@/db/client";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const rows = await db.select().from(products);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    const body = await req.json();
    const { name, slug, category, price, regularPrice, shortDescription, description,
            weight, roast, blend, ean, notes, tags, images, inStock, featured, visible,
            weightOptions, brewingEquipmentOptions, options } = body;

    if (!name || !slug || !category || !price) {
      return NextResponse.json({ error: "name, slug, category, price are required" }, { status: 400 });
    }

    // Normalize slug
    const normalizedSlug = (slug as string).toLowerCase().replace(/\s+/g, "-");

    // Check for duplicate slug
    const existing = await db.select().from(products).where(eq(products.slug, normalizedSlug)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: `A product with slug "${normalizedSlug}" already exists. Please use a different slug.` },
        { status: 409 }
      );
    }

    // Build the insert values object
    const insertValues = {
      name,
      slug: normalizedSlug,
      category,
      price: Number(price),
      regularPrice: regularPrice ? Number(regularPrice) : null,
      shortDescription: shortDescription ?? "",
      description: description ?? "",
      weight: weight ?? null,
      roast: roast ?? null,
      blend: blend ?? null,
      notes: JSON.stringify(Array.isArray(notes) ? notes : []),
      tags: JSON.stringify(Array.isArray(tags) ? tags : []),
      images: JSON.stringify(Array.isArray(images) ? images : []),
      inStock: Boolean(inStock),
      featured: Boolean(featured),
      visible: visible === undefined ? true : Boolean(visible),
      ean: ean ?? null,
      weightOptions: JSON.stringify(Array.isArray(weightOptions) ? weightOptions : []),
      brewingEquipmentOptions: JSON.stringify(Array.isArray(brewingEquipmentOptions) ? brewingEquipmentOptions : []),
      options: "{}",
    };

    // Override options if category is instant-premix
    if (category === "instant-premix") {
      insertValues.options = options ? JSON.stringify(options) : "{}";
    }

    const [row] = await db.insert(products).values(insertValues).returning();

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/shop/${normalizedSlug}`);

    return NextResponse.json(row);
  } catch (error) {
    console.error("Error creating product:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");

    // Provide specific error messages for common database errors
    let errorMessage = "Failed to create product";
    let statusCode = 500;

    if (error && typeof error === "object" && "cause" in error) {
      const cause = error.cause as any;
      if (cause?.code === "SQLITE_CONSTRAINT") {
        if (cause.message?.includes("UNIQUE constraint failed: products.slug")) {
          errorMessage = "A product with this slug already exists. Please use a different slug.";
          statusCode = 409;
        } else if (cause.message?.includes("UNIQUE constraint")) {
          errorMessage = "A unique constraint was violated. Please check your input.";
          statusCode = 409;
        } else if (cause.message?.includes("NOT NULL constraint")) {
          errorMessage = "A required field is missing. Please check your input.";
          statusCode = 400;
        }
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
