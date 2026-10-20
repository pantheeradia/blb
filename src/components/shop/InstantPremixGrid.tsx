"use client";

import { useState } from "react";
import { type Product } from "@/types";
import { CATEGORIES } from "@/lib/categories";
import Image from "next/image";
import Link from "next/link";
import { getFirstValidImage } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { ShoppingBag } from "lucide-react";

const PREMIX_CATEGORIES = [
  "non-milk-tea",
  "milk-tea",
  "matcha-tea",
  "malt-protein",
] as const;

interface Props {
  products: Product[];
}

export function InstantPremixGrid({ products }: Props) {
  const { addItem } = useCartStore();
  
  // Track selected variant for each category
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const handleVariantChange = (categorySlug: string, productSlug: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [categorySlug]: productSlug,
    }));
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {PREMIX_CATEGORIES.map((catSlug) => {
        const category = CATEGORIES.find((c) => c.slug === catSlug);
        if (!category) return null;

        const categoryProducts = products.filter((p) => p.category === catSlug);
        if (categoryProducts.length === 0) return null;

        const selectedSlug = selectedVariants[catSlug] || categoryProducts[0].slug;
        const selectedProduct = categoryProducts.find((p) => p.slug === selectedSlug) || categoryProducts[0];

        const images = selectedProduct.images || [];
        const imageSrc = getFirstValidImage(images);
        const hasDiscount = selectedProduct.regularPrice && selectedProduct.regularPrice > selectedProduct.price;
        const isPriceUnavailable = selectedProduct.price === 0;

        return (
          <div key={catSlug} className="group flex flex-col w-full bg-[#FAFAF8] border border-[#D4C4B0] overflow-hidden hover:shadow-md transition-shadow">
            {/* Product Image - matching ProductCard dimensions with Link */}
            <Link href={`/shop/${selectedProduct.slug}`} className="flex flex-col flex-1">
              <div className="relative h-56 bg-[#EAD9C8] overflow-hidden flex-shrink-0">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#EAD9C8]">
                    <span className="text-xs text-[#8B5E3C] text-center px-4">
                      {selectedProduct.name}
                    </span>
                  </div>
                )}
                {hasDiscount && (
                  <span className="absolute top-3 left-3 bg-[#C9953C] text-[#1A0E08] text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5">
                    Sale
                  </span>
                )}
              </div>

              {/* Product Details - matching ProductCard padding */}
              <div className="p-5 flex-1">
                <p className="text-[9px] uppercase tracking-widest text-[#8B5E3C] mb-1">
                  {category.name} ({categoryProducts.length})
                  {selectedProduct.weight ? ` · ${selectedProduct.weight}` : ""}
                </p>
                <h3 className="font-serif text-base text-[#1A0E08] mb-1">{selectedProduct.name}</h3>
                <p className="text-xs text-[#8B5E3C] leading-relaxed line-clamp-2">
                  {selectedProduct.shortDescription}
                </p>
              </div>
            </Link>

            {/* Price, Variant Dropdown, and Add Button on same row */}
            <div className="px-5 pb-5 flex items-center justify-between gap-2">
              {/* Price */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {isPriceUnavailable ? (
                  <span className="font-medium text-[#8B5E3C] text-xs">Price unavailable</span>
                ) : (
                  <>
                    <span className="font-medium text-[#1A0E08]">₹{selectedProduct.price}</span>
                    {selectedProduct.regularPrice && (
                      <span className="text-xs text-[#8B5E3C] line-through">₹{selectedProduct.regularPrice}</span>
                    )}
                  </>
                )}
              </div>

              {/* Variant Selector and Add Button Group */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Compact Variant Selector */}
                <select
                  value={selectedSlug}
                  onChange={(e) => handleVariantChange(catSlug, e.target.value)}
                  className="text-[9px] uppercase tracking-wider px-2 py-2 border border-[#D4C4B0] bg-white text-[#1A0E08] focus:outline-none focus:border-[#1A0E08]"
                >
                  {categoryProducts.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>

                {/* Add Button */}
                <button
                  onClick={() => handleAddToCart(selectedProduct)}
                  disabled={isPriceUnavailable}
                  className="flex items-center gap-2 bg-[#1A0E08] text-[#F7F0E6] text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-[#4A2512] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={12} />
                  Add
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
