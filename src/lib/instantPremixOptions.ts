// Shared helpers + types for instant-premix selectable options
// (Product Type + Variants).
//
// Instant premix products are organized into product types. Admins can add
// as many variants as needed for each product type.
//
// Product types:
// - Non Milk Tea: Green Tea, Black Tea
// - Milk Tea
// - Matcha Tea
// - Malt Protein

export const INSTANT_PREMIX_CATEGORY = "instant-premix";

export type ProductType = "non-milk-tea-green-tea" | "non-milk-tea-black-tea" | "milk-tea" | "matcha-tea" | "malt-protein";

export interface InstantPremixVariant {
  name: string;
  weight: string;
  sellingPrice: number;
  regularPrice: number | null;
}

export interface InstantPremixOptions {
  productType: ProductType | null;
  variants: InstantPremixVariant[];
}

export const PRODUCT_TYPES: Array<{
  id: ProductType;
  label: string;
  description: string;
}> = [
  {
    id: "non-milk-tea-green-tea",
    label: "Non Milk Tea",
    description: "Green Tea",
  },
  {
    id: "non-milk-tea-black-tea",
    label: "Non Milk Tea",
    description: "Black Tea",
  },
  {
    id: "milk-tea",
    label: "Milk Tea",
    description: "Milk Tea",
  },
  {
    id: "matcha-tea",
    label: "Matcha Tea",
    description: "Matcha Tea",
  },
  {
    id: "malt-protein",
    label: "Malt Protein",
    description: "Malt Protein",
  },
];

/** Create a single empty variant. */
export function createEmptyVariant(): InstantPremixVariant {
  return {
    name: "",
    weight: "",
    sellingPrice: 0,
    regularPrice: null,
  };
}

/** Create initial variants array with one empty variant for a new product type. */
export function createInitialVariants(productType: ProductType | null): InstantPremixVariant[] {
  if (!productType) return [];
  return [createEmptyVariant()];
}

/** Safely parse a JSON string into InstantPremixOptions. Invalid data yields empty object. */
export function parseInstantPremixOptions(raw: string | null | undefined): InstantPremixOptions {
  if (!raw) return { productType: null, variants: [] };
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { productType: null, variants: [] };

    const productType = PRODUCT_TYPES.find((t) => t.id === parsed.productType)?.id ?? null;

    let variants: InstantPremixVariant[] = [];
    if (Array.isArray(parsed.variants)) {
      variants = parsed.variants
        .filter(
          (v: unknown): v is InstantPremixVariant =>
            v != null &&
            typeof v === "object" &&
            "name" in v &&
            typeof v.name === "string" &&
            "weight" in v &&
            typeof v.weight === "string" &&
            "sellingPrice" in v &&
            typeof v.sellingPrice === "number" &&
            Number.isFinite(v.sellingPrice) &&
            v.sellingPrice >= 0
        )
        .map((v: InstantPremixVariant) => ({
          name: v.name,
          weight: v.weight,
          sellingPrice: v.sellingPrice,
          regularPrice: typeof v.regularPrice === "number" && Number.isFinite(v.regularPrice) ? v.regularPrice : null,
        }));
    }

    return { productType, variants };
  } catch {
    return { productType: null, variants: [] };
  }
}

/** Get display label for a product type. */
export function getProductTypeLabel(productType: ProductType | null): string {
  if (!productType) return "";
  const type = PRODUCT_TYPES.find((t) => t.id === productType);
  return type?.label ?? productType;
}
