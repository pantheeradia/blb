import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminAuth";
import { invalidateProductCache } from "@/lib/products";
import { db } from "@/db/client";
import { products } from "@/db/schema";
import { and, desc, eq, like, or, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const page = Math.max(1, Number.parseInt(req.nextUrl.searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(req.nextUrl.searchParams.get("pageSize") ?? "25", 10) || 25));
  const query = req.nextUrl.searchParams.get("q")?.trim();
  const category = req.nextUrl.searchParams.get("category")?.trim();
  const stock = req.nextUrl.searchParams.get("stock");

  const searchFilter = query
    ? or(like(products.name, `%${query}%`), like(products.slug, `%${query}%`))
    : undefined;
  const categoryFilter = category && category !== "all" ? eq(products.category, category) : undefined;
  const stockFilter = stock === "in"
    ? eq(products.inStock, true)
    : stock === "out"
      ? eq(products.inStock, false)
      : undefined;
  const where = and(searchFilter, categoryFilter, stockFilter);

  const [rows, [{ total: rawTotal }]] = await Promise.all([
    db.select()
      .from(products)
      .where(where)
      .orderBy(desc(products.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ total: sql<number>`count(*)` }).from(products).where(where),
  ]);
  const total = Number(rawTotal);

  return NextResponse.json({
    data: rows,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
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

    invalidateProductCache();
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
      const cause = error.cause as { code?: string; message?: string } | undefined;
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
