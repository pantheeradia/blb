"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ChevronDown } from "lucide-react";
import { type ProductGroup, type ProductVariant } from "@/lib/groupProducts";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

interface Props {
  group: ProductGroup;
}

export function ProductGroupCard({ group }: Props) {
  const { addItem } = useCartStore();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);

  const selectedVariant = group.variants[selectedVariantIndex];
  const hasMultipleVariants = group.variants.length > 1;

  // Check if the selected variant is on sale
  const isOnSale = selectedVariant.regularPrice != null && selectedVariant.regularPrice > selectedVariant.sellingPrice;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Reset image error when variant changes
  useEffect(() => {
    setImageError(false);
  }, [selectedVariantIndex]);

  const handleAddToCart = () => {
    // Create a product-like object for the cart
    const productForCart = {
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
      images: [selectedVariant.image],
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
    <div className="flex flex-col w-full bg-[#FAFAF8] border border-[#D4C4B0] hover:shadow-md transition-shadow">
      {/* Title Bar */}
      <div className="border-b border-[#D4C4B0] bg-[#FAFAF8] px-5 py-3">
        <h2 className="font-serif text-sm text-[#1A0E08] uppercase tracking-wide">
          {group.groupTitle}
        </h2>
      </div>

      {/* Image Section */}
      <Link href={`/shop/${selectedVariant.productSlug}?variant=${encodeURIComponent(selectedVariant.variantName)}`} className="relative h-[150px] bg-[#E6D5C8] overflow-hidden flex-shrink-0 block">
        {selectedVariant.image && !imageError ? (
          <Image
            src={selectedVariant.image}
            alt={selectedVariant.variantName}
            fill
            className="object-contain p-4"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#8B5E3C] text-xs">
            {selectedVariant.image ? (
              <>
                <svg className="w-6 h-6 mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586 1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-[10px]">Image not available</p>
              </>
            ) : (
              <p className="text-xs">No image</p>
            )}
          </div>
        )}
        {isOnSale && (
          <span className="absolute top-3 left-3 bg-[#C9953C] text-[#1A0E08] text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5">
            Sale
          </span>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-[9px] uppercase tracking-widest text-[#8B5E3C] mb-1">
          INSTANT PREMIX
        </p>
        <Link href={`/shop/${selectedVariant.productSlug}?variant=${encodeURIComponent(selectedVariant.variantName)}`} className="block">
          <h3 className="font-serif text-base text-[#1A0E08] mb-1 hover:text-[#8B5E3C] transition-colors">{selectedVariant.variantName}</h3>
        </Link>
        <p className="text-xs text-[#8B5E3C] leading-relaxed line-clamp-2 mb-3">
          {selectedVariant.shortDescription}
        </p>
        <p className="text-[10px] text-[#8B5E3C] mb-3">
          Pack Size: {selectedVariant.weight}
        </p>

        {/* Spacer to push footer to bottom */}
        <div className="flex-1" />

        {/* Footer with Price, Scrollable Variant Selector, and Add Button */}
        <div className="mt-auto">
          <div className="flex items-center gap-3">
            {/* Price */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-medium text-[#1A0E08]">
                {formatPrice(selectedVariant.sellingPrice)}
              </span>
              {isOnSale && (
                <span className="text-xs text-[#8B5E3C] line-through">
                  {formatPrice(selectedVariant.regularPrice!)}
                </span>
              )}
            </div>

            {/* Spacer to push Add button to right when no variants */}
            {!hasMultipleVariants && <div className="flex-1" />}

            {/* Select Variants Dropdown */}
            {hasMultipleVariants && (
              <div ref={dropdownRef} className="relative flex-1">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between gap-2 text-[10px] uppercase tracking-widest px-3 py-2 border border-[#D4C4B0] bg-[#FAFAF8] text-[#1A0E08] cursor-pointer hover:border-[#8B5E3C] focus:outline-none focus:border-[#8B5E3C]"
                  aria-label="Select variant"
                  aria-expanded={isDropdownOpen}
                >
                  <span className="truncate">Select Variants</span>
                  <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#FAFAF8] border border-[#D4C4B0] shadow-lg z-50 max-h-60 overflow-y-auto">
                    {group.variants.map((variant, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedVariantIndex(index);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left text-[10px] uppercase tracking-widest px-3 py-2 cursor-pointer transition-colors whitespace-nowrap ${
                          selectedVariantIndex === index
                            ? "bg-[#EAD9C8] text-[#1A0E08] font-medium"
                            : "bg-[#FAFAF8] text-[#8B5E3C] hover:bg-[#EAD9C8] hover:text-[#1A0E08]"
                        }`}
                      >
                        {variant.variantName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Add Button */}
            <button
              onClick={handleAddToCart}
              className="flex-shrink-0 flex items-center justify-center gap-2 bg-[#1A0E08] text-[#F7F0E6] text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-[#4A2512] transition-colors"
            >
              <ShoppingBag size={12} />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
