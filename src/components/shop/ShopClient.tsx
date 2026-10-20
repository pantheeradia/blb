"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { type Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { InstantPremixGrid } from "./InstantPremixGrid";
import { CATEGORIES } from "@/lib/categories";

interface Props {
  products: Product[];
}

export function ShopClient({ products }: Props) {
  const searchParams = useSearchParams();

  const categories = useMemo(() => {
    // Exclude premix subcategories and merchandise from main navigation
    const excludedSlugs = ["non-milk-tea", "milk-tea", "matcha-tea", "malt-protein", "merchandise-accessories"];
    const filteredCategories = CATEGORIES.filter((c) => !excludedSlugs.includes(c.slug));
    
    return [
      { label: "All", value: "all" },
      ...filteredCategories.map((c) => ({ label: c.name, value: c.slug })),
    ];
  }, []);

  // Honour an initial ?category= from the URL, then let clicks override it.
  const urlCategory = searchParams.get("category");
  const initialActive =
    urlCategory && categories.some((c) => c.value === urlCategory) ? urlCategory : "all";
  const [active, setActive] = useState<string>(initialActive);

  // Filter products - special handling for instant-premix
  const filtered = useMemo(() => {
    if (active === "all") return products;
    
    if (active === "instant-premix") {
      // Include all premix subcategories
      const premixSlugs = ["non-milk-tea", "milk-tea", "matcha-tea", "malt-protein"];
      return products.filter((p) => premixSlugs.includes(p.category));
    }
    
    return products.filter((p) => p.category === active);
  }, [active, products]);

  const isCategoryEmpty = filtered.length === 0;

  return (
    <>
      {/* Main Category Navigation */}
      <div className="flex gap-2 flex-wrap mb-10">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActive(cat.value)}
            className={`text-[10px] uppercase tracking-widest px-4 py-2 border transition-colors ${
              active === cat.value
                ? "bg-[#1A0E08] text-[#F7F0E6] border-[#1A0E08]"
                : "text-[#8B5E3C] border-[#D4C4B0] hover:border-[#8B5E3C]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Instant Premix: Special layout with category cards */}
      {active === "instant-premix" ? (
        <InstantPremixGrid products={products} />
      ) : isCategoryEmpty ? (
        <div className="bg-[#FAFAF8] border border-[#D4C4B0] rounded-lg p-12 md:p-16 text-center">
          <p className="text-sm text-[#8B5E3C]">No products available in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filtered.map((product) => (
            <div key={product.id} className="flex">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
