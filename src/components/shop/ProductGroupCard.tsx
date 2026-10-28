"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ShoppingBag } from "lucide-react";
import { type ProductGroup } from "@/lib/groupProducts";
import { type Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

interface Props {
  group: ProductGroup;
  priority?: boolean;
}

export function ProductGroupCard({ group, priority = false }: Props) {
  const { addItem } = useCartStore();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [failedImage, setFailedImage] = useState<string | null>(null);

  const selectedVariant = group.variants[selectedVariantIndex];
  const isOnSale =
    selectedVariant.regularPrice != null &&
    selectedVariant.regularPrice > selectedVariant.sellingPrice;
  const detailHref =
    "/shop/" +
    selectedVariant.productSlug +
    "?variant=" +
    encodeURIComponent(selectedVariant.variantName);

  const handleAddToCart = () => {
    const productForCart: Product = {
      id: selectedVariant.productId,
      slug: selectedVariant.productSlug,
      name: selectedVariant.variantName,
      shortDescription: selectedVariant.shortDescription,
      description: selectedVariant.shortDescription,
      category: "instant-premix",
      categoryLabel: selectedVariant.categoryLabel,
      showWeight: true,
      showRoast: false,
      showBlend: false,
      showNotes: false,
      price: selectedVariant.sellingPrice,
      regularPrice: selectedVariant.regularPrice ?? undefined,
      images: selectedVariant.image ? [selectedVariant.image] : [],
      tags: [],
      inStock: true,
      visible: true,
      weight: selectedVariant.weight,
    };

    addItem(productForCart, 1, {
      selectedVariant: selectedVariant.variantName,
      selectedVariantPrice: selectedVariant.sellingPrice,
    });
  };

  return (
    <article className="reveal-on-scroll group flex min-w-0 flex-col">
      <div className="relative aspect-[5/5.35] overflow-hidden bg-[#e6d9ca]">
        <Link
          href={detailHref}
          aria-label={"View " + selectedVariant.variantName}
          className="absolute inset-0 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#27150e]"
        >
          {selectedVariant.image && failedImage !== selectedVariant.image ? (
            <Image
              src={selectedVariant.image}
              alt={selectedVariant.variantName}
              fill
              fetchPriority={priority ? "high" : "auto"}
              className="object-contain p-7 transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setFailedImage(selectedVariant.image)}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center px-6 text-center text-xs text-[#887260]">
              Product image unavailable
            </span>
          )}
        </Link>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#27150e]/15 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {isOnSale && (
          <span className="absolute left-3 top-3 bg-[#aa7040] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#fffaf2]">
            Sale
          </span>
        )}
        <span className="absolute bottom-3 left-3 bg-[#27150e] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#fffaf2]">
          {group.variants.length} {group.variants.length === 1 ? "blend" : "blends"}
        </span>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#8f5e3b]">
          Instant premix · {group.groupTitle}
        </p>

        <Link
          href={detailHref}
          className="mt-2 block focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#27150e]"
        >
          <h3 className="font-serif text-[1.55rem] leading-[1.05] tracking-[-0.025em] text-[#27150e] transition-colors duration-300 group-hover:text-[#7a4b30]">
            {selectedVariant.variantName}
          </h3>
        </Link>

        <p className="mt-2.5 line-clamp-2 text-xs leading-5 text-[#705b4c]">
          {selectedVariant.shortDescription}
        </p>

        <div className="mt-5">
          <label
            htmlFor={"variant-" + group.groupKey}
            className="mb-2 block text-[8px] font-semibold uppercase tracking-[0.15em] text-[#897361]"
          >
            Choose a blend
          </label>
          <div className="relative border-b border-[#b9a48f]">
            <select
              id={"variant-" + group.groupKey}
              value={selectedVariantIndex}
              onChange={(event) => {
                setSelectedVariantIndex(Number(event.target.value));
                setFailedImage(null);
              }}
              className="w-full appearance-none bg-transparent py-2.5 pr-8 text-xs text-[#27150e] outline-none transition-colors focus:border-[#27150e]"
            >
              {group.variants.map((variant, index) => (
                <option key={variant.productId + "-" + variant.variantName} value={index}>
                  {variant.variantName} · {variant.weight}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              aria-hidden="true"
              className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[#826a57]"
            />
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#d2c0ac] pt-4">
          <div>
            <p className="text-[8px] uppercase tracking-[0.14em] text-[#897361]">
              {selectedVariant.weight}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm font-semibold tabular-nums text-[#27150e]">
                {formatPrice(selectedVariant.sellingPrice)}
              </span>
              {isOnSale && (
                <span className="text-[10px] tabular-nums text-[#897361] line-through">
                  {formatPrice(selectedVariant.regularPrice!)}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex min-h-10 items-center gap-2 bg-[#27150e] px-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#fffaf2] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#543222] active:translate-y-0"
          >
            <ShoppingBag size={12} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
