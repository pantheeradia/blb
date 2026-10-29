import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { revalidatePath } from "next/cache";
import { invalidateProductCache } from "@/lib/products";
import { db } from "@/db/client";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  try {
    const { id } = await params;
    const body = await req.json();

    const updates: Record<string, unknown> = {};

    if (body.name !== undefined) updates.name = body.name;
    if (body.slug !== undefined) {
      const normalizedSlug = body.slug.toLowerCase().replace(/\s+/g, "-");
      // Check for duplicate slug (excluding current product)
      const existing = await db.select().from(products).where(eq(products.slug, normalizedSlug)).limit(1);
      if (existing.length > 0 && existing[0].id !== Number(id)) {
        return NextResponse.json(
          { error: `A product with slug "${normalizedSlug}" already exists. Please use a different slug.` },
          { status: 409 }
        );
      }
      updates.slug = normalizedSlug;
    }
    if (body.category !== undefined) updates.category = body.category;
    if (body.price !== undefined) updates.price = Number(body.price);
    if (body.regularPrice !== undefined) updates.regularPrice = body.regularPrice ? Number(body.regularPrice) : null;
    if (body.shortDescription !== undefined) updates.shortDescription = body.shortDescription;
    if (body.description !== undefined) updates.description = body.description;
    if (body.weight !== undefined) updates.weight = body.weight || null;
    if (body.roast !== undefined) updates.roast = body.roast || null;
    if (body.blend !== undefined) updates.blend = body.blend || null;
    if (body.notes !== undefined) updates.notes = JSON.stringify(Array.isArray(body.notes) ? body.notes : []);
    if (body.tags !== undefined) updates.tags = JSON.stringify(Array.isArray(body.tags) ? body.tags : []);
    if (body.images !== undefined) updates.images = JSON.stringify(Array.isArray(body.images) ? body.images : []);
    if (body.inStock !== undefined) updates.inStock = Boolean(body.inStock);
    if (body.featured !== undefined) updates.featured = Boolean(body.featured);
    if (body.visible !== undefined) updates.visible = Boolean(body.visible);
    if (body.ean !== undefined) updates.ean = body.ean || null;
    if (body.weightOptions !== undefined) updates.weightOptions = JSON.stringify(Array.isArray(body.weightOptions) ? body.weightOptions : []);
    if (body.brewingEquipmentOptions !== undefined) updates.brewingEquipmentOptions = JSON.stringify(Array.isArray(body.brewingEquipmentOptions) ? body.brewingEquipmentOptions : []);

    // Only update options if category is instant-premix
    if (body.category === "instant-premix" && body.options !== undefined) {
      updates.options = body.options ? JSON.stringify(body.options) : "{}";
    }

    const [row] = await db.update(products).set(updates).where(eq(products.id, Number(id))).returning();

    invalidateProductCache();
    revalidatePath("/");
    revalidatePath("/shop");
    if (row?.slug) revalidatePath(`/shop/${row.slug}`);

    return NextResponse.json(row);
  } catch (error) {
    console.error("Error updating product:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");

    // Provide specific error messages for common database errors
    let errorMessage = "Failed to update product";
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

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await params;
  const [row] = await db.delete(products).where(eq(products.id, Number(id))).returning();

  invalidateProductCache();
  revalidatePath("/");
  revalidatePath("/shop");
  if (row?.slug) revalidatePath(`/shop/${row.slug}`);

  return NextResponse.json({ success: true });
}
