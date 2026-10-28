"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { type Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { formatPriceDisplay, requiresOptionSelection } from "@/lib/productOptions";
import { INSTANT_PREMIX_CATEGORY } from "@/lib/instantPremixOptions";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: Props) {
  const { addItem } = useCartStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const weightOptions = product.weightOptions ?? [];
  const equipmentOptions = product.brewingEquipmentOptions ?? [];
  const instantPremixVariants = product.options?.variants ?? [];
  const needsSelection = requiresOptionSelection(
    product.category,
    weightOptions,
    equipmentOptions
  );
  const needsVariantSelection =
    product.category === INSTANT_PREMIX_CATEGORY && instantPremixVariants.length > 0;

  const validImages = product.images.filter(Boolean);
  const hasMultipleImages = validImages.length > 1;
  const currentImage = validImages[currentImageIndex] ?? null;
  const detailHref = "/shop/" + product.slug;

  const showPreviousImage = () => {
    setCurrentImageIndex((current) =>
      current === 0 ? validImages.length - 1 : current - 1
    );
    setImageError(false);
  };

  const showNextImage = () => {
    setCurrentImageIndex((current) =>
      current === validImages.length - 1 ? 0 : current + 1
    );
    setImageError(false);
  };

  return (
    <article
      className="reveal-on-scroll group flex min-w-0 flex-col"
      onMouseLeave={() => {
        setCurrentImageIndex(0);
        setImageError(false);
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#e7d8c7]">
        <Link
          href={detailHref}
          aria-label={"View " + product.name}
          className="absolute inset-0 z-0 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#20110c]"
        >
          {currentImage && !imageError ? (
            <Image
              src={currentImage}
              alt={product.name}
              fill
              fetchPriority={priority ? "high" : "auto"}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center px-6 text-center text-xs text-[#8b735f]">
              Product image unavailable
            </span>
          )}
        </Link>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#20110c]/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              aria-label="Previous product image"
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-[#fffaf2]/92 text-[#20110c] opacity-0 transition-all duration-300 hover:bg-[#fffaf2] focus:opacity-100 group-hover:opacity-100"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              onClick={showNextImage}
              aria-label="Next product image"
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-[#fffaf2]/92 text-[#20110c] opacity-0 transition-all duration-300 hover:bg-[#fffaf2] focus:opacity-100 group-hover:opacity-100"
            >
              <ChevronRight size={15} />
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {validImages.map((image, index) => (
                <button
                  key={image + index}
                  type="button"
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setImageError(false);
                  }}
                  aria-label={"View product image " + (index + 1)}
                  className={cn(
                    "h-1.5 bg-[#fffaf2]/65 transition-all duration-300",
                    index === currentImageIndex ? "w-6 bg-[#fffaf2]" : "w-1.5 hover:bg-[#fffaf2]"
                  )}
                />
              ))}
            </div>
          </>
        )}

        {product.regularPrice && (
          <span className="absolute left-3 top-3 z-10 bg-[#d7a35f] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#20110c]">
            Sale
          </span>
        )}
        {!product.inStock && (
          <span className="absolute right-3 top-3 z-10 bg-[#20110c] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#fffaf2]">
            Sold out
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#9b6a3c]">
          {product.categoryLabel ?? product.category}
          {product.weight ? " · " + product.weight : ""}
        </p>

        <Link
          href={detailHref}
          className="mt-2 block focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#20110c]"
        >
          <h3 className="font-serif text-[1.65rem] leading-[1.05] tracking-[-0.025em] text-[#20110c] transition-colors duration-300 group-hover:text-[#754528]">
            {product.name}
          </h3>
        </Link>

        <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#765f4f]">
          {product.shortDescription}
        </p>

        {(product.notes?.length ?? 0) > 0 && (
          <p className="mt-3 text-[9px] uppercase tracking-[0.13em] text-[#9a806d]">
            {product.notes?.slice(0, 3).join(" / ")}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#d6c4af] pt-5">
          <div>
            <p className="text-[8px] uppercase tracking-[0.14em] text-[#9a806d]">From</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold tabular-nums text-[#20110c]">
                {formatPriceDisplay(product.price, weightOptions)}
              </span>
              {product.regularPrice && weightOptions.length === 0 && !needsVariantSelection && (
                <span className="text-[10px] tabular-nums text-[#9a806d] line-through">
                  {formatPrice(product.regularPrice)}
                </span>
              )}
            </div>
          </div>

          {!product.inStock ? (
            <button
              type="button"
              disabled
              className="min-h-10 border border-[#cdbba7] px-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#9a806d]"
            >
              Unavailable
            </button>
          ) : needsSelection || needsVariantSelection ? (
            <Link
              href={detailHref}
              className="inline-flex min-h-10 items-center gap-2 bg-[#20110c] px-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#fffaf2] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4a2818]"
            >
              Select <ArrowUpRight size={13} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => addItem(product)}
              className="inline-flex min-h-10 items-center gap-2 bg-[#20110c] px-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#fffaf2] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4a2818] active:translate-y-0"
            >
              <ShoppingBag size={12} />
              Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
