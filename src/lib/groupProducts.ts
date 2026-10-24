import { type Product } from "@/types";
import { INSTANT_PREMIX_CATEGORY } from "./instantPremixOptions";

export interface ProductVariant {
  productId: number;
  productSlug: string;
  productName: string;
  variantName: string;
  weight: string;
  sellingPrice: number;
  regularPrice: number | null;
  image: string;
  shortDescription: string;
  categoryLabel: string;
}

export interface ProductGroup {
  groupKey: string;
  groupTitle: string;
  variants: ProductVariant[];
}

/**
 * Group instant premix products by their product type.
 * 
 * Groups:
 * - non-milk-tea (combines non-milk-tea-green-tea and non-milk-tea-black-tea)
 * - milk-tea
 * - matcha-tea
 * - malt-protein
 */
export function groupProducts(products: Product[]): ProductGroup[] {
  const instantPremixProducts = products.filter((p) => p.category === INSTANT_PREMIX_CATEGORY);
  
  if (instantPremixProducts.length === 0) {
    return [];
  }

  const groupsMap = new Map<string, ProductGroup>();

  instantPremixProducts.forEach((product) => {
    const productType = product.options?.productType;
    if (!productType) return;

    // Determine group key and title
    let groupKey: string;
    let groupTitle: string;

    if (productType.startsWith("non-milk-tea")) {
      groupKey = "non-milk-tea";
      groupTitle = "Non Milk Tea";
    } else {
      groupKey = productType;
      groupTitle = productType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }

    // Extract variants from the product
    const variants = product.options?.variants ?? [];
    
    if (!groupsMap.has(groupKey)) {
      groupsMap.set(groupKey, {
        groupKey,
        groupTitle,
        variants: [],
      });
    }

    const group = groupsMap.get(groupKey)!;

    // Add each variant to the group
    variants.forEach((variant) => {
      group.variants.push({
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        variantName: variant.name,
        weight: variant.weight,
        sellingPrice: variant.sellingPrice,
        regularPrice: variant.regularPrice,
        image: (product.images && product.images.length > 0) ? product.images[0] : "",
        shortDescription: product.shortDescription,
        categoryLabel: product.categoryLabel ?? product.category,
      });
    });
  });

  // Convert map to array and preserve order
  const groupOrder = ["non-milk-tea", "milk-tea", "matcha-tea", "malt-protein"];
  const groups: ProductGroup[] = [];

  groupOrder.forEach((key) => {
    if (groupsMap.has(key)) {
      groups.push(groupsMap.get(key)!);
    }
  });

  // Add any remaining groups that weren't in the predefined order
  groupsMap.forEach((group, key) => {
    if (!groupOrder.includes(key)) {
      groups.push(group);
    }
  });

  return groups;
}
