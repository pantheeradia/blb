"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { type Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ComingSoonBanner } from "./index";
import { CATEGORIES } from "@/lib/categories";

interface Props {
  products: Product[];
}

export function ShopClient({ products }: Props) {
  const searchParams = useSearchParams();

  // Build the filter list from hardcoded categories to ensure all tabs always appear.
  // Only include the 4 required categories in the correct order.
  const SHOP_CATEGORIES = [
    "ground-coffee",
    "whole-bean",
    "instant-premix",
    "filter-coffee-decoction",
  ];

  const categories = useMemo(() => {
    return [
      { label: "All", value: "all" },
      ...SHOP_CATEGORIES.map((slug) => {
        const cat = CATEGORIES.find((c) => c.slug === slug);
        return { label: cat?.name ?? slug, value: slug };
      }),
    ];
  }, []);

  // Honour an initial ?category= from the URL, then let clicks override it.
  const urlCategory = searchParams.get("category");
  const initialActive =
    urlCategory && categories.some((c) => c.value === urlCategory) ? urlCategory : "all";
  const [active, setActive] = useState<string>(initialActive);

  const filtered = active === "all" ? products : products.filter((p) => p.category === active);

  // Check if Instant Premix has no visible products
  const isInstantPremixEmpty = active === "instant-premix" && filtered.length === 0;

  return (
    <>
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

      {isInstantPremixEmpty ? (
        <ComingSoonBanner />
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
