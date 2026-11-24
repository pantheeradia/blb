export interface StorefrontCategory {
  slug: string;
  name: string;
  icon: "beans" | "coffee" | "tea" | "protein" | "matcha" | "concentrate" | "gift" | "merchandise";
  image?: string;
  comingSoon?: boolean;
}

// Keep existing coffee slugs so saved product links and inventory remain valid.
export const STOREFRONT_CATEGORIES: StorefrontCategory[] = [
  { slug: "whole-bean", name: "Whole beans", icon: "beans", image: "/images/front-page-whole-bean.png" },
  { slug: "ground-coffee", name: "Roasted & Ground Coffee", icon: "coffee", image: "/images/front-page-ground-coffee.png" },
  { slug: "hoyya-tea", name: "HOYYA Tea", icon: "tea", comingSoon: true },
  { slug: "hoyya-protein", name: "HOYYA Protein", icon: "protein", comingSoon: true },
  { slug: "hoyya-matcha", name: "HOYYA Matcha", icon: "matcha", comingSoon: true },
  { slug: "filter-coffee-decoction", name: "Coffee Concentrate", icon: "concentrate" },
  { slug: "gifting", name: "Gifting", icon: "gift" },
  { slug: "merchandise-accessories", name: "Merchandise", icon: "merchandise" },
];

export function collectionHref(slug: string) {
  return `/shop?category=${encodeURIComponent(slug)}#catalog`;
}
