"use client";

import Link from "next/link";
import Image from "next/image";
import { type Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { ShoppingBag } from "lucide-react";
import { formatPriceDisplay, requiresOptionSelection } from "@/lib/productOptions";
import { useState } from "react";

interface Props {
  products: Product[];
}

export function FeaturedProducts({ products }: Props) {
  const { addItem } = useCartStore();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (productId: number) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  return (
    <section className="bg-[#F7F0E6] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9953C] mb-2">
            Signature Roasts
          </p>
          <h2 className="font-serif text-2xl md:text-4xl text-[#1A0E08]">Crafted to perfection.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => {
            // Safely validate the image array and first image URL
            const imageSrc =
              Array.isArray(product.images) &&
              product.images.length > 0 &&
              typeof product.images[0] === "string" &&
              product.images[0].trim() !== "" &&
              !imageErrors[product.id]
                ? product.images[0].trim()
                : null;

            return (
              <div key={product.id} className="flex">
                <div className="group bg-[#FAFAF8] border border-[#D4C4B0] overflow-hidden hover:shadow-md transition-shadow flex flex-col w-full">
                  <Link href={`/shop/${product.slug}`} className="flex flex-col flex-1">
                    <div className="relative h-60 bg-[#EAD9C8] overflow-hidden flex-shrink-0">
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={product.name}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          onError={() => handleImageError(product.id)}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#EAD9C8]">
                          <svg className="w-12 h-12 text-[#8B5E3C] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs text-[#8B5E3C] text-center px-2">{product.name || "Product"}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1">
                      <h3 className="font-serif text-lg text-[#1A0E08] mb-1">{product.name}</h3>
                      <p className="text-xs text-[#8B5E3C] leading-relaxed">{product.shortDescription}</p>
                      {product.notes && (
                        <div className="flex gap-1.5 mt-3">
                          {product.notes.map((note) => (
                            <span key={note} className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#EAD9C8] text-[#4A2512]">
                              {note}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="px-5 pb-5 flex items-center justify-between flex-shrink-0">
                    <span className="font-medium text-[#1A0E08]">
                      {formatPriceDisplay(product.price, product.weightOptions ?? [])}
                    </span>
                    {requiresOptionSelection(product.category, product.weightOptions ?? [], product.brewingEquipmentOptions ?? []) ? (
                      <Link
                        href={`/shop/${product.slug}`}
                        className="flex items-center gap-2 bg-[#1A0E08] text-[#F7F0E6] text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-[#4A2512] transition-colors"
                      >
                        <ShoppingBag size={12} />
                        Select
                      </Link>
                    ) : (
                      <button
                        onClick={() => addItem(product)}
                        className="flex items-center gap-2 bg-[#1A0E08] text-[#F7F0E6] text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-[#4A2512] transition-colors"
                      >
                        <ShoppingBag size={12} />
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="text-xs uppercase tracking-widest text-[#1A0E08] border-b border-[#1A0E08] pb-0.5 hover:text-[#C9953C] hover:border-[#C9953C] transition-colors"
          >
            View all products
          </Link>
        </div>
      </div>
    </section>
  );
}
