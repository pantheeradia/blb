// Hardcoded product categories (single source of truth).
//
// Categories are defined in code rather than the DB to avoid schema changes.
// `products.category` stores one of these `slug` values (free text in the DB).
//
// Field flags control which coffee-specific fields are shown for a category,
// both in the admin product form and on the storefront.

export interface Category {
  slug: string;
  name: string;
  showWeight: boolean;
  showRoast: boolean;
  showBlend: boolean;
  showNotes: boolean;
}

export const CATEGORIES: Category[] = [
  {
    slug: "ground-coffee",
    name: "Roasted & Ground Coffee",
    showWeight: true,
    showRoast: true,
    showBlend: true,
    showNotes: true,
  },
  {
    slug: "whole-bean",
    name: "Whole beans",
    showWeight: true,
    showRoast: true,
    showBlend: true,
    showNotes: true,
  },
  {
    slug: "instant-premix",
    name: "Instant Premix",
    showWeight: true,
    showRoast: true,
    showBlend: true,
    showNotes: true,
  },
  {
    slug: "filter-coffee-decoction",
    name: "Coffee Concentrate",
    showWeight: true,
    showRoast: true,
    showBlend: true,
    showNotes: true,
  },
  {
    slug: "merchandise-accessories",
    name: "Merchandise",
    showWeight: false,
    showRoast: false,
    showBlend: false,
    showNotes: false,
  },
  { slug: "hoyya-tea", name: "HOYYA Tea", showWeight: true, showRoast: false, showBlend: false, showNotes: true },
  { slug: "hoyya-protein", name: "HOYYA Protein", showWeight: true, showRoast: false, showBlend: false, showNotes: true },
  { slug: "hoyya-matcha", name: "HOYYA Matcha", showWeight: true, showRoast: false, showBlend: false, showNotes: true },
  { slug: "gifting", name: "Gifting", showWeight: false, showRoast: false, showBlend: false, showNotes: false },
];

const BY_SLUG: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
);

/** Look up a category by slug. */
export function getCategory(slug: string): Category | undefined {
  return BY_SLUG[slug];
}

/** Display label for a category slug, falling back to the raw slug. */
export function getCategoryLabel(slug: string): string {
  return getCategory(slug)?.name ?? slug;
}
