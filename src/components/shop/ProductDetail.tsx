"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { type Product } from "@/types";
import { INSTANT_PREMIX_CATEGORY } from "@/lib/instantPremixOptions";
import { formatPrice } from "@/lib/utils";
import { ProductActions } from "./ProductActions";

interface Props {
  product: Product;
}

export function ProductDetail({ product }: Props) {
  const searchParams = useSearchParams();
  const isInstantPremix = product.category === INSTANT_PREMIX_CATEGORY;
  const variants = isInstantPremix ? product.options?.variants ?? [] : [];
  const hasVariants = variants.length > 0;
  const [imageError, setImageError] = useState(false);

  // Get variant from search params
  const variantParam = searchParams.get("variant");
  const selectedVariant = variantParam && hasVariants 
    ? variants.find((v) => v.name === variantParam) 
    : null;

  // Calculate display price and weight
  let displayPrice = formatPrice(product.price);
  let displayRegularPrice = product.regularPrice ? formatPrice(product.regularPrice) : undefined;
  let displayWeight = product.weight;
  let displayName = product.name;

  if (hasVariants) {
    if (selectedVariant) {
      // Show selected variant's price
      displayPrice = formatPrice(selectedVariant.sellingPrice);
      displayRegularPrice = selectedVariant.regularPrice 
        ? formatPrice(selectedVariant.regularPrice) 
        : undefined;
      displayWeight = selectedVariant.weight;
      displayName = selectedVariant.name;
    } else {
      // Show price range when no variant selected
      const prices = variants.map((v) => v.sellingPrice);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      if (min === max) {
        displayPrice = formatPrice(min);
      } else {
        displayPrice = `${formatPrice(min)} – ${formatPrice(max)}`;
      }
      displayRegularPrice = undefined;
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div className="relative aspect-square bg-[#EAD9C8] overflow-hidden">
          {product.images[0] && !imageError ? (
            <Image
              src={product.images[0]}
              alt={displayName}
              fill
              className="object-contain p-6"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#8B5E3C]">
              {product.images[0] ? (
                <>
                  <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586 1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Image not available</p>
                </>
              ) : (
                <p className="text-sm">No image available</p>
              )}
            </div>
          )}
        </div>

        <div className="md:sticky md:top-28">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B5E3C] mb-3">
            {product.categoryLabel ?? product.category}
            {displayWeight ? ` · ${displayWeight}` : ""}
          </p>
          <h1 className="font-serif text-2xl md:text-4xl text-[#1A0E08] mb-3">
            {displayName}
          </h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-medium text-[#1A0E08]">
              {displayPrice}
            </span>
            {displayRegularPrice && (
              <span className="text-base text-[#8B5E3C] line-through">{displayRegularPrice}</span>
            )}
          </div>

          {(product.notes || product.roast || product.blend) && (
            <div className="bg-[#EAD9C8] p-5 mb-6 space-y-2">
              {product.blend && (
                <div className="flex justify-between text-xs">
                  <span className="text-[#8B5E3C] uppercase tracking-wider">Blend</span>
                  <span className="text-[#1A0E08]">{product.blend}</span>
                </div>
              )}
              {product.roast && (
                <div className="flex justify-between text-xs">
                  <span className="text-[#8B5E3C] uppercase tracking-wider">Roast</span>
                  <span className="text-[#1A0E08]">{product.roast}</span>
                </div>
              )}
              {product.notes && (
                <div className="flex justify-between text-xs">
                  <span className="text-[#8B5E3C] uppercase tracking-wider">Notes</span>
                  <span className="text-[#1A0E08]">{product.notes.join(" & ")}</span>
                </div>
              )}
            </div>
          )}

          <ProductActions product={product} initialVariant={selectedVariant?.name} />

          <div className="mt-8 pt-8 border-t border-[#D4C4B0]">
            <h2 className="font-serif text-xl text-[#1A0E08] mb-3">About this product</h2>
            <p className="text-sm text-[#4A2512] leading-relaxed">{product.description}</p>
          </div>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {product.tags.map((tag) => (
                <span key={tag} className="text-[9px] uppercase tracking-wider px-2 py-1 bg-[#EAD9C8] text-[#4A2512]">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
